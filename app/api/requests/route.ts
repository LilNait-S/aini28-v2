import OrderSummaryEmail from "@/components/email/order-summary-email";
import { guardMailRequest } from "@/lib/security/request-guards";
import { orderPayloadSchema } from "@/lib/validations/order";
import { peruvianMobile } from "@/lib/validations/customer-contact";
import { deliveryLabel, paymentMethodLabels } from "@/lib/checkout";
import { createSaleRequest, readAllProducts } from "@/lib/catalog/plush";
import { quoteCart, UnpublishedItemError } from "@/lib/catalog/quote";
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

  // The Solicitud exists in Plush; a failed email must not make the customer
  // send it again, so it is only reported.
  let emailSent = true;
  try {
    const html = await render(
      React.createElement(OrderSummaryEmail, {
        fullName: userDetails.fullName,
        total: Number(plush.body.total),
        paymentMethod: paymentMethodLabels[userDetails.paymentMethod],
        delivery: deliveryLabel(userDetails.delivery),
        address:
          userDetails.delivery.type === "MOTORBIKE"
            ? userDetails.delivery.address
            : undefined,
        cartItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          finalPrice: item.finalPrice,
          variantLabel: item.variantLabel,
        })),
      }),
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FROM_EMAIL_USER_AINI,
        pass: process.env.FROM_EMAIL_PASS_AINI,
      },
    });
    await transporter.sendMail({
      from: `"La tienda Aini28" <${process.env.FROM_EMAIL_USER_AINI}>`,
      to: userDetails.email,
      subject: "Solicitud recibida en Aini28",
      html,
    });
  } catch {
    emailSent = false;
    console.error("No se pudo enviar el correo de confirmación.");
  }

  return NextResponse.json({ message: "Solicitud registrada", emailSent });
}
