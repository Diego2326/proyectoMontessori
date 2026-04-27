import { ApiError } from "./error";
import {
  AcademicModuleDto,
  CalendarEventDto,
  ContentResourceDto,
  CourseDto,
  CreateFeedCommentRequest,
  CreateSubmissionRequest,
  FeedCommentDto,
  FeedPostDto,
  GradeRecordDto,
  LmsAssignmentDto,
  NotificationDto,
  StudentDashboardDto,
  StudentProgressDto,
  SubmissionDto,
  UserDto,
} from "@/types/dto";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const DEMO_TOKEN = "demo-student-session";
const DEMO_EXPIRY = "2099-12-31T23:59:59.000Z";

let nextCommentId = 9000;

const baseUser: UserDto = {
  id: 101,
  username: "alumna.demo",
  email: "demo@montessori.edu",
  createdAt: "2026-01-15T08:30:00.000Z",
  updatedAt: "2026-04-27T08:30:00.000Z",
  isAdmin: false,
  role: "STUDENT",
  active: true,
};

const courses: CourseDto[] = [
  {
    id: 201,
    code: "MAT-7A",
    name: "Matemática Integrada",
    description: "Resolución de problemas, álgebra aplicada y laboratorios guiados por retos.",
    subjectId: 1,
    status: "ACTIVE",
    allowComments: true,
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-04-20T09:00:00.000Z",
  },
  {
    id: 202,
    code: "SCI-7B",
    name: "Ciencias y Laboratorio",
    description: "Exploraciones prácticas con bitácora, observación y trabajo colaborativo.",
    subjectId: 2,
    status: "ACTIVE",
    allowComments: true,
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-04-20T09:00:00.000Z",
  },
  {
    id: 203,
    code: "HUM-7C",
    name: "Lenguaje y Humanidades",
    description: "Lectura, escritura y discusión de textos con proyectos editoriales breves.",
    subjectId: 3,
    status: "ACTIVE",
    allowComments: false,
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-04-20T09:00:00.000Z",
  },
];

const modulesByCourse: Record<number, AcademicModuleDto[]> = {
  201: [
    { id: 301, courseId: 201, title: "Patrones y ecuaciones", description: "Modelos, secuencias y ecuaciones lineales.", position: 1, status: "PUBLISHED" },
    { id: 302, courseId: 201, title: "Geometría aplicada", description: "Medición, proporción y diseño de figuras.", position: 2, status: "PUBLISHED" },
  ],
  202: [
    { id: 303, courseId: 202, title: "Ecosistemas del entorno", description: "Relaciones entre organismos y hábitat.", position: 1, status: "PUBLISHED" },
    { id: 304, courseId: 202, title: "Método científico", description: "Hipótesis, observación y evidencia.", position: 2, status: "PUBLISHED" },
  ],
  203: [
    { id: 305, courseId: 203, title: "Narrativa y voz propia", description: "Escritura de relatos y lectura comentada.", position: 1, status: "PUBLISHED" },
  ],
};

const resourcesByModule: Record<number, ContentResourceDto[]> = {
  301: [
    { id: 401, moduleId: 301, title: "Guía visual de patrones", description: "Resumen con ejemplos resueltos.", resourceType: "PDF", contentUrl: "https://example.com/patrones.pdf", position: 1 },
  ],
  303: [
    { id: 402, moduleId: 303, title: "Bitácora de observación", description: "Plantilla para el laboratorio semanal.", resourceType: "DOC", contentUrl: "https://example.com/bitacora.docx", position: 1 },
  ],
};

