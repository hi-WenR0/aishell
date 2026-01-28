import type { CommandResult } from './index.js';

export interface AIProvider {
    name: string;
    generateCommand(task: string, verbose: boolean): Promise<CommandResult>;
    summarizeOutput(command: string, output: string): Promise<string>;
}

export type ProviderType = 'claude' | 'kimi' | 'deepseek';

export interface ProviderConfig {
    type: ProviderType;
    apiKey: string;
    model?: string;
}
