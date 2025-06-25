import { Link, Stack as ExpoStack } from "expo-router";
import { Stack, Text, styled } from "@tamagui/core";
import { Colors } from "@/constants/Colors";

const YStack = styled(Stack, {
  flexDirection: "column",
});

const StyledLink = styled(Link, {
  marginTop: 15,
  paddingVertical: 15,
});

export default function NotFoundScreen() {
  return (
    <>
      <ExpoStack.Screen options={{ title: "Oops!" }} />
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding={20}
        backgroundColor={Colors.white}
      >
        <Text fontSize={18} color={Colors.primaryText} marginBottom={10}>
          This screen does not exist.
        </Text>
        <StyledLink href="../">
          <Text
            fontSize={16}
            color={Colors.primary}
            textDecorationLine="underline"
          >
            Go to home screen!
          </Text>
        </StyledLink>
      </YStack>
    </>
  );
}
