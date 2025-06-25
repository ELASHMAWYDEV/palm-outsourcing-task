import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Text, styled, View } from "@tamagui/core";
import { XStack, YStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { ScrollView } from "@tamagui/scroll-view";
import { Sheet } from "@tamagui/sheet";
import { AlertDialog } from "@tamagui/alert-dialog";
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import { energyOptions, moodOptions } from "@/constants";
import { CheckInData, MoodOptionId } from "@/types";
import {
  useCreateOrUpdateCheckIn,
  useGetCheckInToday,
  useGetRecentCheckIns,
} from "@/api/checkin";
import AISuggestions from "./AISuggestions";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export default function HealthCheckIn() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [dailyNote, setDailyNote] = useState<string>("");
  const [energyLevel, setEnergyLevel] = useState<number>(1);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckInData | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Sheet states
  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [recordSheetOpen, setRecordSheetOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  // Debounce ref
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // API hooks
  const { data: todayCheckIn } = useGetCheckInToday();
  const { data: recentCheckIns, refetch: refetchRecentCheckIns } =
    useGetRecentCheckIns(10);
  const { mutate: saveCheckIn, error: saveError } = useCreateOrUpdateCheckIn();

  // Initialize form with today's check-in data
  useEffect(() => {
    if (todayCheckIn) {
      setSelectedMood(todayCheckIn.mood);
      setDailyNote(todayCheckIn.dailyNote);
      setEnergyLevel(todayCheckIn.energyLevel);
    }
  }, [todayCheckIn]);

  // Handle save errors
  useEffect(() => {
    if (saveError) {
      setErrorMessage(
        saveError.message || "Failed to save check-in. Please try again."
      );
      setErrorDialogOpen(true);
      setIsSaving(false);
    }
  }, [saveError]);

  // Debounced save function
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      saveCheckIn(
        {
          mood: selectedMood as MoodOptionId,
          dailyNote: dailyNote,
          energyLevel: energyLevel,
        },
        {
          onSuccess: () => {
            setTimeout(() => {
              setIsSaving(false);
            }, 1500);
          },
          onError: () => {
            setIsSaving(false);
          },
        }
      );
    }, 3000);
  }, [selectedMood, dailyNote, energyLevel, saveCheckIn]);

  // Trigger save when form changes
  useEffect(() => {
    if (
      selectedMood !== todayCheckIn?.mood ||
      dailyNote !== todayCheckIn?.dailyNote ||
      energyLevel !== todayCheckIn?.energyLevel
    ) {
      debouncedSave();
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [selectedMood, dailyNote, energyLevel, debouncedSave, todayCheckIn]);

  // Generate dates for the wheel (last 10 days)
  const generateDates = () => {
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
  };

  const dates = useMemo(() => generateDates(), []);

  // Create check-ins map from API data
  const checkInsMap = (recentCheckIns?.checkIns || []).reduce(
    (acc, checkIn) => {
      acc[checkIn.date] = checkIn;
      return acc;
    },
    {} as { [key: string]: CheckInData }
  );

  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    return { day, month };
  };

  const { day, month } = useMemo(() => getCurrentDate(), []);

  const showDateBottomSheet = useCallback(() => {
    refetchRecentCheckIns().catch((err) => {
      console.error(err);
    });
    setDateSheetOpen(true);
  }, [refetchRecentCheckIns]);

  const showRecordBottomSheet = useCallback(
    (date: string) => {
      setSelectedCheckIn(
        Object.values(checkInsMap).find((checkIn) =>
          dayjs(checkIn.date).tz("Africa/Cairo").isSame(dayjs(date), "day")
        ) || null
      );
      setDateSheetOpen(false);
      setTimeout(() => {
        setRecordSheetOpen(true);
      }, 300);
    },
    [checkInsMap]
  );

  // Slider change handler
  const handleSliderChange = (value: number) => {
    const roundedValue = Math.round(value);
    setEnergyLevel(roundedValue);
  };

  const getCurrentEnergyOption = () => {
    return (
      energyOptions.find((option) => {
        if (energyLevel <= 2) return option.value === 1;
        if (energyLevel <= 4) return option.value === 3;
        if (energyLevel <= 6) return option.value === 5;
        if (energyLevel <= 8) return option.value === 7;
        return option.value === 10;
      }) || energyOptions[2]
    );
  };

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <LinearGradient
            colors={[Colors.secondary, "#A5D6A7"]}
            style={{ flex: 1 }}
          >
            <ScrollView
              flex={1}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              {/* Minimal Header */}
              <YStack
                alignItems="center"
                paddingTop={70}
                paddingBottom={40}
                gap={6}
              >
                <Text
                  fontSize={32}
                  fontWeight="700"
                  textAlign="center"
                  color="white"
                  lineHeight={38}
                  letterSpacing={-0.6}
                  style={{ fontFamily: "BowlbyOne_400Regular" }}
                >
                  How are you today?
                </Text>
              </YStack>

              {/* AI Suggestions Section */}
              <AISuggestions
                suggestions={todayCheckIn?.suggestions}
                isLoading={isSaving}
              />

              {/* Energy Level Section */}
              <SectionContainer>
                <Text
                  fontSize={24}
                  fontWeight="700"
                  color={Colors.primaryText}
                  marginBottom={8}
                  letterSpacing={-0.3}
                  style={{ fontFamily: "BowlbyOne_400Regular" }}
                >
                  ⚡ Energy Level
                </Text>

                <EnergyLevelContainer>
                  {/* Current Energy Display */}
                  <YStack alignItems="center" gap={8}>
                    <Text fontSize={48}>{getCurrentEnergyOption().emoji}</Text>
                    <Text
                      fontSize={16}
                      fontWeight="600"
                      color={Colors.primaryText}
                      textAlign="center"
                      marginBottom={8}
                      style={{ fontFamily: "Nunito_600SemiBold" }}
                    >
                      {getCurrentEnergyOption().label}
                    </Text>
                    <Text
                      fontSize={14}
                      color={Colors.mutedText}
                      textAlign="center"
                      opacity={0.8}
                      style={{ fontFamily: "Nunito_400Regular" }}
                    >
                      {getCurrentEnergyOption().subtitle}
                    </Text>
                  </YStack>

                  {/* Energy Scale */}
                  <EnergyScale>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <EnergyDot
                        key={level}
                        backgroundColor={
                          energyLevel >= level
                            ? Colors.primary
                            : Colors.inputBackground
                        }
                        borderColor={
                          energyLevel >= level
                            ? Colors.primary
                            : Colors.inputBorder
                        }
                      >
                        <EnergyNumber
                          color={
                            energyLevel >= level
                              ? Colors.white
                              : Colors.mutedText
                          }
                        >
                          {level}
                        </EnergyNumber>
                      </EnergyDot>
                    ))}
                  </EnergyScale>

                  {/* Interactive Slider */}
                  <YStack gap={8}>
                    <XStack
                      justifyContent="space-between"
                      paddingHorizontal={8}
                    >
                      <Text
                        fontSize={12}
                        color={Colors.mutedText}
                        style={{ fontFamily: "Nunito_400Regular" }}
                      >
                        Low Energy
                      </Text>
                      <Text
                        fontSize={14}
                        fontWeight="700"
                        color={Colors.primary}
                        style={{ fontFamily: "BowlbyOne_400Regular" }}
                      >
                        {energyLevel}/10
                      </Text>
                      <Text
                        fontSize={12}
                        color={Colors.mutedText}
                        style={{ fontFamily: "Nunito_400Regular" }}
                      >
                        High Energy
                      </Text>
                    </XStack>
                    <Slider
                      style={{
                        width: "100%",
                        height: 40,
                      }}
                      value={energyLevel}
                      onValueChange={handleSliderChange}
                      minimumValue={1}
                      maximumValue={10}
                      step={1}
                      minimumTrackTintColor={Colors.primary}
                      maximumTrackTintColor={Colors.inputBorder}
                      thumbTintColor={Colors.primary}
                    />
                  </YStack>
                </EnergyLevelContainer>
              </SectionContainer>

              {/* Mood Checker Section */}
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
                  <MoodSelector>
                    {moodOptions.map((option) => (
                      <MoodOptionButton
                        key={option.id}
                        onPress={() => setSelectedMood(option.id)}
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
                          selectedMood === option.id
                            ? [{ scale: 1.1 }]
                            : [{ scale: 1 }]
                        }
                      >
                        <MoodEmoji>{option.emoji}</MoodEmoji>
                      </MoodOptionButton>
                    ))}
                  </MoodSelector>

                  {/* Mood Labels */}
                  <XStack
                    justifyContent="space-between"
                    paddingHorizontal={6}
                    flex={1}
                  >
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

              {/* Notes Section */}
              <SectionContainer>
                <Text
                  fontSize={24}
                  fontWeight="700"
                  color={Colors.primaryText}
                  marginBottom={8}
                  letterSpacing={-0.3}
                  style={{ fontFamily: "BowlbyOne_400Regular" }}
                >
                  💭 Notes
                </Text>

                <NotesInput
                  placeholder="How are you feeling today?"
                  value={dailyNote}
                  onChangeText={setDailyNote}
                  multiline
                  maxLength={500}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  style={{
                    fontSize: 16,
                    fontFamily: "Nunito_400Regular",
                  }}
                />

                <XStack
                  justifyContent="flex-end"
                  alignItems="center"
                  marginTop={12}
                >
                  <Text
                    fontSize={12}
                    color={Colors.mutedText}
                    opacity={0.7}
                    style={{ fontFamily: "Nunito_400Regular" }}
                  >
                    {dailyNote?.length}/500
                  </Text>
                </XStack>
              </SectionContainer>
            </ScrollView>

            {/* Floating Date Button */}
            <FloatingDateButton onPress={showDateBottomSheet}>
              <Text
                fontSize={28}
                fontWeight="800"
                color={Colors.primaryText}
                letterSpacing={-0.5}
                style={{ fontFamily: "BowlbyOne_400Regular" }}
              >
                {day}
              </Text>
              <Text
                fontSize={14}
                fontWeight="600"
                color={Colors.mutedText}
                marginTop={2}
                letterSpacing={0.5}
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                {month}
              </Text>
            </FloatingDateButton>

            {/* Saving Indicator */}
            {isSaving && (
              <SavingIndicator>
                <Text
                  fontSize={14}
                  fontWeight="600"
                  color={Colors.primary}
                  style={{ fontFamily: "Nunito_600SemiBold" }}
                >
                  Saving...
                </Text>
              </SavingIndicator>
            )}
          </LinearGradient>
        </KeyboardAvoidingView>

        {/* Date Selection Sheet */}
        <Sheet
          modal
          open={dateSheetOpen}
          onOpenChange={setDateSheetOpen}
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
                      onPress={() =>
                        hasData ? showRecordBottomSheet(date.full) : null
                      }
                      disabled={!hasData}
                      style={{
                        backgroundColor: hasData
                          ? Colors.primary + "10"
                          : Colors.inputBackground,
                        borderColor: hasData
                          ? Colors.primary
                          : Colors.inputBorder,
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
                          color={
                            hasData ? Colors.primaryText : Colors.mutedText
                          }
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

        {/* Record Details Sheet */}
        <Sheet
          modal
          open={recordSheetOpen}
          onOpenChange={setRecordSheetOpen}
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
                        backgroundColor={
                          getMoodColor(selectedCheckIn.mood) + "20"
                        }
                      >
                        <Text fontSize={32}>
                          {moodOptions.find(
                            (m) => m.id === selectedCheckIn.mood
                          )?.emoji || "😊"}
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
                          color={getMoodColor(selectedCheckIn.mood)}
                          marginBottom={2}
                          style={{ fontFamily: "Nunito_600SemiBold" }}
                        >
                          {selectedCheckIn.mood.charAt(0).toUpperCase() +
                            selectedCheckIn.mood.slice(1)}
                        </Text>
                        <Text
                          fontSize={12}
                          color={Colors.mutedText}
                          style={{ fontFamily: "Nunito_400Regular" }}
                        >
                          {moodOptions.find(
                            (m) => m.id === selectedCheckIn.mood
                          )?.subtitle || "Your emotional state"}
                        </Text>
                      </YStack>
                    </XStack>
                  </RecordCard>

                  {/* Notes Card */}
                  <RecordCard>
                    <XStack alignItems="flex-start" gap={12} marginBottom={12}>
                      <NotesIconContainer>
                        <Text fontSize={20}>💭</Text>
                      </NotesIconContainer>
                      <YStack flex={1}>
                        <Text
                          fontSize={16}
                          fontWeight="700"
                          color={Colors.primaryText}
                          marginBottom={4}
                          style={{ fontFamily: "Nunito_700Bold" }}
                        >
                          Daily Notes
                        </Text>
                        <Text
                          fontSize={12}
                          color={Colors.mutedText}
                          marginBottom={8}
                          style={{ fontFamily: "Nunito_400Regular" }}
                        >
                          Your thoughts and reflections
                        </Text>
                      </YStack>
                    </XStack>

                    <NotesContent>
                      {selectedCheckIn.dailyNote ? (
                        <Text
                          fontSize={14}
                          color={Colors.primaryText}
                          lineHeight={20}
                          style={{ fontFamily: "Nunito_400Regular" }}
                        >
                          &ldquo;{selectedCheckIn.dailyNote}&rdquo;
                        </Text>
                      ) : (
                        <Text
                          fontSize={14}
                          color={Colors.mutedText}
                          fontStyle="italic"
                          style={{ fontFamily: "Nunito_400Regular" }}
                        >
                          No notes were added for this day
                        </Text>
                      )}
                    </NotesContent>
                  </RecordCard>

                  {/* AI Suggestions Card */}
                  {selectedCheckIn.suggestions &&
                    selectedCheckIn.suggestions.length > 0 && (
                      <RecordCard>
                        <XStack
                          alignItems="flex-start"
                          gap={12}
                          marginBottom={12}
                        >
                          <AIIconContainer>
                            <Text fontSize={20}>🤖</Text>
                          </AIIconContainer>
                          <YStack flex={1}>
                            <Text
                              fontSize={16}
                              fontWeight="700"
                              color={Colors.primaryText}
                              marginBottom={4}
                              style={{ fontFamily: "Nunito_700Bold" }}
                            >
                              AI Suggestions
                            </Text>
                            <Text
                              fontSize={12}
                              color={Colors.mutedText}
                              marginBottom={8}
                              style={{ fontFamily: "Nunito_400Regular" }}
                            >
                              Personalized recommendations based on your mood
                              and energy
                            </Text>
                          </YStack>
                        </XStack>

                        <YStack gap={8}>
                          {selectedCheckIn.suggestions.map(
                            (suggestion, index) => (
                              <SuggestionItem key={index}>
                                <XStack alignItems="flex-start" gap={12}>
                                  <SuggestionNumber>
                                    <Text
                                      fontSize={12}
                                      fontWeight="700"
                                      color={Colors.white}
                                      style={{ fontFamily: "Nunito_700Bold" }}
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
                            )
                          )}
                        </YStack>
                      </RecordCard>
                    )}

                  {/* Summary Card */}
                  <SummaryCard>
                    <XStack alignItems="center" justifyContent="center" gap={8}>
                      <Text fontSize={16}>✨</Text>
                      <Text
                        fontSize={14}
                        fontWeight="600"
                        color={Colors.primaryText}
                        textAlign="center"
                        style={{ fontFamily: "Nunito_600SemiBold" }}
                      >
                        You had a {selectedCheckIn.mood} day with{" "}
                        {selectedCheckIn.energyLevel}/10 energy
                      </Text>
                    </XStack>
                  </SummaryCard>
                </YStack>
              )}
            </Sheet.ScrollView>
          </Sheet.Frame>
        </Sheet>

        {/* Error Dialog */}
        <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay opacity={0.5} backgroundColor={Colors.black} />
            <AlertDialog.Content
              backgroundColor={Colors.background}
              borderRadius={16}
              padding={24}
              maxWidth={400}
              width="90%"
            >
              <AlertDialog.Title
                fontSize={18}
                fontWeight="700"
                color={Colors.primaryText}
                marginBottom={8}
              >
                Oops! Something went wrong
              </AlertDialog.Title>
              <AlertDialog.Description
                fontSize={14}
                color={Colors.secondaryText}
                marginBottom={20}
              >
                {errorMessage}
              </AlertDialog.Description>
              <XStack justifyContent="flex-end" gap={12}>
                <AlertDialog.Cancel asChild>
                  <Button
                    backgroundColor={Colors.inputBackground}
                    color={Colors.primaryText}
                    borderRadius={12}
                    paddingHorizontal={16}
                    paddingVertical={8}
                  >
                    Try Again
                  </Button>
                </AlertDialog.Cancel>
              </XStack>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog>
      </View>
    </GestureHandlerRootView>
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

