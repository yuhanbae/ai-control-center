# Deployment

Run `pnpm install` and `pnpm dev` locally. Add only the provider credentials you need. For Vercel, configure the same server-side variables in project settings and use a hosted MCP endpoint; local Ollama and stdio MCP servers are not reachable from Vercel serverless functions.

Before production, connect the Neon persistence adapter, add authentication, set an encryption key, and run lint, typecheck, tests, and build.
