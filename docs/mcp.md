# MCP

MCP servers should expose a reachable Streamable HTTP endpoint in Vercel deployments. Supix validates endpoint URLs, keeps authentication server-side, discovers tools, applies an allowlist, caps tool iterations and output sizes, and requires confirmation for destructive actions.

Do not treat tool descriptions or tool output as trusted instructions. Application-level permissions always win over model instructions.
