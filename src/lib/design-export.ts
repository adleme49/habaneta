// Design export: rasterize the grid DOM into a PNG file the user
// can download. We reuse `dom-to-image` (already in the tree for
// the environment snapshot in TilePreviewActions) instead of adding
// a new dependency.
//
// The grid is composed of inline <svg> tiles injected via ReactSVG,
// so dom-to-image can walk them without cross-origin issues that
// would hit external <img src>.

import domtoimage from 'dom-to-image';

/**
 * Default upscale factor. A 2x snapshot keeps thumbnails crisp on
 * hi-dpi screens and produces a file that prints acceptably at the
 * grid's natural on-screen size.
 */
const DEFAULT_SCALE = 2;

interface ExportOptions {
  /** Multiplier applied to the node's on-screen size. */
  scale?: number;
}

/**
 * Rasterize `node` to PNG and kick off a browser download under
 * `filename`. Resolves once the click handler has been dispatched —
 * the browser handles the rest. Rejects if dom-to-image fails.
 */
export async function exportDesignAsPng(
  node: HTMLElement,
  filename: string,
  { scale = DEFAULT_SCALE }: ExportOptions = {}
): Promise<void> {
  const width = node.offsetWidth;
  const height = node.offsetHeight;
  // dom-to-image upscales cleanly when we pass an oversized canvas
  // and scale the source via CSS transform (this is the pattern from
  // its README).
  const dataUrl = await domtoimage.toPng(node, {
    width: width * scale,
    height: height * scale,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: `${width}px`,
      height: `${height}px`,
    },
  });
  downloadDataUrl(dataUrl, filename);
}

/**
 * Build a reasonable default filename for an exported design based
 * on the current date. Avoids colons so Windows users don't end up
 * with an unsaveable file.
 */
export function buildExportFilename(prefix = 'habaneta-design'): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const stamp =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `${prefix}-${stamp}.png`;
}

function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  // Safari needs the anchor to be in the DOM for the click to count.
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
