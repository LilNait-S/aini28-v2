import { Container } from "@/components/container"
import { getPeluche } from "@/lib/actions/product"
import { Params } from "@/types/params"
import { PelucheBreadcrumb } from "./peluche-breadcrumb"
import { PelucheClient } from "./peluche-client"
import { PelucheImages } from "./peluche-images"
import { LikeCounter } from "./like-counter"
import { ProductSchema } from "@/components/seo/product-schema"
import type { Metadata } from "next"
import { urlFor } from "@/sanity/lib/image"

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const peluche = await getPeluche({ slug })
    
    // Obtener precio y precio de oferta
    const activePricing = peluche.sizePricing?.find(s => s.isActive)
    const price = activePricing?.price || 0
    const salePrice = activePricing?.salePrice
    const finalPrice = salePrice || price
    
    // Obtener la primera imagen para compartir
    const firstImage = peluche.images?.[0]
    const imageUrl = firstImage ? urlFor(firstImage).width(1200).height(630).url() : null
    
    // Crear descripción optimizada para SEO
    const baseDescription = peluche.description || `Peluche ${peluche.name} de alta calidad`
    const seoDescription = `${baseDescription}. Precio ${salePrice ? 'en oferta' : 'desde'} S/.${finalPrice.toFixed(2)}. Material antialérgico, envío gratis en Lima. ¡Compra ahora en Aini28!`
    
    // Keywords relevantes
    const keywords = [
      `peluche ${peluche.name?.toLowerCase()}`,
      'peluches Peru',
      'juguetes Lima',
      'peluches calidad',
      'regalos niños',
      'peluches antialergicos',
      activePricing?.approximateSize ? `peluche ${activePricing.approximateSize}cm` : '',
      peluche.category ? `peluches ${peluche.category}` : '',
    ].filter(Boolean).join(', ')

    return {
      title: `${peluche.name} - Peluche de Calidad | Aini28`,
      description: seoDescription,
      keywords,
      
      // Open Graph para redes sociales
      openGraph: {
        title: `${peluche.name} - Aini28`,
        description: baseDescription,
        type: 'website', // Cambiado de 'product' a 'website'
        url: `https://aini28.com/peluches/${slug}`,
        siteName: 'Aini28',
        locale: 'es_PE',
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${peluche.name} - Peluche de calidad Aini28`,
          },
        ] : [
          {
            url: `/peluches/${slug}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `${peluche.name} - Peluche de calidad Aini28`,
          },
        ],
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: `${peluche.name} - Aini28`,
        description: baseDescription,
        images: imageUrl ? [imageUrl] : [`/peluches/${slug}/opengraph-image`],
        creator: '@aini28_peru',
      },

      // Datos adicionales para SEO
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Canonical URL
      alternates: {
        canonical: `https://aini28.com/peluches/${slug}`,
      },

      // Datos del producto para redes sociales
      other: {
        'product:price:amount': finalPrice.toString(),
        'product:price:currency': 'PEN',
        'product:availability': 'instock',
        'product:condition': 'new',
        'product:brand': 'Aini28',
      },
    }
  } catch {
    // Fallback en caso de error
    return {
      title: 'Producto no encontrado - Aini28',
      description: 'El producto que buscas no está disponible. Explora nuestra colección de peluches de calidad.',
      robots: { index: false, follow: true },
    }
  }
}

export default async function Peluche({ params }: Params) {
  const { slug } = await params
  const peluche = await getPeluche({ slug })
  const { name, code, slug: Slug, likes } = peluche

  return (
    <>
      <ProductSchema peluche={peluche} slug={slug} />
      <Container className="pb-40">
        <section className="flex flex-col">
          <header className="py-4">
            <PelucheBreadcrumb pelucheName={name} />
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <PelucheImages peluche={peluche} />

            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center mb-0">
                <span className="text-primary">Aini28</span>
                <span>{code}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
                {name}
              </h1>
              <LikeCounter slug={Slug} initialLikes={likes} />
              <PelucheClient peluche={peluche} slug={slug} />
            </div>
          </main>
        </section>
      </Container>
    </>
  )
}
