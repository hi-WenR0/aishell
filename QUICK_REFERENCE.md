# 🚀 AIShell - 快速参考卡

## 安装 & 启动

```bash
# 克隆和安装
git clone <repo-url>
cd aishell
npm install

# 配置 API Key
cp .env.example .env
# 编辑 .env，填入 ANTHROPIC_API_KEY 和/或 KIMI_API_KEY
```

## 基本命令

### 生成并执行命令

```bash
npm run dev "用自然语言描述任务"
```

### 常见任务示例

```bash
# 查看文件
npm run dev "显示当前目录有哪些文件"

# 查看系统信息
npm run dev "查看内存使用情况"
npm run dev "找出 CPU 占用率最高的程序"
npm run dev "检查磁盘使用情况"

# 网络操作
npm run dev "查看 8080 端口被哪个进程占用"

# Git 操作
npm run dev "显示最近 5 条 git 提交"
```

## 高级选项

| 选项            | 说明         | 示例                              |
| --------------- | ------------ | --------------------------------- |
| `-v, --verbose` | 显示详细解释 | `npm run dev "task" -- -v`        |
| `-u, --human`   | AI 总结输出  | `npm run dev "task" -- -u`        |
| `-m, --model`   | 选择模型     | `npm run dev "task" -- -m claude` |
| `--list-models` | 列出可用模型 | `npm run dev "" -- --list-models` |

## 功能组合

```bash
# 详细模式 + AI 解读
npm run dev "任务" -- -v -u

# 特定模型 + 详细 + 解读
npm run dev "任务" -- -m claude -v -u

# 只有 AI 解读
npm run dev "任务" -- -u
```

## API Key 配置

### Claude (Anthropic)

```env
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-20250514  # 可选，自定义模型
```

获取地址: https://console.anthropic.com/

### Kimi (Moonshot)

```env
KIMI_API_KEY=sk-...
KIMI_MODEL=kimi-k2-0711-preview  # 可选，自定义模型
```

获取地址: https://platform.moonshot.cn/

### DeepSeek

```env
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat  # 可选，自定义模型
```

获取地址: https://platform.deepseek.com/

## 开发命令

```bash
npm run build        # 编译 TypeScript
npm run type-check   # 类型检查
npm run watch        # 监听文件变化
npm run dev          # 开发模式
```

## 项目结构一览

```
src/
├── index.tsx          # CLI 入口
├── App.tsx            # 主应用
├── components/        # UI 组件 (8 个)
├── providers/         # AI 提供者 (4 个实现)
└── types/             # 类型定义
```

## 关键特性

- ✅ 自然语言生成 shell 命令
- ✅ 支持 Claude、Kimi 和 DeepSeek 三种 AI 模型
- ✅ 支持自定义模型版本
- ✅ 详细命令解释模式
- ✅ **🤖 AI 解读输出** - 用简单语言总结命令结果
- ✅ 现代化 TUI 界面
- ✅ 交互式执行确认

## 常见问题

**Q: 如何修改默认模型或自定义模型版本？**

```bash
# 在 .env 中添加
DEFAULT_MODEL=deepseek
DEEPSEEK_MODEL=deepseek-reasoner  # 使用特定模型版本

# 或使用 --model 参数
npm run dev "task" -- -m deepseek
```

**Q: 如何处理命令失败？**

```bash
# 按 Q 或 N 键或 Esc 退出，不执行命令
```

**Q: 生成的命令不对怎么办？**

```bash
# 使用更具体的描述
# 如果还是不对，尝试换一个 AI 模型
npm run dev "更详细的描述" -- -m claude
```

**Q: 如何在脚本中使用？**

```bash
#!/bin/bash
npm run dev "获取系统信息" -- -u | grep "AI 解读" -A 10
```

## 文档导航

- 📖 [README.md](README.md) - 完整使用文档
- 📝 [CHANGELOG.md](CHANGELOG.md) - 版本更新日志
- 🔍 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 项目详解
- 🧪 [TEST_REPORT.md](TEST_REPORT.md) - 测试报告
- 📊 [COMPLETION_REPORT.md](COMPLETION_REPORT.md) - 完成报告
- 🗂️ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - 项目结构
- ⭐ [FINAL_SUMMARY.md](FINAL_SUMMARY.md) - 最终总结

## 技术栈

- TypeScript + React 18
- Ink (CLI UI)
- Commander.js (CLI 解析)
- Anthropic SDK (Claude)
- OpenAI SDK (Kimi)

## 支持与反馈

如有问题或建议，欢迎提交 Issue 或 PR！

## 许可证

MIT

---

**版本**: 1.0.0  
**状态**: ✅ 生产就绪  
**最后更新**: 2025-01-28
