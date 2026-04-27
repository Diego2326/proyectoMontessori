import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { SessionSnapshot } from "@/types/api";
import { UserDto } from "@/types/dto";

const SESSION_KEY = "student_app_session";
const USER_CACHE_KEY = "student_app_user_cache";
const SESSION_FALLBACK_KEY = `${SESSION_KEY}_fallback`;

function hasSecureStore() {
  return (
    typeof SecureStore.isAvailableAsync === "function" &&
    typeof SecureStore.setItemAsync === "function" &&
    typeof SecureStore.getItemAsync === "function" &&
    typeof SecureStore.deleteItemAsync === "function"
  );
}

async function saveSecureValue(key: string, value: string) {
  if (!hasSecureStore()) {
    await AsyncStorage.setItem(key, value);
    return;
  }

  try {
    const available = await SecureStore.isAvailableAsync();
    if (!available) {
      await AsyncStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch {
    await AsyncStorage.setItem(key, value);
  }
}

async function readSecureValue(key: string) {
  if (!hasSecureStore()) {
    return AsyncStorage.getItem(key);
  }

  try {
    const available = await SecureStore.isAvailableAsync();
    if (!available) {
      return AsyncStorage.getItem(key);
    }
    const secureValue = await SecureStore.getItemAsync(key);
    if (secureValue) return secureValue;
  } catch {
    return AsyncStorage.getItem(key);
  }

  return AsyncStorage.getItem(key);
}

async function clearSecureValue(key: string) {
  if (!hasSecureStore()) {
    await AsyncStorage.removeItem(key);
    return;
  }

  try {
    const available = await SecureStore.isAvailableAsync();
    if (available) {
      await SecureStore.deleteItemAsync(key);
    }
  } catch {
    // Ignore and clear fallback below.
  }

  await AsyncStorage.removeItem(key);
}

export async function saveSession(snapshot: SessionSnapshot) {
  await saveSecureValue(SESSION_KEY, JSON.stringify(snapshot));
  await AsyncStorage.setItem(SESSION_FALLBACK_KEY, JSON.stringify(snapshot));
}

export async function readSession() {
  const raw = (await readSecureValue(SESSION_KEY)) ?? (await AsyncStorage.getItem(SESSION_FALLBACK_KEY));
  if (!raw) return null;
  return JSON.parse(raw) as SessionSnapshot;
}

export async function clearSession() {
  await clearSecureValue(SESSION_KEY);
  await AsyncStorage.removeItem(SESSION_FALLBACK_KEY);
}

export async function saveUserCache(user: UserDto) {
  await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
}

export async function readUserCache() {
  const raw = await AsyncStorage.getItem(USER_CACHE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as UserDto;
}

export async function clearUserCache() {
  await AsyncStorage.removeItem(USER_CACHE_KEY);
}
