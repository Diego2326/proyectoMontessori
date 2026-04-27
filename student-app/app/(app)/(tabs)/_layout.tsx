import React from "react";
import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

function TabBarGlass() {
  const theme = useAppTheme();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <BlurView intensity={80} tint={theme.mode === "dark" ? "dark" : "light"} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={
          theme.mode === "dark"
            ? ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.03)"]
            : ["rgba(255,255,255,0.7)", "rgba(255,255,255,0.24)"]
        }
        start={{ x: 0.12, y: 0 }}
        end={{ x: 0.88, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export default function TabsLayout() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const itemRadius = responsive.isTablet ? 24 : 20;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarShowLabel: true,
        tabBarBackground: () => <TabBarGlass />,
        tabBarStyle: {
          position: "absolute",
          left: responsive.isTablet ? 26 : 16,
          right: responsive.isTablet ? 26 : 16,
          bottom: responsive.isTablet ? 18 : 12,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderColor: theme.colors.borderStrong,
          borderWidth: 1,
          height: responsive.isTablet ? 88 : 72,
          paddingTop: responsive.isTablet ? 12 : 8,
          paddingBottom: responsive.isTablet ? 10 : 8,
          paddingHorizontal: responsive.isTablet ? 24 : 10,
          borderRadius: responsive.isTablet ? 34 : 28,
          overflow: "hidden",
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: responsive.isTablet ? 13 : 11,
          fontWeight: "700",
        },
        tabBarItemStyle: {
          borderRadius: itemRadius,
          marginHorizontal: 3,
          marginVertical: 3,
        },
        tabBarActiveBackgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.58)",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Para ti",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Cursos",
          tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Avisos",
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
