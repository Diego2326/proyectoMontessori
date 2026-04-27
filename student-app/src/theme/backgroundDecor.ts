import { Ionicons } from "@expo/vector-icons";
import { AppTheme } from "./tokens";
import { hexToRgba, mixHexColors } from "./colorUtils";

export type BackgroundDecorId =
  | "orbit"
  | "bubbles"
  | "comets"
  | "lagoon"
  | "sunrise"
  | "berry-pop"
  | "campus"
  | "aurora"
  | "confetti"
  | "meteor";

export interface BackgroundDecorMeta {
  id: BackgroundDecorId;
  name: string;
  description: string;
}

export type BackgroundShapeKind = "circle" | "rounded" | "capsule" | "ring" | "diamond" | "icon";

export interface BackgroundDecorShape {
  kind: BackgroundShapeKind;
  size: number;
  top?: number | `${number}%`;
  bottom?: number | `${number}%`;
  left?: number | `${number}%`;
  right?: number | `${number}%`;
  opacity: number;
  depth: number;
  color: string;
  rotation?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  previewScale?: number;
}

type PaletteKey = "primary" | "accent" | "success" | "warning" | "danger" | "glowA" | "glowB" | "glowC";

interface ShapeSeed {
  kind: BackgroundShapeKind;
  size: number;
  top?: number | `${number}%`;
  bottom?: number | `${number}%`;
  left?: number | `${number}%`;
  right?: number | `${number}%`;
  opacity: number;
  depth: number;
  colorKey: PaletteKey;
  mixWith?: string;
  mixWeight?: number;
  rotation?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  previewScale?: number;
}

interface BackgroundDecorDefinition {
  meta: BackgroundDecorMeta;
  preview: [PaletteKey, PaletteKey, PaletteKey];
  shapes: ShapeSeed[];
}

