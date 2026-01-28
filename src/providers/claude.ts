import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, CommandResultWithUsage, SummarizeResultWithUsage } from '../types/provider.js';
import { getSystemPrompt, getUserPrompt, parseResponse, getSummarizeSystemPrompt, getSummarizeUserPrompt } from './base.js';

export class ClaudeProvider implements AIProvider {
    name = 'Claude';
    private client: Anthropic;
    private model: string;

    constructor(apiKey: string, model?: string) {
        this.client = new Anthropic({ apiKey });
        this.model = model || 'claude-sonnet-4-20250514';
    }

    async generateCommand(task: string, verbose: boolean): Promise<CommandResultWithUsage> {
        const message = await this.client.messages.create({
            model: this.model,
            max_tokens: 1024,
            system: getSystemPrompt(verbose),
            messages: [
                {
                    role: 'user',
                    content: getUserPrompt(task, verbose),
                },
            ],
        });

        const content = message.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from API');
        }

        return {
            result: parseResponse(content.text),
            tokenUsage: {
                inputTokens: message.usage.input_tokens,
                outputTokens: message.usage.output_tokens,
                totalTokens: message.usage.input_tokens + message.usage.output_tokens,
            },
        };
    }

    async summarizeOutput(command: string, output: string): Promise<SummarizeResultWithUsage> {
        const message = await this.client.messages.create({
            model: this.model,
            max_tokens: 1024,
            system: getSummarizeSystemPrompt(),
            messages: [
                {
                    role: 'user',
                    content: getSummarizeUserPrompt(command, output),
                },
            ],
        });

        const content = message.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from API');
        }

        return {
            summary: content.text,
            tokenUsage: {
                inputTokens: message.usage.input_tokens,
                outputTokens: message.usage.output_tokens,
                totalTokens: message.usage.input_tokens + message.usage.output_tokens,
            },
        };
    }
}
