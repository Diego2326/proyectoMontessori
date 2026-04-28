import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrecheckMutation } from "@/features/auth/api";
import { getErrorMessage } from "@/core/api/error";
import { AppScreen } from "@/components/AppScreen";
import { FormField } from "@/components/FormField";
import { AppButton } from "@/components/AppButton";
import { useAppTheme } from "@/theme/ThemeProvider";

const precheckSchema = z.object({
  email: z.string().email("Correo inválido"),
});

type FormValues = z.infer<typeof precheckSchema>;

export default function PrecheckScreen() {
  const theme = useAppTheme();
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [emailForSetPassword, setEmailForSetPassword] = useState<string | null>(null);
  const precheckMutation = usePrecheckMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(precheckSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await precheckMutation.mutateAsync(values);
      const shouldSetPassword = result.requiresSetPassword || result.hasPassword === false;
      setEmailForSetPassword(shouldSetPassword ? values.email : null);
      setResultMessage(result.message ?? (shouldSetPassword ? "Debes configurar tu contraseña." : "Tu cuenta ya tiene contraseña."));
    } catch (error) {
      const message = getErrorMessage(error);
      setResultMessage(message);
      Alert.alert("No se pudo validar", message);
    }
  });

  return (
    <AppScreen title="Recuperar acceso" scroll={false} compactHeader showAppLabel={false} showGlobalTopBar={false}>
      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <FormField
              label="Correo institucional"
              placeholder="alumno@colegio.edu"
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />
        <AppButton label="Validar correo" onPress={onSubmit} loading={precheckMutation.isPending} />
        {!!resultMessage && <Text style={[styles.result, { color: theme.colors.text }]}>{resultMessage}</Text>}
        {!!emailForSetPassword && (
          <AppButton label="Configurar contraseña" onPress={() => router.push({ pathname: "/(auth)/set-password", params: { email: emailForSetPassword } })} />
        )}
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>Volver a login</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
    marginTop: 12,
  },
  result: {
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    textAlign: "center",
    fontWeight: "600",
  },
});
