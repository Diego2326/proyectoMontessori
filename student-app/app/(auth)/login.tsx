import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/core/auth/authStore";
import { AppScreen } from "@/components/AppScreen";
import { FormField } from "@/components/FormField";
import { AppButton } from "@/components/AppButton";
import { ClayCard } from "@/components/ClayCard";
import { StudentLogo } from "@/components/StudentLogo";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { buildDemoSession } from "@/core/api/mockDemo";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const highlights = [
  "Clases y tareas",
  "Avisos y agenda",
  "Pantallas pensadas para tablet",
];

export default function LoginScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const queryClient = useQueryClient();
  const setAuthenticatedSession = useAuthStore((s) => s.setAuthenticatedSession);
  const unauthorizedReason = useAuthStore((s) => s.unauthorizedReason);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "estudiante@montessori.edu", password: "montessori" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const demoSession = buildDemoSession(values.email);
    await setAuthenticatedSession(demoSession);
    await queryClient.invalidateQueries();
    router.replace("/(app)/(tabs)/dashboard");
  });

  return (
    <AppScreen title="Tu campus" scroll={false} compactHeader showAppLabel={false} showGlobalTopBar={false}>
      <View style={[styles.layout, { flexDirection: responsive.isTablet ? "row" : "column", gap: responsive.isTablet ? 20 : 16 }]}>
        <ClayCard style={[styles.heroCard, { flex: responsive.isTablet ? 1.15 : undefined }]}>
          <View style={[styles.logoRow, { flexDirection: responsive.isTablet ? "row" : "column", alignItems: responsive.isTablet ? "center" : "flex-start" }]}>
            <StudentLogo size={responsive.isTablet ? 124 : 98} />
            <View style={styles.logoText}>
              <View style={[styles.badge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderStrong }]}>
                <Text style={[styles.badgeText, { color: theme.colors.primary }]}>MONTESSORI STUDENT</Text>
              </View>
              <Text
                style={[
                  styles.heroTitle,
                  {
                    color: theme.colors.text,
                    fontFamily: theme.typography.title,
                    fontSize: responsive.isTablet ? 34 : 26,
                    lineHeight: responsive.isTablet ? 42 : 32,
                  },
                ]}
              >
                Entra y sigue tu día.
              </Text>
            </View>
          </View>
          <View style={styles.highlightList}>
            {highlights.map((item) => (
              <View key={item} style={styles.highlightRow}>
                <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
                <Text style={[styles.highlightText, { color: theme.colors.text }]}>{item}</Text>
              </View>
            ))}
          </View>
        </ClayCard>

        <ClayCard style={[styles.formCard, { width: responsive.isTablet ? responsive.formMaxWidth : undefined }]}>
          <Text style={[styles.formTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Ingresar</Text>
          {!!unauthorizedReason && <Text style={[styles.warning, { color: theme.colors.warning }]}>{unauthorizedReason}</Text>}

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormField
                  label="Correo"
                  placeholder="alumno@colegio.edu"
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormField
                  label="Contraseña"
                  placeholder="Tu contraseña"
                  value={field.value}
                  onChangeText={field.onChange}
                  secureTextEntry
                  error={errors.password?.message}
                />
              )}
            />
            <AppButton label="Entrar" onPress={onSubmit} loading={isSubmitting} />
          </View>
        </ClayCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    alignItems: "stretch",
  },
  heroCard: {
    justifyContent: "space-between",
    gap: 18,
  },
  logoRow: {
    gap: 16,
  },
  logoText: {
    flex: 1,
    gap: 10,
  },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 26,
    lineHeight: 32,
  },
  heroBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  highlightList: {
    gap: 12,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  highlightText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    gap: 14,
    alignSelf: "center",
  },
  formTitle: {
    fontSize: 24,
  },
  formSubtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  form: {
    gap: 14,
  },
  warning: {
    fontSize: 13,
    lineHeight: 19,
  },
});
