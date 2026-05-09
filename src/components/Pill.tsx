import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type PillProps = PressableProps & {
  label: string;
  active?: boolean;
};

export function Pill({ label, active = false, style, ...props }: PillProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.container,
        active && styles.active,
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style
      ]}
      {...props}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardMuted,
    borderColor: colors.border,
    borderRadius: radius.round,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }]
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700'
  },
  activeLabel: {
    color: colors.background
  }
});
