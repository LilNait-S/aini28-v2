import OrderSummaryEmail from "@/components/email/order-summary-email";
import {
  exceedsMaxBody,
  guardMailRequest,
  verifyOrigin,
} from "@/lib/security/request-guards";
import { orderPayloadSchema } from "@/lib/validations/order";
import { peruvianMobile } from "@/lib/validations/customer-contact";
import { deliveryLabel, paymentMethodLabels } from "@/lib/checkout";
import {
  createSaleRequest,
  readAllProducts,
  readCompany,
  plushApiUrl,
} from "@/lib/catalog/plush";
import {
  quoteCart,
  recordedEmailLines,
  UnpublishedItemError,
} from "@/lib/catalog/quote";
import { orderMessage } from "@/lib/checkout-receipt";
import { whatsappLink } from "@/types/catalog";
import { shippingAgenciesSchema } from "@/types/shipping";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import React from "react";

const retryMessage = "No pudimos enviar tu solicitud. Intenta nuevamente.";

/**
 * Checkout → Plush Solicitud. Plush reprices every line and rejects stale
 * prices or sold-out items; nothing is reserved. The customer then gets a
 * confirmation email; the store works the request from its Plush inbox.
 */
export async function POST(req: NextRequest) {
  // Cheap checks before reading the body; the full guard runs after parsing.
  if (!verifyOrigin(req))
    return NextResponse.json(
      { message: "Origen no permitido" },
      { status: 403 },
    );
  if (exceedsMaxBody(req))
    return NextResponse.json(
      { message: "Payload demasiado grande" },
      { status: 413 },
    );
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }

  const guardResponse = await guardMailRequest(req, body, {
    routeId: "requests",
  });
  if (guardResponse) return guardResponse;

  const parsed = orderPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Revisa los datos de tu solicitud." },
      { status: 400 },
    );
  }
  const { clientRequestId, userDetails, cartItems } = parsed.data;

  let plush;
  try {
    plush = await createSaleRequest({
      clientRequestId,
      customerName: userDetails.fullName,
      phone: peruvianMobile(userDetails.phoneNumber),
      email: userDetails.email,
      preferredPaymentMethod: userDetails.paymentMethod,
      delivery: userDetails.delivery,
      items: cartItems.map((item) => ({
        variantId: item.selectedSize,
        quantity: item.qty,
        unitPrice: item.finalPrice.toFixed(2),
      })),
    });
  } catch {
    console.error("No se pudo registrar la solicitud en Plush.");
    return NextResponse.json({ message: retryMessage }, { status: 503 });
  }

  if (plush.status === 409) {
    const code = plush.body?.code;
    if (
      code === "SHIPPING_AGENCY_UNAVAILABLE" ||
      code === "SHIPPING_AGENCY_LOCATION_MISMATCH"
    )
      return NextResponse.json(
        {
          message:
            "La agencia seleccionada cambió o no está disponible. Vuelve a elegir la sede.",
        },
        { status: 409 },
      );
    if (code === "SALE_REQUEST_ITEMS_UNAVAILABLE")
      return NextResponse.json(
        {
          message:
            "Algunos productos se agotaron o ya no están disponibles. Los quitamos de tu carrito.",
          unavailable: plush.body?.variantIds ?? [],
        },
        { status: 409 },
      );
    if (code === "SALE_REQUEST_PRICES_CHANGED") {
      try {
        const quote = quoteCart({ cartItems }, await readAllProducts());
        return NextResponse.json(
          {
            message:
              "Los precios cambiaron. Revisa el resumen y vuelve a enviar tu solicitud.",
            quote,
          },
          { status: 409 },
        );
      } catch (error) {
        return NextResponse.json(
          {
            message:
              error instanceof UnpublishedItemError
                ? error.message
                : retryMessage,
          },
          { status: error instanceof UnpublishedItemError ? 409 : 503 },
        );
      }
    }
  }
  if (plush.status === 400)
    return NextResponse.json(
      { message: "Revisa los datos de tu solicitud." },
      { status: 400 },
    );
  if (plush.status !== 201 || typeof plush.body?.total !== "string") {
    console.error(`Plush rechazó la solicitud (HTTP ${plush.status}).`);
    return NextResponse.json({ message: retryMessage }, { status: 503 });
  }

  // Once saved, optional catalog/contact/email failures must never turn success
  // into a retry. Frozen quantities/prices always come from Plush.
  const companyPromise = readCompany();
  const items = Array.isArray(plush.body.items) ? plush.body.items : [];
  const productsPromise = readAllProducts().catch(() => []);
  let lines: ReturnType<typeof recordedEmailLines> = [];
  try {
    lines = recordedEmailLines(items, []);
  } catch {
    /* Upstream contract failure: retain the reference. */
  }

  let delivery = deliveryLabel(userDetails.delivery);
  if (userDetails.delivery.type === "MOTORBIKE")
    delivery += ` · ${userDetails.delivery.address}`;
  if (userDetails.delivery.type === "AGENCY") {
    const agencyId = userDetails.delivery.agencyId;
    if (userDetails.delivery.agencyNote)
      delivery += ` · Sede pendiente de confirmar: ${userDetails.delivery.agencyNote}`;
    else if (userDetails.delivery.agencyId) {
      try {
        const response = await fetch(
          `${plushApiUrl()}/api/public/shipping-agencies?id=${encodeURIComponent(userDetails.delivery.agencyId)}`,
          { cache: "no-store", signal: AbortSignal.timeout(10000) },
        );
        if (!response.ok) throw new Error("Directory unavailable");
        const agency = shippingAgenciesSchema
          .parse(await response.json())
          .agencies.find((row) => row.id === agencyId);
        delivery += agency
          ? ` · ${agency.name} · ${agency.address}`
          : " · Consulta la sede seleccionada en la solicitud";
      } catch {
        delivery += " · Consulta la sede seleccionada en la solicitud";
      }
    }
  }
  try {
    lines = recordedEmailLines(items, await productsPromise);
  } catch {
    /* Keep frozen quantities and prices. */
  }
  const message = orderMessage({
    id: String(plush.body.id),
    name: userDetails.fullName,
    total: plush.body.total,
    payment: paymentMethodLabels[userDetails.paymentMethod],
    delivery,
    lines,
  });
  const company = await companyPromise;
  const whatsappUrl = whatsappLink(company, message);

  // The Solicitud exists in Plush; a failed email must not make the customer
  // send it again, so it is only reported.
  let emailSent = true;
  let emailTimer: ReturnType<typeof setTimeout> | undefined;
  try {
    const html = await render(
      React.createElement(OrderSummaryEmail, {
        fullName: userDetails.fullName,
        total: Number(plush.body.total),
        paymentMethod: paymentMethodLabels[userDetails.paymentMethod],
        delivery,
        // Only Plush data: the browser's product names never reach the email.
        cartItems: lines,
      }),
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      auth: {
        user: process.env.FROM_EMAIL_USER_AINI,
        pass: process.env.FROM_EMAIL_PASS_AINI,
      },
    });
    await Promise.race([
      transporter.sendMail({
        from: `"La tienda Aini28" <${process.env.FROM_EMAIL_USER_AINI}>`,
        to: userDetails.email,
        subject: "Solicitud recibida en Aini28",
        html,
      }),
      new Promise((_, reject) => {
        emailTimer = setTimeout(() => {
          transporter.close();
          reject(new Error("Email timeout"));
        }, 8000);
        emailTimer.unref();
      }),
    ]);
  } catch {
    emailSent = false;
    console.error("No se pudo enviar el correo de confirmación.");
  } finally {
    if (emailTimer) clearTimeout(emailTimer);
  }

  return NextResponse.json(
    {
      id: plush.body.id,
      message,
      whatsappUrl,
      emailSent,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
