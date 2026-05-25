import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { typeScale, TypeVariant } from '@/theme/typography';
import { colors } from '@/theme/colors';

interface Props extends TextProps {
  /**
   * Typography variant from the ROAM type scale.
   * Applies fontFamily, fontSize, fontWeight, and lineHeight.
   * Defaults to 'bodyMedium'.
   *
   * @example
   * <Text variant="h1">Your Adventure Awaits</Text>
   * <Text variant="caption" color={colors.textMuted}>2 hours ago</Text>
   */
  variant?: TypeVariant;
  /** Override text color. Defaults to colors.textPrimary. */
  color?: string;
}

/**
 * ROAM semantic Text component.
 *
 * Always use this instead of React Native's Text for app content.
 * Font families are pre-loaded by _layout.tsx — no flash of unstyled text.
 */
export function Text({
  variant = 'bodyMedium',
  color = colors.textPrimary,
  style,
  ...props
}: Props) {
  return (
    <RNText
      style={[styles[variant], { color }, style]}
      {...props}
    />
  );
}

// StyleSheet is appropriate here: font loading requires explicit fontFamily
// values per the StyleSheet Exception Table in CLAUDE.md.
const styles = StyleSheet.create({
  h1:         typeScale.h1,
  h2:         typeScale.h2,
  h3:         typeScale.h3,
  h4:         typeScale.h4,
  bodyLarge:  typeScale.bodyLarge,
  bodyMedium: typeScale.bodyMedium,
  bodySmall:  typeScale.bodySmall,
  caption:    typeScale.caption,
  label:      typeScale.label,
});
