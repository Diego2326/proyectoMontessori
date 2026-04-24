import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

interface SectionTitleProps {
  title: string;
  hint?: string;
}

export function SectionTitle({ title, hint }: SectionTitleProps) {
  const theme = useAppTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{title}</Text>
      {!!hint && <Text style={[styles.hint, { color: theme.colors.textMuted }]}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  title: {
    fontSize: 18,
  },
  hint: {
    fontSize: 12,
  },
});
