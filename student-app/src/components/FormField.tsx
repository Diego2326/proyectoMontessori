import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

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
  const responsive = useResponsive();

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.textMuted,
            fontFamily: theme.typography.title,
            fontSize: responsive.isTablet ? 14 : 13,
          },
        ]}
      >
        {label}
      </Text>
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
            borderColor: error ? theme.colors.danger : theme.colors.borderStrong,
            minHeight: multiline ? 140 : responsive.isTablet ? 60 : 48,
            textAlignVertical: multiline ? "top" : "center",
            fontFamily: theme.typography.body,
            fontSize: responsive.isTablet ? 17 : 15,
            borderRadius: responsive.isTablet ? 18 : 14,
            paddingHorizontal: responsive.isTablet ? 18 : 12,
            paddingVertical: responsive.isTablet ? 14 : 10,
          },
        ]}
      />
      {!!error && <Text style={[styles.error, { color: theme.colors.danger, fontSize: responsive.isTablet ? 13 : 12 }]}>{error}</Text>}
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
