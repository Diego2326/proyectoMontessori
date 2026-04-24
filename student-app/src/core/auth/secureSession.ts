import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { SessionSnapshot } from "@/types/api";
import { UserDto } from "@/types/dto";

const SESSION_KEY = "student_app_session";
const USER_CACHE_KEY = "student_app_user_cache";

export async function saveSession(snapshot: SessionSnapshot) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(snapshot));
}

export async function readSession() {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as SessionSnapshot;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
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
