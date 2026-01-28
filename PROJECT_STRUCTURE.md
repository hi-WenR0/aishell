# AIShell 项目结构

```
aishell/
│
├── 📄 文档文件
│   ├── README.md                  # 完整使用文档
│   ├── CHANGELOG.md               # 更新日志
│   ├── PROJECT_SUMMARY.md         # 项目详细说明
│   ├── TEST_REPORT.md             # 测试验证报告
│   ├── COMPLETION_REPORT.md       # 项目完成报告
│   └── PROJECT_STRUCTURE.md       # 本文件
│
├── 🔧 配置文件
│   ├── package.json               # Node.js 项目配置
│   ├── package-lock.json          # 依赖版本锁定
│   ├── tsconfig.json              # TypeScript 配置
│   ├── .env                       # 环境变量（本地）
│   ├── .env.example               # 环境变量示例
│   └── .gitignore                 # Git 忽略规则
│
├── 📁 src/ - 主源代码目录
│   │
│   ├── index.tsx                  # CLI 入口点 (Commander.js)
│   ├── App.tsx                    # 主应用组件 (React/Ink)
│   │
│   ├── 📁 components/             # UI 组件层
│   │   ├── Header.tsx             # 项目标题
│   │   ├── Loading.tsx            # 加载动画
│   │   ├── CommandOutput.tsx       # 命令输出展示
│   │   ├── ConfirmPrompt.tsx       # 执行确认提示
│   │   ├── CommandExecutor.tsx     # 命令执行 + AI 解读 ⭐
│   │   ├── ErrorDisplay.tsx        # 错误显示
│   │   ├── ModelList.tsx           # 模型列表
│   │   └── index.ts               # 组件导出
│   │
│   ├── 📁 providers/              # AI 提供者层
│   │   ├── base.ts                # 共享提示和工具函数
│   │   ├── claude.ts              # Claude 提供者实现
│   │   ├── kimi.ts                # Kimi 提供者实现
│   │   └── index.ts               # 提供者工厂函数
│   │
│   └── 📁 types/                  # TypeScript 类型定义
│       ├── index.ts               # 基础类型
│       └── provider.ts            # Provider 接口定义
│
├── 📁 dist/                       # 构建输出目录
│
├── 📁 scripts/                    # 辅助脚本
│   └── verify-api.sh              # API Key 验证
│
├── 📁 node_modules/               # npm 依赖包
│
└── 📁 .git/                       # Git 版本控制
```

## 关键特性实现位置

### 🚀 自然语言命令生成

- `src/providers/base.ts` - 提示词编写
- `src/providers/claude.ts` - Claude 实现
- `src/providers/kimi.ts` - Kimi 实现

### 📚 详细解释模式 (`--verbose`)

- `src/index.tsx` - 参数解析
- `src/providers/base.ts` - 条件提示词
- `src/components/CommandOutput.tsx` - 结果展示

### 🤖 AI 解读输出 (`--human`) ⭐ 新功能

- `src/index.tsx` - 添加 `-u` 选项
- `src/App.tsx` - 状态传递
- `src/providers/base.ts` - 总结提示词
- `src/providers/claude.ts` - 总结实现
- `src/providers/kimi.ts` - 总结实现
- `src/components/CommandExecutor.tsx` - 执行和展示

## 数据流

```
用户输入命令行参数
    ↓
index.tsx 解析参数 (task, -v, -m, -u 等)
    ↓
App.tsx 创建 provider，调用 generateCommand()
    ↓
provider 返回生成的命令
    ↓
CommandOutput 组件显示命令和说明
    ↓
ConfirmPrompt 等待用户确认 (Enter/Q)
    ↓
CommandExecutor 执行命令，捕获输出
    ↓
(如果 -u 启用) 调用 provider.summarizeOutput()
    ↓
显示 AI 解读结果
    ↓
应用退出
```

## 文件统计

| 类别       | 数量       |
| ---------- | ---------- |
| 源代码文件 | 16 个      |
| UI 组件    | 8 个       |
| 提供者实现 | 3 个       |
| 类型定义   | 2 个       |
| 文档文件   | 6 个       |
| 配置文件   | 6 个       |
| **总计**   | **~40 个** |

## npm 脚本

```json
{
  "dev": "tsx src/index.tsx",
  "build": "tsc",
  "type-check": "tsc --noEmit",
  "watch": "tsc --watch"
}
```

## 技术栈

- **语言**: TypeScript (ES2022)
- **运行时**: Node.js >= 18.0
- **CLI 框架**: Commander.js
- **UI 框架**: React 18 + Ink 5
- **AI SDK**: Anthropic SDK, OpenAI SDK
- **其他**: dotenv, tsx

## API 配置

```env
ANTHROPIC_API_KEY=sk-ant-...  # Claude
KIMI_API_KEY=sk-...            # Kimi
DEFAULT_MODEL=kimi             # 默认模型
```

## 版本信息

- **版本**: 1.0.0
- **发布日期**: 2025-01-28
- **状态**: ✅ 生产就绪
- **许可证**: MIT
