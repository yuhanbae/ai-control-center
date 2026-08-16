import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

function createKey(value: string) {
  return Buffer.from(value.padEnd(32, '0').slice(0, 32), 'utf8')
}

export function encryptSecret(value: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', createKey(process.env.ENCRYPTION_KEY ?? ''), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return [iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.')
}

export function decryptSecret(value: string) {
  const [iv, tag, encrypted] = value.split('.')
  if (!iv || !tag || !encrypted) throw new Error('Invalid encrypted secret.')
  const decipher = createDecipheriv('aes-256-gcm', createKey(process.env.ENCRYPTION_KEY ?? ''), Buffer.from(iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64url')), decipher.final()]).toString('utf8')
}

export function assertSecretsConfigured() {
  if (!process.env.ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is required for encrypted credentials.')
}

