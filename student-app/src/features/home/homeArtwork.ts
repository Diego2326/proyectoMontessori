import { CourseDto } from "@/types/dto";

interface HomeArtworkInput {
  id: string;
  title: string;
  body?: string;
  kind: "event" | "feed" | "resource";
  course?: Pick<CourseDto, "id" | "name" | "code" | "subjectId">;
  moduleName?: string;
}

interface HomeArtworkDefinition {
  imageId: number;
  subtitle: string;
}

const DEFAULT_SUBTITLES: Record<HomeArtworkInput["kind"], string> = {
  event: "Actividad del calendario",
  feed: "Publicación del curso",
  resource: "Material del módulo",
};

function chooseImageId(input: HomeArtworkInput) {
  const fingerprint = `${input.title} ${input.body ?? ""} ${input.course?.name ?? ""} ${input.moduleName ?? ""}`.toLowerCase();

  if (fingerprint.includes("laboratorio") || fingerprint.includes("observación") || fingerprint.includes("ecosistema") || fingerprint.includes("especies")) {
    return 621;
  }

  if (fingerprint.includes("lectura") || fingerprint.includes("narrativa") || fingerprint.includes("crónica") || fingerprint.includes("texto")) {
    return 1271;
  }

  if (fingerprint.includes("problema") || fingerprint.includes("ecuacion") || fingerprint.includes("ecuación") || fingerprint.includes("geometr")) {
    return input.kind === "event" ? 1283 : 1262;
  }

  if (fingerprint.includes("bitácora") || fingerprint.includes("guía") || fingerprint.includes("material")) {
    return 1271;
  }

  if (input.course?.subjectId === 2) {
    return 621;
  }

  if (input.course?.subjectId === 3) {
    return 1271;
  }

  if (input.course?.subjectId === 1) {
    return input.kind === "event" ? 1283 : 1262;
  }

  return 738;
}

export function getHomeArtwork(input: HomeArtworkInput) {
  const definition: HomeArtworkDefinition = {
    imageId: chooseImageId(input),
    subtitle: input.moduleName ?? input.course?.name ?? DEFAULT_SUBTITLES[input.kind],
  };

  return {
    imageUrl: `https://placeholdpicsum.dev/photo/id/${definition.imageId}/760/920.webp`,
    title: input.title,
    subtitle: definition.subtitle,
  };
}
