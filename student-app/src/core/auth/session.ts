import { useAuthStore } from "./authStore";
import { ApiError } from "@/core/api/error";

export function getRequiredStudentId() {
  const user = useAuthStore.getState().user;
  if (!user?.id) {
    throw new ApiError("No se pudo identificar al alumno.", 401);
  }
  return user.id;
}
