import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const shortestSide = Math.min(width, height);
    const isTablet = shortestSide >= 768;
    const isLargeTablet = shortestSide >= 1024;
    const horizontalPadding = isLargeTablet ? 40 : isTablet ? 28 : 18;
    const contentMaxWidth = isLargeTablet ? 1280 : isTablet ? 1080 : 560;
    const formMaxWidth = isTablet ? 560 : 480;
    const heroColumns = isTablet ? 2 : 1;
    const metricsColumns = isLargeTablet ? 4 : isTablet ? 2 : 1;

    return {
      width,
      height,
      isTablet,
      isLargeTablet,
      horizontalPadding,
      contentMaxWidth,
      formMaxWidth,
      heroColumns,
      metricsColumns,
    };
  }, [width, height]);
}
