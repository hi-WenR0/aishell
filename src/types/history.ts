/**
 * 历史记录类型定义
 */

export interface TokenUsage {
    inputTokens: number;    // 输入 token 数
    outputTokens: number;   // 输出 token 数
    totalTokens: number;    // 总 token 数
}

export interface HistoryItem {
    id: string;
    timestamp: number;
    task: string;           // 用户的自然语言描述
    command: string;        // 生成的命令
    provider: string;       // 使用的 AI 模型
    executed: boolean;      // 是否执行了命令
    exitCode?: number;      // 命令退出码
    output?: string;        // 命令输出（可选，保存部分输出）
    explanation?: string;   // 命令解释
    tokenUsage?: TokenUsage; // Token 使用量
}

export interface HistoryFile {
    version: string;
    items: HistoryItem[];
}
