import type { CommandResult } from '../types/index.js';

export function getSystemPrompt(verbose: boolean): string {
    const os = process.platform === 'darwin' ? 'macOS' : process.platform === 'win32' ? 'Windows' : 'Linux';

    return verbose
        ? `你是一个 shell 命令专家。根据用户的自然语言描述，生成对应的 shell 命令。
你需要返回 JSON 格式的响应，包含以下字段：
- command: 实际的 shell 命令
- explanation: 对象，包含：
  - description: 命令的整体说明
  - parameters: 数组，每个参数的说明，格式为 { param: "参数", description: "说明" }
  - commonUsages: 数组，列举这个命令的常用用法示例

用户的操作系统是 ${os}。`
        : `你是一个 shell 命令专家。根据用户的自然语言描述，生成对应的 shell 命令。
只需要返回 JSON 格式的响应，包含一个字段：
- command: 实际的 shell 命令

用户的操作系统是 ${os}。`;
}

export function getSummarizeSystemPrompt(): string {
    return `你是一个命令行输出解读专家。用户会给你一个命令和它的输出结果，请用通俗易懂的中文来总结和解释这个输出的含义。

要求：
- 使用简洁明了的语言，让非技术人员也能理解
- 重点突出关键信息
- 如果有数值，用易懂的方式解释（如 CPU 占用 50% 意味着什么）
- 如果有异常或需要注意的地方，请特别指出`;
}

export function getSummarizeUserPrompt(command: string, output: string): string {
    return `命令: ${command}

输出结果:
${output}

请用通俗易懂的语言解释这个命令的输出结果。`;
}

export function getUserPrompt(task: string, verbose: boolean): string {
    return verbose
        ? `任务: ${task}\n\n请生成对应的命令，并详细解释命令和各个参数的作用，以及常见的用法示例。`
        : `任务: ${task}\n\n请生成对应的命令。`;
}

export function parseResponse(text: string): CommandResult {
    try {
        // 移除可能的 markdown 代码块标记
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
        }

        const result: CommandResult = JSON.parse(jsonText);
        return result;
    } catch {
        // 如果解析失败，尝试从文本中提取命令
        const codeBlockMatch = text.match(/```(?:bash|sh)?\n?(.*?)\n?```/s);
        if (codeBlockMatch) {
            return { command: codeBlockMatch[1].trim() };
        }

        // 如果没有代码块，直接返回整个文本作为命令
        return { command: text.trim() };
    }
}
