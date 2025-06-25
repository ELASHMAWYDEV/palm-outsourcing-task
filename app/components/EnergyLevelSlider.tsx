import React from "react";
import { Text, styled, View } from "@tamagui/core";
import { XStack, YStack } from "@tamagui/stacks";
import { Colors } from "@/constants/Colors";
import { energyOptions } from "@/constants";
import Slider from "@react-native-community/slider";

interface EnergyLevelSliderProps {
  energyLevel: number;
  onEnergyLevelChange: (value: number) => void;
}

export default function EnergyLevelSlider({
  energyLevel,
  onEnergyLevelChange,
}: EnergyLevelSliderProps) {
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

  const handleSliderChange = (value: number) => {
    const roundedValue = Math.round(value);
    onEnergyLevelChange(roundedValue);
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
                energyLevel >= level ? Colors.primary : Colors.inputBackground
              }
              borderColor={
                energyLevel >= level ? Colors.primary : Colors.inputBorder
              }
            >
              <EnergyNumber
                color={energyLevel >= level ? Colors.white : Colors.mutedText}
              >
                {level}
              </EnergyNumber>
            </EnergyDot>
          ))}
        </EnergyScale>

        {/* Interactive Slider */}
        <YStack gap={8}>
          <XStack justifyContent="space-between" paddingHorizontal={8}>
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
