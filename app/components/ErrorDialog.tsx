import React from "react";
import { Text } from "@tamagui/core";
import { XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { AlertDialog } from "@tamagui/alert-dialog";
import { Colors } from "@/constants/Colors";

interface ErrorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string;
}

export default function ErrorDialog({
  isOpen,
  onOpenChange,
  errorMessage,
}: ErrorDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}
