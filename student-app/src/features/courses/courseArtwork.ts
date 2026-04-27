import { Ionicons } from "@expo/vector-icons";
import { CourseDto } from "@/types/dto";

type CourseArtworkInput = Partial<Pick<CourseDto, "id" | "name" | "code" | "subjectId">>;
type CourseArtworkVariant = "card" | "hero";

interface CourseArtworkDefinition {
  category: "architecture" | "business" | "nature" | "people" | "technology";
  icon: keyof typeof Ionicons.glyphMap;
  imageId: number;
  accent: string;
}

const COURSE_ARTWORK_BY_SUBJECT: Record<number, CourseArtworkDefinition> = {
  1: {
    category: "business",
    icon: "calculator",
    imageId: 1262,
    accent: "#6D98FF",
  },
  2: {
    category: "nature",
    icon: "flask",
    imageId: 817,
    accent: "#2E9E6F",
  },
  3: {
    category: "people",
    icon: "book",
    imageId: 732,
    accent: "#C96A8B",
  },
};

const DEFAULT_ARTWORK: CourseArtworkDefinition = {
  category: "technology",
  icon: "planet",
  imageId: 733,
  accent: "#4A7BC7",
};

function inferArtworkDefinition(course: CourseArtworkInput): CourseArtworkDefinition {
  if (course.subjectId && COURSE_ARTWORK_BY_SUBJECT[course.subjectId]) {
    return COURSE_ARTWORK_BY_SUBJECT[course.subjectId];
  }

  const fingerprint = `${course.name ?? ""} ${course.code ?? ""}`.toLowerCase();

  if (fingerprint.includes("mate") || fingerprint.includes("álgebra") || fingerprint.includes("mat")) {
    return COURSE_ARTWORK_BY_SUBJECT[1];
  }

  if (fingerprint.includes("ciencia") || fingerprint.includes("lab") || fingerprint.includes("bio")) {
    return COURSE_ARTWORK_BY_SUBJECT[2];
  }

  if (fingerprint.includes("lengua") || fingerprint.includes("human") || fingerprint.includes("lect")) {
    return COURSE_ARTWORK_BY_SUBJECT[3];
  }

  return DEFAULT_ARTWORK;
}

export function getCourseArtwork(course: CourseArtworkInput, variant: CourseArtworkVariant = "card") {
  const definition = inferArtworkDefinition(course);
  const size = variant === "hero" ? "1200/760" : "900/640";

  return {
    ...definition,
    imageUrl: `https://placeholdpicsum.dev/photo/id/${definition.imageId}/${size}.webp`,
  };
}
