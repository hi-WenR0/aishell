# 更新日志

## [1.0.0] - 2025-01-10

### 新增功能

#### 🤖 AI 解读输出 (`-u, --human`)

- 添加了 `-u` 或 `--human` 参数，让 AI 用易懂的语言总结命令执行结果
- 执行命令后，AI 会自动分析输出内容并生成人类友好的解释
- 特别有用于：
  - 理解复杂的系统命令输出
  - 快速获取关键信息的摘要
  - 初学者理解命令行结果

#### 示例用法

```bash
# 简单查询 + AI 解读
npm run dev "显示当前目录有哪些文件" -- -u

# 详细模式 + AI 解读
npm run dev "查看内存使用情况" -- -v -u

# 使用特定模型 + AI 解读
npm run dev "查看磁盘使用情况" -- -m claude -u
```

### 技术实现

- 在 `AIProvider` 接口中添加了 `summarizeOutput()` 方法
- 创建了 `getSummarizeSystemPrompt()` 和 `getSummarizeUserPrompt()` 辅助函数
- 在 Kimi 和 Claude providers 中实现了输出总结功能
- CommandExecutor 组件支持 "summarizing" 状态，在总结过程中显示加载动画
- 总结结果在漂亮的紫色边框盒子中显示，标有 "🤖 AI 解读" 标题

### 改进

- 优化了 CommandExecutor 组件的状态管理
- 提升了用户体验，特别是对非技术用户
- 更好的错误处理机制

### 文档更新

- 更新了 README.md，详细说明新功能
- 添加了使用示例和最佳实践

---

## 项目概述

AIShell 是一个基于 AI 的命令行工具，具有以下特性：

- ✅ 自然语言输入 → 自动生成 Shell 命令
- ✅ 多模型支持（Claude + Kimi-K2）
- ✅ 详细解释模式（`--verbose` 参数）
- ✅ AI 解读输出（`--human` 参数）
- ✅ 美观的 TUI（使用 Ink + React）
- ✅ 交互式确认提示
