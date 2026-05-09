import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Episode } from '../types/podcast';
import { colors, gradients } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { formatEpisodeDate } from '../utils/formatters';

type EpisodeCardProps = {
  episode: Episode;
  compact?: boolean;
  onPress: (episode: Episode) => void;
};

export function EpisodeCard({ episode, compact = false, onPress }: EpisodeCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open episode ${episode.title}`}
      onPress={() => onPress(episode)}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <LinearGradient colors={gradients.card} style={styles.card}>
        <View style={styles.artwork}>
          <Ionicons name="mic" size={compact ? 22 : 28} color={colors.background} />
        </View>
        <View style={styles.copy}>
          <View style={styles.metaRow}>
            <Text style={styles.category}>{episode.category}</Text>
            <Text style={styles.meta}>{episode.duration}</Text>
          </View>
          <Text style={[styles.title, compact && styles.compactTitle]}>
            {episode.title}
          </Text>
          <Text
            style={styles.subtitle}
            numberOfLines={compact ? 2 : 3}
          >
            {episode.subtitle}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.meta}>{formatEpisodeDate(episode.publishedAt)}</Text>
            <View style={styles.play}>
              <Ionicons name="play" size={13} color={colors.background} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.lg
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }]
  },
  card: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.lg
  },
  artwork: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    height: 72,
    justifyContent: 'center',
    width: 72
  },
  copy: {
    flex: 1,
    gap: spacing.xs
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  category: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  meta: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: '600'
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800'
  },
  compactTitle: {
    fontSize: 17
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs
  },
  play: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.round,
    height: 26,
    justifyContent: 'center',
    width: 26
  }
});
