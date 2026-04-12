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
 *
 * Important for the grid use case: the #grid container has
 * `overflow: auto` + a bounded viewport height, so at larger grid
 * sizes it scrolls. dom-to-image captures the element's visual
 * box — anything clipped by the viewport would be missing from
 * the PNG. Before taking the snapshot we temporarily inflate the
 * node to its full `scrollHeight` and drop the overflow so every
 * row ends up in the capture, then restore the original styles in
 * a finally so scroll behavior isn't left broken on error.
 */
export async function exportDesignAsPng(
  node: HTMLElement,
  filename: string,
  { scale = DEFAULT_SCALE }: ExportOptions = {}
): Promise<void> {
  // Save and null out every style property that would prevent the
  // element's box from growing to its full content height. The #grid
  // container is a flex-1 flex item, so plain `style.height` alone
  // is ignored — `flex-basis: 0%` + `flex-grow: 1` force a viewport
  // sized box. We also have to release the flex constraints and
  // drop min-height/max-height for the override to stick.
  const original = {
    height: node.style.height,
    minHeight: node.style.minHeight,
    maxHeight: node.style.maxHeight,
    overflow: node.style.overflow,
    flex: node.style.flex,
    flexBasis: node.style.flexBasis,
    flexGrow: node.style.flexGrow,
    flexShrink: node.style.flexShrink,
  };

  try {
    const fullHeight = node.scrollHeight;
    node.style.flex = 'none';
    node.style.flexBasis = 'auto';
    node.style.flexGrow = '0';
    node.style.flexShrink = '0';
    node.style.minHeight = `${fullHeight}px`;
    node.style.height = `${fullHeight}px`;
    node.style.maxHeight = 'none';
    node.style.overflow = 'visible';
    // Force a layout read so the browser commits before we hand
    // the node to dom-to-image.
    void node.offsetHeight;

    const width = node.offsetWidth;
    const height = node.offsetHeight;
    // dom-to-image upscales cleanly when we pass an oversized canvas
    // and scale the source via CSS transform (this is the pattern
    // from its README).
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
  } finally {
    node.style.height = original.height;
    node.style.minHeight = original.minHeight;
    node.style.maxHeight = original.maxHeight;
    node.style.overflow = original.overflow;
    node.style.flex = original.flex;
    node.style.flexBasis = original.flexBasis;
    node.style.flexGrow = original.flexGrow;
    node.style.flexShrink = original.flexShrink;
  }
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
