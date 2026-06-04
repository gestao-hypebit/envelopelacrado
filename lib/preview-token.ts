import { createHmac } from 'crypto'

const SECRET = process.env.PREVIEW_SECRET ?? 'dev-preview-secret-change-in-prod'

/** Gera um token de 24 chars derivado do pageId via HMAC-SHA256 */
export function generatePreviewToken(pageId: string): string {
  return createHmac('sha256', SECRET).update(pageId).digest('hex').slice(0, 24)
}

/** Verifica se o token corresponde ao pageId */
export function verifyPreviewToken(pageId: string, token: string): boolean {
  if (!token || token.length !== 24) return false
  return generatePreviewToken(pageId) === token
}
