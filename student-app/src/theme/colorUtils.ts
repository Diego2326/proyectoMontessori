import type { ThemeMode } from "./tokens";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function normalizeHexColor(value?: string | null) {
  if (!value) return null;
  const raw = value.trim().replace("#", "");

  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw
      .split("")
      .map((part) => `${part}${part}`)
      .join("")
      .toUpperCase()}`;
  }

  if (/^[0-9a-fA-F]{6}$/.test(raw) || /^[0-9a-fA-F]{8}$/.test(raw)) {
    return `#${raw.toUpperCase()}`;
  }

  return null;
}

function hexToRgb(hex: string): RgbColor {
  const normalized = normalizeHexColor(hex);
  if (!normalized) {
    return { r: 0, g: 0, b: 0 };
  }

  const value = normalized.slice(1);
  const rgb = value.length === 8 ? value.slice(0, 6) : value;

  return {
    r: Number.parseInt(rgb.slice(0, 2), 16),
    g: Number.parseInt(rgb.slice(2, 4), 16),
    b: Number.parseInt(rgb.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RgbColor) {
  return `#${[r, g, b]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function srgbToLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function getContrastRatio(first: string, second: string) {
  const firstRgb = hexToRgb(first);
  const secondRgb = hexToRgb(second);

  const firstLuminance =
    0.2126 * srgbToLinear(firstRgb.r) + 0.7152 * srgbToLinear(firstRgb.g) + 0.0722 * srgbToLinear(firstRgb.b);
  const secondLuminance =
    0.2126 * srgbToLinear(secondRgb.r) + 0.7152 * srgbToLinear(secondRgb.g) + 0.0722 * srgbToLinear(secondRgb.b);

  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function getReadableTextColor(background: string, light = "#FFFFFF", dark = "#11233D") {
  return getContrastRatio(light, background) >= getContrastRatio(dark, background) ? light : dark;
}

export function getReadableAccentColor(preferred: string, background: string, fallback: string, minimumContrast = 4.5) {
  return getContrastRatio(preferred, background) >= minimumContrast ? preferred : fallback;
}

export function mixHexColors(first: string, second: string, secondWeight: number) {
  const left = hexToRgb(first);
  const right = hexToRgb(second);
  const weight = Math.max(0, Math.min(1, secondWeight));

  return rgbToHex({
    r: left.r * (1 - weight) + right.r * weight,
    g: left.g * (1 - weight) + right.g * weight,
    b: left.b * (1 - weight) + right.b * weight,
  });
}

export function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

export function buildSoftTint(color: string, mode: ThemeMode) {
  return mixHexColors(color, mode === "dark" ? "#142033" : "#FFFFFF", mode === "dark" ? 0.58 : 0.82);
}

export function assessThemeColorContrast(color: string, surface: string) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return {
      foreground: "#11233D",
      textContrast: 0,
      surfaceContrast: 0,
      isLowContrast: true,
    };
  }

  const foreground = getReadableTextColor(normalized);
  const textContrast = getContrastRatio(foreground, normalized);
  const surfaceContrast = getContrastRatio(normalized, surface);

  return {
    foreground,
    textContrast,
    surfaceContrast,
    isLowContrast: textContrast < 4.5 || surfaceContrast < 1.8,
  };
}
