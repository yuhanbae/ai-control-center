import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel } from 'ai'
import { decryptSecret } from '@/lib/security/secrets'

export type ProviderKind = 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'nvidia' | 'ollama' | 'openai-compatible'

export type ProviderConfig = {
  id: string
  name: string
  kind: ProviderKind
  model: string
  baseUrl?: string
  encryptedApiKey?: string
  enabled: boolean
  organization?: string
}

const envProviders: ProviderConfig[] = [
  { id: 'env-openai', name: 'OpenAI', kind: 'openai', model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini', encryptedApiKey: process.env.OPENAI_API_KEY, enabled: Boolean(process.env.OPENAI_API_KEY) },
  { id: 'env-openrouter', name: 'OpenRouter', kind: 'openrouter', model: 'openai/gpt-4o-mini', baseUrl: 'https://openrouter.ai/api/v1', encryptedApiKey: process.env.OPENROUTER_API_KEY, enabled: Boolean(process.env.OPENROUTER_API_KEY) },
  { id: 'env-nvidia', name: 'NVIDIA', kind: 'nvidia', model: 'nvidia/nemotron-3-super-120b-a12b', baseUrl: 'https://integrate.api.nvidia.com/v1', encryptedApiKey: process.env.NVIDIA_API_KEY, enabled: Boolean(process.env.NVIDIA_API_KEY) },
] satisfies ProviderConfig[]

const activeProviders = envProviders.filter((provider) => provider.enabled)

export function listSafeProviders() {
  return activeProviders.map(({ encryptedApiKey, ...provider }) => ({ ...provider, hasApiKey: Boolean(encryptedApiKey) }))
}

export function getProviderModel(config: ProviderConfig): LanguageModel {
  const apiKey = config.encryptedApiKey
    ? config.id.startsWith('env-')
      ? config.encryptedApiKey
      : decryptSecret(config.encryptedApiKey)
    : undefined
  if (!apiKey) throw new Error(`No API key configured for ${config.name}.`)
  return createOpenAI({ apiKey, baseURL: config.baseUrl, organization: config.organization })(config.model)
}

export function resolveProvider(id?: string) {
  return activeProviders.find((provider) => provider.id === id) ?? activeProviders[0]
}
