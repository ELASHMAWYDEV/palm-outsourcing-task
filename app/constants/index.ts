import { EnergyOption, MoodOption } from "@/types";

export const energyOptions: EnergyOption[] = [
  {
    id: "drained",
    label: "I'm Feeling Drained",
    emoji: "😩",
    subtitle: "Completely exhausted",
    value: 1,
  },
  {
    id: "tired",
    label: "I'm Feeling Tired",
    emoji: "😴",
    subtitle: "Need some rest",
    value: 3,
  },
  {
    id: "neutral",
    label: "I Feel Neutral",
    emoji: "😐",
    subtitle: "Just okay, nothing special",
    value: 5,
  },
  {
    id: "balanced",
    label: "I'm Feeling Balanced",
    emoji: "😌",
    subtitle: "Steady and comfortable",
    value: 7,
  },
  {
    id: "energized",
    label: "I'm Feeling Energized",
    emoji: "⚡",
    subtitle: "Ready to take on anything!",
    value: 10,
  },
];

export const moodOptions: MoodOption[] = [
  {
    id: "amazing",
    label: "Amazing",
    emoji: "🤩",
    subtitle: "Feeling fantastic and energetic",
  },
  {
    id: "happy",
    label: "Happy",
    emoji: "😊",
    subtitle: "In a great mood today",
  },
  {
    id: "neutral",
    label: "Neutral",
    emoji: "😐",
    subtitle: "Feeling okay, nothing special",
  },
  {
    id: "down",
    label: "Down",
    emoji: "😔",
    subtitle: "Feeling a bit low today",
  },
  {
    id: "stressed",
    label: "Stressed",
    emoji: "😰",
    subtitle: "Feeling overwhelmed or anxious",
  },
];
