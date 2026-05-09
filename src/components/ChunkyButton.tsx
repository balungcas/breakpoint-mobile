import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type ChunkyButtonProps = PropsWithChildren<
  PressableProps & {
    label?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    backgroundColor?: string;
    color?: string;
  }
>;

export function ChunkyButton({
  children,
  label,
  icon,
  backgroundColor = colors.orange,
  color = colors.white,
  style,
  ...props
}: ChunkyButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.shadow,
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style
      ]}
      {...props}
    >
      <View style={[styles.button, { backgroundColor }]}>
        {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
        {label ? <Text style={[styles.label, { color }]}>{label}</Text> : children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: colors.navy,
    borderRadius: radius.round,
    paddingBottom: 4,
    paddingRight: 4
  },
  pressed: {
    opacity: 0.84,
    transform: [{ translateY: 2 }]
  },
  button: {
    alignItems: 'center',
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  label: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase'
  }
});
