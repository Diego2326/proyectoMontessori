import React, { useMemo } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BackgroundDecorShape, buildBackgroundDecorShapes } from "@/theme/backgroundDecor";
import { useAppTheme, useThemeController } from "@/theme/ThemeProvider";

interface AmbientBackdropProps {
  scrollY: Animated.Value;
}

function getShapeStyle(shape: BackgroundDecorShape): ViewStyle {
  const base: ViewStyle = {
    width: shape.size,
    height: shape.kind === "capsule" ? Math.round(shape.size * 0.52) : shape.size,
    top: shape.top,
    bottom: shape.bottom,
    left: shape.left,
    right: shape.right,
    opacity: 1,
    transform: shape.rotation ? [{ rotate: `${shape.rotation}deg` }] : undefined,
  };

  if (shape.kind === "circle") {
    return {
      ...base,
      borderRadius: shape.size,
      backgroundColor: shape.color,
    };
  }

  if (shape.kind === "ring") {
    return {
      ...base,
      borderRadius: shape.size,
      borderWidth: Math.max(8, Math.round(shape.size * 0.08)),
      borderColor: shape.color,
      backgroundColor: "transparent",
    };
  }

  if (shape.kind === "capsule") {
    return {
      ...base,
      borderRadius: shape.size,
      backgroundColor: shape.color,
    };
  }

  if (shape.kind === "rounded") {
    return {
      ...base,
      borderRadius: Math.round(shape.size * 0.26),
      backgroundColor: shape.color,
    };
  }

  if (shape.kind === "diamond") {
    return {
      ...base,
      borderRadius: Math.round(shape.size * 0.18),
      backgroundColor: shape.color,
    };
  }

  return {
    ...base,
    alignItems: "center",
    justifyContent: "center",
  };
}

function DecorShape({ shape, scrollY }: { shape: BackgroundDecorShape; scrollY: Animated.Value }) {
  const translateY = Animated.multiply(scrollY, -shape.depth);

  return (
    <Animated.View
      style={[
        styles.shape,
        getShapeStyle(shape),
        {
          transform: [
            { translateY },
            ...(shape.rotation ? [{ rotate: `${shape.rotation}deg` }] : []),
          ],
        },
      ]}
    >
      {shape.kind === "icon" && !!shape.icon && (
        <Ionicons
          name={shape.icon}
          size={shape.iconSize ?? Math.round(shape.size * 0.52)}
          color={shape.color}
          style={styles.iconShape}
        />
      )}
    </Animated.View>
  );
}

export function AmbientBackdrop({ scrollY }: AmbientBackdropProps) {
  const theme = useAppTheme();
  const { backgroundDecorId } = useThemeController();
  const shapes = useMemo(() => buildBackgroundDecorShapes(theme, backgroundDecorId), [backgroundDecorId, theme]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {shapes.map((shape, index) => (
        <DecorShape key={`${backgroundDecorId}-${index}-${shape.kind}-${shape.size}`} shape={shape} scrollY={scrollY} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  shape: {
    position: "absolute",
  },
  iconShape: {
    alignSelf: "center",
  },
});
