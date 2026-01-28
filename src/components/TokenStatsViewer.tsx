/**
 * Token 使用统计 TUI 组件
 * 支持按多种维度展示统计数据
 */

import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useApp } from "ink";
import { loadHistory } from "../history.js";
import type { HistoryItem } from "../types/history.js";

type ViewMode =
  | "overview"
  | "byProvider"
  | "byDay"
  | "byWeek"
  | "byMonth"
  | "trend";

interface TokenStats {
  totalInput: number;
  totalOutput: number;
  total: number;
  count: number;
  avgPerRequest: number;
}

interface ProviderStats {
  [provider: string]: TokenStats;
}

interface TimeStats {
  label: string;
  stats: TokenStats;
}

export const TokenStatsViewer: React.FC = () => {
  const { exit } = useApp();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<ViewMode>("overview");

  useEffect(() => {
    const history = loadHistory();
    setItems(history.items);
  }, []);

  useInput((input, key) => {
    if (input === "1") setMode("overview");
    else if (input === "2") setMode("byProvider");
    else if (input === "3") setMode("byDay");
    else if (input === "4") setMode("byWeek");
    else if (input === "5") setMode("byMonth");
    else if (input === "6") setMode("trend");
    else if (input === "q" || key.escape) exit();
  });

  // 计算总体统计
  const calculateOverallStats = (): TokenStats => {
    let totalInput = 0;
    let totalOutput = 0;
    let count = 0;

    for (const item of items) {
      if (item.tokenUsage) {
        totalInput += item.tokenUsage.inputTokens;
        totalOutput += item.tokenUsage.outputTokens;
        count++;
      }
    }

    const total = totalInput + totalOutput;
    return {
      totalInput,
      totalOutput,
      total,
      count,
      avgPerRequest: count > 0 ? Math.round(total / count) : 0,
    };
  };

  // 按模型统计
  const calculateProviderStats = (): ProviderStats => {
    const stats: ProviderStats = {};

    for (const item of items) {
      if (item.tokenUsage) {
        if (!stats[item.provider]) {
          stats[item.provider] = {
            totalInput: 0,
            totalOutput: 0,
            total: 0,
            count: 0,
            avgPerRequest: 0,
          };
        }
        stats[item.provider].totalInput += item.tokenUsage.inputTokens;
        stats[item.provider].totalOutput += item.tokenUsage.outputTokens;
        stats[item.provider].total += item.tokenUsage.totalTokens;
        stats[item.provider].count++;
      }
    }

    // 计算平均值
    for (const provider of Object.keys(stats)) {
      stats[provider].avgPerRequest = Math.round(
        stats[provider].total / stats[provider].count,
      );
    }

    return stats;
  };

  // 按时间分组统计
  const calculateTimeStats = (groupFn: (date: Date) => string): TimeStats[] => {
    const groups: { [key: string]: TokenStats } = {};

    for (const item of items) {
      if (item.tokenUsage) {
        const date = new Date(item.timestamp);
        const key = groupFn(date);

        if (!groups[key]) {
          groups[key] = {
            totalInput: 0,
            totalOutput: 0,
            total: 0,
            count: 0,
            avgPerRequest: 0,
          };
        }

        groups[key].totalInput += item.tokenUsage.inputTokens;
        groups[key].totalOutput += item.tokenUsage.outputTokens;
        groups[key].total += item.tokenUsage.totalTokens;
        groups[key].count++;
      }
    }

    // 计算平均值并排序
    return Object.entries(groups)
      .map(([label, stats]) => ({
        label,
        stats: {
          ...stats,
          avgPerRequest: Math.round(stats.total / stats.count),
        },
      }))
      .sort((a, b) => b.label.localeCompare(a.label));
  };

  // 格式化数字
  const formatNumber = (n: number): string => {
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(2)}M`;
    } else if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}K`;
    }
    return n.toString();
  };

  // 绘制进度条
  const renderBar = (
    value: number,
    max: number,
    width: number,
    color: string,
  ): React.ReactNode => {
    const filled = max > 0 ? Math.round((value / max) * width) : 0;
    const empty = width - filled;
    return (
      <Text>
        <Text color={color}>{"█".repeat(filled)}</Text>
        <Text color="gray">{"░".repeat(empty)}</Text>
      </Text>
    );
  };

  // 渲染顶部导航
  const renderNav = (): React.ReactNode => (
    <Box marginBottom={1} flexDirection="column">
      <Box>
        <Text color="cyan" bold>
          📊 Token 使用统计
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text color={mode === "overview" ? "cyan" : "gray"}>[1] 总览 </Text>
        <Text color={mode === "byProvider" ? "cyan" : "gray"}>[2] 按模型 </Text>
        <Text color={mode === "byDay" ? "cyan" : "gray"}>[3] 按天 </Text>
        <Text color={mode === "byWeek" ? "cyan" : "gray"}>[4] 按周 </Text>
        <Text color={mode === "byMonth" ? "cyan" : "gray"}>[5] 按月 </Text>
        <Text color={mode === "trend" ? "cyan" : "gray"}>[6] 趋势 </Text>
        <Text color="gray">│ [q] 退出</Text>
      </Box>
      <Box marginTop={1}>
        <Text color="gray">{"─".repeat(60)}</Text>
      </Box>
    </Box>
  );

  // 渲染总览
  const renderOverview = (): React.ReactNode => {
    const stats = calculateOverallStats();

    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text color="yellow" bold>
            ✨ 使用概览
          </Text>
        </Box>

        {/* 总体数据卡片 */}
        <Box flexDirection="row" marginBottom={1}>
          <Box
            flexDirection="column"
            marginRight={4}
            borderStyle="round"
            borderColor="cyan"
            paddingX={2}
            paddingY={1}
          >
            <Text color="gray">总请求数</Text>
            <Text color="cyan" bold>
              {stats.count}
            </Text>
          </Box>
          <Box
            flexDirection="column"
            marginRight={4}
            borderStyle="round"
            borderColor="green"
            paddingX={2}
            paddingY={1}
          >
            <Text color="gray">总 Tokens</Text>
            <Text color="green" bold>
              {formatNumber(stats.total)}
            </Text>
          </Box>
          <Box
            flexDirection="column"
            marginRight={4}
            borderStyle="round"
            borderColor="yellow"
            paddingX={2}
            paddingY={1}
          >
            <Text color="gray">输入 Tokens</Text>
            <Text color="yellow" bold>
              {formatNumber(stats.totalInput)}
            </Text>
          </Box>
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="magenta"
            paddingX={2}
            paddingY={1}
          >
            <Text color="gray">输出 Tokens</Text>
            <Text color="magenta" bold>
              {formatNumber(stats.totalOutput)}
            </Text>
          </Box>
        </Box>

        {/* 输入/输出比例 */}
        <Box marginBottom={1} marginTop={1}>
          <Text color="gray">输入/输出比例: </Text>
          {renderBar(stats.totalInput, stats.total, 30, "yellow")}
          {renderBar(stats.totalOutput, stats.total, 30, "magenta")}
        </Box>
        <Box marginBottom={1}>
          <Text color="yellow">
            {" "}
            ■ 输入 {((stats.totalInput / (stats.total || 1)) * 100).toFixed(1)}%
          </Text>
          <Text> </Text>
          <Text color="magenta">
            ■ 输出 {((stats.totalOutput / (stats.total || 1)) * 100).toFixed(1)}
            %
          </Text>
        </Box>

        {/* 平均每次请求 */}
        <Box marginTop={1}>
          <Text color="gray">平均每次请求: </Text>
          <Text color="white" bold>
            {formatNumber(stats.avgPerRequest)}
          </Text>
          <Text color="gray"> tokens</Text>
        </Box>
      </Box>
    );
  };

  // 渲染按模型统计
  const renderByProvider = (): React.ReactNode => {
    const providerStats = calculateProviderStats();
    const maxTotal = Math.max(
      ...Object.values(providerStats).map((s) => s.total),
      1,
    );
    const providers = Object.entries(providerStats).sort(
      (a, b) => b[1].total - a[1].total,
    );

    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text color="yellow" bold>
            🤖 按模型统计
          </Text>
        </Box>

        {providers.length === 0 ? (
          <Text color="gray">暂无数据</Text>
        ) : (
          providers.map(([provider, stats], index) => {
            const colors = ["cyan", "green", "yellow", "magenta", "blue"];
            const color = colors[index % colors.length];
            return (
              <Box key={provider} flexDirection="column" marginBottom={1}>
                <Box>
                  <Text color={color as any} bold>
                    {provider}
                  </Text>
                  <Text color="gray"> ({stats.count} 次请求)</Text>
                </Box>
                <Box>
                  {renderBar(stats.total, maxTotal, 40, color)}
                  <Text color="gray"> {formatNumber(stats.total)}</Text>
                </Box>
                <Box paddingLeft={2}>
                  <Text color="gray">输入: </Text>
                  <Text color="yellow">{formatNumber(stats.totalInput)}</Text>
                  <Text color="gray"> │ 输出: </Text>
                  <Text color="magenta">{formatNumber(stats.totalOutput)}</Text>
                  <Text color="gray"> │ 平均: </Text>
                  <Text color="white">{formatNumber(stats.avgPerRequest)}</Text>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    );
  };

  // 渲染时间统计
  const renderTimeStats = (
    title: string,
    emoji: string,
    groupFn: (date: Date) => string,
    limit: number = 10,
  ): React.ReactNode => {
    const timeStats = calculateTimeStats(groupFn).slice(0, limit);
    const maxTotal = Math.max(...timeStats.map((t) => t.stats.total), 1);

    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text color="yellow" bold>
            {emoji} {title}
          </Text>
        </Box>

        {timeStats.length === 0 ? (
          <Text color="gray">暂无数据</Text>
        ) : (
          timeStats.map((item) => (
            <Box key={item.label} marginBottom={0}>
              <Box width={14}>
                <Text color="gray">{item.label}</Text>
              </Box>
              {renderBar(item.stats.total, maxTotal, 30, "green")}
              <Text color="gray"> {formatNumber(item.stats.total)}</Text>
              <Text color="gray"> ({item.stats.count}次)</Text>
            </Box>
          ))
        )}
      </Box>
    );
  };

  // 渲染趋势图（简单的 ASCII 图表）
  const renderTrend = (): React.ReactNode => {
    const dayStats = calculateTimeStats((date) => {
      return date.toISOString().split("T")[0];
    })
      .slice(0, 14)
      .reverse();

    if (dayStats.length === 0) {
      return (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text color="yellow" bold>
              📈 使用趋势 (最近14天)
            </Text>
          </Box>
          <Text color="gray">暂无数据</Text>
        </Box>
      );
    }

    const maxTotal = Math.max(...dayStats.map((d) => d.stats.total), 1);
    const height = 8;

    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text color="yellow" bold>
            📈 使用趋势 (最近14天)
          </Text>
        </Box>

        {/* ASCII 柱状图 */}
        <Box flexDirection="column">
          {[...Array(height)].map((_, rowIndex) => {
            const threshold = ((height - rowIndex) / height) * maxTotal;
            return (
              <Box key={rowIndex}>
                <Box width={10}>
                  {rowIndex === 0 && (
                    <Text color="gray">
                      {formatNumber(maxTotal).padStart(8)}
                    </Text>
                  )}
                  {rowIndex === height - 1 && (
                    <Text color="gray">{"0".padStart(8)}</Text>
                  )}
                </Box>
                <Text color="gray">│</Text>
                {dayStats.map((day, colIndex) => {
                  const filled = day.stats.total >= threshold;
                  return (
                    <Text key={colIndex} color={filled ? "cyan" : "gray"}>
                      {filled ? " ██" : "   "}
                    </Text>
                  );
                })}
              </Box>
            );
          })}
          <Box>
            <Box width={10}></Box>
            <Text color="gray">└{"───".repeat(dayStats.length)}</Text>
          </Box>
          <Box>
            <Box width={11}></Box>
            {dayStats.map((day, index) => (
              <Text key={index} color="gray">
                {day.label.slice(-2).padStart(3)}
              </Text>
            ))}
          </Box>
        </Box>

        {/* 汇总信息 */}
        <Box marginTop={1}>
          <Text color="gray">期间总计: </Text>
          <Text color="cyan" bold>
            {formatNumber(dayStats.reduce((sum, d) => sum + d.stats.total, 0))}
          </Text>
          <Text color="gray"> tokens │ </Text>
          <Text color="gray">日均: </Text>
          <Text color="green" bold>
            {formatNumber(
              Math.round(
                dayStats.reduce((sum, d) => sum + d.stats.total, 0) /
                  dayStats.length,
              ),
            )}
          </Text>
          <Text color="gray"> tokens</Text>
        </Box>
      </Box>
    );
  };

  // 日期格式化函数
  const formatDay = (date: Date): string => date.toISOString().split("T")[0];

  const formatWeek = (date: Date): string => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((date.getTime() - startOfYear.getTime()) / 86400000 +
        startOfYear.getDay() +
        1) /
        7,
    );
    return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
  };

  const formatMonth = (date: Date): string => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  return (
    <Box flexDirection="column" padding={1}>
      {renderNav()}

      {mode === "overview" && renderOverview()}
      {mode === "byProvider" && renderByProvider()}
      {mode === "byDay" &&
        renderTimeStats("按天统计 (最近10天)", "📅", formatDay, 10)}
      {mode === "byWeek" &&
        renderTimeStats("按周统计 (最近10周)", "📆", formatWeek, 10)}
      {mode === "byMonth" &&
        renderTimeStats("按月统计 (最近12月)", "🗓️", formatMonth, 12)}
      {mode === "trend" && renderTrend()}
    </Box>
  );
};
