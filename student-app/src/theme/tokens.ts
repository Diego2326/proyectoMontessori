export type ThemeMode = "light" | "dark";

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    bg: string;
    bgSecondary: string;
    card: string;
    cardSoft: string;
    text: string;
    textMuted: string;
    primary: string;
    primarySoft: string;
    success: string;
    warning: string;
    danger: string;
    border: string;
    glowA: string;
    glowB: string;
    shadow: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  typography: {
    title: string;
    body: string;
    mono: string;
  };
}

const shared = {
  spacing: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28 },
  radius: { sm: 10, md: 16, lg: 22, xl: 30, pill: 999 },
  typography: {
    title: "AvenirNext-DemiBold",
    body: "AvenirNext-Regular",
    mono: "Menlo",
  },
};

export const lightTheme: AppTheme = {
  mode: "light",
  colors: {
    bg: "#E9F3FF",
    bgSecondary: "#F4F9FF",
    card: "#F1F7FF",
    cardSoft: "#FFFFFF",
    text: "#0E2D58",
    textMuted: "#5277A6",
    primary: "#1E7BFF",
    primarySoft: "#CFE2FF",
    success: "#2EBE72",
    warning: "#F2A82E",
    danger: "#E95B72",
    border: "#C9DDF8",
    glowA: "rgba(30, 123, 255, 0.26)",
    glowB: "rgba(95, 175, 255, 0.24)",
    shadow: "rgba(40, 98, 170, 0.22)",
  },
  ...shared,
};

export const darkTheme: AppTheme = {
  mode: "dark",
  colors: {
    bg: "#0A1321",
    bgSecondary: "#121E32",
    card: "#172941",
    cardSoft: "#1D3350",
    text: "#E6F2FF",
    textMuted: "#95B3D8",
    primary: "#4DA2FF",
    primarySoft: "#223E62",
    success: "#4DD38E",
    warning: "#FFC15C",
    danger: "#FF7A91",
    border: "#2A4565",
    glowA: "rgba(77, 162, 255, 0.25)",
    glowB: "rgba(137, 193, 255, 0.2)",
    shadow: "rgba(2, 7, 14, 0.6)",
  },
  ...shared,
};
