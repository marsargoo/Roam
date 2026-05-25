/**
 * ROAM Design System — Color Tokens
 *
 * Single source of truth for all color values.
 * JS constant names mirror the CSS variable names in global.css.
 *
 * CSS class reference (via NativeWind):
 *   bg-forest        text-forest        border-forest
 *   bg-terracotta    text-terracotta    border-terracotta
 *   bg-amber         text-amber         border-amber
 *   bg-sage          text-sage          border-sage
 *   bg-conquest      text-conquest      border-conquest
 *   bg-warning       text-warning       border-warning
 *   bg-xp            text-xp            border-xp
 *   bg-error         text-error         border-error
 *   bg-info          text-info          border-info
 *   bg-text-primary  text-text-primary
 *   bg-text-muted    text-text-muted
 *   bg-on-dark       text-on-dark
 *   bg-border        border-border
 *   bg-surface
 *   bg-background
 */

export const colors = {
  // ── PRIMARY ──────────────────────────────────────────────────────────────
  /** Dark sage — headers, buttons, tab bars, journal covers */
  forest: '#2E4A3A',
  /** Warm red-brown — stamps, accents, headings */
  terracotta: '#8B3A2A',
  /** Golden tan — borders, sticker outlines, dividers */
  amber: '#C8A878',
  /** Medium sage green — secondary actions, category tags */
  sage: '#4A7A5A',

  // ── SEMANTIC ─────────────────────────────────────────────────────────────
  /** Active conquest / check-in indicator */
  conquest: '#4A7C59',
  /** Caution / expiry warnings */
  warning: '#D4860A',
  /** XP gain / streak highlights */
  xp: '#E8C547',
  /** Errors and destructive actions */
  error: '#C0392B',
  /** Informational callouts */
  info: '#5B8DB8',

  // ── NEUTRALS ─────────────────────────────────────────────────────────────
  /** Primary body text */
  textPrimary: '#5A4A3A',
  /** Secondary / metadata text */
  textMuted: '#B0A090',
  /** Text rendered on dark green backgrounds */
  onDark: '#E8F2E8',
  /** Card and element borders */
  border: '#DDD5C8',
  /** Card fills, stamp backgrounds */
  surface: '#F0EBE0',
  /** App / screen background */
  background: '#FAF6EE',
} as const;

export type ColorToken = keyof typeof colors;
