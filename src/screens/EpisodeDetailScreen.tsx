import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { episodes, podcastProfile } from '../data/podcast';
import type { RootStackParamList } from '../navigation/types';
import { colors, gradients } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { formatEpisodeDate } from '../utils/formatters';

type EpisodeDetailProps = NativeStackScreenProps<RootStackParamList, 'EpisodeDetail'>;

export function EpisodeDetailScreen({ navigation, route }: EpisodeDetailProps) {
  const episode = episodes.find((item) => item.id === route.params.episodeId);

  if (!episode) {
    return (
      <Screen>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={38} color={colors.primary} />
          <Text style={styles.notFoundTitle}>Episode unavailable</Text>
          <Text style={styles.body}>
            This episode could not be found in the current mobile catalog.
          </Text>
        </View>
      </Screen>
    );
  }

  const episodeUrl = `${podcastProfile.website}?episode=${episode.id}`;

  async function shareEpisode() {
    await Share.share({
      title: episode.title,
      message: `${episode.title}\n${episode.subtitle}\n${episodeUrl}`
    });
  }

  async function copyEpisodeLink() {
    await Clipboard.setStringAsync(episodeUrl);
  }

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={colors.text} />
        <Text style={styles.backText}>Episodes</Text>
      </Pressable>

      <LinearGradient colors={gradients.card} style={styles.hero}>
        <View style={styles.artwork}>
          <Ionicons name="mic" size={46} color={colors.background} />
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{episode.category}</Text>
          <Text style={styles.meta}>{episode.duration}</Text>
        </View>
        <Text style={styles.title}>{episode.title}</Text>
        <Text style={styles.subtitle}>{episode.subtitle}</Text>
        <Text style={styles.meta}>{formatEpisodeDate(episode.publishedAt)}</Text>
      </LinearGradient>

      <View style={styles.actions}>
        <PrimaryButton
          label={episode.audioUrl ? 'Play episode' : 'Open website'}
          icon={episode.audioUrl ? 'play' : 'globe-outline'}
          onPress={() => Linking.openURL(episode.audioUrl ?? podcastProfile.website)}
        />
        <PrimaryButton
          label="Share"
          icon="share-outline"
          variant="secondary"
          onPress={shareEpisode}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About this episode</Text>
        <Text style={styles.body}>{episode.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key takeaways</Text>
        {episode.takeaways.map((takeaway) => (
          <View key={takeaway} style={styles.takeaway}>
            <Ionicons name="checkmark-circle" size={19} color={colors.success} />
            <Text style={styles.takeawayText}>{takeaway}</Text>
          </View>
        ))}
      </View>

      <View style={styles.secondaryActions}>
        <Pressable style={styles.utilityAction} onPress={copyEpisodeLink}>
          <Ionicons name="copy-outline" size={18} color={colors.accent} />
          <Text style={styles.utilityText}>Copy episode link</Text>
        </Pressable>
        <Pressable
          style={styles.utilityAction}
          onPress={() => Linking.openURL(`mailto:${podcastProfile.email}`)}
        >
          <Ionicons name="mail-outline" size={18} color={colors.accent} />
          <Text style={styles.utilityText}>Send feedback</Text>
        </Pressable>
      </View>
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
    color: colors.text,
    fontSize: 15,
    fontWeight: '800'
  },
  hero: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl
  },
  artwork: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    height: 112,
    justifyContent: 'center',
    width: 112
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md
  },
  category: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  meta: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: '700'
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center'
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md
  },
  section: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23
  },
  takeaway: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm
  },
  takeawayText: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 15,
    lineHeight: 22
  },
  secondaryActions: {
    gap: spacing.md
  },
  utilityAction: {
    alignItems: 'center',
    backgroundColor: colors.cardMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg
  },
  utilityText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800'
  },
  notFound: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxxl
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900'
  }
});
