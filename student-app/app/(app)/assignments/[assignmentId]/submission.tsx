import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/core/api/error";
import { AppScreen } from "@/components/AppScreen";
import { CourseShell } from "@/components/CourseShell";
import { FormField } from "@/components/FormField";
import { AppButton } from "@/components/AppButton";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import {
  canEditSubmission,
  useAssignmentDetailFromCourseQuery,
  useCreateSubmissionMutation,
  useMySubmissionQuery,
  useUpdateSubmissionMutation,
} from "@/features/assignments/hooks";
import { SubmissionFormValues, submissionSchema } from "@/features/submissions/schema";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function SubmissionEditorScreen() {
  const theme = useAppTheme();
  const params = useLocalSearchParams<{ assignmentId: string; courseId?: string; submissionId?: string }>();
  const assignmentId = Number(params.assignmentId);
  const courseId = Number(params.courseId);
  const submissionId = params.submissionId ? Number(params.submissionId) : undefined;

  const assignmentQuery = useAssignmentDetailFromCourseQuery(courseId, assignmentId);
  const mySubmissionQuery = useMySubmissionQuery(assignmentId);
  const createMutation = useCreateSubmissionMutation(assignmentId, courseId);
  const updateMutation = useUpdateSubmissionMutation(assignmentId, submissionId ?? -1, courseId);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { contentText: "", attachmentUrl: "" },
  });

  useEffect(() => {
    if (!mySubmissionQuery.data) return;
    setValue("contentText", mySubmissionQuery.data.contentText ?? "");
    setValue("attachmentUrl", mySubmissionQuery.data.attachmentUrl ?? "");
  }, [mySubmissionQuery.data, setValue]);

  const editable = canEditSubmission(assignmentQuery.data);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isCourseContext = Number.isFinite(courseId);

  const onSubmit = handleSubmit(async (values) => {
    if (!editable) {
      Alert.alert("No disponible", "La tarea ya cerró.");
      return;
    }
    try {
      const payload = {
        contentText: values.contentText?.trim() || undefined,
        attachmentUrl: values.attachmentUrl?.trim() || undefined,
      };

      if (mySubmissionQuery.data?.id) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
      Alert.alert("Listo", "Entrega guardada.");
      router.back();
    } catch (error) {
      Alert.alert("No se pudo guardar", getErrorMessage(error));
    }
  });

  if (!Number.isFinite(courseId)) {
    return (
      <AppScreen title="Editor de entrega" compactHeader showAppLabel={false}>
        <ErrorState error={new Error("No se recibió el curso de la tarea.")} />
      </AppScreen>
    );
  }

  const screenContent = (
    <>
      {(assignmentQuery.isLoading || mySubmissionQuery.isLoading) && <LoadingState />}
      {(assignmentQuery.error || mySubmissionQuery.error) && <ErrorState error={assignmentQuery.error ?? mySubmissionQuery.error} />}

      {!!assignmentQuery.data && (
        <View style={styles.form}>
          <Text style={{ color: theme.colors.textMuted }}>
            Tarea: <Text style={{ color: theme.colors.text, fontFamily: theme.typography.title }}>{assignmentQuery.data.title}</Text>
          </Text>

          {!editable && (
            <Text style={{ color: theme.colors.warning, fontSize: 13 }}>
              Esta tarea ya cerró.
            </Text>
          )}

          <Controller
            control={control}
            name="contentText"
            render={({ field }) => (
              <FormField
                label="Respuesta en texto"
                value={field.value ?? ""}
                onChangeText={field.onChange}
                placeholder="Escribe tu respuesta..."
                multiline
                error={errors.contentText?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="attachmentUrl"
            render={({ field }) => (
              <FormField
                label="URL adjunta (opcional)"
                value={field.value ?? ""}
                onChangeText={field.onChange}
                placeholder="https://..."
                keyboardType="url"
                error={errors.attachmentUrl?.message}
              />
            )}
          />

          {errors.root?.message && <Text style={{ color: theme.colors.danger }}>{errors.root.message}</Text>}
          <AppButton
            label={mySubmissionQuery.data ? "Actualizar entrega" : "Enviar entrega"}
            onPress={onSubmit}
            loading={isSubmitting}
            disabled={!editable || isSubmitting}
          />
        </View>
      )}
    </>
  );

  if (isCourseContext) {
    return (
      <CourseShell courseId={courseId} activeSection="assignments" title="Entrega">
        {screenContent}
      </CourseShell>
    );
  }

  return (
    <AppScreen title="Entrega" compactHeader showAppLabel={false}>
      {screenContent}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
});
