// Client for the habaneta-backend image-processing service.
//
// The backend turns a photograph of a real-world tile into a recolorable
// SVG composition: a list of `atoms` (vector tiles) and a `composition`
// describing how those atoms repeat across a 2D lattice. v1 always
// returns a single atom + 1×1 lattice + empty palette, but the renderer
// is built to handle the general case so multi-atom output drops in
// without UI changes.

export type Vec2 = [number, number];

export type Transform =
  | { kind: 'identity' }
  | { kind: 'rotate'; degrees: number }
  | { kind: 'reflect'; axis_degrees: number };

export interface Atom {
  id: string;
  /** Raw SVG markup. v1 wraps a base64-embedded raster as a placeholder. */
  svg: string;
}

export interface Lattice {
  basis_a: Vec2;
  basis_b: Vec2;
}

export interface Cell {
  atom_id: string;
  position: Vec2;
  transform: Transform;
}

export interface Composition {
  lattice: Lattice;
  cells: Cell[];
}

export interface PipelineOutput {
  atoms: Atom[];
  composition: Composition;
  /**
   * Layer colors, indexed by N (paths in atoms carry `class="layer-N"`).
   * Frontend treats `palette.length` as authoritative — the backend may
   * clamp the user's requested layer count, or auto-detect it entirely.
   */
  palette: { hex: string }[];
  /**
   * Color of the contour layer (paths carry `class="contour"`). Null when
   * the contour pass was disabled by params or no thin components survived
   * the thickness gate.
   */
  contour: { hex: string } | null;
  /**
   * Backend-reported pipeline metadata. `passes` lists the named stages
   * that actually ran (e.g. `"bilateral"`, `"contour"`, `"auto_layers"`).
   * `"auto_layers"` is emitted iff k was auto-detected — otherwise the
   * user-supplied `params.layers` was honored.
   */
  quality?: { passes: string[] };
}

/**
 * Optional per-job parameters for `POST /v1/jobs`. Send only fields the
 * user explicitly changed; omitted fields fall back to server defaults.
 * Setting `contour: null` disables the contour pass entirely.
 */
export interface JobParams {
  target_px?: number;
  layers?: number;
  denoise?: number;
  min_region_px?: number;
  auto_levels?: boolean;
  contour?: { sensitivity?: number; max_thickness?: number } | null;
}

export type JobStatus = 'queued' | 'running' | 'done' | 'failed';

export interface JobStatusResponse {
  status: JobStatus;
  error?: string;
}

const BASE_URL =
  (import.meta.env.VITE_HABANETA_API as string | undefined) ??
  'http://localhost:8080';

export class HabanetaBackendError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'HabanetaBackendError';
  }
}

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = '';
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    throw new HabanetaBackendError(
      `HTTP ${res.status} ${res.statusText}${detail ? `: ${detail}` : ''}`,
      undefined,
      res.status
    );
  }
  return (await res.json()) as T;
}

export async function checkHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/healthz`, { signal });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitJob(
  file: File,
  params?: JobParams,
  signal?: AbortSignal
): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  if (params && Object.keys(params).length > 0) {
    form.append('params', JSON.stringify(params));
  }
  const res = await fetch(`${BASE_URL}/v1/jobs`, {
    method: 'POST',
    body: form,
    signal,
  });
  const body = await jsonOrThrow<{ job_id: string }>(res);
  return body.job_id;
}

export async function getJobStatus(
  jobId: string,
  signal?: AbortSignal
): Promise<JobStatusResponse> {
  const res = await fetch(`${BASE_URL}/v1/jobs/${jobId}`, { signal });
  return jsonOrThrow<JobStatusResponse>(res);
}

export async function getJobResult(
  jobId: string,
  signal?: AbortSignal
): Promise<PipelineOutput> {
  const res = await fetch(`${BASE_URL}/v1/jobs/${jobId}/result`, { signal });
  return jsonOrThrow<PipelineOutput>(res);
}

export interface PollOptions {
  /** Initial delay between status polls. Default 250ms. */
  initialIntervalMs?: number;
  /** Max delay between polls (exponential backoff cap). Default 2000ms. */
  maxIntervalMs?: number;
  /** Hard ceiling on total polling time. Default 60s. */
  timeoutMs?: number;
  /** Called on each status change so the UI can show progress. */
  onStatus?: (status: JobStatus) => void;
  /** Per-job extraction parameters; omit any field to use server defaults. */
  params?: JobParams;
  signal?: AbortSignal;
}

/**
 * Submit a file and resolve with the final PipelineOutput. Polls with
 * exponential backoff. Aborts cleanly via `signal` (caller's responsibility
 * to wire a controller — e.g. from a React effect cleanup).
 */
export async function runImageImport(
  file: File,
  opts: PollOptions = {}
): Promise<PipelineOutput> {
  const initial = opts.initialIntervalMs ?? 250;
  const max = opts.maxIntervalMs ?? 2000;
  const timeout = opts.timeoutMs ?? 60_000;
  const { signal, onStatus, params } = opts;

  const jobId = await submitJob(file, params, signal);
  const deadline = Date.now() + timeout;
  let interval = initial;
  let lastStatus: JobStatus | null = null;

  while (true) {
    if (signal?.aborted) throw new HabanetaBackendError('aborted');
    if (Date.now() > deadline) {
      throw new HabanetaBackendError(`Timed out after ${timeout}ms`);
    }
    const { status, error } = await getJobStatus(jobId, signal);
    if (status !== lastStatus) {
      lastStatus = status;
      onStatus?.(status);
    }
    if (status === 'done') {
      return getJobResult(jobId, signal);
    }
    if (status === 'failed') {
      throw new HabanetaBackendError(error ?? 'Job failed');
    }
    await sleep(interval, signal);
    interval = Math.min(interval * 1.5, max);
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new HabanetaBackendError('aborted'));
    const t = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(new HabanetaBackendError('aborted'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
