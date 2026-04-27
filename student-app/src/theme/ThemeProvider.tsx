import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import {
  AppTheme,
  defaultThemePaletteId,
  getThemePaletteMeta,
  themeColorSwatches,
  resolveTheme,
  ThemeMode,
  ThemeColorOverrides,
  ThemePaletteId,
  ThemePreferenceMode,
  themePalettes,
} from "./tokens";
import { normalizeHexColor } from "./colorUtils";

interface ThemeContextValue {
  theme: AppTheme;
  colorScheme: ThemeMode;
  paletteId: ThemePaletteId;
  preferredMode: ThemePreferenceMode;
  palettes: typeof themePalettes;
  colorSwatches: typeof themeColorSwatches;
  primaryColor: string | null;
  accentColor: string | null;
  setPalette: (paletteId: ThemePaletteId) => Promise<void>;
  setPreferredMode: (mode: ThemePreferenceMode) => Promise<void>;
  setPrimaryColor: (color: string | null) => Promise<void>;
  setAccentColor: (color: string | null) => Promise<void>;
  resetColorOverrides: () => Promise<void>;
}

const THEME_PREFS_KEY = "student_app_theme_preferences";

const ThemeContext = createContext<ThemeContextValue>({
  theme: resolveTheme(defaultThemePaletteId, "light"),
  colorScheme: "light",
  paletteId: defaultThemePaletteId,
  preferredMode: "system",
  palettes: themePalettes,
  colorSwatches: themeColorSwatches,
  primaryColor: null,
  accentColor: null,
  setPalette: async () => undefined,
  setPreferredMode: async () => undefined,
  setPrimaryColor: async () => undefined,
  setAccentColor: async () => undefined,
  resetColorOverrides: async () => undefined,
});

interface StoredThemePreferences {
  paletteId: ThemePaletteId;
  preferredMode: ThemePreferenceMode;
  primaryColor?: string | null;
  accentColor?: string | null;
}

function isPaletteId(value: unknown): value is ThemePaletteId {
  return typeof value === "string" && themePalettes.some((palette) => palette.id === value);
}

function isPreferenceMode(value: unknown): value is ThemePreferenceMode {
  return value === "light" || value === "dark" || value === "system";
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [paletteId, setPaletteId] = useState<ThemePaletteId>(defaultThemePaletteId);
  const [preferredMode, setPreferredModeState] = useState<ThemePreferenceMode>("system");
  const [primaryColor, setPrimaryColorState] = useState<string | null>(null);
  const [accentColor, setAccentColorState] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(THEME_PREFS_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<StoredThemePreferences>;
        if (isPaletteId(parsed.paletteId)) {
          setPaletteId(parsed.paletteId);
        }
        if (isPreferenceMode(parsed.preferredMode)) {
          setPreferredModeState(parsed.preferredMode);
        }
        setPrimaryColorState(normalizeHexColor(parsed.primaryColor) ?? null);
        setAccentColorState(normalizeHexColor(parsed.accentColor) ?? null);
      })
      .catch(() => undefined);
  }, []);

  const colorScheme: ThemeMode =
    preferredMode === "system" ? (systemColorScheme === "dark" ? "dark" : "light") : preferredMode;

  const persist = async (next: StoredThemePreferences) => {
    await AsyncStorage.setItem(THEME_PREFS_KEY, JSON.stringify(next));
  };

  const persistCurrent = async (next: Partial<StoredThemePreferences>) => {
    await persist({
      paletteId: "paletteId" in next ? (next.paletteId as ThemePaletteId) : paletteId,
      preferredMode: "preferredMode" in next ? (next.preferredMode as ThemePreferenceMode) : preferredMode,
      primaryColor: "primaryColor" in next ? (next.primaryColor ?? null) : primaryColor,
      accentColor: "accentColor" in next ? (next.accentColor ?? null) : accentColor,
    });
  };

  const setPalette = async (nextPaletteId: ThemePaletteId) => {
    setPaletteId(nextPaletteId);
    await persistCurrent({ paletteId: nextPaletteId });
  };

  const setPreferredMode = async (nextMode: ThemePreferenceMode) => {
    setPreferredModeState(nextMode);
    await persistCurrent({ preferredMode: nextMode });
  };

  const setPrimaryColor = async (nextColor: string | null) => {
    const normalized = normalizeHexColor(nextColor) ?? null;
    setPrimaryColorState(normalized);
    await persistCurrent({ primaryColor: normalized });
  };

  const setAccentColor = async (nextColor: string | null) => {
    const normalized = normalizeHexColor(nextColor) ?? null;
    setAccentColorState(normalized);
    await persistCurrent({ accentColor: normalized });
  };

  const resetColorOverrides = async () => {
    setPrimaryColorState(null);
    setAccentColorState(null);
    await persistCurrent({ primaryColor: null, accentColor: null });
  };

  const value = useMemo<ThemeContextValue>(() => {
    const safePalette = getThemePaletteMeta(paletteId).id;
    const overrides: ThemeColorOverrides = {
      primaryColor,
      accentColor,
    };
    return {
      theme: resolveTheme(safePalette, colorScheme, overrides),
      colorScheme,
      paletteId: safePalette,
      preferredMode,
      palettes: themePalettes,
      colorSwatches: themeColorSwatches,
      primaryColor,
      accentColor,
      setPalette,
      setPreferredMode,
      setPrimaryColor,
      setAccentColor,
      resetColorOverrides,
    };
  }, [accentColor, colorScheme, paletteId, preferredMode, primaryColor]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext).theme;
}

export function useThemeController() {
  const {
    paletteId,
    preferredMode,
    palettes,
    colorSwatches,
    primaryColor,
    accentColor,
    setPalette,
    setPreferredMode,
    setPrimaryColor,
    setAccentColor,
    resetColorOverrides,
    colorScheme,
  } = useContext(ThemeContext);
  return {
    paletteId,
    preferredMode,
    palettes,
    colorSwatches,
    primaryColor,
    accentColor,
    colorScheme,
    setPalette,
    setPreferredMode,
    setPrimaryColor,
    setAccentColor,
    resetColorOverrides,
  };
}
