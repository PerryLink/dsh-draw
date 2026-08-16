/**
 * The `image_generate` tool: the model-facing unified image generation entry.
 * Standard parameters (prompt/size/count/quality/style/engine) flow into the
 * shared drawer path; the canonical value carries the durable attachment
 * references plus quota and routing facts, and the render output embeds the
 * images as attachment content blocks so both text-only surfaces and the web
 * conversation show them.
 *
 * @module dsh-draw/tool
 */

import { AttachmentId, type ImageAttachmentRef } from '@deepseek-ai/dsh-attachment'
import type { ContentBlock } from '@deepseek-ai/dsh-llm'
import type { JsonValue } from '@deepseek-ai/dsh-session'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ResolvedConfig } from './config.ts'
import type { Drawer, DrawSuccess } from './drawer.ts'

/** Tool argument surface (validated by the schema; the drawer re-normalizes). */
export interface ImageGenerateArgs {
  prompt: string
  size?: 'square' | 'landscape' | 'portrait' | 'auto'
  count?: number
  quality?: 'low' | 'medium' | 'high' | 'auto'
  style?: 'natural' | 'vivid'
  engine?: string
}

/**
 * Build the `image_generate` tool over one drawer.
 *
 * @param drawer - the shared generation path.
 * @param config - resolved config (prompt cap for the description, timeout budget).
 * @returns the tool definition.
 */
export function imageGenerateTool(drawer: Drawer, config: ResolvedConfig) {
  return defineTool({
    name: 'image_generate',
    description: `Generate 1..${config.maxImagesPerCall} static images from a text prompt through the configured image engines (OpenAI Images, Zhipu CogView, or any OpenAI-compatible endpoint). Standard parameters are translated per engine; a failing engine falls back down the configured chain. Results are saved as durable attachments and count against the per-session quota. Prompt cap: ${config.maxPromptLength} characters.`,
    parameters: {
      prompt: { type: 'string' as const, description: 'Image prompt.', required: true as const },
      size: { type: 'string' as const, enum: ['square', 'landscape', 'portrait', 'auto'] as const, description: 'Composition (default square).' },
      count: { type: 'integer' as const, description: 'Number of images (default 1; capped by configuration).' },
      quality: { type: 'string' as const, enum: ['low', 'medium', 'high', 'auto'] as const, description: 'Quality tier (default auto; dropped for engines without it).' },
      style: { type: 'string' as const, enum: ['natural', 'vivid'] as const, description: 'Style preset (dropped for engines without it).' },
      engine: { type: 'string' as const, description: 'Engine id override (must name a configured engine; omitted = chain order).' },
    },
    output: {
      schema: {
        type: 'object' as const,
        properties: {
          ok: { type: 'boolean' as const, const: true },
          engine: { type: 'string' as const },
          model: { type: 'string' as const },
          size: { type: 'string' as const },
          images: {
            type: 'array' as const,
            items: {
              type: 'object' as const,
              properties: {
                attachmentId: { type: 'string' as const },
                mediaType: { type: 'string' as const },
                bytes: { type: 'integer' as const },
                width: { type: 'integer' as const },
                height: { type: 'integer' as const },
                name: { type: 'string' as const },
              },
              additionalProperties: false,
            },
          },
          quota: {
            type: 'object' as const,
            properties: {
              generations: { type: 'integer' as const },
              bytes: { type: 'integer' as const },
            },
            additionalProperties: false,
          },
          limits: {
            type: 'object' as const,
            properties: {
              maxGenerations: { type: 'integer' as const },
              maxBytes: { type: 'integer' as const },
            },
            additionalProperties: false,
          },
          fallbackUsed: { type: 'boolean' as const },
          elapsedMs: { type: 'integer' as const },
          attempts: {
            type: 'array' as const,
            items: {
              type: 'object' as const,
              properties: {
                engine: { type: 'string' as const },
                phase: { oneOf: [{ type: 'string' as const }, { type: 'null' as const }] as const },
                code: { type: 'string' as const },
                message: { oneOf: [{ type: 'string' as const }, { type: 'null' as const }] as const },
                status: { oneOf: [{ type: 'integer' as const }, { type: 'null' as const }] as const },
              },
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
      render(_args, value): ContentBlock[] {
        const result = value as unknown as DrawSuccess
        const lines = [
          `Generated ${result.images.length} image(s) via ${result.engine} (${result.model}, ${result.size})${result.fallbackUsed ? ' after fallback' : ''} in ${result.elapsedMs} ms.`,
          `Quota: ${result.quota.generations}/${result.limits.maxGenerations} calls, ${result.quota.bytes}/${result.limits.maxBytes} bytes this session.`,
        ]
        for (const attempt of result.attempts) {
          if (attempt.code === 'ok') continue
          lines.push(`- ${attempt.engine}: ${attempt.code}${attempt.message === undefined ? '' : ` (${attempt.message})`}`)
        }
        const blocks: ContentBlock[] = [{ type: 'text', text: lines.join('\n') }]
        for (const image of result.images) {
          const attachment: ImageAttachmentRef = {
            attachmentId: AttachmentId(image.attachmentId),
            mediaType: image.mediaType as ImageAttachmentRef['mediaType'],
            bytes: image.bytes,
            width: image.width,
            height: image.height,
            ...(image.name !== undefined ? { name: image.name } : {}),
          }
          blocks.push({ type: 'image', attachment })
        }
        return blocks
      },
      // The result card reads the canonical value through this replayable
      // presentation projection (the frozen client block exposes only `meta`).
      presentationMeta(_args, value): JsonValue {
        return value as unknown as JsonValue
      },
    },
    timeoutMs: config.requestTimeoutMs,
    async execute(args, exec) {
      const outcome = await drawer.generate(args as unknown, { session: exec.agent?.session, source: 'tool', signal: exec.signal })
      if (!outcome.ok) throw new Error(outcome.message)
      // The schema-inferred canonical value owns mutable arrays; the drawer's
      // frozen records are copied into owned mutable ones here.
      return { ...outcome, images: [...outcome.images], attempts: [...outcome.attempts] }
    },
  })
}
