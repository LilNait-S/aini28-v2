import { NextRequest, NextResponse } from "next/server";
import { readAllProducts } from "@/lib/catalog/plush";
import {
  quoteCart,
  quoteRequestSchema,
  UnpublishedItemError,
} from "@/lib/catalog/quote";
import {
  verifyOrigin,
  exceedsMaxBody,
  getClientIp,
} from "@/lib/security/request-guards";
import { rateLimit } from "@/lib/security/rate-limit";
import { COMPANY } from "@/constants/phone-company";

export async function POST(req: NextRequest) {
  if (!verifyOrigin(req))
    return NextResponse.json(
      { message: "Origen no permitido" },
      { status: 403 },
    );
  if (exceedsMaxBody(req))
    return NextResponse.json(
      { message: "Solicitud demasiado grande" },
      { status: 413 },
    );
  const limit = await rateLimit(`quote:${getClientIp(req)}`, {
    limit: 30,
    windowMs: 60000,
  });
  if (!limit.success)
    return NextResponse.json(
      { message: "Intenta nuevamente en un minuto." },
      { status: 429 },
    );
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }
  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ message: "Carrito inválido" }, { status: 400 });
  try {
    const quote = quoteCart(parsed.data, await readAllProducts());
    const text = [
      "Hola, quisiera consultar por estos peluches:",
      ...quote.cartItems.map(
        (item) =>
          `${item.qty} x ${item.name} (${item.variantLabel}) — S/. ${item.finalPrice.toFixed(2)} c/u\n${COMPANY.web}/peluches/${item.slug}?variant=${item.selectedSize}`,
      ),
      `Total referencial: S/. ${quote.total.toFixed(2)}`,
      "Quisiera coordinar la venta y el envío.",
    ].join("\n\n");
    return NextResponse.json(
      {
        ...quote,
        whatsappUrl: `${COMPANY.whatsappUrl}?text=${encodeURIComponent(text)}`,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof UnpublishedItemError
            ? error.message
            : "No pudimos consultar el catálogo. Intenta nuevamente.",
      },
      { status: error instanceof UnpublishedItemError ? 409 : 503 },
    );
  }
}
