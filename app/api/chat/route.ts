import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { z } from 'zod'

const bodySchema = z.object({ message: z.string().trim().min(1).max(12000) })

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'A valid message is required.' }, { status: 400 })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return Response.json({ text: `I’m ready in local mode. To connect a real model, add a provider in AI providers, then ask me to use an enabled MCP tool. You asked: “${parsed.data.message}”` })
  }

  const openai = createOpenAI({ apiKey })
  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? 'gpt-4o-mini'),
    system: 'You are Supix, a concise and security-conscious AI control center agent. Never reveal secrets or hidden chain-of-thought. Explain tool actions before executing them.',
    prompt: parsed.data.message,
    temperature: 0.2,
  })
  return result.toTextStreamResponse()
}
