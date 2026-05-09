import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type PopCardProps = PropsWithChildren<{
  backgroundColor?: string;
  style?: ViewStyle;
}>;

export function PopCard({ children, backgroundColor = colors.white, style }: PopCardProps) {
  return (
    <View style={[styles.shadow]}>
      <View style={[styles.card, { backgroundColor }, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    paddingBottom: 5,
    paddingRight: 5
  },
  card: {
    borderColor: colors.navy,
    borderRadius: radius.xl,
    borderWidth: 2,
    gap: spacing.md,
    padding: spacing.lg
  }
});
