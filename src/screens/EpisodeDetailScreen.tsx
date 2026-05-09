import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { ChunkyButton } from '../components/ChunkyButton';
import { PopCard } from '../components/PopCard';
import { Screen } from '../components/Screen';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useGuestProgress, useStoredStringArray } from '../hooks/useAsyncStore';
import { fetchEpisodes } from '../services/supabaseRest';
import type { RootStackParamList } from '../navigation/types';
import { colors, pickPalette } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import type { Episode } from '../types/podcast';

type EpisodeDetailProps = NativeStackScreenProps<RootStackParamList, 'EpisodeDetail'>;

export function EpisodeDetailScreen({ navigation, route }: EpisodeDetailProps) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loaded, setLoaded] = useState(false);
  const audio = useAudioPlayer();
  const guest = useGuestProgress();
  const bookmarks = useStoredStringArray('bookmarkedCases');

  useEffect(() => {
    fetchEpisodes()
      .then((items) => setEpisode(items.find((item) => item.id === route.params.episodeId) ?? null))
      .finally(() => setLoaded(true));
  }, [route.params.episodeId]);

  if (!episode && loaded) {
    return (
      <Screen>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={colors.navy} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={38} color={colors.orange} />
          <Text style={styles.notFoundTitle}>Episode unavailable</Text>
          <Text style={styles.body}>
            This episode could not be found in the current mobile catalog.
          </Text>
        </View>
      </Screen>
    );
  }

  if (!episode) {
    return (
      <Screen>
        <Text style={styles.body}>Loading case...</Text>
      </Screen>
    );
  }

  const currentEpisode = episode;
  const palette = pickPalette(currentEpisode.id);
  const episodeUrl = `https://breakpoint.app/case/${currentEpisode.id}`;
  const bookmarked = bookmarks.items.includes(currentEpisode.id);
  const isCurrent = audio.current?.id === currentEpisode.id;

  async function shareEpisode() {
    await Share.share({
      title: currentEpisode.title,
      message: `${currentEpisode.title}\n${currentEpisode.description}\n${episodeUrl}`
    });
  }

  async function copyEpisodeLink() {
    await Clipboard.setStringAsync(episodeUrl);
  }

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={colors.navy} />
        <Text style={styles.backText}>Cases</Text>
      </Pressable>

      <View style={[styles.cover, { backgroundColor: palette.bg }]}>
        <View style={styles.coverBlob} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark this case'}
          onPress={() => bookmarks.toggle(episode.id)}
          style={styles.bookmark}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={bookmarked ? colors.orange : colors.navy}
          />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={audio.isPlaying && isCurrent ? 'Pause' : 'Play'}
        onPress={() => audio.playTrack(episode)}
        style={styles.floatingPlay}
      >
        <Ionicons
          name={audio.isPlaying && isCurrent ? 'pause' : 'play'}
          size={30}
          color={colors.white}
        />
      </Pressable>

      <View style={styles.centered}>
        <Text style={styles.title}>{episode.title}</Text>
        <Text style={styles.caseNumber}>{episode.caseNumber} · {episode.category}</Text>
      </View>

      <PopCard backgroundColor={colors.purple}>
        <Text style={styles.hostLabel}>Host</Text>
        <Text style={styles.description}>{episode.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.infoPill}>★ — ({0})</Text>
          <Text style={styles.infoPill}>{episode.category}</Text>
          <Pressable onPress={copyEpisodeLink} style={styles.infoPillButton}>
            <Ionicons name="share-outline" size={14} color={colors.white} />
            <Text style={styles.infoPillText}>Copy Link</Text>
          </Pressable>
          <Text style={[styles.infoPill, styles.durationPill]}>{episode.duration}</Text>
        </View>
      </PopCard>

      <View style={styles.actions}>
        <ChunkyButton
          label={episode.audioUrl ? (audio.isPlaying && isCurrent ? 'Pause case' : 'Play case') : 'Open audio'}
          icon={audio.isPlaying && isCurrent ? 'pause' : 'play'}
          backgroundColor={colors.orange}
          onPress={() =>
            episode.audioUrl ? audio.playTrack(episode) : Linking.openURL(episodeUrl)
          }
        />
        <ChunkyButton
          label="Share"
          icon="share-outline"
          backgroundColor={colors.blue}
          onPress={shareEpisode}
        />
      </View>

      {episode.interactions.length ? (
        <PopCard backgroundColor={colors.yellow}>
          <Text style={styles.sectionTitle}>Interactive checkpoints</Text>
          {episode.interactions.map((interaction) => (
            <View key={interaction.id} style={styles.checkpoint}>
              <Text style={styles.checkpointTime}>{interaction.timestamp}s</Text>
              <Text style={styles.checkpointQuestion}>{interaction.question}</Text>
            </View>
          ))}
        </PopCard>
      ) : null}

      <PopCard backgroundColor={colors.yellow}>
        <Text style={styles.invite}>Invite your friends to listen</Text>
        <ChunkyButton label="Copy invite" icon="copy" backgroundColor={colors.navy} onPress={copyEpisodeLink} />
      </PopCard>

      <ChunkyButton
        label="Mark case closed +100 XP"
        icon="checkmark-circle"
        backgroundColor={colors.lime}
        color={colors.navy}
        onPress={async () => {
          await guest.completeCase(episode.id);
          await guest.addXp(100);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.xs
  },
  backText: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: '800'
  },
  cover: {
    borderBottomColor: colors.navy,
    borderBottomLeftRadius: 96,
    borderBottomRightRadius: 96,
    borderBottomWidth: 2,
    height: 310,
    marginHorizontal: -spacing.lg,
    overflow: 'hidden'
  },
  coverBlob: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    height: 84,
    left: '38%',
    position: 'absolute',
    top: '42%',
    width: 84
  },
  bookmark: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    height: 44,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.xl,
    top: spacing.xl,
    width: 44
  },
  floatingPlay: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.orange,
    borderColor: colors.white,
    borderRadius: radius.round,
    borderWidth: 4,
    height: 82,
    justifyContent: 'center',
    marginTop: -58,
    width: 82
  },
  centered: {
    alignItems: 'center',
    gap: spacing.sm
  },
  title: {
    color: colors.navy,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1.2,
    lineHeight: 36,
    textAlign: 'center'
  },
  caseNumber: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase'
  },
  hostLabel: {
    color: colors.yellow,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  description: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 22
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  infoPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.round,
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  infoPillButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.round,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  infoPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900'
  },
  durationPill: {
    backgroundColor: colors.yellow,
    color: colors.navy
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '900'
  },
  body: {
    color: colors.purple,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 23
  },
  checkpoint: {
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: spacing.xs,
    padding: spacing.md
  },
  checkpointTime: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase'
  },
  checkpointQuestion: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 20
  },
  invite: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: '900'
  },
  notFound: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxxl
  },
  notFoundTitle: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: '900'
  }
});
