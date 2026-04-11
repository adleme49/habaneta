import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../../store/store';
import { generateShades } from '../../../lib/color-math';

/**
 * Compact color chooser for the tile editor. Two rows of chrome
 * (~130px total) that give users:
 *
 *   - current color preview (click → native OS picker)
 *   - hex input (type or paste any CSS color)
 *   - 9×4 preset grid for common choices
 *
 * Deliberately tiny. Anything not in the presets is reachable via
 * the input or the native picker, so there's no UX cost to keeping
 * the visible grid small.
 */
const ColorPallete: React.FC = () => {
  const { colors, selectedColor, setSelectedColor } = useStore();
  const pickerRef = useRef<HTMLInputElement>(null);

  const flatColors = useMemo(() => colors.flat(), [colors]);

  // `shadesBase` is the color the shades row is centered on. It's
  // independent of `selectedColor` so that clicking WITHIN the
  // shades row — which updates selectedColor — doesn't re-center
  // the ramp on every click. The ramp stays visually stable and
  // the active ring slides along it. Only picking from the preset
  // grid, typing a new hex, or using the native picker updates the
  // base and re-generates the ramp.
  const [shadesBase, setShadesBase] = useState<string>(selectedColor);
  const shades = useMemo(() => generateShades(shadesBase, 9), [shadesBase]);

  // If selectedColor changes from outside this component (e.g. a
  // preset is loaded by applyPreset in the store), snap the shades
  // base to the new value too — otherwise the ramp would still be
  // centered on the last preset the user clicked here.
  useEffect(() => {
    if (!shades.some((s) => s.toLowerCase() === selectedColor.toLowerCase())) {
      setShadesBase(selectedColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor]);

  const pickBase = (color: string) => {
    setSelectedColor(color);
    setShadesBase(color);
  };

  const pickShade = (color: string) => {
    // Only update selectedColor — leave shadesBase alone so the
    // ramp stays anchored and the active ring moves along it.
    setSelectedColor(color);
  };

  const handleHexInput = (value: string) => {
    const trimmed = value.trim();
    const normalized = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(normalized)) {
      pickBase(normalized);
    }
  };

  return (
    <div className="w-full max-w-[320px] space-y-1.5">
      {/* Preview + hex input inline */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => pickerRef.current?.click()}
          className="w-7 h-7 rounded border border-gray-300 shadow-sm flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: selectedColor }}
          title="Open color picker"
          aria-label="Open color picker"
        />
        <input
          ref={pickerRef}
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(selectedColor) ? selectedColor : '#ffffff'}
          onChange={(e) => pickBase(e.target.value)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <input
          type="text"
          value={selectedColor}
          onChange={(e) => handleHexInput(e.target.value)}
          className="flex-1 min-w-0 h-7 border rounded px-2 text-xs font-mono"
          placeholder="#rrggbb"
          spellCheck={false}
          aria-label="Hex color value"
        />
      </div>

      {/* 9×4 preset grid — compact squares */}
      <div
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}
      >
        {flatColors.map((color) => {
          const isActive =
            color.toLowerCase() === selectedColor.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => pickBase(color)}
              className={`aspect-square rounded-sm transition-all ${
                isActive
                  ? 'ring-2 ring-offset-1 ring-blue-500 z-10'
                  : 'hover:ring-1 hover:ring-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
              aria-label={`Select ${color}`}
            />
          );
        })}
      </div>

      {/* Shades ramp: 4 darker + base + 4 lighter variations of the
          currently selected color. Hidden if selectedColor isn't a
          parseable hex (parseable shades list would be empty). */}
      {shades.length > 0 && (
        <div className="pt-1">
          <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
            Shades
          </div>
          <div
            className="grid gap-[2px]"
            style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}
          >
            {shades.map((shade, i) => {
              const isActive =
                shade.toLowerCase() === selectedColor.toLowerCase();
              return (
                <button
                  key={`${shade}-${i}`}
                  type="button"
                  onClick={() => pickShade(shade)}
                  className={`aspect-square rounded-sm transition-all ${
                    isActive
                      ? 'ring-2 ring-offset-1 ring-blue-500 z-10'
                      : 'hover:ring-1 hover:ring-gray-400'
                  }`}
                  style={{ backgroundColor: shade }}
                  title={shade}
                  aria-label={`Shade ${shade}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPallete;
