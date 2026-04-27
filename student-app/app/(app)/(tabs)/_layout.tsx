import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

export default function TabsLayout() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarShowLabel: true,
        tabBarBackground: () => (
          <BlurView
            intensity={85}
            tint={theme.mode === "dark" ? "dark" : "light"}
            style={{ flex: 1, borderRadius: responsive.isTablet ? 34 : 28, overflow: "hidden" }}
          />
        ),
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
          paddingHorizontal: responsive.isTablet ? 28 : 12,
          borderRadius: responsive.isTablet ? 34 : 28,
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
          borderRadius: 20,
          marginHorizontal: responsive.isTablet ? 4 : 2,
        },
        tabBarActiveBackgroundColor: theme.colors.surface,
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
          title: "Calendario",
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
