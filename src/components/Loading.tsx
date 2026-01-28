import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

interface LoadingProps {
  providerName: string;
}

export const Loading: React.FC<LoadingProps> = ({ providerName }) => {
  return (
    <Box marginY={1}>
      <Text color="cyan">
        <Spinner type="dots" />
      </Text>
      <Text color="white"> 正在使用 </Text>
      <Text color="cyan" bold>
        {providerName}
      </Text>
      <Text color="white"> 生成命令...</Text>
    </Box>
  );
};
