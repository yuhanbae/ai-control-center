# BYOK

Provider credentials belong in server-side storage and must be encrypted at rest. Never send saved keys back to React or log them. The provider abstraction should normalize built-in providers and arbitrary OpenAI-compatible endpoints through `{ baseURL, apiKey, model }`.

For local development, environment variables are supported as a safe bootstrap path. Ollama at `localhost` works when Supix runs locally; a Vercel deployment cannot reach a user's computer localhost.
