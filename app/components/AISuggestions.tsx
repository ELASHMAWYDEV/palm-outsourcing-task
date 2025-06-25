import React, { useState, useEffect } from "react";
import { Animated, ViewStyle } from "react-native";
import { Text, styled, View } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

interface AISuggestionsProps {
  suggestions?: string[];
  isLoading?: boolean;
}

export default function AISuggestions({
  suggestions,
  isLoading = false,
}: AISuggestionsProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [blurAnim] = useState(new Animated.Value(10));
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    if (suggestions && suggestions.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(blurAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]).start();
      setIsBlurred(false);
    } else if (isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.6,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(blurAnim, {
          toValue: 4,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
      setIsBlurred(true);
    } else {
      // Empty state - show component with reduced opacity
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(blurAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
      setIsBlurred(false);
    }
  }, [suggestions, isLoading, fadeAnim, blurAnim]);

  const animatedStyle: ViewStyle = {
    opacity: fadeAnim,
  };

  const blurredStyle: ViewStyle = {
    opacity: isBlurred ? 0.7 : 1,
  };

  return (
    <Animated.View style={animatedStyle}>
      <SuggestionsContainer>
        <LinearGradient
          colors={[Colors.accent + "15", Colors.secondary + "15"]}
          style={{
            borderRadius: 20,
            padding: 1,
          }}
        >
          <SuggestionsCard>
            <SuggestionsHeader>
              <XStack alignItems="center" gap={8}>
                <AIIconContainer>
                  <Text fontSize={18}>🤖</Text>
                </AIIconContainer>
                <Text
                  fontSize={18}
                  fontWeight="700"
                  color={Colors.primaryText}
                  style={{ fontFamily: "BowlbyOne_400Regular" }}
                >
                  AI Suggestions
                </Text>
              </XStack>
              {isLoading && (
                <LoadingIndicator>
                  <Text
                    fontSize={12}
                    color={Colors.mutedText}
                    style={{ fontFamily: "Nunito_400Regular" }}
                  >
                    Thinking...
                  </Text>
                </LoadingIndicator>
              )}
            </SuggestionsHeader>

            <Animated.View style={blurredStyle}>
              <SuggestionsContent>
                {isLoading ? (
                  <PlaceholderContent>
                    <PlaceholderLine width="90%" />
                    <PlaceholderLine width="75%" />
                    <PlaceholderLine width="85%" />
                  </PlaceholderContent>
                ) : suggestions && suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <SuggestionItem key={index}>
                      <SuggestionIcon>
                        <Text fontSize={16}>💡</Text>
                      </SuggestionIcon>
                      <SuggestionText>
                        <Text
                          fontSize={14}
                          color={Colors.primaryText}
                          lineHeight={20}
                          style={{ fontFamily: "Nunito_400Regular" }}
                        >
                          {suggestion}
                        </Text>
                      </SuggestionText>
                    </SuggestionItem>
                  ))
                ) : (
                  <EmptyState>
                    <SuggestionIcon>
                      <Text fontSize={16}>✨</Text>
                    </SuggestionIcon>
                    <SuggestionText>
                      <Text
                        fontSize={14}
                        color={Colors.mutedText}
                        lineHeight={20}
                        style={{ fontFamily: "Nunito_400Regular" }}
                      >
                        AI suggestions will appear here based on your mood and
                        energy level once you check in.
                      </Text>
                    </SuggestionText>
                  </EmptyState>
                )}
              </SuggestionsContent>
            </Animated.View>
          </SuggestionsCard>
        </LinearGradient>
      </SuggestionsContainer>
    </Animated.View>
  );
}

const SuggestionsContainer = styled(View, {
  marginHorizontal: 20,
  marginBottom: 20,
});

const SuggestionsCard = styled(YStack, {
  backgroundColor: Colors.cardBackground,
  borderRadius: 20,
  padding: 20,
  shadowColor: "rgba(0,0,0,0.08)",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
  borderWidth: 1,
  borderColor: Colors.inputBorder + "50",
});

const SuggestionsHeader = styled(XStack, {
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
});

const AIIconContainer = styled(View, {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: Colors.accent + "20",
  alignItems: "center",
  justifyContent: "center",
});

const LoadingIndicator = styled(View, {
  backgroundColor: Colors.accent + "20",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 6,
});

const SuggestionsContent = styled(YStack, {
  gap: 12,
});

const SuggestionItem = styled(XStack, {
  alignItems: "flex-start",
  gap: 12,
  paddingVertical: 4,
});

const EmptyState = styled(XStack, {
  alignItems: "flex-start",
  gap: 12,
  paddingVertical: 8,
});

const SuggestionIcon = styled(View, {
  marginTop: 2,
});

const SuggestionText = styled(View, {
  flex: 1,
});

const PlaceholderContent = styled(YStack, {
  gap: 8,
});

const PlaceholderLine = styled(View, {
  height: 16,
  backgroundColor: Colors.inputBackground,
  borderRadius: 8,
  variants: {
    width: {
      "90%": { width: "90%" },
      "75%": { width: "75%" },
      "85%": { width: "85%" },
    },
  },
});
