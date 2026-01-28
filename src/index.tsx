#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import { Command } from "commander";
import dotenv from "dotenv";
import * as path from "path";
import * as os from "os";
import { App } from "./App.js";
import { runInit } from "./init.js";
import { displayConfigInfo } from "./config.js";
import { HistoryViewer } from "./components/HistoryViewer.js";
import { TokenStatsViewer } from "./components/TokenStatsViewer.js";

// 加载全局和本地配置
const globalEnvPath = path.join(os.homedir(), ".aishell", ".env");
const localEnvPath = path.join(process.cwd(), ".env");

// 先加载全局配置，再加载本地配置（本地覆盖全局）
dotenv.config({ path: globalEnvPath });
dotenv.config({ path: localEnvPath });

const program = new Command();

program
  .name("aishell")
  .description(
    "AI-powered CLI tool that generates shell commands from natural language",
  )
  .version("1.0.0");

// 添加 init 命令
program
  .command("init")
  .description("交互式配置模型提供商和 API Key")
  .action(async () => {
    await runInit();
  });

// 添加 config 命令
program
  .command("config")
  .description("显示当前配置信息")
  .action(() => {
    displayConfigInfo();
  });

// 添加 history 命令
program
  .command("history")
  .description("查看历史命令记录")
  .option("-s, --search <keyword>", "搜索历史记录")
  .action((options: { search?: string }) => {
    const { waitUntilExit } = render(
      React.createElement(HistoryViewer, {
        searchKeyword: options.search,
      }),
    );

    waitUntilExit().catch(() => {
      process.exit(1);
    });
  });

// 添加 stats 命令
program
  .command("stats")
  .description("查看 AI Token 使用统计")
  .action(() => {
    const { waitUntilExit } = render(React.createElement(TokenStatsViewer));

    waitUntilExit().catch(() => {
      process.exit(1);
    });
  });

program
  .argument("[task]", "用自然语言描述你想执行的任务")
  .option("-v, --verbose", "显示命令的详细解释和参数说明")
  .option("-m, --model <type>", "选择 AI 模型 (claude, kimi, deepseek)", "auto")
  .option("-u, --human", "用 AI 总结命令输出，使其更易理解")
  .option("-e, --execute", "自动执行生成的命令（慎用）")
  .option("--list-models", "列出可用的模型")
  .action(
    (
      task: string | undefined,
      options: {
        verbose?: boolean;
        execute?: boolean;
        model?: string;
        listModels?: boolean;
        human?: boolean;
      },
    ) => {
      // 如果没有任务且不是列出模型，显示帮助
      if (!task && !options.listModels) {
        program.help();
        return;
      }

      const { waitUntilExit } = render(
        React.createElement(App, {
          task: task || "",
          verbose: options.verbose || false,
          model: options.model || "auto",
          listModels: options.listModels || false,
          human: options.human || false,
        }),
      );

      waitUntilExit().catch(() => {
        process.exit(1);
      });
    },
  );

program.parse();
