import React from "react";
import { Box, Text } from "ink";

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="red"
      paddingX={2}
      paddingY={1}
      marginY={1}
    >
      <Box marginBottom={1}>
        <Text color="red" bold>
          ❌ 错误
        </Text>
      </Box>
      <Text color="white">{message}</Text>
    </Box>
  );
};
