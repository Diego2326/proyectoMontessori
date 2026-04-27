import React, { PropsWithChildren } from "react";
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { getReadableAccentColor } from "@/theme/colorUtils";
import { OfflineBanner } from "./OfflineBanner";

interface AppScreenProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  compactHeader?: boolean;
  showAppLabel?: boolean;
  showBackButton?: boolean;
}

export function AppScreen({
  title,
  subtitle,
  children,
  scroll = true,
  refreshing = false,
  onRefresh,
  compactHeader = false,
  showAppLabel = true,
  showBackButton = true,
}: AppScreenProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const navigation = useNavigation();
  const canGoBack = showBackButton && navigation.canGoBack();
  const appIconColor = getReadableAccentColor(theme.colors.primary, theme.colors.surfaceStrong, theme.colors.text);
  const content = (
    <View
      style={[
        styles.content,
        {
          width: "100%",
          maxWidth: responsive.contentMaxWidth,
          alignSelf: "center",
          paddingTop: responsive.isTablet ? 18 : 8,
          gap: responsive.isTablet ? 14 : 8,
        },
      ]}
    >
      <OfflineBanner />
      <View style={[styles.header, { paddingTop: compactHeader ? 0 : responsive.isTablet ? 10 : 2, gap: compactHeader ? 3 : 6 }]}>
        {(canGoBack || showAppLabel) && (
          <View style={styles.utilityRow}>
            {canGoBack && (
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [
                  styles.backButton,
                  {
                    backgroundColor: theme.colors.cardSoft,
                    borderColor: theme.colors.border,
                    opacity: pressed ? 0.88 : 1,
                  },
                ]}
              >
                <Ionicons name="chevron-back" size={18} color={theme.colors.primary} />
                <Text style={[styles.backLabel, { color: theme.colors.text }]}>Regresar</Text>
              </Pressable>
            )}
            {showAppLabel && (
              <View style={styles.headerTopline}>
                <View style={[styles.appDot, { backgroundColor: theme.colors.surfaceStrong }]}>
                  <Ionicons name="apps" size={15} color={appIconColor} />
                </View>
                <Text style={[styles.appLabel, { color: theme.colors.textSoft }]}>Montessori Student</Text>
              </View>
            )}
          </View>
        )}
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.title,
              fontSize: compactHeader ? (responsive.isTablet ? 24 : 21) : responsive.isTablet ? 30 : 24,
              lineHeight: compactHeader ? (responsive.isTablet ? 30 : 26) : responsive.isTablet ? 36 : 30,
            },
          ]}
        >
          {title}
        </Text>
        {!!subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textMuted,
                fontSize: compactHeader ? 13 : responsive.isTablet ? 15 : 14,
                lineHeight: compactHeader ? 18 : responsive.isTablet ? 22 : 20,
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <View style={{ gap: responsive.isTablet ? 18 : 12 }}>{children}</View>
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
      <View style={[styles.glowC, { backgroundColor: theme.colors.glowC }]} />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {
              paddingHorizontal: responsive.horizontalPadding,
              paddingBottom: responsive.isTablet ? 132 : 110,
            },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
        >
          {content}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.container,
            {
              paddingHorizontal: responsive.horizontalPadding,
              paddingBottom: responsive.isTablet ? 132 : 110,
            },
          ]}
        >
          {content}
        </View>
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
  header: {
    gap: 6,
  },
  utilityRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  headerTopline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  backLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  appDot: {
    width: 28,
    height: 28,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  appLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  glowA: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 240,
    top: 78,
    right: -40,
    opacity: 0.6,
  },
  glowB: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 260,
    left: -80,
    bottom: 70,
    opacity: 0.42,
  },
  glowC: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 180,
    top: 220,
    left: "35%",
    opacity: 0.55,
  },
});
