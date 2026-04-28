export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export interface UserDto {
  id: number;
  username?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
  role: UserRole;
  active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: UserDto;
}

export interface PrecheckRequest {
  email: string;
}

export interface PrecheckResponse {
  requiresSetPassword?: boolean;
  hasPassword?: boolean;
  message?: string;
}

export interface SetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface CourseDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  subjectId: number;
  gradeLevelId?: number;
  sectionId?: number;
  academicPeriodId?: number;
  status: string;
  allowComments: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicModuleDto {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  position: number;
  status: string;
}

export interface ContentResourceDto {
  id: number;
  moduleId: number;
  title: string;
  description?: string;
  resourceType: string;
  contentUrl?: string;
  contentText?: string;
  position: number;
}

export interface LmsAssignmentDto {
  id: number;
  courseId: number;
  moduleId?: number;
  title: string;
  description?: string;
  instructions?: string;
  maxPoints: number;
  dueAt?: string;
  allowLateSubmissions: boolean;
  status: string;
  publishedAt?: string;
}

export interface SubmissionDto {
  id: number;
  assignmentId: number;
  studentId: number;
  contentText?: string;
  attachmentUrl?: string;
  status: string;
  submittedAt?: string;
}

export interface CreateSubmissionRequest {
  contentText?: string;
  attachmentUrl?: string;
}

export interface GradeRecordDto {
  id: number;
  submissionId: number;
  assignmentId: number;
  studentId: number;
  teacherId: number;
  score: number;
  feedback?: string;
  gradedAt: string;
}

export interface FeedPostDto {
  id: number;
  courseId: number;
  authorId: number;
  authorName?: string;
  title?: string;
  content: string;
  createdAt: string;
}

export interface FeedCommentDto {
  id: number;
  postId: number;
  authorId: number;
  authorName?: string;
  content: string;
  createdAt: string;
}

export interface CreateFeedCommentRequest {
  content: string;
}

export interface NotificationDto {
  id: number;
  userId: number;
  title: string;
  message: string;
  status: string;
  type: string;
  refType?: string;
  refId?: number;
  createdAt: string;
  readAt?: string;
}

export interface CalendarEventDto {
  id: number;
  courseId?: number;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
}

export interface StudentProgressDto {
  studentId: number;
  courseId?: number;
  publishedAssignments: number;
  submittedAssignments: number;
  gradedAssignments: number;
  progressPercent: number;
}

export interface StudentDashboardDto {
  studentId: number;
  enrolledCourses: number;
  pendingAssignments: number;
  gradedAssignments: number;
  unreadNotifications: number;
}

export interface HomeActivityDto {
  id: string;
  type: "assignment" | "material" | "event" | "announcement" | "grade" | "reminder";
  title: string;
  body: string;
  createdAt: string;
  authorName?: string;
  authorRole?: string;
  courseId?: number;
  courseName?: string;
  moduleName?: string;
  actionLabel?: string;
  actionHref?: string;
  commentHref?: string;
  likes?: number;
  comments?: number;
  attachments?: HomeActivityAttachmentDto[];
}

export interface HomeActivityAttachmentDto {
  id: string;
  type: "image" | "document";
  title: string;
  subtitle?: string;
  imageUrl?: string;
  previewTone?: "sky" | "sun" | "mint" | "berry";
  fileLabel?: string;
}
