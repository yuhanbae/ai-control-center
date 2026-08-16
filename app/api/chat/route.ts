import { streamText } from 'ai'
import { z } from 'zod'
import { getProviderModel, resolveProvider } from '@/lib/ai/providers'

const bodySchema = z.object({ message: z.string().trim().min(1).max(12000), providerId: z.string().optional() })

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'A valid message is required.' }, { status: 400 })

  const provider = resolveProvider(parsed.data.providerId)
  if (!provider) {
    return Response.json({ text: `I’m ready in local mode. Add a provider in AI providers to connect a real model. You asked: “${parsed.data.message}”` })
  }

  const result = streamText({
    model: getProviderModel(provider),
    system: 'You are Supix, a concise and security-conscious AI control center agent. Never reveal secrets or hidden chain-of-thought. Explain tool actions before executing them.',
    prompt: parsed.data.message,
    temperature: 0.2,
  })
  return result.toTextStreamResponse()
}
