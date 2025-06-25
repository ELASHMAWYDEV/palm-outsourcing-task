import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Text, styled, View } from "@tamagui/core";
import { YStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { ScrollView } from "@tamagui/scroll-view";
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CheckInData, MoodOptionId } from "@/types";
import {
  useCreateOrUpdateCheckIn,
  useGetCheckInToday,
  useGetRecentCheckIns,
} from "@/api/checkin";
import AISuggestions from "./AISuggestions";
import MoodSelector from "./MoodSelector";
import EnergyLevelSlider from "./EnergyLevelSlider";
import DailyNotesInput from "./DailyNotesInput";
import DateSelectionSheet from "./DateSelectionSheet";
import RecordDetailsSheet from "./RecordDetailsSheet";
import ErrorDialog from "./ErrorDialog";
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

  // Create check-ins map from API data
  const checkInsMap = useMemo(
    () =>
      (recentCheckIns?.checkIns || []).reduce((acc, checkIn) => {
        acc[checkIn.date] = checkIn;
        return acc;
      }, {} as { [key: string]: CheckInData }),
    [recentCheckIns]
  );

  const getCurrentDate = useMemo(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    return { day, month };
  }, []);

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

  const handleMoodSelect = useCallback((mood: MoodOptionId) => {
    setSelectedMood(mood);
  }, []);

  const handleEnergyLevelChange = useCallback((level: number) => {
    setEnergyLevel(level);
  }, []);

  const handleNoteChange = useCallback((note: string) => {
    setDailyNote(note);
  }, []);

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
              {/* Header */}
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
                isLoading={isSaving}
                suggestions={todayCheckIn?.suggestions}
              />

              {/* Energy Level Section */}
              <EnergyLevelSlider
                energyLevel={energyLevel}
                onEnergyLevelChange={handleEnergyLevelChange}
              />

              {/* Mood Selector Section */}
              <MoodSelector
                selectedMood={selectedMood}
                onMoodSelect={handleMoodSelect}
              />

              {/* Daily Notes Section */}
              <DailyNotesInput
                dailyNote={dailyNote}
                onNoteChange={handleNoteChange}
              />
            </ScrollView>

            {/* Floating Date Button */}
            <FloatingDateButton onPress={showDateBottomSheet}>
              <YStack alignItems="center" gap={2}>
                <Text
                  fontSize={28}
                  fontWeight="700"
                  color={Colors.primaryText}
                  style={{ fontFamily: "BowlbyOne_400Regular" }}
                >
                  {getCurrentDate.day}
                </Text>
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color={Colors.mutedText}
                  style={{ fontFamily: "Nunito_600SemiBold" }}
                >
                  {getCurrentDate.month}
                </Text>
              </YStack>
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
        <DateSelectionSheet
          isOpen={dateSheetOpen}
          onOpenChange={setDateSheetOpen}
          checkInsMap={checkInsMap}
          onDateSelect={showRecordBottomSheet}
        />

        {/* Record Details Sheet */}
        <RecordDetailsSheet
          isOpen={recordSheetOpen}
          onOpenChange={setRecordSheetOpen}
          selectedCheckIn={selectedCheckIn}
        />

        {/* Error Dialog */}
        <ErrorDialog
          isOpen={errorDialogOpen}
          onOpenChange={setErrorDialogOpen}
          errorMessage={errorMessage}
        />
      </View>
    </GestureHandlerRootView>
  );
}

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
