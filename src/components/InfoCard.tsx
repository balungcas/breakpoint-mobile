import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type InfoCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
};

export function InfoCard({ icon, title, body }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.cardMuted,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  copy: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800'
  },
  body: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  }
});
