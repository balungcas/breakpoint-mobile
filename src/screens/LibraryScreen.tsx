import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CaseCard } from '../components/CaseCard';
import { ConsoleHeader } from '../components/ConsoleHeader';
import { PopCard } from '../components/PopCard';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { fetchEpisodes, fetchFlashcards } from '../services/supabaseRest';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import type { RootStackParamList } from '../navigation/types';
import type { Episode, Flashcard } from '../types/podcast';
import { useStoredStringArray } from '../hooks/useAsyncStore';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function LibraryScreen() {
  const navigation = useNavigation<Navigation>();
  const bookmarks = useStoredStringArray('bookmarkedCases');
  const mastered = useStoredStringArray('breakpoint:mastered-flashcards');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [query, setQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    fetchEpisodes().then(setEpisodes);
    fetchFlashcards().then(setFlashcards);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return episodes
      .filter((episode) => (savedOnly ? bookmarks.items.includes(episode.id) : true))
      .filter(
        (episode) =>
          episode.title.toLowerCase().includes(q) ||
          episode.category.toLowerCase().includes(q)
      );
  }, [bookmarks.items, episodes, query, savedOnly]);

  const card = flashcards[cardIndex];
  const cardMastered = card ? mastered.items.includes(String(card.id)) : false;

  function openEpisode(episode: Episode) {
    navigation.navigate('EpisodeDetail', { episodeId: episode.id });
  }

  function moveCard(delta: number) {
    if (!flashcards.length) return;
    setFlipped(false);
    setCardIndex((current) => (current + delta + flashcards.length) % flashcards.length);
  }

  return (
    <Screen>
      <ConsoleHeader icon="library" eyebrow="Archive" title="CASE LIBRARY" color={colors.cyan} />

      <View style={styles.search}>
        <Ionicons name="search" size={16} color={colors.purple} />
        <TextInput
          accessibilityLabel="Search cases"
          value={query}
          onChangeText={setQuery}
          placeholder="Search cases, categories..."
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="FLASHCARDS" color={colors.orange} />
        <PopCard backgroundColor={flipped ? colors.navy : colors.white} style={styles.flashcard}>
          {card ? (
            <Pressable onPress={() => setFlipped((value) => !value)} style={styles.flashContent}>
              <View style={styles.flashMetaRow}>
                <Text style={[styles.flashBadge, flipped && styles.flashBadgeBack]}>
                  {flipped ? 'Definition' : (card.category ?? 'General')}
                </Text>
                <Text style={[styles.flashDifficulty, flipped && styles.lightText]}>
                  {card.difficulty ?? 'Starter'}
                </Text>
              </View>
              <View>
                <Text style={[styles.flashLabel, flipped && styles.lightText]}>
                  {flipped ? 'Answer' : 'Term'}
                </Text>
                <Text style={[styles.flashTitle, flipped && styles.backTitle]}>
                  {flipped ? card.definition : card.term}
                </Text>
              </View>
              <Text style={[styles.flashHint, flipped && styles.lightText]}>
                Tap to flip · use arrows to navigate
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.empty}>No flashcards yet.</Text>
          )}
        </PopCard>
        <View style={styles.flashActions}>
          <Pressable onPress={() => moveCard(-1)} style={styles.roundAction}>
            <Ionicons name="chevron-back" size={20} color={colors.navy} />
          </Pressable>
          <Pressable
            onPress={() => card && mastered.toggle(String(card.id))}
            style={[styles.masterButton, cardMastered && styles.mastered]}
          >
            <Ionicons name="trophy" size={16} color={colors.navy} />
            <Text style={styles.masterText}>{cardMastered ? 'Mastered' : 'Mark Mastered'}</Text>
          </Pressable>
          <Pressable onPress={() => moveCard(1)} style={styles.roundAction}>
            <Ionicons name="chevron-forward" size={20} color={colors.navy} />
          </Pressable>
        </View>
      </View>

      <View style={styles.filesHeader}>
        <Text style={styles.fileCount}>// {filtered.length} files</Text>
        <Pressable
          onPress={() => setSavedOnly((value) => !value)}
          style={[styles.savedToggle, savedOnly && styles.savedToggleOn]}
        >
          <Ionicons
            name={savedOnly ? 'bookmark' : 'bookmark-outline'}
            size={14}
            color={savedOnly ? colors.white : colors.navy}
          />
          <Text style={[styles.savedText, savedOnly && styles.savedTextOn]}>
            Saved {savedOnly ? 'On' : 'Off'} ({bookmarks.items.length})
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(episode) => episode.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <CaseCard
            episode={item}
            bookmarked={bookmarks.items.includes(item.id)}
            onToggleBookmark={(episode) => bookmarks.toggle(episode.id)}
            onPress={openEpisode}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No bookmarked cases yet. Tap any bookmark to save a case.</Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  input: {
    color: colors.navy,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    minHeight: 38
  },
  section: {
    gap: spacing.md
  },
  flashcard: {
    minHeight: 280
  },
  flashContent: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 240
  },
  flashMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flashBadge: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    textTransform: 'uppercase'
  },
  flashBadgeBack: {
    backgroundColor: colors.orange
  },
  flashDifficulty: {
    color: colors.purple,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  lightText: {
    color: colors.white
  },
  flashLabel: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  flashTitle: {
    color: colors.navy,
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 40,
    marginTop: spacing.xs
  },
  backTitle: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 28
  },
  flashHint: {
    color: colors.purple,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  flashActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md
  },
  roundAction: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    height: 48,
    justifyContent: 'center',
    width: 48
  },
  masterButton: {
    alignItems: 'center',
    backgroundColor: colors.orange,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.md
  },
  mastered: {
    backgroundColor: colors.lime
  },
  masterText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  filesHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  fileCount: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  savedToggle: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  savedToggleOn: {
    backgroundColor: colors.orange
  },
  savedText: {
    color: colors.navy,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  savedTextOn: {
    color: colors.white
  },
  grid: {
    gap: spacing.lg
  },
  gridRow: {
    justifyContent: 'space-between'
  },
  empty: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    textAlign: 'center'
  }
});
