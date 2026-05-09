import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, pickPalette } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import type { Episode } from '../types/podcast';

type CaseCardProps = {
  episode: Episode;
  bookmarked?: boolean;
  onPress: (episode: Episode) => void;
  onToggleBookmark?: (episode: Episode) => void;
};

export function CaseCard({
  episode,
  bookmarked = false,
  onPress,
  onToggleBookmark
}: CaseCardProps) {
  const palette = pickPalette(episode.id);

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open case ${episode.caseNumber}: ${episode.title}`}
        onPress={() => onPress(episode)}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.shadow}>
          <View style={[styles.art, { backgroundColor: palette.bg }]}>
            <View style={[styles.blob, { backgroundColor: palette.meta }]} />
            <View style={styles.play}>
              <Ionicons name="play" size={14} color={colors.blue} />
            </View>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {episode.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {episode.category} · {episode.duration}
        </Text>
      </Pressable>

      {onToggleBookmark ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark episode'}
          onPress={() => onToggleBookmark(episode)}
          style={styles.bookmark}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={17}
            color={bookmarked ? colors.orange : colors.navy}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    width: 168
  },
  pressed: {
    opacity: 0.82,
    transform: [{ translateY: 2 }]
  },
  shadow: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    paddingBottom: 5,
    paddingRight: 5
  },
  art: {
    borderColor: colors.navy,
    borderRadius: radius.xl,
    borderWidth: 2,
    height: 168,
    overflow: 'hidden'
  },
  blob: {
    borderRadius: 999,
    height: 92,
    opacity: 0.58,
    position: 'absolute',
    right: -28,
    top: -24,
    width: 92
  },
  bookmark: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: 999,
    borderWidth: 2,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
    width: 36
  },
  play: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: 999,
    borderWidth: 2,
    bottom: spacing.md,
    height: 42,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.md,
    width: 42
  },
  title: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
    marginTop: spacing.md
  },
  meta: {
    color: colors.purple,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: spacing.xs,
    textTransform: 'uppercase'
  }
});
