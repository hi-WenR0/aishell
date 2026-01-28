import React, { useState, useEffect } from "react";
import { Box, useApp } from "ink";
import {
  Header,
  Loading,
  CommandOutput,
  ErrorDisplay,
  ModelList,
  ConfirmPrompt,
  CommandExecutor,
} from "./components/index.js";
import {
  createProvider,
  getDefaultProvider,
  getAvailableProviders,
} from "./providers/index.js";
import type { ProviderType } from "./types/provider.js";
import type { CommandResult } from "./types/index.js";
import type { AIProvider } from "./types/provider.js";

type AppState = "loading" | "confirm" | "executing" | "done" | "error";

interface AppProps {
  task: string;
  verbose: boolean;
  model: string;
  listModels: boolean;
  human: boolean;
}

export const App: React.FC<AppProps> = ({
  task,
  verbose,
  model,
  listModels,
  human,
}) => {
  const { exit } = useApp();
  const [state, setState] = useState<AppState>("loading");
  const [result, setResult] = useState<CommandResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [providerName, setProviderName] = useState("");
  const [provider, setProvider] = useState<AIProvider | null>(null);

  useEffect(() => {
    const run = async () => {
      // 列出可用模型
      if (listModels) {
        return;
      }

      // 确定使用哪个模型
      let providerType: ProviderType;
      if (model === "auto") {
        const defaultProvider = getDefaultProvider();
        if (!defaultProvider) {
          setError(
            "未找到任何 API Key\n请在 .env 文件中设置 ANTHROPIC_API_KEY 或 KIMI_API_KEY",
          );
          setState("error");
          setTimeout(() => exit(), 100);
          return;
        }
        providerType = defaultProvider;
      } else {
        providerType = model as ProviderType;
      }

      try {
        const currentProvider = createProvider(providerType);
        setProvider(currentProvider);
        setProviderName(currentProvider.name);
        setState("loading");

        const commandResult = await currentProvider.generateCommand(
          task,
          verbose,
        );
        setResult(commandResult);
        setState("confirm");
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知错误");
        setState("error");
        setTimeout(() => exit(), 100);
      }
    };

    run();
  }, [task, verbose, model, listModels, exit]);

  const handleConfirm = () => {
    setState("executing");
  };

  const handleCancel = () => {
    exit();
  };

  // 列出可用模型模式
  if (listModels) {
    return (
      <Box flexDirection="column">
        <Header />
        <ModelList available={getAvailableProviders()} />
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Header />

      {state === "loading" && <Loading providerName={providerName} />}

      {state === "error" && error && <ErrorDisplay message={error} />}

      {(state === "confirm" || state === "executing") && result && (
        <CommandOutput
          result={result}
          verbose={verbose}
          providerName={providerName}
          showHint={false}
        />
      )}

      {state === "confirm" && (
        <ConfirmPrompt onConfirm={handleConfirm} onCancel={handleCancel} />
      )}

      {state === "executing" && result && provider && (
        <CommandExecutor
          command={result.command}
          human={human}
          provider={provider}
        />
      )}
    </Box>
  );
};
