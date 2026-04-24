import { LmsAssignmentDto } from "@/types/dto";

export function normalizeStatus(status?: string) {
  return status?.toLowerCase().trim() ?? "";
}

export function assignmentStatusLabel(assignment: LmsAssignmentDto, hasSubmission: boolean) {
  if (hasSubmission) return "Entregada";
  if (assignment.dueAt && normalizeStatus(assignment.status) === "closed") return "Cerrada";
  return "Pendiente";
}
