import React, { useMemo, useRef } from 'react';
import { useStore } from '../../../store/store';

/**
 * Compact color chooser for the tile editor. Three components in
 * ~120px of vertical space:
 *
 *   - Row 1: current color preview + hex input + native picker
 *   - Row 2-7: 6×6 curated preset grid
 *
 * The native <input type="color"> gives users full spectrum access
 * without bundling a heavy picker library. Hex input accepts any
 * valid CSS color string. Presets are one-click shortcuts.
 */
const ColorPallete: React.FC = () => {
  const { colors, selectedColor, setSelectedColor } = useStore();
  const pickerRef = useRef<HTMLInputElement>(null);

  const flatColors = useMemo(() => colors.flat(), [colors]);

  const handleHexInput = (value: string) => {
    const trimmed = value.trim();
    // Accept with or without leading #, any length (user is still
    // typing). Only commit if it parses to a valid 3/6/8-digit hex.
    const normalized = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(normalized)) {
      setSelectedColor(normalized);
    }
  };

  return (
    <div className="w-full max-w-[280px] space-y-2">
      {/* Row 1: preview + hex input + native picker */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => pickerRef.current?.click()}
          className="w-8 h-8 rounded border border-gray-300 shadow-sm flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: selectedColor }}
          title="Click to open color picker"
          aria-label="Open color picker"
        />
        <input
          ref={pickerRef}
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(selectedColor) ? selectedColor : '#ffffff'}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <input
          type="text"
          value={selectedColor}
          onChange={(e) => handleHexInput(e.target.value)}
          className="flex-1 min-w-0 h-8 border rounded px-2 text-xs font-mono"
          placeholder="#rrggbb"
          spellCheck={false}
          aria-label="Hex color value"
        />
      </div>

      {/* Row 2: preset grid */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
      >
        {flatColors.map((color) => {
          const isActive =
            color.toLowerCase() === selectedColor.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`aspect-square rounded border transition-all ${
                isActive
                  ? 'ring-2 ring-offset-1 ring-blue-500 border-transparent'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
              aria-label={`Select ${color}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorPallete;
