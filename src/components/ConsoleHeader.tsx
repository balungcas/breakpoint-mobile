import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type ConsoleHeaderProps = {
  icon: keyof typeof Ionicons.glyphMap;
  eyebrow: string;
  title: string;
  color?: string;
};

export function ConsoleHeader({
  icon,
  eyebrow,
  title,
  color = colors.orange
}: ConsoleHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={[styles.icon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={18} color={color === colors.purple ? colors.white : colors.navy} />
      </View>
      <View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    borderBottomColor: colors.navy,
    borderBottomWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: -spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg
  },
  icon: {
    alignItems: 'center',
    borderColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    width: 42
  },
  eyebrow: {
    color: colors.purple,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.2,
    textTransform: 'uppercase'
  },
  title: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 26
  }
});
