import React from "react";
import { Text, styled, View } from "@tamagui/core";
import { XStack, YStack } from "@tamagui/stacks";
import { Sheet } from "@tamagui/sheet";
import { Colors } from "@/constants/Colors";
import { CheckInData } from "@/types";
import { moodOptions } from "@/constants";

interface RecordDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCheckIn: CheckInData | null;
}

export default function RecordDetailsSheet({
  isOpen,
  onOpenChange,
  selectedCheckIn,
}: RecordDetailsSheetProps) {
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
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onOpenChange}
      snapPoints={[65]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay opacity={0.2} backgroundColor={Colors.black} />
      <Sheet.Frame backgroundColor={Colors.background} borderRadius={30}>
        <Sheet.Handle
          backgroundColor={Colors.inputBorder}
          style={{
            marginTop: 15,
          }}
        />
        <SheetHeader>
          <YStack alignItems="center" gap={8}>
            <Text
              fontSize={20}
              fontWeight="700"
              color={Colors.primaryText}
              style={{ fontFamily: "BowlbyOne_400Regular" }}
            >
              Daily Check-in
            </Text>
            <Text
              fontSize={14}
              color={Colors.mutedText}
              style={{ fontFamily: "Nunito_400Regular" }}
            >
              {selectedCheckIn &&
                new Date(selectedCheckIn.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </Text>
          </YStack>
        </SheetHeader>

        <Sheet.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {selectedCheckIn && (
            <YStack gap={16} paddingHorizontal={20}>
              {/* Energy Level Card */}
              <RecordCard>
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  marginBottom={16}
                >
                  <XStack alignItems="center" gap={12}>
                    <EnergyIconContainer>
                      <Text fontSize={24}>⚡</Text>
                    </EnergyIconContainer>
                    <YStack>
                      <Text
                        fontSize={16}
                        fontWeight="700"
                        color={Colors.primaryText}
                        style={{ fontFamily: "Nunito_700Bold" }}
                      >
                        Energy Level
                      </Text>
                      <Text
                        fontSize={12}
                        color={Colors.mutedText}
                        style={{ fontFamily: "Nunito_400Regular" }}
                      >
                        How energized you felt
                      </Text>
                    </YStack>
                  </XStack>
                  <EnergyBadge>
                    <Text
                      fontSize={18}
                      fontWeight="700"
                      color={Colors.white}
                      style={{ fontFamily: "BowlbyOne_400Regular" }}
                    >
                      {selectedCheckIn.energyLevel}/10
                    </Text>
                  </EnergyBadge>
                </XStack>

                {/* Energy Level Visual */}
                <EnergyVisualContainer>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <EnergyVisualDot
                      key={level}
                      backgroundColor={
                        selectedCheckIn.energyLevel >= level
                          ? Colors.primary
                          : Colors.inputBorder
                      }
                    />
                  ))}
                </EnergyVisualContainer>
              </RecordCard>

              {/* Mood Card */}
              <RecordCard>
                <XStack alignItems="center" gap={16}>
                  <MoodIconContainer
                    backgroundColor={getMoodColor(selectedCheckIn.mood) + "20"}
                  >
                    <Text fontSize={32}>
                      {moodOptions.find((m) => m.id === selectedCheckIn.mood)
                        ?.emoji || "😊"}
                    </Text>
                  </MoodIconContainer>
                  <YStack flex={1}>
                    <Text
                      fontSize={16}
                      fontWeight="700"
                      color={Colors.primaryText}
                      marginBottom={4}
                      style={{ fontFamily: "Nunito_700Bold" }}
                    >
                      Mood
                    </Text>
                    <Text
                      fontSize={18}
                      fontWeight="600"
                      color={Colors.primaryText}
                      style={{ fontFamily: "Nunito_600SemiBold" }}
                    >
                      {moodOptions.find((m) => m.id === selectedCheckIn.mood)
                        ?.label || "Unknown"}
                    </Text>
                    <Text
                      fontSize={14}
                      color={Colors.mutedText}
                      style={{ fontFamily: "Nunito_400Regular" }}
                    >
                      {moodOptions.find((m) => m.id === selectedCheckIn.mood)
                        ?.subtitle || ""}
                    </Text>
                  </YStack>
                </XStack>
              </RecordCard>

              {/* Daily Notes Card */}
              {selectedCheckIn.dailyNote && (
                <RecordCard>
                  <XStack alignItems="flex-start" gap={16}>
                    <NotesIconContainer>
                      <Text fontSize={20}>📝</Text>
                    </NotesIconContainer>
                    <YStack flex={1}>
                      <Text
                        fontSize={16}
                        fontWeight="700"
                        color={Colors.primaryText}
                        marginBottom={8}
                        style={{ fontFamily: "Nunito_700Bold" }}
                      >
                        Daily Notes
                      </Text>
                      <NotesContent>
                        <Text
                          fontSize={14}
                          color={Colors.primaryText}
                          lineHeight={20}
                          style={{ fontFamily: "Nunito_400Regular" }}
                        >
                          {selectedCheckIn.dailyNote}
                        </Text>
                      </NotesContent>
                    </YStack>
                  </XStack>
                </RecordCard>
              )}

              {/* AI Suggestions Card */}
              {selectedCheckIn.suggestions &&
                selectedCheckIn.suggestions.length > 0 && (
                  <RecordCard>
                    <XStack alignItems="flex-start" gap={16} marginBottom={16}>
                      <AIIconContainer>
                        <Text fontSize={20}>🤖</Text>
                      </AIIconContainer>
                      <YStack flex={1}>
                        <Text
                          fontSize={16}
                          fontWeight="700"
                          color={Colors.primaryText}
                          style={{ fontFamily: "Nunito_700Bold" }}
                        >
                          AI Suggestions
                        </Text>
                        <Text
                          fontSize={12}
                          color={Colors.mutedText}
                          style={{ fontFamily: "Nunito_400Regular" }}
                        >
                          Personalized recommendations based on your mood and
                          energy
                        </Text>
                      </YStack>
                    </XStack>

                    <YStack gap={12}>
                      {selectedCheckIn.suggestions.map((suggestion, index) => (
                        <SuggestionItem key={index}>
                          <XStack alignItems="flex-start" gap={12}>
                            <SuggestionNumber>
                              <Text
                                fontSize={12}
                                fontWeight="700"
                                color={Colors.white}
                                style={{ fontFamily: "BowlbyOne_400Regular" }}
                              >
                                {index + 1}
                              </Text>
                            </SuggestionNumber>
                            <Text
                              fontSize={14}
                              color={Colors.primaryText}
                              lineHeight={20}
                              flex={1}
                              style={{ fontFamily: "Nunito_400Regular" }}
                            >
                              {suggestion}
                            </Text>
                          </XStack>
                        </SuggestionItem>
                      ))}
                    </YStack>
                  </RecordCard>
                )}

              {/* Summary Card */}
              <SummaryCard>
                <XStack alignItems="center" gap={12}>
                  <Text fontSize={24}>📊</Text>
                  <YStack flex={1}>
                    <Text
                      fontSize={16}
                      fontWeight="700"
                      color={Colors.primaryText}
                      marginBottom={4}
                      style={{ fontFamily: "Nunito_700Bold" }}
                    >
                      Daily Summary
                    </Text>
                    <Text
                      fontSize={14}
                      color={Colors.primaryText}
                      lineHeight={20}
                      style={{ fontFamily: "Nunito_400Regular" }}
                    >
                      You felt{" "}
                      <Text fontWeight="600" color={Colors.primary}>
                        {moodOptions
                          .find((m) => m.id === selectedCheckIn.mood)
                          ?.label?.toLowerCase() || "unknown"}
                      </Text>{" "}
                      with an energy level of{" "}
                      <Text fontWeight="600" color={Colors.primary}>
                        {selectedCheckIn.energyLevel}/10
                      </Text>
                      .
                    </Text>
                  </YStack>
                </XStack>
              </SummaryCard>
            </YStack>
          )}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}

