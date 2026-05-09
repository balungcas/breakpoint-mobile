import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CaseCard } from '../components/CaseCard';
import { ChunkyButton } from '../components/ChunkyButton';
import { PopCard } from '../components/PopCard';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useStoredStringArray } from '../hooks/useAsyncStore';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { fetchDrills, fetchEpisodes } from '../services/supabaseRest';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import type { Episode } from '../types/podcast';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const audio = useAudioPlayer();
  const bookmarks = useStoredStringArray('bookmarkedCases');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [drillTitle, setDrillTitle] = useState('Spot the phishing email');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchEpisodes(), fetchDrills()])
      .then(([episodeRows, drillRows]) => {
        setEpisodes(episodeRows);
        if (drillRows[0]) setDrillTitle(drillRows[0].title);
      })
      .finally(() => setLoading(false));
  }, []);

  const featured = episodes[0];
  const loadedLabel = useMemo(
    () => (loading ? 'Loading the case files...' : `${episodes.length} files loaded into the Vault.`),
    [episodes.length, loading]
  );

  function openEpisode(episode: Episode) {
    navigation.navigate('EpisodeDetail', { episodeId: episode.id });
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Ionicons name="radio" size={18} color={colors.white} />
          </View>
          <View>
            <Text style={styles.kicker}>Detective Console</Text>
            <Text style={styles.brand}>BREAKPOINT</Text>
          </View>
        </View>
        <Text style={styles.dispatch}>// 04 May · 21:42</Text>
        <Text style={styles.title}>
          Ready for your next case, <Text style={styles.blue}>Detective?</Text>
        </Text>
        <Text style={styles.loaded}>{loadedLabel}</Text>
      </View>

      <View style={styles.section}>
        <SectionHeader title="FEATURED CASE" color={colors.orange} />
        {!featured || loading ? (
          <PopCard backgroundColor={colors.orange} style={styles.loadingCard}>
            <ActivityIndicator color={colors.navy} />
          </PopCard>
        ) : (
          <PopCard backgroundColor={colors.orange} style={styles.featured}>
            <View style={styles.featuredBlobs}>
              <View style={styles.blueBlob} />
              <View style={styles.yellowBlob} />
            </View>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>{featured.caseNumber}</Text>
              <Text style={[styles.badge, styles.limeBadge]}>Interactive</Text>
            </View>
            <Text style={styles.featuredTitle}>{featured.title}</Text>
            <Text style={styles.featuredDescription} numberOfLines={3}>
              {featured.description}
            </Text>
            <View style={styles.featuredActions}>
              <ChunkyButton
                label="Listen Now"
                icon="play"
                backgroundColor={colors.blue}
                onPress={() => audio.playTrack(featured)}
              />
              <Text style={styles.duration}>{featured.duration}</Text>
            </View>
          </PopCard>
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader title="CONTINUE LISTENING" color={colors.cyan} action="View all" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.caseList}
        >
          {episodes.map((episode) => (
            <CaseCard
              key={episode.id}
              episode={episode}
              bookmarked={bookmarks.items.includes(episode.id)}
              onToggleBookmark={(item) => bookmarks.toggle(item.id)}
              onPress={openEpisode}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader title="DAILY DRILL" color={colors.lime} />
        <PopCard backgroundColor={colors.lime} style={styles.drillCard}>
          <View style={styles.drillIcon}>
            <Ionicons name="flash" size={20} color={colors.orange} />
          </View>
          <View style={styles.drillCopy}>
            <Text style={styles.drillMeta}>60 sec · +25 XP</Text>
            <Text style={styles.drillTitle}>{drillTitle}</Text>
          </View>
          <ChunkyButton
            label="Start"
            backgroundColor={colors.orange}
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'Drills' satisfies keyof MainTabParamList
              })
            }
          />
        </PopCard>
      </View>

      {audio.current ? (
        <PopCard backgroundColor={colors.white} style={styles.player}>
          <View style={styles.playerCopy}>
            <Text style={styles.drillMeta}>Now playing</Text>
            <Text style={styles.playerTitle} numberOfLines={1}>
              {audio.current.title}
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${audio.progress}%` }]} />
            </View>
          </View>
          <ChunkyButton
            icon={audio.isPlaying ? 'pause' : 'play'}
            backgroundColor={colors.blue}
            onPress={audio.toggle}
          />
        </PopCard>
      ) : null}

      {audio.pendingInteraction ? (
        <PopCard backgroundColor={colors.yellow}>
          <Text style={styles.interactionTitle}>Checkpoint</Text>
          <Text style={styles.interactionQuestion}>{audio.pendingInteraction.question}</Text>
          <ChunkyButton
            label="Resume case"
            backgroundColor={colors.navy}
            onPress={audio.resumeFromInteraction}
          />
        </PopCard>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.orange,
    borderColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    width: 42
  },
  kicker: {
    color: colors.purple,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.2,
    textTransform: 'uppercase'
  },
  brand: {
    color: colors.navy,
    fontSize: 22,
    fontWeight: '900'
  },
  dispatch: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.4,
    marginTop: spacing.md,
    textTransform: 'uppercase'
  },
  title: {
    color: colors.navy,
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 46
  },
  blue: {
    color: colors.blue
  },
  loaded: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '800'
  },
  section: {
    gap: spacing.md
  },
  loadingCard: {
    justifyContent: 'center',
    minHeight: 260
  },
  featured: {
    minHeight: 280,
    overflow: 'hidden'
  },
  featuredBlobs: {
    ...StyleSheet.absoluteFillObject
  },
  blueBlob: {
    backgroundColor: colors.blue,
    borderRadius: 999,
    height: 150,
    position: 'absolute',
    right: -52,
    top: -48,
    width: 150
  },
  yellowBlob: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    bottom: 58,
    height: 78,
    left: -28,
    position: 'absolute',
    width: 78
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  badge: {
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    color: colors.navy,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    textTransform: 'uppercase'
  },
  limeBadge: {
    backgroundColor: colors.lime
  },
  featuredTitle: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 36,
    marginTop: 'auto',
    textShadowColor: colors.navy,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0
  },
  featuredDescription: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20
  },
  featuredActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md
  },
  duration: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900'
  },
  caseList: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
    paddingRight: spacing.lg
  },
  drillCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md
  },
  drillIcon: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: 48,
    justifyContent: 'center',
    width: 48
  },
  drillCopy: {
    flex: 1
  },
  drillMeta: {
    color: colors.purple,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase'
  },
  drillTitle: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: '900'
  },
  player: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md
  },
  playerCopy: {
    flex: 1,
    gap: spacing.xs
  },
  playerTitle: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: '900'
  },
  progressTrack: {
    backgroundColor: colors.cream,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    height: 10,
    overflow: 'hidden'
  },
  progressFill: {
    backgroundColor: colors.blue,
    height: '100%'
  },
  interactionTitle: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: '900'
  },
  interactionQuestion: {
    color: colors.purple,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22
  }
});
