import React from "react";
import { Text, styled, View } from "@tamagui/core";
import { XStack, YStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Colors } from "@/constants/Colors";
import { moodOptions } from "@/constants";
import { MoodOptionId } from "@/types";

interface MoodSelectorProps {
  selectedMood: string;
  onMoodSelect: (mood: MoodOptionId) => void;
}

export default function MoodSelector({
  selectedMood,
  onMoodSelect,
}: MoodSelectorProps) {
  const getCurrentMoodOption = () => {
    return moodOptions.find((option) => option.id === selectedMood) || null;
  };

  const getMoodColor = (moodId: string) => {
    const colors = {
      amazing: Colors.colors.green,
      happy: Colors.colors.yellow,
      neutral: Colors.colors.brown,
      down: Colors.colors.orange,
      stressed: "#E57373",
    };
    return colors[moodId as keyof typeof colors] || Colors.inputBorder;
  };

  return (
    <SectionContainer>
      <Text
        fontSize={24}
        fontWeight="700"
        color={Colors.primaryText}
        marginBottom={8}
        letterSpacing={-0.3}
        style={{ fontFamily: "BowlbyOne_400Regular" }}
      >
        😊 How&apos;s Your Mood?
      </Text>

      <MoodContainer>
        {/* Current Mood Display */}
        {getCurrentMoodOption() ? (
          <CurrentMoodDisplay>
            <Text fontSize={56}>{getCurrentMoodOption()!.emoji}</Text>
            <Text
              fontSize={20}
              fontWeight="700"
              color={Colors.primaryText}
              textAlign="center"
              style={{ fontFamily: "Nunito_700Bold" }}
            >
              {getCurrentMoodOption()!.label}
            </Text>
            <Text
              fontSize={14}
              color={Colors.mutedText}
              textAlign="center"
              opacity={0.8}
              style={{ fontFamily: "Nunito_400Regular" }}
            >
              {getCurrentMoodOption()!.subtitle}
            </Text>
          </CurrentMoodDisplay>
        ) : (
          <CurrentMoodDisplay>
            <Text fontSize={56}>🤔</Text>
            <Text
              fontSize={20}
              fontWeight="700"
              color={Colors.primaryText}
              textAlign="center"
              style={{ fontFamily: "Nunito_700Bold" }}
            >
              How are you feeling?
            </Text>
            <Text
              fontSize={14}
              color={Colors.mutedText}
              textAlign="center"
              opacity={0.8}
              style={{ fontFamily: "Nunito_400Regular" }}
            >
              Tap an emoji below to select your mood
            </Text>
          </CurrentMoodDisplay>
        )}

        {/* Mood Selector */}
        <MoodSelectorContainer>
          {moodOptions.map((option) => (
            <MoodOptionButton
              key={option.id}
              onPress={() => onMoodSelect(option.id)}
              backgroundColor={
                selectedMood === option.id
                  ? getMoodColor(option.id) + "20"
                  : "transparent"
              }
              borderColor={
                selectedMood === option.id
                  ? getMoodColor(option.id)
                  : Colors.inputBorder
              }
              transform={
                selectedMood === option.id ? [{ scale: 1.1 }] : [{ scale: 1 }]
              }
            >
              <MoodEmoji>{option.emoji}</MoodEmoji>
            </MoodOptionButton>
          ))}
        </MoodSelectorContainer>

        {/* Mood Labels */}
        <XStack justifyContent="space-between" paddingHorizontal={6} flex={1}>
          <Text
            fontSize={8}
            color={Colors.mutedText}
            textAlign="center"
            flex={1}
            maxWidth={60}
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Amazing
          </Text>
          <Text
            fontSize={8}
            color={Colors.mutedText}
            textAlign="center"
            flex={1}
            maxWidth={60}
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Happy
          </Text>
          <Text
            fontSize={8}
            color={Colors.mutedText}
            textAlign="center"
            flex={1}
            maxWidth={60}
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Neutral
          </Text>
          <Text
            fontSize={8}
            color={Colors.mutedText}
            textAlign="center"
            flex={1}
            maxWidth={60}
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Down
          </Text>
          <Text
            fontSize={8}
            color={Colors.mutedText}
            textAlign="center"
            flex={1}
            maxWidth={60}
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Stressed
          </Text>
        </XStack>
      </MoodContainer>
    </SectionContainer>
  );
}

const SectionContainer = styled(YStack, {
  marginHorizontal: 20,
  marginBottom: 32,
  backgroundColor: Colors.sectionBackground,
  borderRadius: 24,
  padding: 24,
  shadowColor: "rgba(0,0,0,0.1)",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 12,
});

const MoodContainer = styled(YStack, {
  gap: 5,
  paddingVertical: 8,
});

const MoodSelectorContainer = styled(XStack, {
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 20,
  paddingHorizontal: 16,
  backgroundColor: Colors.inputBackground,
  borderRadius: 20,
  flex: 1,
});

const MoodOptionButton = styled(Button, {
  flex: 1,
  maxWidth: 40,
  height: 40,
  borderRadius: 30,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 3,
  borderColor: "transparent",
  backgroundColor: "transparent",
  marginHorizontal: 2,
});

const MoodEmoji = styled(Text, {
  fontSize: 18,
});

const CurrentMoodDisplay = styled(YStack, {
  alignItems: "center",
  gap: 8,
  paddingVertical: 16,
});
