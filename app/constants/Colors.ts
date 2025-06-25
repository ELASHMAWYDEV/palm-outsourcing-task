/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

/**
 * Colors inspired by mood-based design patterns
 */

export const Colors = {
  // Vibrant mood colors
  colors: {
    orange: "#FF6B47", // Sad/Concerned mood
    coral: "#FF8A65",
    brown: "#8D6E63", // Neutral mood
    tan: "#A1887F",
    yellow: "#FFD54F", // Happy mood
    amber: "#FFCA28",
    green: "#81C784", // Content/Good mood
    sage: "#A5D6A7",
  },

  // Background gradients for different moods
  gradients: {
    sad: ["#FF6B47", "#FF8A65"],
    neutral: ["#8D6E63", "#A1887F"],
    happy: ["#FFD54F", "#FFCA28"],
    content: ["#81C784", "#A5D6A7"],
    calm: ["#64B5F6", "#90CAF9"],
    energetic: ["#FF7043", "#FFAB91"],
  },

  // Main app colors
  primary: "#FF6B47",
  secondary: "#81C784",
  accent: "#FFD54F",

  // Text colors
  primaryText: "#2E2E2E",
  secondaryText: "#5A5A5A",
  lightText: "#FFFFFF",
  mutedText: "#9E9E9E",

  // Background colors
  background: "#FAFAFA",
  cardBackground: "#FFFFFF",
  sectionBackground: "rgba(255,255,255,0.95)",

  // Input and form colors
  inputBackground: "#F7F7F7",
  inputBorder: "#E0E0E0",
  inputFocus: "#FF6B47",

  // Status colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",

  // Mood-specific colors (matching image inspiration)
  moods: {
    sad: {
      primary: "#FF6B47",
      secondary: "#FF8A65",
      background: ["#FF6B47", "#FF8A65"],
      text: "#FFFFFF",
    },
    neutral: {
      primary: "#8D6E63",
      secondary: "#A1887F",
      background: ["#8D6E63", "#A1887F"],
      text: "#FFFFFF",
    },
    happy: {
      primary: "#FFD54F",
      secondary: "#FFCA28",
      background: ["#FFD54F", "#FFCA28"],
      text: "#2E2E2E",
    },
    content: {
      primary: "#81C784",
      secondary: "#A5D6A7",
      background: ["#81C784", "#A5D6A7"],
      text: "#FFFFFF",
    },
  },

  // Common colors
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
};
