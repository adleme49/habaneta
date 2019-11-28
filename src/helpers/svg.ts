export const getColorShapes = (svg: Element): Element[] =>
  Array.from(svg.childNodes).reduce(
    (acc: any, curr) =>
      curr.childNodes.length > 0
        ? [...acc, curr, ...Array.from(curr.childNodes)]
        : [...acc, curr],
    []
  );

export const paintLayer = (
  shapes: Element[],
  layerId: string,
  color: string | undefined
) => {
  const layer = shapes.filter(
    (node: any) =>
      node['attributes'] &&
      node['attributes']['class'] &&
      node['attributes']['class']['nodeValue'] === `colora ${layerId}`
  );
  layer.forEach((e: any) => e.setAttribute('fill', color ? color : 'white'));
};

export const styleSVG = (
  svg: Element,
  options: { height?: number; width?: number; rotation?: number }
) =>
  svg.setAttribute(
    'style',
    ` ${options.width ? `width: ${options.width}px` : ''};
      ${options.height ? `height: ${options.height}px` : ''};
      ${options.rotation ? `transform: rotate(${options.rotation}deg)` : ''};`
  );
