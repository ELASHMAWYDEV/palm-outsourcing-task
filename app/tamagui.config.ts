import { createTamagui, createTokens, createFont } from "@tamagui/core";
import { createAnimations } from "@tamagui/animations-react-native";
import { Colors } from "./constants/Colors";

// Gamified Experience Fonts
const headerFont = createFont({
  family: "BowlbyOne_400Regular, Arial, sans-serif",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 48,
    10: 64,
  },
  weight: {
    1: "400",
  },
  letterSpacing: {
    1: 0,
    2: -0.3,
    3: -0.6,
  },
});

const bodyFont = createFont({
  family: "Nunito_400Regular, Arial, sans-serif",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 48,
    10: 64,
  },
  weight: {
    1: "300",
    2: "400",
    3: "500",
    4: "600",
    5: "700",
    6: "800",
    7: "900",
  },
  letterSpacing: {
    1: 0.2,
    2: 0,
    3: -0.2,
  },
});

const animations = createAnimations({
  bouncy: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    damping: 20,
    stiffness: 60,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});

const tokens = createTokens({
  color: {
    primary: Colors.primary,
    secondary: Colors.secondary,
    accent: Colors.accent,
    primaryText: Colors.primaryText,
    secondaryText: Colors.secondaryText,
    lightText: Colors.lightText,
    mutedText: Colors.mutedText,
    white: Colors.white,
    black: Colors.black,
    background: Colors.background,
    cardBackground: Colors.cardBackground,
    sectionBackground: Colors.sectionBackground,
    inputBackground: Colors.inputBackground,
    inputBorder: Colors.inputBorder,
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    info: Colors.info,
  },
  space: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
  },
  size: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
  },
  radius: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
  },
});

const tamaguiConfig = createTamagui({
  animations,
  tokens,
  fonts: {
    header: headerFont,
    body: bodyFont,
  },
  themes: {
    light: {
      background: Colors.white,
      color: Colors.primary,
    },
  },
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}
