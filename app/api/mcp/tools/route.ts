import { discoverMcpTools } from '@/lib/mcp/client'
import { z } from 'zod'

const schema = z.object({ url: z.string().url(), headers: z.record(z.string(), z.string()).optional() })

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'A valid MCP URL is required.' }, { status: 400 })
  try {
    const tools = await discoverMcpTools(parsed.data.url, parsed.data.headers)
    return Response.json({ tools })
  } catch {
    return Response.json({ error: 'MCP server connection failed.' }, { status: 502 })
  }
}
