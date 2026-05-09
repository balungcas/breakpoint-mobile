import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: string;
};

export function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
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
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800'
  },
  action: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700'
  }
});
