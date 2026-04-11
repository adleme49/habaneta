import React, { useMemo } from 'react';
import { useStore } from '../../../store/store';
import Swatch from '@uiw/react-color-swatch';

const ColorPallete: React.FC = () => {
  const { colors, setSelectedColor } = useStore();

  const flatColors = useMemo(() => colors.flat(), [colors]);

  const handleChange = (hsva: { h: number; s: number; v: number; a: number }) => {
    const s = hsva.s / 100;
    const v = hsva.v / 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((hsva.h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (hsva.h < 60) { r = c; g = x; b = 0; }
    else if (hsva.h < 120) { r = x; g = c; b = 0; }
    else if (hsva.h < 180) { r = 0; g = c; b = x; }
    else if (hsva.h < 240) { r = 0; g = x; b = c; }
    else if (hsva.h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    setSelectedColor(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
  };

  return (
    <div className="border-2 border-black p-2">
      <Swatch
        colors={flatColors}
        color="#ffffff"
        rectProps={{
          children: null,
          style: {
            width: '32px',
            height: '32px',
            margin: '2px',
          },
        }}
        onChange={(hsvColor) => handleChange(hsvColor)}
      />
    </div>
  );
};

export default ColorPallete;
