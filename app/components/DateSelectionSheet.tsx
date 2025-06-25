import React, { useMemo } from "react";
import { Text, styled, View } from "@tamagui/core";
import { XStack, YStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Sheet } from "@tamagui/sheet";
import { Colors } from "@/constants/Colors";
import { CheckInData } from "@/types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

interface DateSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  checkInsMap: { [key: string]: CheckInData };
  onDateSelect: (date: string) => void;
}

export default function DateSelectionSheet({
  isOpen,
  onOpenChange,
  checkInsMap,
  onDateSelect,
}: DateSelectionSheetProps) {
  // Generate dates for the wheel (last 10 days)
  const dates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push({
        full: date.toISOString(),
        day: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    return dates;
  }, []);

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onOpenChange}
      snapPoints={[45]}
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
              Select Date
            </Text>
            <Text
              fontSize={14}
              color={Colors.mutedText}
              style={{ fontFamily: "Nunito_400Regular" }}
            >
              Tap a date to view your check-in record
            </Text>
          </YStack>
        </SheetHeader>

        <Sheet.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
            gap: 12,
          }}
        >
          <XStack gap={12}>
            {dates.map((date) => {
              const hasData = Object.keys(checkInsMap).find((checkInDate) =>
                dayjs(checkInDate)
                  .tz("Africa/Cairo")
                  .isSame(dayjs(date.full), "day")
              );
              return (
                <DateCard
                  key={date.full}
                  onPress={() => (hasData ? onDateSelect(date.full) : null)}
                  disabled={!hasData}
                  style={{
                    backgroundColor: hasData
                      ? Colors.primary + "10"
                      : Colors.inputBackground,
                    borderColor: hasData ? Colors.primary : Colors.inputBorder,
                    opacity: hasData ? 1 : 0.6,
                    shadowColor: hasData
                      ? Colors.primary + "30"
                      : "rgba(0,0,0,0.05)",
                  }}
                >
                  <YStack alignItems="center" gap={4}>
                    <Text
                      fontSize={12}
                      fontWeight="600"
                      color={hasData ? Colors.primary : Colors.mutedText}
                      style={{ fontFamily: "Nunito_600SemiBold" }}
                    >
                      {date.weekday.toUpperCase()}
                    </Text>
                    <Text
                      fontSize={22}
                      fontWeight="700"
                      color={hasData ? Colors.primaryText : Colors.mutedText}
                      style={{ fontFamily: "BowlbyOne_400Regular" }}
                    >
                      {date.day}
                    </Text>
                    <Text
                      fontSize={11}
                      fontWeight="500"
                      color={Colors.mutedText}
                      style={{ fontFamily: "Nunito_500Medium" }}
                    >
                      {date.month.toUpperCase()}
                    </Text>
                    {hasData && (
                      <StatusIndicator>
                        <Text fontSize={8}>✓</Text>
                      </StatusIndicator>
                    )}
                  </YStack>
                </DateCard>
              );
            })}
          </XStack>
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

const DateCard = styled(Button, {
  backgroundColor: Colors.white,
  borderRadius: 20,
  paddingHorizontal: 20,
  paddingVertical: 20,
  shadowColor: "rgba(0,0,0,0.05)",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  borderWidth: 2,
  borderColor: Colors.inputBorder,
  minWidth: 90,
  alignItems: "center",
  justifyContent: "center",
});

const StatusIndicator = styled(View, {
  width: 18,
  height: 18,
  borderRadius: 9,
  backgroundColor: Colors.primary,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 4,
});
