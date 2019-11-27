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
  options: { height?: number; width?: number }
) =>
  svg.setAttribute(
    'style',
    `width: ${options.width ? options.width : 40.42}px; height: ${
      options.height ? options.height : 40.42
    }px`
  );
