import React from "react";
import { Box, Text } from "ink";

export const Header: React.FC = () => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text color="cyan" bold>
          ╭─────────────────────────────────╮
        </Text>
      </Box>
      <Box>
        <Text color="cyan" bold>
          │
        </Text>
        <Text color="white" bold>
          {" "}
          🚀 AIShell{" "}
        </Text>
        <Text color="gray">- AI 命令生成器 </Text>
        <Text color="cyan" bold>
          │
        </Text>
      </Box>
      <Box>
        <Text color="cyan" bold>
          ╰─────────────────────────────────╯
        </Text>
      </Box>
    </Box>
  );
};
