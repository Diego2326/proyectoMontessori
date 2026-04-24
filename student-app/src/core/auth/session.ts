import { useAuthStore } from "./authStore";
import { ApiError } from "@/core/api/error";

export function getOptionalStudentId() {
  const user = useAuthStore.getState().user;
  if (!user?.id) return null;
  return user.id;
}

export function getRequiredStudentId() {
  const studentId = getOptionalStudentId();
  if (!studentId) {
    throw new ApiError("No se pudo identificar al alumno.", 401);
  }
  return studentId;
}
