import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ChunkyButton } from '../components/ChunkyButton';
import { PopCard } from '../components/PopCard';
import { Screen } from '../components/Screen';
import { fetchDrills } from '../services/supabaseRest';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import type { Drill } from '../types/podcast';
import { useGuestProgress } from '../hooks/useAsyncStore';

const deckSize = 10;

type Stats = {
  correct: number;
  wrong: number;
  xp: number;
};

export function DrillsScreen() {
  const guest = useGuestProgress();
  const [deck, setDeck] = useState<Drill[]>([]);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState<Stats>({ correct: 0, wrong: 0, xp: 0 });
  const [revealed, setRevealed] = useState<Drill | null>(null);

  useEffect(() => {
    fetchDrills().then((rows) => setDeck(rows.slice(0, deckSize)));
  }, []);

  const current = deck[index];
  const cardsDone = Math.min(index, deckSize);
  const missionLabel = useMemo(() => `${cardsDone}/${deckSize}`, [cardsDone]);

  async function answer(userSaysScam: boolean) {
    if (!current) return;
    const correct = userSaysScam === current.isScam;

    if (correct) {
      const xp = current.xpReward;
      setStats((value) => ({
        correct: value.correct + 1,
        wrong: value.wrong,
        xp: value.xp + xp
      }));
      await guest.addXp(xp);
      setIndex((value) => value + 1);
    } else {
      setStats((value) => ({ ...value, wrong: value.wrong + 1 }));
      setRevealed(current);
    }
  }

  function dismissReveal() {
    setRevealed(null);
    setIndex((value) => value + 1);
  }

  function resetDeck() {
    setIndex(0);
    setStats({ correct: 0, wrong: 0, xp: 0 });
    setRevealed(null);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.kicker}>// Field Training</Text>
        <Text style={styles.title}>DAILY DRILLS</Text>
        <Text style={styles.instructions}>
          Tap <Text style={styles.orange}>SCAM</Text> or <Text style={styles.blue}>SAFE</Text> to sharpen your instincts.
        </Text>

        <Text style={styles.progressLabel}>Mission · {missionLabel}</Text>
        <View style={styles.progressGrid}>
          {Array.from({ length: deckSize }).map((_, itemIndex) => (
            <View
              key={itemIndex}
              style={[
                styles.progressDot,
                itemIndex < cardsDone && styles.progressDotDone
              ]}
            />
          ))}
        </View>

        <View style={styles.statsRow}>
          <StatPill label="Correct" value={stats.correct} backgroundColor={colors.lime} />
          <StatPill label="Missed" value={stats.wrong} backgroundColor={colors.yellow} />
          <StatPill label="+XP" value={stats.xp} backgroundColor={colors.orange} color={colors.white} />
        </View>
      </View>

      {!current ? (
        <PopCard backgroundColor={colors.lime} style={styles.finished}>
          <Ionicons name="flash" size={42} color={colors.navy} />
          <Text style={styles.finishedTitle}>MISSION CLEARED!</Text>
          <Text style={styles.instructions}>
            {stats.correct} correct · {stats.wrong} missed · +{stats.xp} XP
          </Text>
          <ChunkyButton label="Restart deck" backgroundColor={colors.blue} onPress={resetDeck} />
        </PopCard>
      ) : (
        <PopCard backgroundColor={colors.white} style={styles.drillCard}>
          <View style={styles.blobTop} />
          <View style={styles.blobBottom} />
          <Text style={styles.category}>{(current.category ?? 'DRILL').toUpperCase()}</Text>
          <Text style={styles.drillTitle}>{current.title}</Text>
          <Text style={styles.drillContent}>
            {current.content || current.description || 'Examine the scenario carefully.'}
          </Text>
          <Text style={styles.swipeHint}>Scam ← · → Safe</Text>
        </PopCard>
      )}

      {current && !revealed ? (
        <View style={styles.answerRow}>
          <ChunkyButton
            label="Scam"
            icon="warning"
            backgroundColor={colors.orange}
            onPress={() => answer(true)}
            style={styles.answerButton}
          />
          <ChunkyButton
            label="Safe"
            icon="shield-checkmark"
            backgroundColor={colors.blue}
            onPress={() => answer(false)}
            style={styles.answerButton}
          />
        </View>
      ) : null}

      {revealed ? (
        <View style={styles.overlay}>
          <PopCard backgroundColor={colors.yellow}>
            <Text style={styles.revealBadge}>Intel Debrief</Text>
            <Text style={styles.revealTitle}>
              {revealed.isScam ? 'It WAS a scam.' : 'Actually, this was SAFE.'}
            </Text>
            <Text style={styles.instructions}>
              {revealed.explanation ??
                (revealed.isScam
                  ? 'Look for spoofed senders, urgency, and unexpected links.'
                  : 'This message had no malicious indicators.')}
            </Text>
            <ChunkyButton label="Got it" backgroundColor={colors.navy} onPress={dismissReveal} />
          </PopCard>
        </View>
      ) : null}
    </Screen>
  );
}

function StatPill({
  label,
  value,
  backgroundColor,
  color = colors.navy
}: {
  label: string;
  value: number;
  backgroundColor: string;
  color?: string;
}) {
  return (
    <View style={[styles.stat, { backgroundColor }]}>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md
  },
  kicker: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.4,
    textTransform: 'uppercase'
  },
  title: {
    color: colors.navy,
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 48,
    textShadowColor: colors.yellow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0
  },
  instructions: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21
  },
  orange: {
    color: colors.orange,
    fontWeight: '900'
  },
  blue: {
    color: colors.blue,
    fontWeight: '900'
  },
  progressLabel: {
    color: colors.navy,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  progressGrid: {
    flexDirection: 'row',
    gap: spacing.xs
  },
  progressDot: {
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 1,
    flex: 1,
    height: 10
  },
  progressDotDone: {
    backgroundColor: colors.orange
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  stat: {
    borderColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 2,
    flex: 1,
    padding: spacing.md
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900'
  },
  drillCard: {
    minHeight: 420,
    overflow: 'hidden'
  },
  blobTop: {
    backgroundColor: colors.lime,
    borderRadius: 999,
    height: 96,
    left: -36,
    position: 'absolute',
    top: -38,
    width: 96
  },
  blobBottom: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    bottom: -42,
    height: 112,
    position: 'absolute',
    right: -42,
    width: 112
  },
  category: {
    alignSelf: 'flex-start',
    backgroundColor: colors.navy,
    borderRadius: radius.round,
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  drillTitle: {
    color: colors.navy,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 34,
    marginTop: spacing.lg
  },
  drillContent: {
    color: colors.purple,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 23,
    marginTop: spacing.md
  },
  swipeHint: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  answerRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  answerButton: {
    flex: 1
  },
  finished: {
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 360,
    justifyContent: 'center'
  },
  finishedTitle: {
    color: colors.navy,
    fontSize: 30,
    fontWeight: '900'
  },
  overlay: {
    backgroundColor: colors.overlay,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: spacing.lg,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20
  },
  revealBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.navy,
    borderRadius: radius.round,
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    textTransform: 'uppercase'
  },
  revealTitle: {
    color: colors.navy,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 34
  }
});