const assignmentsByCourse: Record<number, LmsAssignmentDto[]> = {
  201: [
    {
      id: 501,
      courseId: 201,
      moduleId: 301,
      title: "Reto de ecuaciones cotidianas",
      description: "Modela tres situaciones reales con ecuaciones simples.",
      instructions: "Entrega una hoja con proceso y conclusiones.",
      maxPoints: 100,
      dueAt: "2026-05-02T17:00:00.000Z",
      allowLateSubmissions: true,
      status: "PUBLISHED",
      publishedAt: "2026-04-20T12:00:00.000Z",
    },
    {
      id: 502,
      courseId: 201,
      moduleId: 302,
      title: "Diseño geométrico del aula",
      description: "Aplica perímetro, área y escala en un plano simple.",
      instructions: "Incluye croquis y justificación numérica.",
      maxPoints: 80,
      dueAt: "2026-05-08T17:00:00.000Z",
      allowLateSubmissions: false,
      status: "PUBLISHED",
      publishedAt: "2026-04-23T12:00:00.000Z",
    },
  ],
  202: [
    {
      id: 503,
      courseId: 202,
      moduleId: 303,
      title: "Mapa de ecosistema local",
      description: "Representa especies, cadenas tróficas y riesgos del entorno.",
      instructions: "Puedes entregar dibujo digital o fotografía del cuaderno.",
      maxPoints: 100,
      dueAt: "2026-05-04T16:00:00.000Z",
      allowLateSubmissions: true,
      status: "PUBLISHED",
      publishedAt: "2026-04-19T12:00:00.000Z",
    },
  ],
  203: [
    {
      id: 504,
      courseId: 203,
      moduleId: 305,
      title: "Mini crónica del día",
      description: "Escribe una crónica breve desde la mirada del estudiante.",
      instructions: "Máximo 500 palabras.",
      maxPoints: 70,
      dueAt: "2026-05-06T15:00:00.000Z",
      allowLateSubmissions: false,
      status: "PUBLISHED",
      publishedAt: "2026-04-22T12:00:00.000Z",
    },
  ],
};

let submissionsByAssignment: Record<number, SubmissionDto> = {
  501: {
    id: 601,
    assignmentId: 501,
    studentId: baseUser.id,
    contentText: "Resolví tres escenarios: transporte, materiales y tiempo de estudio.",
    status: "SUBMITTED",
    submittedAt: "2026-04-25T14:00:00.000Z",
  },
};

const grades: GradeRecordDto[] = [
  {
    id: 701,
    submissionId: 601,
    assignmentId: 501,
    studentId: baseUser.id,
    teacherId: 12,
    score: 94,
    feedback: "Buen razonamiento y presentación clara. Revisa solo la notación final.",
    gradedAt: "2026-04-26T10:00:00.000Z",
  },
];

let notifications: NotificationDto[] = [
  {
    id: 801,
    userId: baseUser.id,
    title: "Nueva tarea en Matemática",
    message: "Se publicó el reto de ecuaciones cotidianas con entrega para el viernes.",
    status: "UNREAD",
    type: "ASSIGNMENT",
    refType: "assignment",
    refId: 501,
    createdAt: "2026-04-26T09:00:00.000Z",
  },
  {
    id: 802,
    userId: baseUser.id,
    title: "Retroalimentación recibida",
    message: "Tu entrega de Matemática ya fue calificada.",
    status: "READ",
    type: "GRADE",
    refType: "grade",
    refId: 701,
    createdAt: "2026-04-26T11:30:00.000Z",
    readAt: "2026-04-26T11:45:00.000Z",
  },
  {
    id: 803,
    userId: baseUser.id,
    title: "Recordatorio de laboratorio",
    message: "Lleva tu bitácora y material reciclado para Ciencias mañana.",
    status: "UNREAD",
    type: "REMINDER",
    createdAt: "2026-04-27T07:30:00.000Z",
  },
];

