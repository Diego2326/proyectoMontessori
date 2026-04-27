import { buildSoftTint, hexToRgba, normalizeHexColor } from "./colorUtils";

export type ThemeMode = "light" | "dark";
export type ThemePaletteId =
  | "sunrise"
  | "ocean"
  | "meadow"
  | "berry"
  | "notebook"
  | "twilight"
  | "citrus"
  | "forest"
  | "lavender"
  | "graphite";
export type ThemePreferenceMode = ThemeMode | "system";
export interface ThemeColorOverrides {
  primaryColor?: string | null;
  accentColor?: string | null;
}

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    bg: string;
    bgSecondary: string;
    surface: string;
    surfaceStrong: string;
    card: string;
    cardSoft: string;
    text: string;
    textMuted: string;
    textSoft: string;
    primary: string;
    primarySoft: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
    border: string;
    borderStrong: string;
    glowA: string;
    glowB: string;
    glowC: string;
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

export interface ThemePaletteMeta {
  id: ThemePaletteId;
  name: string;
  description: string;
  preview: {
    primary: string;
    accent: string;
    bg: string;
  };
}

export interface ThemeColorSwatch {
  id: string;
  name: string;
  value: string;
}

type PaletteThemeColors = AppTheme["colors"];

interface PaletteThemeSet {
  light: PaletteThemeColors;
  dark: PaletteThemeColors;
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

export const themePalettes: ThemePaletteMeta[] = [
  {
    id: "sunrise",
    name: "Sunrise",
    description: "Cálido, brillante y escolar.",
    preview: { primary: "#2D7CE8", accent: "#F59E4C", bg: "#F9F3E8" },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Azul fresco y tranquilo.",
    preview: { primary: "#1479D6", accent: "#21B7B7", bg: "#EAF7FA" },
  },
  {
    id: "meadow",
    name: "Meadow",
    description: "Verde suave y energético.",
    preview: { primary: "#2E9B66", accent: "#E9B83D", bg: "#F2F8E9" },
  },
  {
    id: "berry",
    name: "Berry",
    description: "Rosado vibrante y creativo.",
    preview: { primary: "#D94F86", accent: "#FF9A5C", bg: "#FFF0F5" },
  },
  {
    id: "notebook",
    name: "Notebook",
    description: "Papel, tinta y acentos escolares.",
    preview: { primary: "#3F63D6", accent: "#E86D4F", bg: "#FFFDF6" },
  },
  {
    id: "twilight",
    name: "Twilight",
    description: "Nocturno con color pero sin pesadez.",
    preview: { primary: "#6C7CFF", accent: "#FFB86C", bg: "#EEF0FF" },
  },
  {
    id: "citrus",
    name: "Citrus",
    description: "Lima, mandarina y energía.",
    preview: { primary: "#4EAF46", accent: "#FF9E2F", bg: "#FBFBEA" },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Más profundo, natural y sereno.",
    preview: { primary: "#287A59", accent: "#D8A53C", bg: "#EEF5EE" },
  },
  {
    id: "lavender",
    name: "Lavender",
    description: "Suave, creativo y brillante.",
    preview: { primary: "#8A6CFF", accent: "#F08FC0", bg: "#F5F1FF" },
  },
  {
    id: "graphite",
    name: "Graphite",
    description: "Neutral moderno con acentos claros.",
    preview: { primary: "#4D7CFE", accent: "#22B8CF", bg: "#F3F4F6" },
  },
];

export const themeColorSwatches: ThemeColorSwatch[] = [
  { id: "ink", name: "Ink", value: "#3F63D6" },
  { id: "sky", name: "Sky", value: "#2D7CE8" },
  { id: "teal", name: "Teal", value: "#1CA7A3" },
  { id: "mint", name: "Mint", value: "#2E9B66" },
  { id: "lime", name: "Lime", value: "#58A83D" },
  { id: "gold", name: "Gold", value: "#D39A21" },
  { id: "orange", name: "Orange", value: "#E67A32" },
  { id: "coral", name: "Coral", value: "#E76A62" },
  { id: "berry", name: "Berry", value: "#D94F86" },
  { id: "rose", name: "Rose", value: "#C95B9E" },
  { id: "violet", name: "Violet", value: "#7A63E8" },
  { id: "graphite", name: "Graphite", value: "#4E627A" },
];

const paletteThemes: Record<ThemePaletteId, PaletteThemeSet> = {
  sunrise: {
    light: {
      bg: "#F9F3E8",
      bgSecondary: "#FFFDFC",
      surface: "#FFE7B8",
      surfaceStrong: "#FFD58A",
      card: "#FFF7ED",
      cardSoft: "#FFFFFF",
      text: "#20314D",
      textMuted: "#64748E",
      textSoft: "#95A2B8",
      primary: "#2D7CE8",
      primarySoft: "#DDEBFF",
      accent: "#F59E4C",
      success: "#2EBE72",
      warning: "#F2A82E",
      danger: "#E95B72",
      border: "#E7D8C4",
      borderStrong: "#D8C3A8",
      glowA: "rgba(45, 124, 232, 0.18)",
      glowB: "rgba(245, 158, 76, 0.14)",
      glowC: "rgba(255, 213, 138, 0.2)",
      shadow: "rgba(78, 74, 113, 0.14)",
    },
    dark: {
      bg: "#17131C",
      bgSecondary: "#211B27",
      surface: "#473523",
      surfaceStrong: "#6A4A2E",
      card: "#261F2A",
      cardSoft: "#322937",
      text: "#F8EEDF",
      textMuted: "#D0BDA7",
      textSoft: "#A99186",
      primary: "#6AA4FF",
      primarySoft: "#26395D",
      accent: "#FFB565",
      success: "#50D28E",
      warning: "#FFC15C",
      danger: "#FF8CA6",
      border: "#47393E",
      borderStrong: "#5E4C4F",
      glowA: "rgba(106, 164, 255, 0.22)",
      glowB: "rgba(255, 181, 101, 0.14)",
      glowC: "rgba(106, 74, 46, 0.26)",
      shadow: "rgba(0, 0, 0, 0.45)",
    },
  },
  ocean: {
    light: {
      bg: "#EAF7FA",
      bgSecondary: "#FBFEFF",
      surface: "#D7F2F4",
      surfaceStrong: "#BCE8EB",
      card: "#F2FCFD",
      cardSoft: "#FFFFFF",
      text: "#17324A",
      textMuted: "#5F7B8F",
      textSoft: "#8CA8B3",
      primary: "#1479D6",
      primarySoft: "#D7ECFF",
      accent: "#21B7B7",
      success: "#2DBB86",
      warning: "#E6A933",
      danger: "#E76E7F",
      border: "#D6E8EC",
      borderStrong: "#BDD9E0",
      glowA: "rgba(20, 121, 214, 0.16)",
      glowB: "rgba(33, 183, 183, 0.14)",
      glowC: "rgba(188, 232, 235, 0.22)",
      shadow: "rgba(35, 84, 112, 0.12)",
    },
    dark: {
      bg: "#0F1D28",
      bgSecondary: "#162A36",
      surface: "#1B4150",
      surfaceStrong: "#236072",
      card: "#152733",
      cardSoft: "#1B3342",
      text: "#EAF8FF",
      textMuted: "#9FC0D1",
      textSoft: "#7294A6",
      primary: "#57B0FF",
      primarySoft: "#1F4260",
      accent: "#5FE0D8",
      success: "#50D9A0",
      warning: "#FFC763",
      danger: "#FF8C93",
      border: "#274658",
      borderStrong: "#356179",
      glowA: "rgba(87, 176, 255, 0.22)",
      glowB: "rgba(95, 224, 216, 0.12)",
      glowC: "rgba(35, 96, 114, 0.18)",
      shadow: "rgba(0, 0, 0, 0.42)",
    },
  },
  meadow: {
    light: {
      bg: "#F2F8E9",
      bgSecondary: "#FDFFF9",
      surface: "#E3F1C7",
      surfaceStrong: "#CFE79E",
      card: "#F8FCEB",
      cardSoft: "#FFFFFF",
      text: "#264235",
      textMuted: "#667B67",
      textSoft: "#9AAA96",
      primary: "#2E9B66",
      primarySoft: "#D9F3E6",
      accent: "#E9B83D",
      success: "#28B86A",
      warning: "#E8A237",
      danger: "#E76A78",
      border: "#DCE8C8",
      borderStrong: "#C7D9AA",
      glowA: "rgba(46, 155, 102, 0.16)",
      glowB: "rgba(233, 184, 61, 0.12)",
      glowC: "rgba(207, 231, 158, 0.2)",
      shadow: "rgba(66, 101, 65, 0.14)",
    },
    dark: {
      bg: "#132019",
      bgSecondary: "#1A2A22",
      surface: "#29412C",
      surfaceStrong: "#3D5E38",
      card: "#1C2B20",
      cardSoft: "#24362A",
      text: "#F1F7E8",
      textMuted: "#B5C7AE",
      textSoft: "#83957D",
      primary: "#68D091",
      primarySoft: "#254B34",
      accent: "#F4C860",
      success: "#65D69A",
      warning: "#F9B85E",
      danger: "#FF8B90",
      border: "#35503D",
      borderStrong: "#49684E",
      glowA: "rgba(104, 208, 145, 0.2)",
      glowB: "rgba(244, 200, 96, 0.12)",
      glowC: "rgba(61, 94, 56, 0.2)",
      shadow: "rgba(0, 0, 0, 0.38)",
    },
  },
  berry: {
    light: {
      bg: "#FFF0F5",
      bgSecondary: "#FFFDFC",
      surface: "#FFDCE8",
      surfaceStrong: "#FFBED3",
      card: "#FFF6F9",
      cardSoft: "#FFFFFF",
      text: "#432B44",
      textMuted: "#7A647B",
      textSoft: "#A48FA2",
      primary: "#D94F86",
      primarySoft: "#FFD9E8",
      accent: "#FF9A5C",
      success: "#37B887",
      warning: "#F2AF45",
      danger: "#E65B6A",
      border: "#EFD7E2",
      borderStrong: "#E1C1D0",
      glowA: "rgba(217, 79, 134, 0.16)",
      glowB: "rgba(255, 154, 92, 0.14)",
      glowC: "rgba(255, 190, 211, 0.2)",
      shadow: "rgba(102, 62, 91, 0.14)",
    },
    dark: {
      bg: "#211521",
      bgSecondary: "#2D1C2B",
      surface: "#4B2540",
      surfaceStrong: "#6A2E57",
      card: "#2D1E2B",
      cardSoft: "#39263A",
      text: "#FFF0F7",
      textMuted: "#D9B2C7",
      textSoft: "#A98198",
      primary: "#FF7FB2",
      primarySoft: "#592C4B",
      accent: "#FFB275",
      success: "#5FD0A0",
      warning: "#FFC86D",
      danger: "#FF8E95",
      border: "#56394E",
      borderStrong: "#724A65",
      glowA: "rgba(255, 127, 178, 0.18)",
      glowB: "rgba(255, 178, 117, 0.12)",
      glowC: "rgba(106, 46, 87, 0.2)",
      shadow: "rgba(0, 0, 0, 0.42)",
    },
  },
  notebook: {
    light: {
      bg: "#FFFDF6",
      bgSecondary: "#FFFFFF",
      surface: "#FFF1CF",
      surfaceStrong: "#FFE2A0",
      card: "#FFFDF8",
      cardSoft: "#FFFFFF",
      text: "#2B3552",
      textMuted: "#67728D",
      textSoft: "#9BA4B7",
      primary: "#3F63D6",
      primarySoft: "#DDE4FF",
      accent: "#E86D4F",
      success: "#35B579",
      warning: "#F2B246",
      danger: "#E76178",
      border: "#E8E1CF",
      borderStrong: "#D8CFBA",
      glowA: "rgba(63, 99, 214, 0.16)",
      glowB: "rgba(232, 109, 79, 0.14)",
      glowC: "rgba(255, 226, 160, 0.18)",
      shadow: "rgba(83, 89, 116, 0.12)",
    },
    dark: {
      bg: "#191D29",
      bgSecondary: "#21273A",
      surface: "#3D3A31",
      surfaceStrong: "#555047",
      card: "#22283A",
      cardSoft: "#2A3145",
      text: "#F5F4EE",
      textMuted: "#C1C5D5",
      textSoft: "#9298AB",
      primary: "#89A2FF",
      primarySoft: "#354370",
      accent: "#FF9B7D",
      success: "#61D29B",
      warning: "#FFCB71",
      danger: "#FF8F97",
      border: "#394156",
      borderStrong: "#4F5873",
      glowA: "rgba(137, 162, 255, 0.18)",
      glowB: "rgba(255, 155, 125, 0.14)",
      glowC: "rgba(85, 80, 71, 0.18)",
      shadow: "rgba(0, 0, 0, 0.4)",
    },
  },
  twilight: {
    light: {
      bg: "#EEF0FF",
      bgSecondary: "#FCFCFF",
      surface: "#E1D7FF",
      surfaceStrong: "#CAB9FF",
      card: "#F6F5FF",
      cardSoft: "#FFFFFF",
      text: "#2C3059",
      textMuted: "#676C95",
      textSoft: "#9498B7",
      primary: "#6C7CFF",
      primarySoft: "#E1E5FF",
      accent: "#FFB86C",
      success: "#39B892",
      warning: "#F2B548",
      danger: "#E96887",
      border: "#DDDDF0",
      borderStrong: "#C9C8E8",
      glowA: "rgba(108, 124, 255, 0.16)",
      glowB: "rgba(255, 184, 108, 0.12)",
      glowC: "rgba(202, 185, 255, 0.2)",
      shadow: "rgba(66, 74, 124, 0.14)",
    },
    dark: {
      bg: "#16182C",
      bgSecondary: "#1E223A",
      surface: "#35366A",
      surfaceStrong: "#484B8D",
      card: "#20243C",
      cardSoft: "#292E49",
      text: "#EEF0FF",
      textMuted: "#B6B9D9",
      textSoft: "#878DB2",
      primary: "#9FA9FF",
      primarySoft: "#3A4177",
      accent: "#FFC47F",
      success: "#63D7AE",
      warning: "#FFD170",
      danger: "#FF93A2",
      border: "#3B4161",
      borderStrong: "#505886",
      glowA: "rgba(159, 169, 255, 0.2)",
      glowB: "rgba(255, 196, 127, 0.12)",
      glowC: "rgba(72, 75, 141, 0.18)",
      shadow: "rgba(0, 0, 0, 0.42)",
    },
  },
  citrus: {
    light: {
      bg: "#FBFBEA",
      bgSecondary: "#FFFFFC",
      surface: "#EEF7C4",
      surfaceStrong: "#DDEF8E",
      card: "#FCFDEB",
      cardSoft: "#FFFFFF",
      text: "#2E3C2A",
      textMuted: "#6D7D64",
      textSoft: "#A0AC90",
      primary: "#4EAF46",
      primarySoft: "#DFF6D8",
      accent: "#FF9E2F",
      success: "#2DBF76",
      warning: "#F0B13C",
      danger: "#E96D70",
      border: "#E0E7C8",
      borderStrong: "#CDD9AA",
      glowA: "rgba(78, 175, 70, 0.14)",
      glowB: "rgba(255, 158, 47, 0.14)",
      glowC: "rgba(221, 239, 142, 0.22)",
      shadow: "rgba(86, 100, 64, 0.12)",
    },
    dark: {
      bg: "#1A2315",
      bgSecondary: "#222D1C",
      surface: "#314526",
      surfaceStrong: "#466233",
      card: "#24301E",
      cardSoft: "#2B3925",
      text: "#F4F7E8",
      textMuted: "#B9C5AA",
      textSoft: "#8C987F",
      primary: "#7ADD6B",
      primarySoft: "#31502D",
      accent: "#FFB75D",
      success: "#60D48A",
      warning: "#F7C864",
      danger: "#FF8D92",
      border: "#43543B",
      borderStrong: "#5A6E50",
      glowA: "rgba(122, 221, 107, 0.18)",
      glowB: "rgba(255, 183, 93, 0.12)",
      glowC: "rgba(70, 98, 51, 0.2)",
      shadow: "rgba(0, 0, 0, 0.38)",
    },
  },
  forest: {
    light: {
      bg: "#EEF5EE",
      bgSecondary: "#FBFDFB",
      surface: "#DCEEE0",
      surfaceStrong: "#BEDBC7",
      card: "#F6FBF6",
      cardSoft: "#FFFFFF",
      text: "#22392F",
      textMuted: "#5F786F",
      textSoft: "#8DA39B",
      primary: "#287A59",
      primarySoft: "#D8EFE4",
      accent: "#D8A53C",
      success: "#2FB17B",
      warning: "#D9A347",
      danger: "#D96872",
      border: "#D6E3D9",
      borderStrong: "#BFD1C4",
      glowA: "rgba(40, 122, 89, 0.15)",
      glowB: "rgba(216, 165, 60, 0.12)",
      glowC: "rgba(190, 219, 199, 0.2)",
      shadow: "rgba(56, 88, 76, 0.12)",
    },
    dark: {
      bg: "#13211C",
      bgSecondary: "#1A2C25",
      surface: "#214135",
      surfaceStrong: "#2C5A49",
      card: "#1C2F28",
      cardSoft: "#233A32",
      text: "#EDF7F2",
      textMuted: "#A5C1B5",
      textSoft: "#78938A",
      primary: "#58C79A",
      primarySoft: "#254A3D",
      accent: "#E4BC67",
      success: "#68D39E",
      warning: "#F3C975",
      danger: "#FF8B97",
      border: "#355249",
      borderStrong: "#466B5F",
      glowA: "rgba(88, 199, 154, 0.18)",
      glowB: "rgba(228, 188, 103, 0.12)",
      glowC: "rgba(44, 90, 73, 0.18)",
      shadow: "rgba(0, 0, 0, 0.38)",
    },
  },
  lavender: {
    light: {
      bg: "#F5F1FF",
      bgSecondary: "#FCFBFF",
      surface: "#E8DEFF",
      surfaceStrong: "#D6C6FF",
      card: "#F8F5FF",
      cardSoft: "#FFFFFF",
      text: "#342E57",
      textMuted: "#726B99",
      textSoft: "#9D96BC",
      primary: "#8A6CFF",
      primarySoft: "#E4DEFF",
      accent: "#F08FC0",
      success: "#40B58B",
      warning: "#F2B556",
      danger: "#E76B8B",
      border: "#DED8F2",
      borderStrong: "#C9C0EA",
      glowA: "rgba(138, 108, 255, 0.16)",
      glowB: "rgba(240, 143, 192, 0.13)",
      glowC: "rgba(214, 198, 255, 0.2)",
      shadow: "rgba(82, 74, 124, 0.13)",
    },
    dark: {
      bg: "#1D1931",
      bgSecondary: "#26203F",
      surface: "#3E3268",
      surfaceStrong: "#57478D",
      card: "#292244",
      cardSoft: "#31284E",
      text: "#F4EFFF",
      textMuted: "#C0B3DE",
      textSoft: "#9083AF",
      primary: "#B19CFF",
      primarySoft: "#4B3F7B",
      accent: "#FFB1D6",
      success: "#67D1A8",
      warning: "#FACC73",
      danger: "#FF93B0",
      border: "#4A426A",
      borderStrong: "#625987",
      glowA: "rgba(177, 156, 255, 0.18)",
      glowB: "rgba(255, 177, 214, 0.12)",
      glowC: "rgba(87, 71, 141, 0.18)",
      shadow: "rgba(0, 0, 0, 0.42)",
    },
  },
  graphite: {
    light: {
      bg: "#F3F4F6",
      bgSecondary: "#FAFBFC",
      surface: "#E4E8ED",
      surfaceStrong: "#D1D7E0",
      card: "#F8F9FB",
      cardSoft: "#FFFFFF",
      text: "#253243",
      textMuted: "#637284",
      textSoft: "#94A1AF",
      primary: "#4D7CFE",
      primarySoft: "#DCE7FF",
      accent: "#22B8CF",
      success: "#2FB885",
      warning: "#E9A73F",
      danger: "#E56A75",
      border: "#DCE1E7",
      borderStrong: "#C9D0D9",
      glowA: "rgba(77, 124, 254, 0.14)",
      glowB: "rgba(34, 184, 207, 0.12)",
      glowC: "rgba(209, 215, 224, 0.22)",
      shadow: "rgba(60, 72, 88, 0.12)",
    },
    dark: {
      bg: "#161A20",
      bgSecondary: "#1E242C",
      surface: "#2C3743",
      surfaceStrong: "#3A4959",
      card: "#202731",
      cardSoft: "#29323D",
      text: "#EEF3F7",
      textMuted: "#B1BCC8",
      textSoft: "#818D9B",
      primary: "#86A8FF",
      primarySoft: "#34466C",
      accent: "#6AD5E4",
      success: "#67D4A1",
      warning: "#F3C66E",
      danger: "#FF8C97",
      border: "#3A4451",
      borderStrong: "#4C5968",
      glowA: "rgba(134, 168, 255, 0.18)",
      glowB: "rgba(106, 213, 228, 0.1)",
      glowC: "rgba(58, 73, 89, 0.2)",
      shadow: "rgba(0, 0, 0, 0.42)",
    },
  },
};

export function getThemePaletteMeta(id: ThemePaletteId) {
  return themePalettes.find((palette) => palette.id === id) ?? themePalettes[0];
}

export function resolveTheme(paletteId: ThemePaletteId, mode: ThemeMode, overrides: ThemeColorOverrides = {}): AppTheme {
  const colors = { ...paletteThemes[paletteId][mode] };
  const primaryColor = normalizeHexColor(overrides.primaryColor);
  const accentColor = normalizeHexColor(overrides.accentColor);

  if (primaryColor) {
    colors.primary = primaryColor;
    colors.primarySoft = buildSoftTint(primaryColor, mode);
    colors.glowA = hexToRgba(primaryColor, mode === "dark" ? 0.22 : 0.18);
  }

  if (accentColor) {
    colors.accent = accentColor;
    colors.glowB = hexToRgba(accentColor, mode === "dark" ? 0.14 : 0.14);
  }

  return {
    mode,
    colors,
    ...shared,
  };
}

export const defaultThemePaletteId: ThemePaletteId = "notebook";
