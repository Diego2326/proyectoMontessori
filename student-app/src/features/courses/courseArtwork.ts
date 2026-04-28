import { Ionicons } from "@expo/vector-icons";
import { CourseDto } from "@/types/dto";

type CourseArtworkInput = Partial<Pick<CourseDto, "id" | "name" | "code" | "subjectId">>;
type CourseArtworkVariant = "card" | "hero";

interface CourseArtworkDefinition {
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  imageBaseUrl: string;
}

const ARTWORK_MATH: CourseArtworkDefinition = {
  icon: "calculator",
  accent: "#6D98FF",
  imageBaseUrl: "https://images.unsplash.com/photo-1758685848147-e1e149bf2603",
};

const ARTWORK_SCIENCE: CourseArtworkDefinition = {
  icon: "flask",
  accent: "#2E9E6F",
  imageBaseUrl: "https://images.unsplash.com/photo-1758206523826-a65d4cf070aa",
};

const ARTWORK_HUMANITIES: CourseArtworkDefinition = {
  icon: "book",
  accent: "#C96A8B",
  imageBaseUrl: "https://images.unsplash.com/photo-1749631951548-c26612825aed",
};

const ARTWORK_ART: CourseArtworkDefinition = {
  icon: "color-palette",
  accent: "#D17A52",
  imageBaseUrl: "https://images.unsplash.com/photo-1753200468785-eecdd7f6014c",
};

const ARTWORK_TECH: CourseArtworkDefinition = {
  icon: "desktop",
  accent: "#4A7BC7",
  imageBaseUrl: "https://images.unsplash.com/photo-1763568258492-9569a0af2127",
};

const ARTWORK_SOCIAL: CourseArtworkDefinition = {
  icon: "planet",
  accent: "#4B8BC1",
  imageBaseUrl: "https://images.unsplash.com/photo-1740635551152-7fa6854a0a10",
};

const ARTWORK_ENGLISH: CourseArtworkDefinition = {
  icon: "book",
  accent: "#7C6AC7",
  imageBaseUrl: "https://images.unsplash.com/photo-1769794371055-54436b54577e",
};

const COURSE_ARTWORK_BY_SUBJECT: Record<number, CourseArtworkDefinition> = {
  1: ARTWORK_MATH,
  2: ARTWORK_SCIENCE,
  3: ARTWORK_HUMANITIES,
};

const DEFAULT_ARTWORK: CourseArtworkDefinition = ARTWORK_HUMANITIES;

function matchesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function inferArtworkDefinition(course: CourseArtworkInput): CourseArtworkDefinition {
  const fingerprint = `${course.name ?? ""} ${course.code ?? ""}`.toLowerCase();

  if (matchesAny(fingerprint, ["arte", "art ", "paint", "draw", "dibujo", "composición", "composicion"])) {
    return ARTWORK_ART;
  }

  if (matchesAny(fingerprint, ["tec", "coding", "code", "program", "tecnología", "tecnologia", "digital"])) {
    return ARTWORK_TECH;
  }

  if (matchesAny(fingerprint, ["social", "geogra", "hist", "globe", "mapa", "territorio", "comunidad"])) {
    return ARTWORK_SOCIAL;
  }

  if (matchesAny(fingerprint, ["english", "workshop", "reading", "speaking", "language arts"])) {
    return ARTWORK_ENGLISH;
  }

  if (matchesAny(fingerprint, ["mate", "álgebra", "algebra", "matem", "math", "equation", "geometry"])) {
    return ARTWORK_MATH;
  }

  if (matchesAny(fingerprint, ["ciencia", "science", "lab", "bio", "química", "quimica", "microscope"])) {
    return ARTWORK_SCIENCE;
  }

  if (matchesAny(fingerprint, ["lengua", "human", "lect", "liter", "book", "narrativa", "escritura"])) {
    return ARTWORK_HUMANITIES;
  }

  if (course.subjectId && COURSE_ARTWORK_BY_SUBJECT[course.subjectId]) {
    return COURSE_ARTWORK_BY_SUBJECT[course.subjectId];
  }

  return DEFAULT_ARTWORK;
}

function buildBannerUrl(baseUrl: string, variant: CourseArtworkVariant) {
  const width = variant === "hero" ? 1400 : 1080;
  const height = variant === "hero" ? 820 : 720;
  return `${baseUrl}?auto=format&fit=crop&crop=entropy&fm=jpg&q=80&w=${width}&h=${height}`;
}

export function getCourseArtwork(course: CourseArtworkInput, variant: CourseArtworkVariant = "card") {
  const definition = inferArtworkDefinition(course);

  return {
    ...definition,
    imageUrl: buildBannerUrl(definition.imageBaseUrl, variant),
  };
}
