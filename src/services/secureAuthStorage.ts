import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const markerPrefix = 'breakpoint.secure-auth-marker.';
const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
};

async function canUseSecureStore() {
  if (Platform.OS === 'web') return false;

  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export const secureAuthStorage = {
  async getItem(key: string) {
    if (await canUseSecureStore()) {
      const secureValue = await SecureStore.getItemAsync(key, secureStoreOptions);
      if (secureValue !== null) return secureValue;
    }

    return AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string) {
    await AsyncStorage.setItem(`${markerPrefix}${key}`, 'secure-store');

    if (await canUseSecureStore()) {
      await SecureStore.setItemAsync(key, value, secureStoreOptions);
      await AsyncStorage.removeItem(key);
      return;
    }

    // SecureStore is unavailable on web, so AsyncStorage is the persistence fallback there.
    await AsyncStorage.setItem(key, value);
  },

  async removeItem(key: string) {
    await AsyncStorage.removeItem(`${markerPrefix}${key}`);
    await AsyncStorage.removeItem(key);

    if (await canUseSecureStore()) {
      await SecureStore.deleteItemAsync(key, secureStoreOptions);
    }
  }
};
