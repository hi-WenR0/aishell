import React from "react";
import { Box, Text } from "ink";
import type { CommandResult, UsageItem } from "../types/index.js";

interface CommandOutputProps {
  result: CommandResult;
  verbose: boolean;
  providerName: string;
  showHint?: boolean;
}

// 将 usage 转换为字符串
function formatUsage(usage: string | UsageItem): string {
  if (typeof usage === "string") {
    return usage;
  }
  // 如果是对象，尝试提取有用的信息
  if (usage.usage) return usage.usage;
  if (usage.command)
    return `${usage.command}${usage.description ? ": " + usage.description : ""}`;
  if (usage.description) return usage.description;
  return JSON.stringify(usage);
}

export const CommandOutput: React.FC<CommandOutputProps> = ({
  result,
  verbose,
  providerName,
  showHint = true,
}) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="gray">使用 </Text>
        <Text color="cyan" bold>
          {providerName}
        </Text>
        <Text color="gray"> 生成</Text>
      </Box>

      {/* Command Box */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="green"
        paddingX={2}
        paddingY={1}
      >
        <Box marginBottom={1}>
          <Text color="green" bold>
            📋 生成的命令
          </Text>
        </Box>
        <Text color="white" bold>
          {result.command}
        </Text>
      </Box>

      {/* Verbose Output */}
      {verbose && result.explanation && (
        <Box flexDirection="column" marginTop={1}>
          {/* Description */}
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="yellow"
            paddingX={2}
            paddingY={1}
            marginBottom={1}
          >
            <Box marginBottom={1}>
              <Text color="yellow" bold>
                💡 命令说明
              </Text>
            </Box>
            <Text>{result.explanation.description}</Text>
          </Box>

          {/* Parameters */}
          {result.explanation.parameters &&
            result.explanation.parameters.length > 0 && (
              <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="blue"
                paddingX={2}
                paddingY={1}
                marginBottom={1}
              >
                <Box marginBottom={1}>
                  <Text color="blue" bold>
                    🔧 参数解释
                  </Text>
                </Box>
                {result.explanation.parameters.map((param, index) => (
                  <Box key={index} marginLeft={1}>
                    <Text color="cyan">{param.param}</Text>
                    <Text color="gray"> — </Text>
                    <Text>{param.description}</Text>
                  </Box>
                ))}
              </Box>
            )}

          {/* Common Usages */}
          {result.explanation.commonUsages &&
            result.explanation.commonUsages.length > 0 && (
              <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="magenta"
                paddingX={2}
                paddingY={1}
              >
                <Box marginBottom={1}>
                  <Text color="magenta" bold>
                    📚 常用用法
                  </Text>
                </Box>
                {result.explanation.commonUsages.map((usage, index) => (
                  <Box key={index} marginLeft={1}>
                    <Text color="gray">{index + 1}. </Text>
                    <Text>{formatUsage(usage)}</Text>
                  </Box>
                ))}
              </Box>
            )}
        </Box>
      )}

      {/* Footer hint */}
      {showHint && (
        <Box marginTop={1}>
          <Text color="gray" dimColor>
            提示: 复制上面的命令到终端执行
          </Text>
        </Box>
      )}
    </Box>
  );
};
