import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import Spinner from "ink-spinner";
import { spawn } from "child_process";
import type { AIProvider } from "../types/provider.js";

interface CommandExecutorProps {
  command: string;
  human?: boolean;
  provider?: AIProvider;
}

export const CommandExecutor: React.FC<CommandExecutorProps> = ({
  command,
  human = false,
  provider,
}) => {
  const { exit } = useApp();
  const [status, setStatus] = useState<
    "running" | "success" | "error" | "summarizing"
  >("running");
  const [output, setOutput] = useState<string[]>([]);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    const child = spawn("sh", ["-c", command], {
      stdio: ["inherit", "pipe", "pipe"],
      env: process.env,
    });

    const collectedOutput: string[] = [];

    const handleData = (data: Buffer) => {
      const lines = data
        .toString()
        .split("\n")
        .filter((line) => line.length > 0);
      collectedOutput.push(...lines);
      setOutput((prev) => [...prev, ...lines]);
    };

    child.stdout?.on("data", handleData);
    child.stderr?.on("data", handleData);

    child.on("close", async (code) => {
      setExitCode(code);

      // 如果启用了 human 模式且有 provider，进行 AI 总结
      if (human && provider && collectedOutput.length > 0) {
        setStatus("summarizing");
        try {
          const outputText = collectedOutput.join("\n");
          const summaryText = await provider.summarizeOutput(
            command,
            outputText,
          );
          setSummary(summaryText);
          setStatus(code === 0 ? "success" : "error");
        } catch (err) {
          // 总结失败不影响主流程
          setSummary(
            `总结失败: ${err instanceof Error ? err.message : "未知错误"}`,
          );
          setStatus(code === 0 ? "success" : "error");
        }
      } else {
        setStatus(code === 0 ? "success" : "error");
      }

      // 延迟退出让用户看到结果
      setTimeout(() => exit(), 500);
    });

    child.on("error", (err) => {
      setOutput((prev) => [...prev, `错误: ${err.message}`]);
      setStatus("error");
      setTimeout(() => exit(), 500);
    });

    return () => {
      child.kill();
    };
  }, [command, exit, human, provider]);

  return (
    <Box flexDirection="column" marginTop={1}>
      {/* 执行状态 */}
      <Box marginBottom={1}>
        {status === "running" && (
          <>
            <Text color="cyan">
              <Spinner type="dots" />
            </Text>
            <Text color="white"> 正在执行命令...</Text>
          </>
        )}
        {status === "summarizing" && (
          <>
            <Text color="magenta">
              <Spinner type="dots" />
            </Text>
            <Text color="white"> 正在用 AI 总结输出...</Text>
          </>
        )}
        {status === "success" && (
          <>
            <Text color="green">✓ </Text>
            <Text color="green" bold>
              命令执行成功
            </Text>
            <Text color="gray"> (退出码: {exitCode})</Text>
          </>
        )}
        {status === "error" && (
          <>
            <Text color="red">✗ </Text>
            <Text color="red" bold>
              命令执行失败
            </Text>
            <Text color="gray"> (退出码: {exitCode})</Text>
          </>
        )}
      </Box>

      {/* 命令输出 */}
      {output.length > 0 && (
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor={status === "error" ? "red" : "gray"}
          paddingX={2}
          paddingY={1}
        >
          <Box marginBottom={1}>
            <Text color="gray" bold>
              📤 命令输出
            </Text>
          </Box>
          {output.slice(-20).map((line, index) => (
            <Text key={index} color="white">
              {line}
            </Text>
          ))}
          {output.length > 20 && (
            <Text color="gray" dimColor>
              ... (显示最后 20 行)
            </Text>
          )}
        </Box>
      )}

      {/* AI 总结 */}
      {summary && (
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor="magenta"
          paddingX={2}
          paddingY={1}
          marginTop={1}
        >
          <Box marginBottom={1}>
            <Text color="magenta" bold>
              🤖 AI 解读
            </Text>
          </Box>
          <Text color="white">{summary}</Text>
        </Box>
      )}
    </Box>
  );
};
