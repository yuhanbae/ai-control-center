import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { z } from 'zod'

export const mcpServerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(300).optional(),
  url: z.string().url().refine((value) => ['http:', 'https:'].includes(new URL(value).protocol), 'Only HTTP(S) MCP endpoints are supported.'),
})

export async function discoverMcpTools(url: string, headers?: Record<string, string>) {
  const endpoint = new URL(url)
  if (['localhost', '127.0.0.1', '0.0.0.0'].includes(endpoint.hostname) && process.env.VERCEL) {
    throw new Error('A Vercel deployment cannot reach a service bound to localhost.')
  }
  const client = new Client({ name: 'supix', version: '0.1.0' })
  const transport = new StreamableHTTPClientTransport(endpoint, { requestInit: { headers, signal: AbortSignal.timeout(15_000) } })
  await client.connect(transport)
  try {
    const result = await client.listTools()
    return result.tools.map((tool) => ({ name: tool.name, description: tool.description ?? '', inputSchema: tool.inputSchema }))
  } finally {
    await client.close().catch(() => undefined)
  }
}

export async function callMcpTool(url: string, name: string, args: Record<string, unknown>, headers?: Record<string, string>) {
  const client = new Client({ name: 'supix', version: '0.1.0' })
  const transport = new StreamableHTTPClientTransport(new URL(url), { requestInit: { headers, signal: AbortSignal.timeout(20_000) } })
  await client.connect(transport)
  try {
    return await client.callTool({ name, arguments: args })
  } finally {
    await client.close().catch(() => undefined)
  }
}
