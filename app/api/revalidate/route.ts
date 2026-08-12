import { parseBody } from "next-sanity/webhook"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * Webhook de revalidación on-demand para Sanity.
 *
 * Configuración en Sanity (Manage > API > Webhooks):
 *  - URL: https://aini28.com/api/revalidate
 *  - Trigger on: Create, Update, Delete
 *  - HTTP method: POST
 *  - Secret: el mismo valor de SANITY_REVALIDATE_SECRET
 *  - Projection: {_type, "slug": slug.current}
 *
 * Requiere la variable de entorno SANITY_REVALIDATE_SECRET (en Vercel y en el webhook).
 */
type WebhookPayload = {
  _type?: string
  slug?: string
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET
    if (!secret) {
      return new NextResponse("Missing SANITY_REVALIDATE_SECRET", {
        status: 500,
      })
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      secret
    )

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse("Bad request: missing _type", { status: 400 })
    }

    switch (body._type) {
      case "product":
        // Páginas que listan/muestran productos
        revalidatePath("/") // home: destacados, recientes, ofertas destacadas
        revalidatePath("/peluches") // listado principal
        revalidatePath("/ofertas") // ofertas
        if (body.slug) {
          revalidatePath(`/peluches/${body.slug}`) // vista detalle
        }
        break
      case "category":
        revalidatePath("/", "layout") // afecta navegación/filtros en varias rutas
        break
      case "banners":
        revalidatePath("/")
        break
      default:
        // Tipo no mapeado: revalidamos el home por seguridad
        revalidatePath("/")
    }

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      slug: body.slug ?? null,
      now: Date.now(),
    })
  } catch (error) {
    console.error("Revalidate webhook error:", error)
    return new NextResponse((error as Error).message, { status: 500 })
  }
}
