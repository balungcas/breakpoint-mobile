import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { completedCasesKey, guestXpKey } from '../services/guestProgress';

export function useStoredStringArray(key: string) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((value) => {
        if (!value) return;
        const parsed = JSON.parse(value) as string[];
        if (Array.isArray(parsed)) setItems(parsed);
      })
      .catch(() => undefined);
  }, [key]);

  const write = useCallback(
    async (next: string[]) => {
      setItems(next);
      await AsyncStorage.setItem(key, JSON.stringify(next));
    },
    [key]
  );

  const toggle = useCallback(
    async (id: string) => {
      const next = items.includes(id)
        ? items.filter((item) => item !== id)
        : [...items, id];
      await write(next);
    },
    [items, write]
  );

  return { items, setItems: write, toggle };
}

export function useGuestProgress() {
  const [xp, setXp] = useState(0);
  const completed = useStoredStringArray(completedCasesKey);

  useEffect(() => {
    AsyncStorage.getItem(guestXpKey)
      .then((value) => setXp(value ? Number.parseInt(value, 10) || 0 : 0))
      .catch(() => undefined);
  }, []);

  const addXp = useCallback(async (amount: number) => {
    setXp((current) => {
      const next = current + amount;
      AsyncStorage.setItem(guestXpKey, String(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const completeCase = useCallback(
    async (id: string) => {
      if (!completed.items.includes(id)) {
        await completed.setItems([...completed.items, id]);
      }
    },
    [completed]
  );

  return {
    xp,
    completedCases: completed.items,
    addXp,
    completeCase,
    clear: async () => {
      setXp(0);
      await AsyncStorage.removeItem(guestXpKey);
      await completed.setItems([]);
    }
  };
}
