# Student App (Expo + React Native)

Aplicación móvil para alumnos (`STUDENT`) integrada con backend LMS existente (Kotlin + Ktor) mediante JWT.

## Prerrequisitos

- Node.js 18+
- npm 9+
- Expo CLI vía `npx`
- Android Studio (emulador) y/o Xcode (simulador iOS, macOS)
- Backend LMS corriendo en red local

## Instalación

```bash
npm install
```

## Configuración de entorno

1. Copia `.env.example` a `.env`
2. Configura:

```env
EXPO_PUBLIC_API_BASE_URL=http://<IP_O_HOST_BACKEND>:8080
```

Notas de red:
- Android emulador: usa `http://10.0.2.2:8080` si el backend corre en tu misma máquina.
- iOS simulador: suele funcionar `http://localhost:8080`.
- Dispositivo físico: usa la IP LAN real de tu máquina, por ejemplo `http://192.168.1.100:8080`.

## Ejecutar

```bash
npx expo start
npx expo run:android
npx expo run:ios
```

## Stack

- Expo + React Native
- TypeScript estricto
- Expo Router
- TanStack Query
- Zustand
- React Hook Form + Zod
- Expo Secure Store
- AsyncStorage (solo caché no sensible)
- dayjs

## Estructura

```text
student-app/
  app/                      # Rutas Expo Router
    (auth)/                 # splash, login, precheck, set-password
    (app)/(tabs)/           # dashboard, courses, notifications, calendar, profile
    (app)/...               # stacks internos de curso/tarea/feed/progreso/notas
  src/
    core/                   # config, API client, auth store, query client, utils
    features/               # auth, dashboard, courses, assignments, submissions,
                            # grades, feed, notifications, calendar, progress, profile
    components/             # componentes reutilizables UI/estado
    theme/                  # light/dark + tokens visuales
    types/                  # DTOs y tipos compartidos
  assets/
    logo-colegio.png
```

## Pantallas implementadas

- SplashScreen
- LoginScreen
- PrecheckScreen
- SetPasswordScreen
- StudentDashboardScreen
- CoursesListScreen
- CourseDetailScreen (segmentos: Resumen, Módulos, Tareas, Feed, Calendario, Progreso)
- CourseModulesScreen
- ModuleDetailScreen
- AssignmentListScreen
- AssignmentDetailScreen
- SubmissionEditorScreen
- GradesScreen
- NotificationsScreen
- CalendarScreen
- FeedScreen
- FeedCommentsScreen
- ProgressScreen
- ProfileScreen
- CourseProgressDetailScreen

## Endpoints integrados

Públicos:
- `POST /auth/login`
- `POST /auth/precheck`
- `POST /auth/set-password`

Protegidos:
- `GET /auth/me`
- `GET /dashboard/student`
- `GET /notifications`
- `PATCH /notifications/{id}/read`
- `PATCH /notifications/read-all`
- `GET /students/{studentId}/courses`
- `GET /courses/{id}`
- `GET /courses/{courseId}/modules`
- `GET /modules/{id}`
- `GET /modules/{moduleId}/resources`
- `GET /courses/{courseId}/assignments`
- `GET /assignments/{assignmentId}/my-submission`
- `POST /assignments/{assignmentId}/submissions`
- `PUT /submissions/{id}`
- `GET /submissions/{id}`
- `GET /students/{studentId}/grades`
- `GET /courses/{courseId}/feed`
- `GET /feed/{postId}/comments`
- `POST /feed/{postId}/comments`
- `GET /calendar`
- `GET /courses/{courseId}/calendar`
- `GET /students/{studentId}/progress`
- `GET /courses/{courseId}/students/{studentId}/progress`

## Reglas de negocio aplicadas en frontend

- Rol permitido: solo `STUDENT`
- Bloqueo de flujo principal para `ADMIN` y `TEACHER`
- JWT en Secure Store
- Restauración de sesión al abrir app
- Logout controlado en `401`/token vencido
- Manejo explícito de `403`, `404`, timeout y red caída
- Comentarios bloqueados cuando `allowComments = false`
- Entregas con validación: `contentText` o `attachmentUrl` obligatorio
- Sin upload binario (solo `attachmentUrl`)

## Decisiones técnicas

- Cliente API pequeño basado en `fetch`, con parser de errores común.
- Server state en TanStack Query con invalidaciones tras mutaciones.
- Estado local de sesión/UI en Zustand.
- Diseño móvil con enfoque clay/neumórfico, tonos azules y light/dark mode.

## Limitaciones reales detectadas

- El repositorio actual no incluye backend ni Swagger completo, por lo que los DTOs se modelaron con base en contratos provistos.
- Para detalle de tarea se reutiliza `GET /courses/{courseId}/assignments` + búsqueda local (no existe endpoint `GET /assignments/{id}` en la lista oficial).
- El desglose de calificaciones por curso depende de correlacionar asignaciones por curso disponibles en backend.

