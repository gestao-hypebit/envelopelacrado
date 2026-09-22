import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Páginas de casal ficam fora de propósito: são conteúdo privado (noindex)
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/criar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
