import React, { useContext, useMemo } from 'react';
import GeneralContext from '../../../context/global/general.context';
import EditorContext from '../../../context/editor/editor.context';
import Swatch from '@uiw/react-color-swatch';
import { hexToHsva } from '@uiw/color-convert';

const ColorPallete: React.FC = () => {
  const { colors } = useContext(GeneralContext);
  const { setColor } = useContext(EditorContext);

  const flatColors = useMemo(() => colors.flat(), [colors]);

  const handleChange = (hsva: { h: number; s: number; v: number; a: number }) => {
    // Convert HSVA back to hex
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
    setColor(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
  };

  return (
    <div className="border-2 border-black p-2 w-[450px]">
      <Swatch
        colors={flatColors}
        color="#ffffff"
        rectProps={{
          children: <Point />,
          style: {
            width: '40px',
            height: '40px',
            margin: '2px',
          },
        }}
        onChange={(hsvColor) => handleChange(hsvColor)}
      />
    </div>
  );
};

const Point: React.FC<{ color?: string; checked?: boolean }> = ({ checked }) =>
  checked ? (
    <div
      style={{
        height: 6,
        width: 6,
        borderRadius: '50%',
        backgroundColor: '#fff',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  ) : null;

export default ColorPallete;
