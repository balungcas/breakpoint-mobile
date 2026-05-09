import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { EpisodeCard } from '../components/EpisodeCard';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { featuredEpisodes, podcastProfile } from '../data/podcast';
import { colors, gradients } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import type { RootStackParamList } from '../navigation/types';
import type { Episode } from '../types/podcast';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();

  function openEpisode(episode: Episode) {
    navigation.navigate('EpisodeDetail', { episodeId: episode.id });
  }

  return (
    <Screen>
      <LinearGradient colors={gradients.hero} style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="radio" size={16} color={colors.background} />
          <Text style={styles.heroBadgeText}>Podcast</Text>
        </View>
        <Text style={styles.title}>{podcastProfile.name}</Text>
        <Text style={styles.tagline}>{podcastProfile.tagline}</Text>
        <Text style={styles.description}>{podcastProfile.insight}</Text>
        <View style={styles.heroActions}>
          <PrimaryButton
            label="Listen now"
            icon="play"
            onPress={() => openEpisode(featuredEpisodes[0])}
          />
          <PrimaryButton
            label="Website"
            icon="globe-outline"
            variant="secondary"
            onPress={() => Linking.openURL(podcastProfile.website)}
          />
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <SectionHeader eyebrow="Featured" title="Start with these episodes" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        >
          {featuredEpisodes.map((episode) => (
            <View key={episode.id} style={styles.featuredCard}>
              <EpisodeCard episode={episode} onPress={openEpisode} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader eyebrow="Why listen" title="Designed for real life" />
        <InfoCard
          icon="compass-outline"
          title="Practical perspective"
          body="Episodes focus on common-sense choices, grounded conversations, and useful next steps."
        />
        <InfoCard
          icon="sparkles-outline"
          title="Insight without overwhelm"
          body="The app keeps listening, subscribing, and contacting the show clear and easy on mobile."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.xl
  },
  heroBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  heroBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  title: {
    color: colors.text,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1.2
  },
  tagline: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800'
  },
  description: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm
  },
  section: {
    gap: spacing.md
  },
  featuredList: {
    gap: spacing.md,
    paddingRight: spacing.lg
  },
  featuredCard: {
    width: 320
  }
});
