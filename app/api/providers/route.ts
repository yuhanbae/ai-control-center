import { listSafeProviders } from '@/lib/ai/providers'

export async function GET() {
  return Response.json({ providers: listSafeProviders() })
}
