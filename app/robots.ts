import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /p/ não entra aqui: as páginas de casal usam meta noindex, e o crawler
        // precisa conseguir acessá-las para ler essa tag (e o WhatsApp para gerar o preview)
        disallow: ['/api/', '/dashboard', '/editar/', '/colaborar/', '/criar/', '/auth/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