const SheetHeader = styled(YStack, {
  alignItems: "center",
  paddingBottom: 24,
  paddingTop: 8,
  borderBottomWidth: 1,
  borderBottomColor: Colors.inputBorder,
  marginBottom: 20,
  paddingHorizontal: 20,
});

const RecordCard = styled(YStack, {
  backgroundColor: Colors.white,
  borderRadius: 20,
  padding: 20,
  shadowColor: "rgba(0,0,0,0.05)",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  borderWidth: 1,
  borderColor: Colors.inputBorder,
});

const EnergyIconContainer = styled(View, {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: Colors.primary + "20",
  alignItems: "center",
  justifyContent: "center",
});

const EnergyBadge = styled(View, {
  backgroundColor: Colors.primary,
  borderRadius: 20,
  paddingHorizontal: 16,
  paddingVertical: 8,
  alignItems: "center",
  justifyContent: "center",
});

const EnergyVisualContainer = styled(XStack, {
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 4,
});

const EnergyVisualDot = styled(View, {
  width: 16,
  height: 16,
  borderRadius: 8,
  marginHorizontal: 1,
});

const MoodIconContainer = styled(View, {
  width: 64,
  height: 64,
  borderRadius: 32,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 2,
  borderColor: Colors.inputBorder,
});

const NotesIconContainer = styled(View, {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: Colors.primary + "15",
  alignItems: "center",
  justifyContent: "center",
});

const NotesContent = styled(View, {
  backgroundColor: Colors.inputBackground,
  borderRadius: 12,
  padding: 16,
  borderLeftWidth: 4,
  borderLeftColor: Colors.primary,
});

const SummaryCard = styled(View, {
  backgroundColor: Colors.primary + "10",
  borderRadius: 16,
  padding: 16,
  borderWidth: 1,
  borderColor: Colors.primary + "30",
  marginTop: 8,
});

const AIIconContainer = styled(View, {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: Colors.primary + "15",
  alignItems: "center",
  justifyContent: "center",
});

const SuggestionItem = styled(View, {
  backgroundColor: Colors.inputBackground,
  borderRadius: 12,
  padding: 16,
  borderLeftWidth: 3,
  borderLeftColor: Colors.primary,
});

const SuggestionNumber = styled(View, {
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: Colors.primary,
  alignItems: "center",
  justifyContent: "center",
  minWidth: 20,
});
