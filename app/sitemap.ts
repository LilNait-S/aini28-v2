import { getAllPeluches } from '@/lib/actions/product'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener todos los peluches para generar URLs dinámicas
  const { products: peluches } = await getAllPeluches({ pageSize: 1000 }) // Obtener todos los productos
  
  // URLs de productos individuales
  const pelucheUrls = peluches.map((peluche) => ({
    url: `https://aini28.com/peluches/${peluche.slug?.current}`,
    lastModified: new Date(peluche._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    // Página principal
    {
      url: 'https://aini28.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Página de peluches
    {
      url: 'https://aini28.com/peluches',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Páginas estáticas importantes
    {
      url: 'https://aini28.com/nosotros',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://aini28.com/ofertas',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://aini28.com/moda',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: 'https://aini28.com/checkout',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://aini28.com/claims-book',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    // URLs dinámicas de productos
    ...pelucheUrls,
  ]
}
