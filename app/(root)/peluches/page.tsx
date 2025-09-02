import { Container } from "@/components/container"
import { getAllPeluches } from "@/lib/actions/product"
import { getPeluchesSchema } from "@/lib/validations/search/products"
import { Params } from "@/types/params"
import { FiltersToolbar } from "./filters-toolbar"
import { PeluchesQueryContainer } from "./peluches-query-container"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Metadata } from "next"

export async function generateMetadata({ searchParams }: Params): Promise<Metadata> {
  const search = getPeluchesSchema.parse(await searchParams)
  
  // Crear título dinámico basado en filtros
  let title = "Peluches de Calidad - Aini28"
  let description = "Descubre nuestra colección completa de peluches de alta calidad. Material antialérgico, envío gratis en Lima."
  
  // Personalizar según filtros activos
  if (search.search) {
    title = `Peluches "${search.search}" - Aini28`
    description = `Encuentra peluches relacionados con "${search.search}". Calidad garantizada y envío gratis en Lima.`
  }
  
  if (search.category) {
    title = `Peluches ${search.category} - Aini28`
    description = `Explora nuestra colección de peluches ${search.category}. Material antialérgico y de alta calidad.`
  }
  
  if (search.isFeatured) {
    title = "Peluches Destacados - Aini28"
    description = "Descubre nuestros peluches más populares y destacados. Selección especial de alta calidad."
  }

  // Keywords dinámicas
  const keywords = [
    'peluches Peru',
    'juguetes Lima',
    'peluches calidad',
    'regalos niños',
    'peluches antialergicos',
    'tienda peluches online',
    search.search ? `peluches ${search.search}` : '',
    search.category ? `peluches ${search.category}` : '',
  ].filter(Boolean).join(', ')

  return {
    title,
    description,
    keywords,
    
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://aini28.com/peluches',
      siteName: 'Aini28',
      locale: 'es_PE',
      images: [
        {
          url: 'https://aini28.com/og-peluches.jpg', // Puedes crear una imagen específica
          width: 1200,
          height: 630,
          alt: 'Colección de peluches Aini28',
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@aini28_peru',
    },

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

    alternates: {
      canonical: 'https://aini28.com/peluches',
    },
  }
}

export default async function Peluches({ searchParams }: Params) {
  const search = getPeluchesSchema.parse(await searchParams)
  const peluches = getAllPeluches(search)

  return (
    <Container>
      <section className="space-y-8 pt-4 pb-20">
        <FiltersToolbar />
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center">
              <LoadingSpinner />
            </div>
          }
        >
          <PeluchesQueryContainer peluchesPromise={peluches} />
        </Suspense>
      </section>
    </Container>
  )
}
