import { Ionicons } from '@expo/vector-icons';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type PrimaryButtonProps = PressableProps & {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary';
};

export function PrimaryButton({
  label,
  icon,
  variant = 'primary',
  style,
  ...props
}: PrimaryButtonProps) {
  const secondary = variant === 'secondary';

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style
      ]}
      {...props}
    >
      <View style={styles.content}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={secondary ? colors.text : colors.background}
          />
        ) : null}
        <Text style={[styles.label, secondary && styles.secondaryLabel]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md
  },
  secondary: {
    backgroundColor: colors.cardMuted,
    borderColor: colors.border,
    borderWidth: 1
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }]
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm
  },
  label: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '800'
  },
  secondaryLabel: {
    color: colors.text
  }
});
