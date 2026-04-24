import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useLoginMutation } from "@/features/auth/api";
import { useAuthStore } from "@/core/auth/authStore";
import { getErrorMessage } from "@/core/api/error";
import { AppScreen } from "@/components/AppScreen";
import { FormField } from "@/components/FormField";
import { AppButton } from "@/components/AppButton";
import { useAppTheme } from "@/theme/ThemeProvider";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const setAuthenticatedSession = useAuthStore((s) => s.setAuthenticatedSession);
  const logout = useAuthStore((s) => s.logout);
  const unauthorizedReason = useAuthStore((s) => s.unauthorizedReason);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLoginMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      if (response.user.role !== "STUDENT") {
        await logout("Esta app es exclusiva para alumnos.");
        Alert.alert("Acceso restringido", "Esta aplicación está pensada únicamente para alumnos (rol STUDENT).");
        return;
      }
      await setAuthenticatedSession({
        token: response.token,
        expiresAt: response.expiresAt,
        user: response.user,
      });
      await queryClient.invalidateQueries();
      router.replace("/(app)/(tabs)/dashboard");
    } catch (error) {
      Alert.alert("No se pudo iniciar sesión", getErrorMessage(error));
    }
  });

  return (
    <AppScreen title="Bienvenido" subtitle="Inicia sesión para entrar a tu campus estudiantil." scroll={false}>
      <View style={styles.form}>
        {!!unauthorizedReason && <Text style={[styles.warning, { color: theme.colors.warning }]}>{unauthorizedReason}</Text>}
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
              placeholder="********"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />
        <AppButton label="Entrar" onPress={onSubmit} loading={loginMutation.isPending} />
        <TouchableOpacity onPress={() => router.push("/(auth)/precheck")}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>¿Primera vez o problema de acceso?</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 12,
    gap: 12,
  },
  link: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  warning: {
    textAlign: "center",
    fontSize: 13,
  },
});
