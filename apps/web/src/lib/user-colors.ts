// Persistent "My colors" row in the editor palette. A simple array
// of hex strings stored in localStorage so a user's handpicked
// palette survives page refreshes. Separate from presets (which bind
// to a tile) — these are loose swatches the user can apply anywhere.

const STORAGE_KEY = 'habaneta:user-colors';

/** Keep the stored list bounded so a runaway click on "+" can't
 *  balloon localStorage or the preview-header strip. 18 = two full
 *  rows at the current 9-col layout. */
const MAX_USER_COLORS = 18;

export function loadUserColors(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

export function saveUserColors(colors: string[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(colors.slice(0, MAX_USER_COLORS))
    );
  } catch {
    // Quota / private browsing — fail silently.
  }
}

/** Add a color to the saved list if not already present, returning
 *  the new list. Case-insensitive dedupe. */
export function addUserColor(colors: string[], color: string): string[] {
  const normalized = color.trim().toLowerCase();
  if (!normalized) return colors;
  if (colors.some((c) => c.toLowerCase() === normalized)) return colors;
  return [...colors, color].slice(0, MAX_USER_COLORS);
}

export function removeUserColor(colors: string[], color: string): string[] {
  return colors.filter((c) => c.toLowerCase() !== color.toLowerCase());
}
