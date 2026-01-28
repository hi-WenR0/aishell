import OpenAI from 'openai';
import type { AIProvider, CommandResultWithUsage, SummarizeResultWithUsage } from '../types/provider.js';
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

    async generateCommand(task: string, verbose: boolean): Promise<CommandResultWithUsage> {
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

        return {
            result: parseResponse(content),
            tokenUsage: response.usage ? {
                inputTokens: response.usage.prompt_tokens,
                outputTokens: response.usage.completion_tokens,
                totalTokens: response.usage.total_tokens,
            } : undefined,
        };
    }

    async summarizeOutput(command: string, output: string): Promise<SummarizeResultWithUsage> {
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

        return {
            summary: content,
            tokenUsage: response.usage ? {
                inputTokens: response.usage.prompt_tokens,
                outputTokens: response.usage.completion_tokens,
                totalTokens: response.usage.total_tokens,
            } : undefined,
        };
    }
}
