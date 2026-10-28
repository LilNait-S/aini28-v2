import { NextRequest, NextResponse } from "next/server";
import { plushApiUrl } from "@/lib/catalog/plush";
import { shippingAgenciesSchema } from "@/types/shipping";
import { getClientIp } from "@/lib/security/request-guards";
import { rateLimit } from "@/lib/security/rate-limit";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2 || q.length > 100) return NextResponse.json({agencies: []});
  try {
    const rate = await rateLimit(`shipping-search:${getClientIp(request)}`, {limit: 40, windowMs: 60000});
    if (!rate.success) return NextResponse.json({message: "Espera un minuto antes de seguir buscando."}, {status: 429, headers: {"Retry-After": String(rate.retryAfter)}});
    const response = await fetch(`${plushApiUrl()}/api/public/shipping-agencies?q=${encodeURIComponent(q)}`, {next: {revalidate: 300}, signal: AbortSignal.timeout(10000)});
    if (!response.ok) return NextResponse.json({message: "El directorio no está disponible. Intenta nuevamente."}, {status: response.status === 429 ? 429 : 503});
    return NextResponse.json(shippingAgenciesSchema.parse(await response.json()));
  } catch {
    return NextResponse.json({message: "No se pudo consultar el directorio."}, {status: 503});
  }
}
