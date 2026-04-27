import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

type Tone = "sky" | "sun" | "mint" | "berry";

interface QuickActionTileProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone?: Tone;
  onPress: () => void;
}

const toneMap: Record<Tone, readonly [string, string]> = {
  sky: ["#DDECFF", "#F7FBFF"],
  sun: ["#FFE6B9", "#FFF8EA"],
  mint: ["#D7F6E6", "#F6FFF9"],
  berry: ["#F8D9E5", "#FFF5F8"],
};

export function QuickActionTile({ title, subtitle, icon, tone = "sky", onPress }: QuickActionTileProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }, styles.wrap]}>
      <LinearGradient
        colors={toneMap[tone]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.tile,
          {
            borderColor: theme.colors.borderStrong,
            minHeight: responsive.isTablet ? 168 : 142,
            borderRadius: responsive.isTablet ? 30 : 24,
            padding: responsive.isTablet ? 20 : 16,
          },
        ]}
      >
        <View style={[styles.iconBubble, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}>
          <Ionicons name={icon} size={responsive.isTablet ? 28 : 24} color={theme.colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  tile: {
    borderWidth: 1,
    gap: 12,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 23,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
