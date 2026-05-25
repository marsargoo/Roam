/**
 * ROAM Design System — Typography Scale
 *
 * Typefaces:
 *   Playfair Display — Display headings (H1, H2)
 *   DM Sans          — UI & body text (H3 → Label)
 *
 * Keys MUST match the names registered in useFonts() inside app/_layout.tsx.
 * lineHeight values are pixels (React Native standard, not unitless ratios).
 */

// ─── Font Family Keys ────────────────────────────────────────────────────────

/** Registered font-family names. Must stay in sync with _layout.tsx useFonts(). */
export const fontFamilies = {
  displayBold: 'PlayfairDisplay-Bold',         // weight 700
  displaySemiBold: 'PlayfairDisplay-SemiBold', // weight 600
  bodyRegular: 'DMSans-Regular',               // weight 400
  bodyMedium: 'DMSans-Medium',                 // weight 500
  bodySemiBold: 'DMSans-SemiBold',             // weight 600
} as const;

export type FontFamily = (typeof fontFamilies)[keyof typeof fontFamilies];

// ─── Type Scale ──────────────────────────────────────────────────────────────

/**
 * Full type scale as React Native style objects.
 * Used by <Text variant="…"> and exported for direct StyleSheet use.
 *
 * Design spec:
 *   variant      face              size   weight   lh ratio
 *   h1           Playfair Display  32px   700      1.2
 *   h2           Playfair Display  26px   600      1.2
 *   h3           DM Sans           20px   600      1.3
 *   h4           DM Sans           17px   500      1.4
 *   bodyLarge    DM Sans           16px   400      1.6
 *   bodyMedium   DM Sans           14px   400      1.6
 *   bodySmall    DM Sans           13px   400      1.6
 *   caption      DM Sans           11px   400      1.4
 *   label        DM Sans           12px   600      1.0
 */
export const typeScale = {
  /** Page / Screen Title — Playfair Display Bold 32px */
  h1: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 32,
    lineHeight: 38, // 32 × 1.2 = 38.4 → 38
    fontWeight: '700' as const,
  },
  /** Section / POI Title — Playfair Display SemiBold 26px */
  h2: {
    fontFamily: fontFamilies.displaySemiBold,
    fontSize: 26,
    lineHeight: 31, // 26 × 1.2 = 31.2 → 31
    fontWeight: '600' as const,
  },
  /** Card / Challenge Title — DM Sans SemiBold 20px */
  h3: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 20,
    lineHeight: 26, // 20 × 1.3 = 26
    fontWeight: '600' as const,
  },
  /** Subheading / Tab Label — DM Sans Medium 17px */
  h4: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 17,
    lineHeight: 24, // 17 × 1.4 = 23.8 → 24
    fontWeight: '500' as const,
  },
  /** Primary content / reflections — DM Sans Regular 16px */
  bodyLarge: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: 16,
    lineHeight: 26, // 16 × 1.6 = 25.6 → 26
    fontWeight: '400' as const,
  },
  /** Standard body text — DM Sans Regular 14px */
  bodyMedium: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: 14,
    lineHeight: 22, // 14 × 1.6 = 22.4 → 22
    fontWeight: '400' as const,
  },
  /** Supporting / metadata — DM Sans Regular 13px */
  bodySmall: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: 13,
    lineHeight: 21, // 13 × 1.6 = 20.8 → 21
    fontWeight: '400' as const,
  },
  /** Timestamps / fine print — DM Sans Regular 11px */
  caption: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: 11,
    lineHeight: 15, // 11 × 1.4 = 15.4 → 15
    fontWeight: '400' as const,
  },
  /** Buttons / tags / chips — DM Sans SemiBold 12px */
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    lineHeight: 12, // 12 × 1.0 = 12
    fontWeight: '600' as const,
  },
} as const;

export type TypeVariant = keyof typeof typeScale;
