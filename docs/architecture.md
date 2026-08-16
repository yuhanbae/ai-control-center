# Supix architecture

Supix separates browser UI from server-only provider and MCP execution. The browser sends chat prompts and receives safe text/status events; API keys and MCP credentials are resolved only in route handlers.

The first vertical slice uses the Vercel AI SDK with an OpenAI-compatible provider and a local demo fallback. Production persistence should implement the storage interfaces with Neon/Drizzle and scope every record by user ID. MCP connections should prefer Streamable HTTP for Vercel request lifetimes; stdio and localhost processes are local-development only.
