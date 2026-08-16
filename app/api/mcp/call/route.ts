import { callMcpTool } from '@/lib/mcp/client'
import { z } from 'zod'

const schema = z.object({ url: z.string().url(), name: z.string().min(1).max(120), arguments: z.record(z.string(), z.unknown()).default({}), headers: z.record(z.string(), z.string()).optional() })

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Invalid tool call.' }, { status: 400 })
  try {
    const result = await callMcpTool(parsed.data.url, parsed.data.name, parsed.data.arguments, parsed.data.headers)
    return Response.json({ result })
  } catch {
    return Response.json({ error: 'MCP tool execution failed.' }, { status: 502 })
  }
}
