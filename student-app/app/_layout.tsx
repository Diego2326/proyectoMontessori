import React, { useEffect, useRef } from "react";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useAppTheme, useThemeController } from "@/theme/ThemeProvider";
import { getReadableTextColor } from "@/theme/colorUtils";
import { queryClient } from "@/core/query/queryClient";
import { useSessionBootstrap } from "@/core/auth/useSessionBootstrap";

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

function AnimatedThemeRoot() {
  const theme = useAppTheme();
  const { paletteId, colorScheme } = useThemeController();
  const animation = useRef(new Animated.Value(1)).current;
  const previousKey = useRef(`${paletteId}-${colorScheme}`);

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    const nextKey = `${paletteId}-${colorScheme}`;
    if (previousKey.current === nextKey) {
      return;
    }

    previousKey.current = nextKey;
    LayoutAnimation.configureNext({
      duration: 240,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });

    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animation, colorScheme, paletteId]);

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
        opacity: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
        transform: [
          {
            scale: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.985, 1],
            }),
          },
        ],
      }}
    >
      <RootNavigation />
    </Animated.View>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AnimatedThemeRoot />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const retryColor = "#1E7BFF";
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12, backgroundColor: "#F4F9FF" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#0E2D58" }}>Error en la app</Text>
      <Text style={{ fontSize: 14, color: "#2E4F77" }}>{error.message}</Text>
      <Pressable onPress={retry} style={{ backgroundColor: retryColor, padding: 12, borderRadius: 12 }}>
        <Text style={{ color: getReadableTextColor(retryColor), textAlign: "center", fontWeight: "700" }}>Reintentar</Text>
      </Pressable>
    </View>
  );
}
