import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: string;
  color?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  action,
  color = colors.orange
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.bar, { backgroundColor: color }]} />
        </View>
      </View>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md
  },
  copy: {
    flex: 1,
    gap: spacing.xs
  },
  eyebrow: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  title: {
    color: colors.navy,
    fontSize: 22,
    fontWeight: '900'
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md
  },
  bar: {
    borderRadius: 999,
    height: 8,
    width: 48
  },
  action: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: '700'
  }
});
