import React from "react";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { queryClient } from "@/core/query/queryClient";
import { useSessionBootstrap } from "@/core/auth/useSessionBootstrap";

const reactCompat = React as typeof React & {
  use?: <T>(usable: React.Context<T>) => T;
};

if (typeof reactCompat.use !== "function") {
  reactCompat.use = function <T>(usable: React.Context<T>) {
    return React.useContext(usable);
  };
}

function RootNavigation() {
  useSessionBootstrap();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12, backgroundColor: "#F4F9FF" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#0E2D58" }}>Error en la app</Text>
      <Text style={{ fontSize: 14, color: "#2E4F77" }}>{error.message}</Text>
      <Pressable onPress={retry} style={{ backgroundColor: "#1E7BFF", padding: 12, borderRadius: 12 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Reintentar</Text>
      </Pressable>
    </View>
  );
}
