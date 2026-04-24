import React, { PropsWithChildren } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/ThemeProvider";
import { OfflineBanner } from "./OfflineBanner";

interface AppScreenProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function AppScreen({
  title,
  subtitle,
  children,
  scroll = true,
  refreshing = false,
  onRefresh,
}: AppScreenProps) {
  const theme = useAppTheme();
  const content = (
    <View style={styles.content}>
      <OfflineBanner />
      <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{title}</Text>
      {!!subtitle && <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>}
      <View style={{ gap: 12 }}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={[theme.colors.bg, theme.colors.bgSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.glowA, { backgroundColor: theme.colors.glowA }]} />
      <View style={[styles.glowB, { backgroundColor: theme.colors.glowB }]} />
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.container}>{content}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  content: {
    gap: 8,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  glowA: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 180,
    top: 70,
    right: -50,
    opacity: 0.5,
  },
  glowB: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 220,
    left: -70,
    bottom: 80,
    opacity: 0.45,
  },
});
