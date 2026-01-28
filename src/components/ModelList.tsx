import React from "react";
import { Box, Text } from "ink";
import type { ProviderType } from "../types/provider.js";

interface ModelListProps {
  available: ProviderType[];
}

export const ModelList: React.FC<ModelListProps> = ({ available }) => {
  return (
    <Box flexDirection="column" marginY={1}>
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
      >
        <Box marginBottom={1}>
          <Text color="cyan" bold>
            🤖 可用的模型
          </Text>
        </Box>
        {available.length === 0 ? (
          <Box flexDirection="column">
            <Text color="yellow">没有配置任何 API Key</Text>
            <Text color="gray" dimColor>
              请在 .env 文件中设置 ANTHROPIC_API_KEY 或 KIMI_API_KEY
            </Text>
          </Box>
        ) : (
          available.map((provider, index) => (
            <Box key={index} marginLeft={1}>
              <Text color="green">✓ </Text>
              <Text color="white" bold>
                {provider}
              </Text>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};
