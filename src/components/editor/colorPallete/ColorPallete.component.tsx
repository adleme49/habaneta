import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store/store';
import { generateShades } from '../../../lib/color-math';
import {
  loadUserColors,
  saveUserColors,
  addUserColor,
  removeUserColor,
} from '../../../lib/user-colors';

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
  const { t } = useTranslation();
  const { colors, selectedColor, setSelectedColor } = useStore();
  const pickerRef = useRef<HTMLInputElement>(null);

  const flatColors = useMemo(() => colors.flat(), [colors]);

  // Persistent "My colors" row, hydrated from localStorage on mount.
  // Kept in local state (not the global store) because nothing else
  // needs to read or mutate it.
  const [userColors, setUserColors] = useState<string[]>(() => loadUserColors());
  useEffect(() => {
    saveUserColors(userColors);
  }, [userColors]);

  const handleAddCurrent = () => {
    setUserColors((prev) => addUserColor(prev, selectedColor));
  };
  const handleRemoveUserColor = (color: string) => {
    setUserColors((prev) => removeUserColor(prev, color));
  };

  const isCurrentSaved = userColors.some(
    (c) => c.toLowerCase() === selectedColor.toLowerCase()
  );

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

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="w-full max-w-[300px] space-y-1.5">
      {/* Preview + hex input inline, with expand/collapse toggle */}
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
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 text-xs text-gray-500 flex-shrink-0"
          title={isExpanded ? 'Collapse palette' : 'Expand palette'}
          aria-label={isExpanded ? 'Collapse palette' : 'Expand palette'}
          aria-expanded={isExpanded}
        >
          {isExpanded ? '▾' : '▸'}
        </button>
      </div>

      {/* 9×4 preset grid — compact squares */}
      {isExpanded && (
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

      )}

      {/* Shades ramp: 4 darker + base + 4 lighter variations of the
          currently selected color. Hidden if selectedColor isn't a
          parseable hex (parseable shades list would be empty). */}
      {isExpanded && shades.length > 0 && (
        <div className="pt-1">
          <div className="text-[10px] font-medium text-gray-500 mb-1">
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

      {/* My colors: persistent per-user palette row. Mirrors the
          conventions used by the recents strip — hover-reveal delete
          on each swatch, single italic empty-state line, + button
          tucked at the end. */}
      {isExpanded && (
        <div className="pt-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] font-medium text-gray-500">
              {t('editor.myColors')}
            </div>
            <button
              type="button"
              onClick={handleAddCurrent}
              disabled={isCurrentSaved}
              className="text-[10px] text-gray-500 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
              title={t('editor.addCurrentColor')}
              aria-label={t('editor.addCurrentColor')}
            >
              + {t('editor.addCurrent')}
            </button>
          </div>
          {userColors.length === 0 ? (
            <div className="text-[10px] italic text-gray-400">
              {t('editor.myColorsEmpty')}
            </div>
          ) : (
            <div
              className="grid gap-[2px]"
              style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}
            >
              {userColors.map((color) => {
                const isActive =
                  color.toLowerCase() === selectedColor.toLowerCase();
                return (
                  <div
                    key={color}
                    className={`group relative aspect-square rounded-sm transition-all ${
                      isActive
                        ? 'ring-2 ring-offset-1 ring-blue-500 z-10'
                        : 'hover:ring-1 hover:ring-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <button
                      type="button"
                      onClick={() => pickBase(color)}
                      className="absolute inset-0 rounded-sm"
                      title={color}
                      aria-label={`Select ${color}`}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUserColor(color);
                      }}
                      className="absolute top-0 right-0 w-3 h-3 flex items-center justify-center text-gray-500 bg-white/85 rounded-bl opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                      title={t('editor.removeSavedColor')}
                      aria-label={t('editor.removeSavedColor')}
                    >
                      <svg
                        width="7"
                        height="7"
                        viewBox="0 0 10 10"
                        aria-hidden
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="M2 2 L8 8 M8 2 L2 8" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorPallete;
