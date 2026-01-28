import OpenAI from 'openai';
import type { AIProvider } from '../types/provider.js';
import type { CommandResult } from '../types/index.js';
import { getSystemPrompt, getUserPrompt, parseResponse, getSummarizeSystemPrompt, getSummarizeUserPrompt } from './base.js';

export class KimiProvider implements AIProvider {
    name = 'Kimi';
    private client: OpenAI;
    private model: string;

    constructor(apiKey: string, model?: string) {
        this.client = new OpenAI({
            apiKey,
            baseURL: 'https://api.moonshot.cn/v1',
        });
        this.model = model || 'kimi-k2-0711-preview';
    }

    async generateCommand(task: string, verbose: boolean): Promise<CommandResult> {
        const response = await this.client.chat.completions.create({
            model: this.model,
            max_tokens: 1024,
            messages: [
                {
                    role: 'system',
                    content: getSystemPrompt(verbose),
                },
                {
                    role: 'user',
                    content: getUserPrompt(task, verbose),
                },
            ],
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from API');
        }

        return parseResponse(content);
    }

    async summarizeOutput(command: string, output: string): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: this.model,
            max_tokens: 1024,
            messages: [
                {
                    role: 'system',
                    content: getSummarizeSystemPrompt(),
                },
                {
                    role: 'user',
                    content: getSummarizeUserPrompt(command, output),
                },
            ],
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from API');
        }

        return content;
    }
}