const FloatingDateButton = styled(Button, {
  position: "absolute",
  bottom: 30,
  alignSelf: "center",
  backgroundColor: Colors.white,
  borderRadius: 25,
  paddingVertical: 16,
  paddingHorizontal: 24,
  shadowColor: "rgba(0,0,0,0.05)",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.15,
  shadowRadius: 15,
  alignItems: "center",
  justifyContent: "center",
  minWidth: 100,
});

const EnergyLevelContainer = styled(YStack, {
  marginVertical: 20,
  paddingHorizontal: 16,
  gap: 16,
});

const EnergyScale = styled(XStack, {
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 16,
  paddingHorizontal: 8,
  backgroundColor: Colors.inputBackground,
  borderRadius: 20,
  marginBottom: 16,
});

const EnergyDot = styled(View, {
  width: 24,
  height: 24,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 2,
});

const EnergyNumber = styled(Text, {
  fontSize: 12,
  fontWeight: "700",
});

const MoodContainer = styled(YStack, {
  gap: 5,
  paddingVertical: 8,
});

const MoodSelector = styled(XStack, {
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

const SavingIndicator = styled(View, {
  position: "absolute",
  top: 90,
  alignSelf: "center",
  backgroundColor: Colors.white,
  borderRadius: 25,
  paddingVertical: 16,
  paddingHorizontal: 24,
  shadowColor: "rgba(0,0,0,0.05)",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.15,
  shadowRadius: 15,
  alignItems: "center",
  justifyContent: "center",
  minWidth: 100,
});

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
