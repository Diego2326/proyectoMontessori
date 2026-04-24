import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetPasswordMutation } from "@/features/auth/api";
import { getErrorMessage } from "@/core/api/error";
import { AppScreen } from "@/components/AppScreen";
import { FormField } from "@/components/FormField";
import { AppButton } from "@/components/AppButton";
import { useAppTheme } from "@/theme/ThemeProvider";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  newPassword: z
    .string()
    .min(8, "Debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir una mayúscula")
    .regex(/[0-9]/, "Debe incluir al menos un número"),
});

type FormValues = z.infer<typeof schema>;

export default function SetPasswordScreen() {
  const theme = useAppTheme();
  const params = useLocalSearchParams<{ email?: string }>();
  const setPasswordMutation = useSetPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: params.email ?? "", newPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await setPasswordMutation.mutateAsync(values);
      Alert.alert("Listo", "Contraseña actualizada. Ahora puedes iniciar sesión.");
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("No se pudo guardar", getErrorMessage(error));
    }
  });

  return (
    <AppScreen title="Configurar contraseña" subtitle="Solo lo necesitas una vez." scroll={false}>
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
          name="newPassword"
          render={({ field }) => (
            <FormField
              label="Nueva contraseña"
              placeholder="********"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              error={errors.newPassword?.message}
            />
          )}
        />
        <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
          Mínimo 8 caracteres, 1 mayúscula y 1 número.
        </Text>
        <AppButton label="Guardar contraseña" onPress={onSubmit} loading={setPasswordMutation.isPending} />
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>Volver a login</Text>
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
  hint: {
    fontSize: 12,
  },
  link: {
    textAlign: "center",
    fontWeight: "600",
  },
});
