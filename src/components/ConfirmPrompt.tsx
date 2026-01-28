import React from "react";
import { Box, Text, useInput } from "ink";

interface ConfirmPromptProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmPrompt: React.FC<ConfirmPromptProps> = ({
  onConfirm,
  onCancel,
}) => {
  useInput(
    (input, key) => {
      if (key.return) {
        onConfirm();
      } else if (key.escape || input === "q" || input === "n") {
        onCancel();
      }
    },
    { isActive: true },
  );

  return (
    <Box marginTop={1} flexDirection="column">
      <Box borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1}>
        <Text color="cyan">⏎ </Text>
        <Text color="white">按 </Text>
        <Text color="green" bold>
          Enter
        </Text>
        <Text color="white"> 执行命令，按 </Text>
        <Text color="yellow" bold>
          q/n/Esc
        </Text>
        <Text color="white"> 退出</Text>
      </Box>
    </Box>
  );
};
