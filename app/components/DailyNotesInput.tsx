import React from "react";
import { TextInput } from "react-native";
import { Text, styled } from "@tamagui/core";
import { YStack } from "@tamagui/stacks";
import { Colors } from "@/constants/Colors";

interface DailyNotesInputProps {
  dailyNote: string;
  onNoteChange: (note: string) => void;
}

export default function DailyNotesInput({
  dailyNote,
  onNoteChange,
}: DailyNotesInputProps) {
  return (
    <SectionContainer>
      <Text
        fontSize={24}
        fontWeight="700"
        color={Colors.primaryText}
        marginBottom={16}
        letterSpacing={-0.3}
        style={{ fontFamily: "BowlbyOne_400Regular" }}
      >
        📝 Daily Notes
      </Text>

      <Text
        fontSize={14}
        color={Colors.mutedText}
        marginBottom={16}
        style={{ fontFamily: "Nunito_400Regular" }}
      >
        Share what&apos;s on your mind, any highlights, or things you&apos;re
        grateful for today.
      </Text>

      <NotesInput
        value={dailyNote}
        onChangeText={onNoteChange}
        placeholder="How was your day? What are you thinking about?"
        placeholderTextColor={Colors.mutedText}
        multiline
        textAlignVertical="top"
        style={{
          fontFamily: "Nunito_400Regular",
          fontSize: 16,
          color: Colors.primaryText,
          lineHeight: 22,
        }}
      />
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

const NotesInput = styled(TextInput, {
  backgroundColor: Colors.inputBackground,
  borderRadius: 16,
  padding: 20,
  minHeight: 120,
  borderWidth: 2,
  borderColor: Colors.inputBorder,
  textAlignVertical: "top",
});
