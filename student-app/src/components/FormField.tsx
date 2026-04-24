import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

interface FormFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "url";
  multiline?: boolean;
  error?: string;
}

export function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType = "default",
  multiline = false,
  error,
}: FormFieldProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: theme.typography.title }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.cardSoft,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            minHeight: multiline ? 120 : 48,
            textAlignVertical: multiline ? "top" : "center",
            fontFamily: theme.typography.body,
          },
        ]}
      />
      {!!error && <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  error: {
    fontSize: 12,
  },
});