const calendarEvents: CalendarEventDto[] = [
  {
    id: 901,
    title: "Asamblea de sección",
    description: "Revisión semanal de acuerdos y pendientes.",
    startsAt: "2026-04-28T08:00:00.000Z",
    endsAt: "2026-04-28T08:40:00.000Z",
  },
  {
    id: 902,
    courseId: 201,
    title: "Taller de problemas abiertos",
    description: "Resolución colaborativa en parejas.",
    startsAt: "2026-04-29T10:00:00.000Z",
    endsAt: "2026-04-29T11:30:00.000Z",
  },
  {
    id: 903,
    courseId: 202,
    title: "Laboratorio de observación",
    description: "Trabajo de campo en patio y registro de especies.",
    startsAt: "2026-05-01T09:00:00.000Z",
    endsAt: "2026-05-01T10:30:00.000Z",
  },
];

const feedPostsByCourse: Record<number, FeedPostDto[]> = {
  201: [
    {
      id: 1001,
      courseId: 201,
      authorId: 12,
      authorName: "Prof. Camila",
      title: "Cómo organizar el reto de esta semana",
      content: "Prioriza planteamiento, operaciones y una conclusión breve por cada caso.",
      createdAt: "2026-04-24T10:00:00.000Z",
    },
  ],
  202: [
    {
      id: 1002,
      courseId: 202,
      authorId: 14,
      authorName: "Prof. Mateo",
      title: "Observación antes del laboratorio",
      content: "Hoy practicaremos cómo diferenciar evidencia de interpretación.",
      createdAt: "2026-04-25T08:30:00.000Z",
    },
  ],
  203: [
    {
      id: 1003,
      courseId: 203,
      authorId: 16,
      authorName: "Prof. Sofía",
      title: "Lectura guiada",
      content: "Mañana comentaremos las voces narrativas y el punto de vista del texto base.",
      createdAt: "2026-04-25T12:15:00.000Z",
    },
  ],
};

