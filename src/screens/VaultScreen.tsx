import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ChunkyButton } from '../components/ChunkyButton';
import { ConsoleHeader } from '../components/ConsoleHeader';
import { PopCard } from '../components/PopCard';
import { Screen } from '../components/Screen';
import { fetchDossiers } from '../services/supabaseRest';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import type { Dossier } from '../types/podcast';
import { useStoredStringArray } from '../hooks/useAsyncStore';

const dossierMeta = {
  1: { title: 'Phishing Patterns', code: 'DOSSIER 01', icon: 'warning' as const, color: colors.orange, ink: colors.white },
  2: { title: 'Password Hygiene Kit', code: 'DOSSIER 02', icon: 'key' as const, color: colors.cyan, ink: colors.navy },
  3: { title: 'Tracker Anatomy', code: 'DOSSIER 03', icon: 'eye' as const, color: colors.yellow, ink: colors.navy },
  4: { title: 'Deepfake Detection', code: 'DOSSIER 04', icon: 'skull' as const, color: colors.purple, ink: colors.white }
};

const missionColors = [colors.orange, colors.cyan, colors.yellow, colors.lime, colors.purple, colors.blue];

export function VaultScreen() {
  const completed = useStoredStringArray('breakpoint.completedMissionIds');
  const [rows, setRows] = useState<Dossier[]>([]);
  const [openDossier, setOpenDossier] = useState<number | null>(null);
  const [openMission, setOpenMission] = useState<Dossier | null>(null);

  useEffect(() => {
    fetchDossiers().then(setRows);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<number, Dossier[]>();
    rows.forEach((row) => {
      const list = map.get(row.dossierNumber) ?? [];
      list.push(row);
      map.set(row.dossierNumber, list);
    });
    return map;
  }, [rows]);

  const completedSet = useMemo(() => new Set(completed.items), [completed.items]);

  function completedCount(dossierNumber: number) {
    return (grouped.get(dossierNumber) ?? []).filter((mission) => completedSet.has(mission.id)).length;
  }

  function isCleared(dossierNumber: number) {
    const missions = grouped.get(dossierNumber) ?? [];
    return missions.length > 0 && missions.every((mission) => completedSet.has(mission.id));
  }

  function isUnlocked(dossierNumber: number) {
    if (!(grouped.get(dossierNumber) ?? []).length) return false;
    if (dossierNumber === 1) return true;
    return isCleared(dossierNumber - 1);
  }

  const activeMissions = openDossier ? grouped.get(openDossier) ?? [] : [];
  const activeMeta = openDossier ? dossierMeta[openDossier as keyof typeof dossierMeta] : null;

  return (
    <Screen>
      <ConsoleHeader icon="lock-closed" eyebrow="Classified" title="THE VAULT" color={colors.purple} />

      <View>
        <Text style={styles.kicker}>// Clearance Level: Detective</Text>
        <Text style={styles.title}>Decrypted intel for sharper instincts.</Text>
        <Text style={styles.body}>Clear every mission to unlock the next dossier.</Text>
      </View>

      <View style={styles.dossierList}>
        {[1, 2, 3, 4].map((number) => {
          const meta = dossierMeta[number as keyof typeof dossierMeta];
          const missions = grouped.get(number) ?? [];
          const unlocked = isUnlocked(number);
          const cleared = isCleared(number);
          const backgroundColor = unlocked ? meta.color : colors.white;
          const ink = unlocked ? meta.ink : colors.navy;

          return (
            <Pressable
              key={number}
              disabled={!missions.length}
              onPress={() => unlocked && setOpenDossier(number)}
              style={({ pressed }) => [styles.dossierPress, pressed && styles.pressed]}
            >
              <PopCard backgroundColor={backgroundColor} style={styles.dossierCard}>
                <View style={styles.dossierIcon}>
                  <Ionicons
                    name={unlocked ? meta.icon : 'lock-closed'}
                    size={20}
                    color={colors.navy}
                  />
                </View>
                <View style={styles.dossierCopy}>
                  <Text style={[styles.dossierCode, { color: ink }]}>{meta.code}</Text>
                  <Text style={[styles.dossierTitle, { color: ink }]}>{meta.title}</Text>
                  <Text style={[styles.dossierProgress, { color: ink }]}>
                    Completed: {completedCount(number)}/{missions.length || 15}
                  </Text>
                </View>
                <Text style={[styles.status, unlocked ? styles.unlocked : styles.locked]}>
                  {cleared ? '100% Cleared' : unlocked ? 'Unlocked' : 'Locked'}
                </Text>
              </PopCard>
            </Pressable>
          );
        })}
      </View>

      <Modal visible={!!activeMeta} animationType="slide">
        <Screen>
          {activeMeta && openDossier ? (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.missionSelect}>MISSION SELECT</Text>
                <Pressable onPress={() => setOpenDossier(null)} style={styles.close}>
                  <Ionicons name="close" size={18} color={colors.navy} />
                </Pressable>
              </View>
              <Text style={styles.modalKicker}>{activeMeta.code}</Text>
              <Text style={styles.modalTitle}>{activeMeta.title.toUpperCase()}</Text>
              <Text style={styles.modalBody}>
                {completedCount(openDossier)}/{activeMissions.length} cleared. Keep going, Detective.
              </Text>
              <View style={styles.missionGrid}>
                {activeMissions.map((mission, index) => {
                  const backgroundColor = missionColors[index % missionColors.length];
                  const isDark =
                    backgroundColor === colors.purple ||
                    backgroundColor === colors.blue ||
                    backgroundColor === colors.orange;
                  const done = completedSet.has(mission.id);

                  return (
                    <Pressable
                      key={mission.id}
                      onPress={() => setOpenMission(mission)}
                      style={[styles.missionPill, { backgroundColor }]}
                    >
                      <Text style={[styles.missionText, { color: isDark ? colors.white : colors.navy }]}>
                        MISSION {mission.missionNumber}
                      </Text>
                      {done ? (
                        <View style={styles.doneBadge}>
                          <Ionicons name="checkmark-circle" size={14} color={colors.navy} />
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}
        </Screen>
      </Modal>

      <Modal visible={!!openMission} transparent animationType="fade">
        <View style={styles.quizBackdrop}>
          {openMission ? (
            <PopCard backgroundColor={colors.white}>
              <Text style={styles.quizBadge}>MISSION {openMission.missionNumber}</Text>
              <Text style={styles.quizTitle}>{openMission.question}</Text>
              <Text style={styles.body}>Choose carefully, Detective.</Text>
              <ChunkyButton
                label={openMission.safeOption}
                icon="shield-checkmark"
                backgroundColor={colors.lime}
                color={colors.navy}
                onPress={async () => {
                  await completed.toggle(openMission.id);
                  setOpenMission(null);
                }}
              />
              <ChunkyButton
                label={openMission.dangerOption}
                icon="warning"
                backgroundColor={colors.yellow}
                color={colors.navy}
                onPress={() => setOpenMission(null)}
              />
            </PopCard>
          ) : null}
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.4,
    textTransform: 'uppercase'
  },
  title: {
    color: colors.navy,
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 38,
    marginTop: spacing.sm
  },
  body: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: spacing.xs
  },
  dossierList: {
    gap: spacing.md
  },
  dossierPress: {
    borderRadius: radius.xl
  },
  pressed: {
    opacity: 0.84,
    transform: [{ translateY: 2 }]
  },
  dossierCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md
  },
  dossierIcon: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: 52,
    justifyContent: 'center',
    width: 52
  },
  dossierCopy: {
    flex: 1
  },
  dossierCode: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase'
  },
  dossierTitle: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22
  },
  dossierProgress: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: spacing.xs
  },
  status: {
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    fontSize: 10,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textTransform: 'uppercase'
  },
  unlocked: {
    backgroundColor: colors.white,
    color: colors.navy
  },
  locked: {
    backgroundColor: colors.navy,
    color: colors.white
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  missionSelect: {
    backgroundColor: colors.yellow,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  close: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    width: 42
  },
  modalKicker: {
    color: colors.orange,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.4,
    textTransform: 'uppercase'
  },
  modalTitle: {
    color: colors.navy,
    fontSize: 46,
    fontWeight: '900',
    lineHeight: 46
  },
  modalBody: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '800'
  },
  missionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md
  },
  missionPill: {
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    width: '30%'
  },
  missionText: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center'
  },
  doneBadge: {
    alignItems: 'center',
    backgroundColor: colors.lime,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: -8,
    top: -8,
    width: 24
  },
  quizBackdrop: {
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg
  },
  quizBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.yellow,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
  },
  quizTitle: {
    color: colors.navy,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 31
  }
});