export const backgroundDecorPresets: BackgroundDecorDefinition[] = [
  {
    meta: { id: "orbit", name: "Orbit", description: "Capas ordenadas con anillos y órbitas." },
    preview: ["glowA", "primary", "glowC"],
    shapes: [
      { kind: "ring", size: 250, top: 64, right: -46, opacity: 0.42, depth: 0.12, colorKey: "glowA", previewScale: 0.26 },
      { kind: "circle", size: 190, top: 224, left: "36%", opacity: 0.3, depth: 0.22, colorKey: "glowC", previewScale: 0.22 },
      { kind: "diamond", size: 132, bottom: 94, left: -18, opacity: 0.18, depth: 0.18, colorKey: "primary", rotation: 24, previewScale: 0.24 },
      { kind: "icon", size: 108, top: 156, left: 16, opacity: 0.14, depth: 0.28, colorKey: "accent", icon: "planet", iconSize: 58, previewScale: 0.3 },
      { kind: "capsule", size: 168, bottom: 182, right: "20%", opacity: 0.16, depth: 0.34, colorKey: "accent", rotation: -18, previewScale: 0.26 },
    ],
  },
  {
    meta: { id: "bubbles", name: "Bubbles", description: "Más juguetón, con cápsulas y notas suaves." },
    preview: ["accent", "success", "primary"],
    shapes: [
      { kind: "circle", size: 210, top: 84, left: -42, opacity: 0.28, depth: 0.15, colorKey: "success", previewScale: 0.28 },
      { kind: "circle", size: 138, top: 148, right: 22, opacity: 0.2, depth: 0.3, colorKey: "accent", previewScale: 0.24 },
      { kind: "icon", size: 110, top: 258, left: "44%", opacity: 0.16, depth: 0.24, colorKey: "primary", icon: "musical-notes", iconSize: 46, previewScale: 0.28 },
      { kind: "capsule", size: 178, bottom: 132, right: -24, opacity: 0.18, depth: 0.1, colorKey: "glowB", rotation: 22, previewScale: 0.24 },
      { kind: "rounded", size: 128, bottom: 42, left: 12, opacity: 0.16, depth: 0.32, colorKey: "warning", rotation: -14, previewScale: 0.24 },
    ],
  },
  {
    meta: { id: "comets", name: "Comets", description: "Más dinámico, con trazos y estrellas." },
    preview: ["primary", "accent", "danger"],
    shapes: [
      { kind: "capsule", size: 260, top: 62, right: -68, opacity: 0.22, depth: 0.08, colorKey: "primary", rotation: -28, previewScale: 0.28 },
      { kind: "icon", size: 126, top: 208, left: 12, opacity: 0.16, depth: 0.28, colorKey: "warning", icon: "star", iconSize: 58, previewScale: 0.28 },
      { kind: "ring", size: 176, top: 318, left: "42%", opacity: 0.18, depth: 0.14, colorKey: "danger", previewScale: 0.24 },
      { kind: "diamond", size: 156, bottom: 92, left: -22, opacity: 0.16, depth: 0.18, colorKey: "accent", rotation: -18, previewScale: 0.22 },
      { kind: "circle", size: 118, bottom: 210, right: 12, opacity: 0.14, depth: 0.3, colorKey: "glowB", previewScale: 0.18 },
    ],
  },
  {
    meta: { id: "lagoon", name: "Lagoon", description: "Acuático, con tarjetas suaves y peces abstractos." },
    preview: ["success", "glowA", "accent"],
    shapes: [
      { kind: "rounded", size: 248, top: 84, right: -58, opacity: 0.22, depth: 0.1, colorKey: "success", rotation: -12, previewScale: 0.28 },
      { kind: "circle", size: 168, top: 208, left: 14, opacity: 0.2, depth: 0.22, colorKey: "glowA", previewScale: 0.24 },
      { kind: "icon", size: 112, top: 342, left: "40%", opacity: 0.14, depth: 0.2, colorKey: "accent", icon: "fish", iconSize: 50, previewScale: 0.28 },
      { kind: "capsule", size: 182, bottom: 152, right: 8, opacity: 0.16, depth: 0.16, colorKey: "primary", rotation: 16, previewScale: 0.24 },
      { kind: "ring", size: 214, bottom: 58, left: -68, opacity: 0.16, depth: 0.08, colorKey: "glowB", previewScale: 0.24 },
    ],
  },
  {
    meta: { id: "sunrise", name: "Sunrise", description: "Cálido, con soles y bloques suaves." },
    preview: ["warning", "accent", "glowB"],
    shapes: [
      { kind: "circle", size: 276, top: 70, right: -52, opacity: 0.3, depth: 0.1, colorKey: "warning", previewScale: 0.3 },
      { kind: "icon", size: 120, top: 240, left: 12, opacity: 0.16, depth: 0.26, colorKey: "accent", icon: "sunny", iconSize: 54, previewScale: 0.3 },
      { kind: "rounded", size: 148, top: 314, left: "42%", opacity: 0.14, depth: 0.18, colorKey: "danger", rotation: 18, previewScale: 0.24 },
      { kind: "capsule", size: 172, bottom: 128, right: 12, opacity: 0.14, depth: 0.28, colorKey: "glowA", rotation: -22, previewScale: 0.24 },
      { kind: "ring", size: 204, bottom: 48, left: -58, opacity: 0.16, depth: 0.08, colorKey: "glowB", previewScale: 0.22 },
    ],
  },
  {
    meta: { id: "berry-pop", name: "Berry Pop", description: "Más expresivo, con formas pop y corazones." },
    preview: ["danger", "accent", "primary"],
    shapes: [
      { kind: "rounded", size: 220, top: 78, right: -34, opacity: 0.24, depth: 0.1, colorKey: "danger", rotation: -18, previewScale: 0.28 },
      { kind: "icon", size: 116, top: 190, left: 14, opacity: 0.16, depth: 0.24, colorKey: "accent", icon: "heart", iconSize: 48, previewScale: 0.28 },
      { kind: "diamond", size: 148, top: 328, left: "44%", opacity: 0.15, depth: 0.18, colorKey: "primary", rotation: 22, previewScale: 0.22 },
      { kind: "circle", size: 168, bottom: 180, right: 8, opacity: 0.14, depth: 0.16, colorKey: "warning", previewScale: 0.2 },
      { kind: "capsule", size: 188, bottom: 54, left: -34, opacity: 0.16, depth: 0.08, colorKey: "glowA", rotation: 12, previewScale: 0.24 },
    ],
  },
  {
    meta: { id: "campus", name: "Campus", description: "Escolar, con badges e iconos de estudio." },
    preview: ["primary", "success", "warning"],
    shapes: [
      { kind: "rounded", size: 232, top: 76, right: -24, opacity: 0.2, depth: 0.1, colorKey: "primary", rotation: -10, previewScale: 0.28 },
      { kind: "icon", size: 118, top: 170, left: 16, opacity: 0.16, depth: 0.28, colorKey: "success", icon: "school", iconSize: 50, previewScale: 0.28 },
      { kind: "ring", size: 142, top: 306, left: "44%", opacity: 0.16, depth: 0.18, colorKey: "warning", previewScale: 0.22 },
      { kind: "diamond", size: 128, bottom: 190, right: 18, opacity: 0.14, depth: 0.22, colorKey: "glowC", rotation: -18, previewScale: 0.2 },
      { kind: "capsule", size: 196, bottom: 54, left: -34, opacity: 0.14, depth: 0.08, colorKey: "glowB", rotation: 18, previewScale: 0.24 },
    ],
  },
  {
    meta: { id: "aurora", name: "Aurora", description: "Más etéreo, con brillos y estrellas suaves." },
    preview: ["glowC", "primary", "accent"],
    shapes: [
      { kind: "capsule", size: 286, top: 62, right: -72, opacity: 0.18, depth: 0.08, colorKey: "glowC", rotation: -26, previewScale: 0.3 },
      { kind: "icon", size: 110, top: 186, left: 12, opacity: 0.14, depth: 0.26, colorKey: "primary", icon: "sparkles", iconSize: 48, previewScale: 0.28 },
      { kind: "circle", size: 172, top: 324, left: "44%", opacity: 0.14, depth: 0.18, colorKey: "accent", previewScale: 0.22 },
      { kind: "ring", size: 188, bottom: 164, right: -8, opacity: 0.14, depth: 0.16, colorKey: "glowB", previewScale: 0.22 },
      { kind: "rounded", size: 228, bottom: 48, left: -62, opacity: 0.14, depth: 0.08, colorKey: "glowA", rotation: 14, previewScale: 0.26 },
    ],
  },
  {
    meta: { id: "confetti", name: "Confetti", description: "Más vivo, con mezcla de recortes y notas." },
    preview: ["accent", "warning", "danger"],
    shapes: [
      { kind: "diamond", size: 154, top: 84, left: 12, opacity: 0.18, depth: 0.28, colorKey: "accent", rotation: 18, previewScale: 0.2 },
      { kind: "rounded", size: 112, top: 120, right: 18, opacity: 0.2, depth: 0.32, colorKey: "warning", rotation: -12, previewScale: 0.22 },
      { kind: "icon", size: 118, top: 254, left: "40%", opacity: 0.16, depth: 0.18, colorKey: "danger", icon: "flash", iconSize: 48, previewScale: 0.28 },
      { kind: "capsule", size: 162, bottom: 120, right: -12, opacity: 0.14, depth: 0.12, colorKey: "glowB", rotation: 28, previewScale: 0.22 },
      { kind: "circle", size: 210, bottom: 58, left: -74, opacity: 0.16, depth: 0.08, colorKey: "glowA", previewScale: 0.26 },
    ],
  },
  {
    meta: { id: "meteor", name: "Meteor", description: "Más intenso, con flechas y trazos." },
    preview: ["primary", "danger", "glowA"],
    shapes: [
      { kind: "capsule", size: 288, top: 68, right: -78, opacity: 0.2, depth: 0.08, colorKey: "primary", rotation: -30, previewScale: 0.3 },
      { kind: "icon", size: 120, top: 192, left: 14, opacity: 0.16, depth: 0.28, colorKey: "danger", icon: "rocket", iconSize: 52, previewScale: 0.3 },
      { kind: "ring", size: 176, top: 328, left: "44%", opacity: 0.14, depth: 0.18, colorKey: "accent", previewScale: 0.22 },
      { kind: "diamond", size: 146, bottom: 176, right: 12, opacity: 0.14, depth: 0.22, colorKey: "warning", rotation: 20, previewScale: 0.22 },
      { kind: "rounded", size: 220, bottom: 54, left: -56, opacity: 0.14, depth: 0.08, colorKey: "glowC", rotation: 12, previewScale: 0.26 },
    ],
  },
];