let commentsByPost: Record<number, FeedCommentDto[]> = {
  1001: [
    {
      id: 1101,
      postId: 1001,
      authorId: baseUser.id,
      authorName: "Alumna Demo",
      content: "¿Podemos entregar un ejemplo extra para subir nota?",
      createdAt: "2026-04-24T14:10:00.000Z",
    },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getCourse(courseId: number) {
  return courses.find((course) => course.id === courseId) ?? null;
}

function getAssignments(courseId: number) {
  return assignmentsByCourse[courseId] ?? [];
}

function getProgress(courseId?: number): StudentProgressDto {
  const allAssignments = courseId ? getAssignments(courseId) : Object.values(assignmentsByCourse).flat();
  const submittedAssignments = allAssignments.filter((item) => submissionsByAssignment[item.id]).length;
  const gradedAssignments = allAssignments.filter((item) => grades.some((grade) => grade.assignmentId === item.id)).length;
  const publishedAssignments = allAssignments.length;
  const progressPercent = publishedAssignments === 0 ? 0 : Math.round((submittedAssignments / publishedAssignments) * 100);
  return {
    studentId: baseUser.id,
    courseId,
    publishedAssignments,
    submittedAssignments,
    gradedAssignments,
    progressPercent,
  };
}

function getDashboard(): StudentDashboardDto {
  const allAssignments = Object.values(assignmentsByCourse).flat();
  const unreadNotifications = notifications.filter((item) => !item.readAt && item.status !== "READ").length;
  const submittedIds = new Set(Object.values(submissionsByAssignment).map((item) => item.assignmentId));
  const gradedIds = new Set(grades.map((item) => item.assignmentId));

  return {
    studentId: baseUser.id,
    enrolledCourses: courses.length,
    pendingAssignments: allAssignments.filter((item) => !submittedIds.has(item.id)).length,
    gradedAssignments: gradedIds.size,
    unreadNotifications,
  };
}

function buildUser(email?: string): UserDto {
  return {
    ...baseUser,
    email: email?.trim() || baseUser.email,
    updatedAt: new Date().toISOString(),
  };
}

export function isDemoToken(token: string | null | undefined) {
  return token === DEMO_TOKEN;
}

export function buildDemoSession(email?: string) {
  return {
    token: DEMO_TOKEN,
    expiresAt: DEMO_EXPIRY,
    user: buildUser(email),
  };
}

export async function mockAuthedRequest<T>(
  path: string,
  options: { method?: Method; body?: unknown } = {}
): Promise<T> {
  const method = options.method ?? "GET";
  const normalizedPath = path.split("?")[0];

  if (normalizedPath === "/auth/me" && method === "GET") {
    return clone(buildUser()) as T;
  }

  if (normalizedPath === "/dashboard/student" && method === "GET") {
    return clone(getDashboard()) as T;
  }

  if (normalizedPath === "/notifications" && method === "GET") {
    return clone(notifications) as T;
  }

  if (normalizedPath === "/notifications/read-all" && method === "PATCH") {
    notifications = notifications.map((item) => ({
      ...item,
      status: "READ",
      readAt: item.readAt ?? new Date().toISOString(),
    }));
    return { ok: true } as T;
  }

  const notificationReadMatch = normalizedPath.match(/^\/notifications\/(\d+)\/read$/);
  if (notificationReadMatch && method === "PATCH") {
    const notificationId = Number(notificationReadMatch[1]);
    notifications = notifications.map((item) =>
      item.id === notificationId
        ? { ...item, status: "READ", readAt: item.readAt ?? new Date().toISOString() }
        : item
    );
    return clone(notifications.find((item) => item.id === notificationId) ?? { ok: true }) as T;
  }

  if (normalizedPath === "/calendar" && method === "GET") {
    return clone(calendarEvents) as T;
  }

  const studentCoursesMatch = normalizedPath.match(/^\/students\/(\d+)\/courses$/);
  if (studentCoursesMatch && method === "GET") {
    return clone(courses) as T;
  }

  const courseDetailMatch = normalizedPath.match(/^\/courses\/(\d+)$/);
  if (courseDetailMatch && method === "GET") {
    const course = getCourse(Number(courseDetailMatch[1]));
    if (!course) throw new ApiError("Curso no encontrado.", 404);
    return clone(course) as T;
  }

  const courseModulesMatch = normalizedPath.match(/^\/courses\/(\d+)\/modules$/);
  if (courseModulesMatch && method === "GET") {
    return clone(modulesByCourse[Number(courseModulesMatch[1])] ?? []) as T;
  }

  const moduleDetailMatch = normalizedPath.match(/^\/modules\/(\d+)$/);
  if (moduleDetailMatch && method === "GET") {
    const moduleId = Number(moduleDetailMatch[1]);
    const item = Object.values(modulesByCourse).flat().find((module) => module.id === moduleId);
    if (!item) throw new ApiError("Módulo no encontrado.", 404);
    return clone(item) as T;
  }

  const moduleResourcesMatch = normalizedPath.match(/^\/modules\/(\d+)\/resources$/);
  if (moduleResourcesMatch && method === "GET") {
    return clone(resourcesByModule[Number(moduleResourcesMatch[1])] ?? []) as T;
  }

  const courseAssignmentsMatch = normalizedPath.match(/^\/courses\/(\d+)\/assignments$/);
  if (courseAssignmentsMatch && method === "GET") {
    return clone(getAssignments(Number(courseAssignmentsMatch[1]))) as T;
  }

  const assignmentSubmissionMatch = normalizedPath.match(/^\/assignments\/(\d+)\/my-submission$/);
  if (assignmentSubmissionMatch && method === "GET") {
    const assignmentId = Number(assignmentSubmissionMatch[1]);
    const submission = submissionsByAssignment[assignmentId];
    if (!submission) throw new ApiError("No existe entrega para esta tarea.", 404);
    return clone(submission) as T;
  }

  const createSubmissionMatch = normalizedPath.match(/^\/assignments\/(\d+)\/submissions$/);
  if (createSubmissionMatch && method === "POST") {
    const assignmentId = Number(createSubmissionMatch[1]);
    const payload = (options.body ?? {}) as CreateSubmissionRequest;
    const newSubmission: SubmissionDto = {
      id: Date.now(),
      assignmentId,
      studentId: baseUser.id,
      contentText: payload.contentText,
      attachmentUrl: payload.attachmentUrl,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
    };
    submissionsByAssignment = { ...submissionsByAssignment, [assignmentId]: newSubmission };
    return clone(newSubmission) as T;
  }

  const submissionDetailMatch = normalizedPath.match(/^\/submissions\/(\d+)$/);
  if (submissionDetailMatch && method === "GET") {
    const submissionId = Number(submissionDetailMatch[1]);
    const submission = Object.values(submissionsByAssignment).find((item) => item.id === submissionId);
    if (!submission) throw new ApiError("Entrega no encontrada.", 404);
    return clone(submission) as T;
  }

  if (submissionDetailMatch && method === "PUT") {
    const submissionId = Number(submissionDetailMatch[1]);
    const assignmentEntry = Object.entries(submissionsByAssignment).find(([, item]) => item.id === submissionId);
    if (!assignmentEntry) throw new ApiError("Entrega no encontrada.", 404);
    const assignmentId = Number(assignmentEntry[0]);
    const payload = (options.body ?? {}) as CreateSubmissionRequest;
    const updated: SubmissionDto = {
      ...assignmentEntry[1],
      contentText: payload.contentText,
      attachmentUrl: payload.attachmentUrl,
      submittedAt: new Date().toISOString(),
    };
    submissionsByAssignment = { ...submissionsByAssignment, [assignmentId]: updated };
    return clone(updated) as T;
  }

  const studentGradesMatch = normalizedPath.match(/^\/students\/(\d+)\/grades$/);
  if (studentGradesMatch && method === "GET") {
    return clone(grades) as T;
  }

  const studentProgressMatch = normalizedPath.match(/^\/students\/(\d+)\/progress$/);
  if (studentProgressMatch && method === "GET") {
    return clone(getProgress()) as T;
  }

  const courseProgressMatch = normalizedPath.match(/^\/courses\/(\d+)\/students\/(\d+)\/progress$/);
  if (courseProgressMatch && method === "GET") {
    return clone(getProgress(Number(courseProgressMatch[1]))) as T;
  }

  const courseCalendarMatch = normalizedPath.match(/^\/courses\/(\d+)\/calendar$/);
  if (courseCalendarMatch && method === "GET") {
    const courseId = Number(courseCalendarMatch[1]);
    return clone(calendarEvents.filter((event) => event.courseId === courseId)) as T;
  }

  const courseFeedMatch = normalizedPath.match(/^\/courses\/(\d+)\/feed$/);
  if (courseFeedMatch && method === "GET") {
    return clone(feedPostsByCourse[Number(courseFeedMatch[1])] ?? []) as T;
  }

  const feedCommentsMatch = normalizedPath.match(/^\/feed\/(\d+)\/comments$/);
  if (feedCommentsMatch && method === "GET") {
    return clone(commentsByPost[Number(feedCommentsMatch[1])] ?? []) as T;
  }

  if (feedCommentsMatch && method === "POST") {
    const postId = Number(feedCommentsMatch[1]);
    const payload = (options.body ?? {}) as CreateFeedCommentRequest;
    const newComment: FeedCommentDto = {
      id: nextCommentId++,
      postId,
      authorId: baseUser.id,
      authorName: "Alumna Demo",
      content: payload.content,
      createdAt: new Date().toISOString(),
    };
    commentsByPost = {
      ...commentsByPost,
      [postId]: [...(commentsByPost[postId] ?? []), newComment],
    };
    return clone(newComment) as T;
  }

  throw new ApiError(`Ruta demo no implementada: ${method} ${normalizedPath}`, 501);
}
