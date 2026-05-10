// Renders a single backend Atom (the v2 classed-path SVG) as a
// recolorable thumbnail using react-native-svg.
//
// We can't use the inline-`style="fill: var(--…)"` + CSS-variable
// trick that the web app uses — RN doesn't have CSS. Instead, parse
// the atom SVG once, walk the path elements, and render typed
// <Path> nodes whose `fill` prop comes from the layer map at render
// time. Recolor is just a re-render with a different `layers` prop.
//
// v1 backend always returns a single atom + identity transform, so
// only the first atom + first cell are honored here. Multi-atom
// pipelines land in v3 alongside symmetry detection.

import React, { useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { PipelineOutput } from '@habaneta/api-types';

interface ParsedPath {
  d: string;
  layerKey: string; // 'layer-0' | 'layer-1' | ... | 'contour'
}

interface ParsedAtom {
  viewBox: string;
  paths: ParsedPath[];
}

function parseAtomSvg(svg: string): ParsedAtom {
  // Naive regex parser — the backend's atom SVG is a constrained
  // subset (only `<svg>` + `<path class="…" d="…"/>`), so a full XML
  // parser is overkill. Anything more exotic from the backend would
  // need DOMParser, which RN doesn't ship.
  const viewMatch = /viewBox="([^"]+)"/.exec(svg);
  const viewBox = viewMatch?.[1] ?? '0 0 1 1';
  const paths: ParsedPath[] = [];
  const re = /<path\s+class="([^"]+)"\s+d="([^"]+)"\s*\/?>/g;
  let m;
  while ((m = re.exec(svg)) !== null) {
    paths.push({ layerKey: m[1], d: m[2] });
  }
  return { viewBox, paths };
}

interface Props {
  pipeline: PipelineOutput;
  layers: Record<string, string>;
  style?: StyleProp<ViewStyle>;
}

const PatternThumb: React.FC<Props> = ({ pipeline, layers, style }) => {
  const atom = useMemo(() => {
    const raw = pipeline.atoms[0]?.svg;
    if (!raw) return null;
    return parseAtomSvg(raw);
  }, [pipeline]);

  if (!atom) return <View style={style} />;

  const fallbackForKey = (key: string): string => {
    if (key === 'contour') {
      return pipeline.contour?.hex ?? '#000000';
    }
    const m = /^layer-(\d+)$/.exec(key);
    if (m) {
      const idx = Number(m[1]);
      return pipeline.palette[idx]?.hex ?? '#cccccc';
    }
    return '#cccccc';
  };

  return (
    <View style={style}>
      <Svg
        width="100%"
        height="100%"
        viewBox={atom.viewBox}
        preserveAspectRatio="xMidYMid meet"
      >
        {atom.paths.map((p, i) => (
          <Path
            // Layer key is the canonical stable identity (it matches the
            // class on the source path). Index-as-key is a fallback for
            // duplicates, which the backend doesn't currently emit.
            key={`${p.layerKey}-${i}`}
            d={p.d}
            fill={layers[p.layerKey] ?? fallbackForKey(p.layerKey)}
          />
        ))}
      </Svg>
    </View>
  );
};

export default PatternThumb;
