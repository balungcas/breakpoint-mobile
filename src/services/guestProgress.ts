import AsyncStorage from '@react-native-async-storage/async-storage';

export const guestXpKey = 'guestXP';
export const completedCasesKey = 'completedCases';

export type LocalGuestProgress = {
  xp: number;
  completedCases: string[];
};

export async function readGuestProgress(): Promise<LocalGuestProgress> {
  const [xpValue, completedCasesValue] = await Promise.all([
    AsyncStorage.getItem(guestXpKey),
    AsyncStorage.getItem(completedCasesKey)
  ]);

  let completedCases: string[] = [];
  try {
    const parsed = completedCasesValue ? (JSON.parse(completedCasesValue) as unknown) : [];
    if (Array.isArray(parsed)) {
      completedCases = parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    completedCases = [];
  }

  return {
    xp: xpValue ? Number.parseInt(xpValue, 10) || 0 : 0,
    completedCases
  };
}

export async function clearGuestProgress() {
  await Promise.all([
    AsyncStorage.removeItem(guestXpKey),
    AsyncStorage.removeItem(completedCasesKey)
  ]);
}
