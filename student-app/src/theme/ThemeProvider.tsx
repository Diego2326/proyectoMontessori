import React, { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { AppTheme, darkTheme, lightTheme } from "./tokens";

interface ThemeContextValue {
  theme: AppTheme;
  colorScheme: ColorSchemeName;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  colorScheme: "light",
});

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();

  const value = useMemo<ThemeContextValue>(() => {
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    return { theme, colorScheme };
  }, [colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext).theme;
}
