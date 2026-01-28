import type { CommandResult } from './index.js';
import type { TokenUsage } from './history.js';

export interface CommandResultWithUsage {
    result: CommandResult;
    tokenUsage?: TokenUsage;
}

export interface SummarizeResultWithUsage {
    summary: string;
    tokenUsage?: TokenUsage;
}

export interface AIProvider {
    name: string;
    generateCommand(task: string, verbose: boolean): Promise<CommandResultWithUsage>;
    summarizeOutput(command: string, output: string): Promise<SummarizeResultWithUsage>;
}

export type ProviderType = 'claude' | 'kimi' | 'deepseek';

export interface ProviderConfig {
    type: ProviderType;
    apiKey: string;
    model?: string;
}