export const defaultBackgroundDecorId: BackgroundDecorId = "orbit";

export function getBackgroundDecorMeta(id: BackgroundDecorId) {
  return backgroundDecorPresets.find((item) => item.meta.id === id)?.meta ?? backgroundDecorPresets[0].meta;
}

export function isBackgroundDecorId(value: unknown): value is BackgroundDecorId {
  return typeof value === "string" && backgroundDecorPresets.some((item) => item.meta.id === value);
}

function resolveSeedColor(theme: AppTheme, seed: ShapeSeed) {
  const base = theme.colors[seed.colorKey];
  if (!seed.mixWith) return base;
  return mixHexColors(base, seed.mixWith, seed.mixWeight ?? 0.24);
}

export function getBackgroundDecorPreviewColors(theme: AppTheme, id: BackgroundDecorId) {
  const preset = backgroundDecorPresets.find((item) => item.meta.id === id) ?? backgroundDecorPresets[0];
  return preset.preview.map((key) => theme.colors[key]) as [string, string, string];
}

export function buildBackgroundDecorShapes(theme: AppTheme, id: BackgroundDecorId): BackgroundDecorShape[] {
  const preset = backgroundDecorPresets.find((item) => item.meta.id === id) ?? backgroundDecorPresets[0];

  return preset.shapes.map((shape) => ({
    kind: shape.kind,
    size: shape.size,
    top: shape.top,
    bottom: shape.bottom,
    left: shape.left,
    right: shape.right,
    opacity: shape.opacity,
    depth: shape.depth,
    rotation: shape.rotation,
    icon: shape.icon,
    iconSize: shape.iconSize,
    previewScale: shape.previewScale,
    color: hexToRgba(resolveSeedColor(theme, shape), theme.mode === "dark" ? shape.opacity * 1.16 : shape.opacity),
  }));
}

export function getBackgroundDecorPreviewShapes(theme: AppTheme, id: BackgroundDecorId) {
  return buildBackgroundDecorShapes(theme, id)
    .slice(0, 3)
    .map((shape, index) => ({
      ...shape,
      size: Math.round(shape.size * (shape.previewScale ?? 0.24)),
      top: index === 0 ? 8 : index === 1 ? 18 : 40,
      left: index === 0 ? 10 : index === 1 ? 68 : 46,
      right: undefined,
      bottom: undefined,
    }));
}
