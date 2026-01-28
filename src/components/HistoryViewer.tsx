/**
 * 历史记录交互式 TUI 组件
 */

import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useApp } from "ink";
import {
  getHistoryItems,
  searchHistory,
  clearHistory,
  getHistoryStats,
  deleteHistoryItem,
} from "../history.js";
import type { HistoryItem } from "../types/history.js";

interface HistoryViewerProps {
  searchKeyword?: string;
}

export const HistoryViewer: React.FC<HistoryViewerProps> = ({
  searchKeyword,
}) => {
  const { exit } = useApp();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<
    "list" | "detail" | "stats" | "confirmClear"
  >("list");
  const [message, setMessage] = useState<string | null>(null);

  // 每页显示的数量
  const pageSize = 10;
  const [page, setPage] = useState(0);

  useEffect(() => {
    const data = searchKeyword
      ? searchHistory(searchKeyword)
      : getHistoryItems();
    setItems(data);
  }, [searchKeyword]);

  // 当前页的项目
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / pageSize);

  // 当前选中的项目（相对于当前页）
  const selectedItem = currentPageItems[selectedIndex];

  useInput((input, key) => {
    // 显示消息后清除
    if (message) {
      setMessage(null);
    }

    if (mode === "confirmClear") {
      if (input === "y" || input === "Y") {
        clearHistory();
        setItems([]);
        setMode("list");
        setMessage("✓ 历史记录已清空");
      } else {
        setMode("list");
      }
      return;
    }

    if (mode === "detail") {
      if (key.escape || input === "q" || key.return) {
        setMode("list");
      }
      return;
    }

    if (mode === "stats") {
      if (key.escape || input === "q" || key.return) {
        setMode("list");
      }
      return;
    }

    // 列表模式的键盘处理
    if (key.upArrow || input === "k") {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow || input === "j") {
      setSelectedIndex((prev) =>
        Math.min(currentPageItems.length - 1, prev + 1),
      );
    } else if (key.leftArrow || input === "h") {
      // 上一页
      if (page > 0) {
        setPage((prev) => prev - 1);
        setSelectedIndex(0);
      }
    } else if (key.rightArrow || input === "l") {
      // 下一页
      if (page < totalPages - 1) {
        setPage((prev) => prev + 1);
        setSelectedIndex(0);
      }
    } else if (key.return && selectedItem) {
      // 查看详情
      setMode("detail");
    } else if (input === "c" && selectedItem) {
      // 复制命令到剪贴板
      copyToClipboard(selectedItem.command);
      setMessage(`✓ 命令已复制: ${selectedItem.command.slice(0, 50)}...`);
    } else if (input === "t" && selectedItem) {
      // 复制任务描述
      copyToClipboard(selectedItem.task);
      setMessage(`✓ 任务描述已复制`);
    } else if (input === "s") {
      // 显示统计
      setMode("stats");
    } else if (input === "d" && selectedItem) {
      // 删除当前项
      deleteHistoryItem(selectedItem.id);
      const newItems = items.filter((i) => i.id !== selectedItem.id);
      setItems(newItems);
      if (selectedIndex >= newItems.length) {
        setSelectedIndex(Math.max(0, newItems.length - 1));
      }
      setMessage("✓ 已删除");
    } else if (input === "C") {
      // 清空历史（需要确认）
      setMode("confirmClear");
    } else if (input === "q" || key.escape) {
      exit();
    }
  });

  // 复制到剪贴板
  function copyToClipboard(text: string): void {
    try {
      const { execSync } = require("child_process");
      // macOS
      execSync(`echo ${JSON.stringify(text)} | pbcopy`, { encoding: "utf-8" });
    } catch {
      // 忽略错误
    }
  }

  // 格式化时间
  function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;

    if (diff < 60000) {
      return "刚刚";
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} 分钟前`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} 小时前`;
    } else if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)} 天前`;
    } else {
      return date.toLocaleDateString("zh-CN");
    }
  }

  // 确认清空模式
  if (mode === "confirmClear") {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="yellow" bold>
          ⚠️ 确认清空所有历史记录？
        </Text>
        <Text color="gray">此操作不可撤销</Text>
        <Box marginTop={1}>
          <Text>按 </Text>
          <Text color="green" bold>
            Y
          </Text>
          <Text> 确认，其他键取消</Text>
        </Box>
      </Box>
    );
  }

  // 统计模式
  if (mode === "stats") {
    const stats = getHistoryStats();
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>
          📊 历史统计
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text>
            总记录数: <Text color="yellow">{stats.total}</Text>
          </Text>
          <Text>
            已执行: <Text color="green">{stats.executed}</Text>
          </Text>
          <Text>
            执行成功: <Text color="green">{stats.successful}</Text>
          </Text>
          <Box marginTop={1} flexDirection="column">
            <Text color="gray">各模型使用情况:</Text>
            {Object.entries(stats.providers).map(([provider, count]) => (
              <Text key={provider}>
                {" "}
                {provider}: <Text color="cyan">{count}</Text>
              </Text>
            ))}
          </Box>
        </Box>
        <Box marginTop={1}>
          <Text color="gray">按任意键返回</Text>
        </Box>
      </Box>
    );
  }

  // 详情模式
  if (mode === "detail" && selectedItem) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>
          📝 命令详情
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Box>
            <Text color="gray">时间: </Text>
            <Text>
              {new Date(selectedItem.timestamp).toLocaleString("zh-CN")}
            </Text>
          </Box>
          <Box>
            <Text color="gray">模型: </Text>
            <Text color="magenta">{selectedItem.provider}</Text>
          </Box>
          <Box marginTop={1}>
            <Text color="gray">任务: </Text>
          </Box>
          <Box paddingLeft={2}>
            <Text color="yellow">{selectedItem.task}</Text>
          </Box>
          <Box marginTop={1}>
            <Text color="gray">命令: </Text>
          </Box>
          <Box paddingLeft={2}>
            <Text color="green">{selectedItem.command}</Text>
          </Box>
          {selectedItem.explanation && (
            <>
              <Box marginTop={1}>
                <Text color="gray">解释: </Text>
              </Box>
              <Box paddingLeft={2}>
                <Text>{selectedItem.explanation}</Text>
              </Box>
            </>
          )}
          {selectedItem.executed && (
            <Box marginTop={1}>
              <Text color="gray">执行状态: </Text>
              <Text color={selectedItem.exitCode === 0 ? "green" : "red"}>
                {selectedItem.exitCode === 0
                  ? "✓ 成功"
                  : `✗ 失败 (${selectedItem.exitCode})`}
              </Text>
            </Box>
          )}
          {selectedItem.output && (
            <>
              <Box marginTop={1}>
                <Text color="gray">输出: </Text>
              </Box>
              <Box paddingLeft={2} flexDirection="column">
                <Text dimColor>{selectedItem.output.slice(0, 500)}</Text>
                {selectedItem.output.length > 500 && (
                  <Text color="gray">... (已截断)</Text>
                )}
              </Box>
            </>
          )}
        </Box>
        <Box marginTop={1}>
          <Text color="gray">按 </Text>
          <Text color="cyan">c</Text>
          <Text color="gray"> 复制命令，</Text>
          <Text color="cyan">Enter/q</Text>
          <Text color="gray"> 返回</Text>
        </Box>
      </Box>
    );
  }

  // 列表模式
  return (
    <Box flexDirection="column" padding={1}>
      {/* 标题 */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          📜 命令历史
        </Text>
        {searchKeyword && <Text color="gray"> (搜索: "{searchKeyword}")</Text>}
        <Text color="gray"> - 共 {items.length} 条记录</Text>
      </Box>

      {/* 消息提示 */}
      {message && (
        <Box marginBottom={1}>
          <Text color="green">{message}</Text>
        </Box>
      )}

      {/* 列表 */}
      {items.length === 0 ? (
        <Box>
          <Text color="gray">暂无历史记录</Text>
        </Box>
      ) : (
        <Box flexDirection="column">
          {currentPageItems.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <Box key={item.id} paddingX={1}>
                <Text>{isSelected ? "▶ " : "  "}</Text>
                <Box width={18}>
                  <Text color="gray">{formatTime(item.timestamp)}</Text>
                </Box>
                <Box width={12}>
                  <Text color="magenta">[{item.provider}]</Text>
                </Box>
                <Box flexGrow={1}>
                  <Text
                    color={isSelected ? "cyan" : "yellow"}
                    bold={isSelected}
                  >
                    {item.task.length > 40
                      ? item.task.slice(0, 40) + "..."
                      : item.task}
                  </Text>
                </Box>
                <Box width={3}>
                  {item.executed && (
                    <Text color={item.exitCode === 0 ? "green" : "red"}>
                      {item.exitCode === 0 ? "✓" : "✗"}
                    </Text>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* 分页信息 */}
      {totalPages > 1 && (
        <Box marginTop={1}>
          <Text color="gray">
            第 {page + 1}/{totalPages} 页 (←/→ 翻页)
          </Text>
        </Box>
      )}

      {/* 帮助信息 */}
      <Box marginTop={1} flexDirection="column">
        <Text color="gray">
          ↑/↓ 选择 │ Enter 详情 │ c 复制命令 │ t 复制任务 │ d 删除 │ s 统计 │ C
          清空 │ q 退出
        </Text>
      </Box>
    </Box>
  );
};
