import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from './AuthScreen';
import { ChunkyButton } from '../components/ChunkyButton';
import { ConsoleHeader } from '../components/ConsoleHeader';
import { PopCard } from '../components/PopCard';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { useAuth } from '../contexts/AuthContext';
import { useGuestProgress } from '../hooks/useAsyncStore';
import { supabase } from '../services/supabaseClient';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { getAgentRank } from '../utils/ranks';

const badges = [
  { id: 'first-clue', label: 'The First Clue', hint: 'Close 1 case', icon: 'search', color: colors.orange },
  { id: 'phish-catcher', label: 'Phish Catcher', hint: 'Close 3 cases', icon: 'fish', color: colors.blue },
  { id: 'vibe-checker', label: 'Vibe Checker', hint: 'Earn 200 XP', icon: 'sparkles', color: colors.lime },
  { id: 'dossier-master', label: 'Dossier Master', hint: 'Earn 1000 XP', icon: 'trophy', color: colors.cyan }
] as const;

type ProfileRow = {
  display_name: string | null;
  xp: number;
  completed_cases: string[] | null;
  avatar_url: string | null;
};

export function ProfileScreen() {
  const { signOut, syncVersion, user } = useAuth();
  const guestProgress = useGuestProgress();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const fallbackName = user?.email?.split('@')[0] || 'Agent';
  const isAuthenticated = !!user;
  const name = isAuthenticated ? profile?.display_name || fallbackName : 'Guest';
  const xp = isAuthenticated ? profile?.xp ?? 0 : guestProgress.xp;
  const completedCases = useMemo(
    () => (isAuthenticated ? profile?.completed_cases ?? [] : guestProgress.completedCases),
    [guestProgress.completedCases, isAuthenticated, profile?.completed_cases]
  );
  const rankProgress = getAgentRank(xp);
  const { rank, next } = rankProgress;
  const cases = completedCases.length;

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name,xp,completed_cases,avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        Alert.alert('Profile load failed', error.message);
        setProfile({
          display_name: fallbackName,
          xp: 0,
          completed_cases: [],
          avatar_url: null
        });
        setLoading(false);
        return;
      }

      if (data) {
        setProfile(data as ProfileRow);
        setLoading(false);
        return;
      }

      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: user.id,
            display_name: fallbackName
          },
          { onConflict: 'user_id' }
        )
        .select('display_name,xp,completed_cases,avatar_url')
        .single();

      if (cancelled) return;

      if (insertError) {
        Alert.alert('Profile setup failed', insertError.message);
      }

      setProfile(
        inserted
          ? (inserted as ProfileRow)
          : {
              display_name: fallbackName,
              xp: 0,
              completed_cases: [],
              avatar_url: null
            }
      );
      setLoading(false);
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [fallbackName, syncVersion, user]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign out.';
      Alert.alert('Sign out failed', message);
    } finally {
      setSigningOut(false);
    }
  }

  if (isAuthenticated && loading) {
    return (
      <Screen>
        <ConsoleHeader icon="person" eyebrow="Authenticated Agent" title="YOUR DOSSIER" color={colors.yellow} />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.navy} />
          <Text style={styles.loadingText}>Loading dossier...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ConsoleHeader
        icon="person"
        eyebrow={isAuthenticated ? `Welcome, Agent ${name}` : 'Guest Agent'}
        title="YOUR DOSSIER"
        color={colors.yellow}
      />

      <PopCard backgroundColor={rank.bg} style={styles.idCard}>
        <View style={[styles.rankBlob, { backgroundColor: rank.accent }]} />
        <View style={styles.classifiedRow}>
          <Text style={styles.classified}>★ Classified</Text>
          <Text style={styles.idNumber}>
            ID #{isAuthenticated ? user?.id.slice(0, 6).toUpperCase() : 'GUEST'}
          </Text>
        </View>
        <View style={styles.agentRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            <View style={styles.level}>
              <Text style={styles.levelText}>{rank.level}</Text>
            </View>
          </View>
          <View style={styles.agentCopy}>
            <Text style={[styles.agentMeta, { color: rank.ink }]}>Agent</Text>
            <Text style={[styles.agentName, { color: rank.ink }]} numberOfLines={1}>
              {name.toUpperCase()}
            </Text>
            <Text style={[styles.agentMeta, { color: rank.ink }]}>Rank</Text>
            <Text style={[styles.rankTitle, { color: rank.ink }]}>{rank.title.toUpperCase()}</Text>
          </View>
        </View>
        <View>
          <View style={styles.xpRow}>
            <Text style={[styles.agentMeta, { color: rank.ink }]}>{xp.toLocaleString()} XP</Text>
            <Text style={[styles.agentMeta, { color: rank.ink }]}>
              {next ? `${rankProgress.xpToNext} TO ${next.title.toUpperCase()}` : 'MAX RANK'}
            </Text>
          </View>
          <View style={styles.segmentRow}>
            {Array.from({ length: rankProgress.segments }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.segment,
                  {
                    backgroundColor:
                      index < rankProgress.filledSegments ? rank.accent : colors.cream
                  }
                ]}
              />
            ))}
          </View>
        </View>
      </PopCard>

      <View style={styles.section}>
        <SectionHeader title="MISSION LOG" color={colors.blue} />
        <View style={styles.statGrid}>
          <MissionStat label="Cases Solved" value={cases} icon="folder" backgroundColor={colors.orange} color={colors.white} />
          <MissionStat label="Drills Completed" value={0} icon="locate" backgroundColor={colors.lime} />
          <MissionStat label="Total XP" value={xp} icon="sparkles" backgroundColor={colors.cyan} />
          <MissionStat label="Clearance Lvl" value={rank.level} icon="shield-checkmark" backgroundColor={colors.navy} color={colors.yellow} />
        </View>
      </View>

      {!isAuthenticated ? (
        <PopCard backgroundColor={colors.yellow}>
          <View style={styles.cloudRow}>
            <View style={styles.cloudIcon}>
              <Ionicons name="cloud-upload" size={24} color={colors.navy} />
            </View>
            <View style={styles.cloudCopy}>
              <Text style={styles.cloudKicker}>Do not lose your dossier</Text>
              <Text style={styles.cloudTitle}>SAVE PROGRESS TO CLOUD</Text>
            </View>
          </View>
          <Text style={styles.cloudBody}>
            You are playing as a guest. Create an account or sign in to sync {xp.toLocaleString()} XP and {cases} solved cases.
          </Text>
          <ChunkyButton
            label="Save Progress"
            icon="cloud-upload"
            backgroundColor={colors.blue}
            onPress={() => setAuthOpen(true)}
          />
        </PopCard>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="DOSSIER TROPHIES" color={colors.orange} />
        <View style={styles.badgeGrid}>
          {badges.map((badge) => {
            const unlocked =
              (badge.id === 'first-clue' && cases >= 1) ||
              (badge.id === 'phish-catcher' && cases >= 3) ||
              (badge.id === 'vibe-checker' && xp >= 200) ||
              (badge.id === 'dossier-master' && xp >= 1000);

            return (
              <View key={badge.id} style={[styles.badgeCard, !unlocked && styles.lockedBadge]}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                  <Ionicons name={badge.icon} size={22} color={colors.white} />
                </View>
                <Text style={styles.badgeTitle}>{badge.label}</Text>
                <Text style={styles.badgeHint}>{badge.hint}</Text>
                {!unlocked ? (
                  <View style={styles.lock}>
                    <Ionicons name="lock-closed" size={12} color={colors.navy} />
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      {isAuthenticated ? (
        <ChunkyButton
          label={signingOut ? 'Signing out...' : 'Sign Out'}
          icon="log-out"
          backgroundColor={colors.navy}
          onPress={handleSignOut}
          disabled={signingOut}
        />
      ) : null}

      <Modal visible={authOpen} animationType="slide" presentationStyle="fullScreen">
        <AuthScreen
          onAuthenticated={() => setAuthOpen(false)}
          onCancel={() => setAuthOpen(false)}
        />
      </Modal>
    </Screen>
  );
}

function MissionStat({
  label,
  value,
  icon,
  backgroundColor,
  color = colors.navy
}: {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  color?: string;
}) {
  return (
    <View style={[styles.missionStat, { backgroundColor }]}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={18} color={colors.navy} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value.toLocaleString()}</Text>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxxl
  },
  loadingText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase'
  },
  idCard: {
    overflow: 'hidden'
  },
  rankBlob: {
    borderColor: colors.navy,
    borderRadius: 999,
    borderWidth: 3,
    height: 140,
    position: 'absolute',
    right: -44,
    top: -42,
    width: 140
  },
  classifiedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  classified: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
    borderWidth: 2,
    color: colors.yellow,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textTransform: 'uppercase'
  },
  idNumber: {
    backgroundColor: colors.cream,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    color: colors.navy,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  agentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.navy,
    borderRadius: 38,
    borderWidth: 3,
    height: 96,
    justifyContent: 'center',
    width: 96
  },
  avatarText: {
    color: colors.navy,
    fontSize: 42,
    fontWeight: '900'
  },
  level: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderColor: colors.cream,
    borderRadius: radius.round,
    borderWidth: 3,
    bottom: -8,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: -8,
    width: 36
  },
  levelText: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: '900'
  },
  agentCopy: {
    flex: 1
  },
  agentMeta: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    opacity: 0.84,
    textTransform: 'uppercase'
  },
  agentName: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: spacing.sm
  },
  rankTitle: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 30
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.xs
  },
  segment: {
    borderColor: colors.navy,
    borderWidth: 2,
    flex: 1,
    height: 20
  },
  section: {
    gap: spacing.md
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md
  },
  missionStat: {
    borderColor: colors.navy,
    borderRadius: radius.xl,
    borderWidth: 3,
    padding: spacing.md,
    width: '47%'
  },
  statIcon: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.navy,
    borderRadius: radius.md,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  statValue: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: spacing.sm
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase'
  },
  cloudRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md
  },
  cloudIcon: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: 56,
    justifyContent: 'center',
    width: 56
  },
  cloudCopy: {
    flex: 1
  },
  cloudKicker: {
    color: colors.navy,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  cloudTitle: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 26
  },
  cloudBody: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md
  },
  badgeCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.xl,
    borderWidth: 2,
    gap: spacing.sm,
    padding: spacing.md,
    width: '47%'
  },
  lockedBadge: {
    opacity: 0.52
  },
  badgeIcon: {
    alignItems: 'center',
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    height: 56,
    justifyContent: 'center',
    width: 56
  },
  badgeTitle: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  badgeHint: {
    color: colors.purple,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  lock: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
    width: 28
  }
});
