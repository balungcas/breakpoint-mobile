import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { EpisodeCard } from '../components/EpisodeCard';
import { Pill } from '../components/Pill';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { episodeCategories, episodes } from '../data/podcast';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import type { Episode, EpisodeCategory } from '../types/podcast';
import { normalizeSearchTerm } from '../utils/formatters';

type EpisodesNavigation = NativeStackNavigationProp<RootStackParamList>;
type SelectedCategory = 'All' | EpisodeCategory;

export function EpisodesScreen() {
  const navigation = useNavigation<EpisodesNavigation>();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>('All');

  const filteredEpisodes = useMemo(() => {
    const normalizedQuery = normalizeSearchTerm(query);

    return episodes.filter((episode) => {
      const matchesCategory =
        selectedCategory === 'All' || episode.category === selectedCategory;
      const searchable = normalizeSearchTerm(
        `${episode.title} ${episode.subtitle} ${episode.description} ${episode.category}`
      );

      return matchesCategory && searchable.includes(normalizedQuery);
    });
  }, [query, selectedCategory]);

  function openEpisode(episode: Episode) {
    navigation.navigate('EpisodeDetail', { episodeId: episode.id });
  }

  return (
    <Screen scroll={false} contentStyle={styles.screen}>
      <View style={styles.header}>
        <SectionHeader eyebrow="Library" title="Episodes" />
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textSubtle} />
          <TextInput
            accessibilityLabel="Search episodes"
            value={query}
            onChangeText={setQuery}
            placeholder="Search by topic, title, or category"
            placeholderTextColor={colors.textSubtle}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {episodeCategories.map((category) => (
            <Pill
              key={category}
              label={category}
              active={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredEpisodes}
        keyExtractor={(episode) => episode.id}
        renderItem={({ item }) => (
          <EpisodeCard episode={item} compact onPress={openEpisode} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="file-tray-outline" size={34} color={colors.textSubtle} />
            <Text style={styles.emptyTitle}>No episodes found</Text>
            <Text style={styles.emptyBody}>
              Try a different search term or browse another category.
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.lg
  },
  header: {
    gap: spacing.md
  },
  search: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    minHeight: 36
  },
  categoryList: {
    gap: spacing.sm,
    paddingRight: spacing.lg
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xxxl
  },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center'
  }
});
