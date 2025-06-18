import OrderSummaryEmail from "@/components/email/order-summary-email"
import { OrderPayload } from "@/types/order"
import { render } from "@react-email/render"
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import React from "react"

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as OrderPayload

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM_EMAIL_USER_AINI,
      pass: process.env.FROM_EMAIL_PASS_AINI,
    },
  })

  const total = payload.cartItems.reduce(
    (acc, item) => acc + item.finalPrice * item.qty,
    0
  )

  const emailHtmlForSelf = await render(
    React.createElement(OrderSummaryEmail, {
      fullName: payload.userDetails.fullName,
      email: payload.userDetails.email,
      phoneNumber: payload.userDetails.phoneNumber,
      total,
      paymentMethod: payload.userDetails.paymentMethod,
      shippingMethod: payload.userDetails.shippingMethod,
      address: {
        country: payload.userDetails.country,
        department: payload.userDetails.department,
        province: payload.userDetails.province,
        district: payload.userDetails.district,
        address: payload.userDetails.address,
      },
      cartItems: payload.cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        finalPrice: item.finalPrice,
        selectedSize: item.selectedSize,
      })),
      isForCustomer: false,
    })
  )

  const emailHtmlForCustomer = await render(
    React.createElement(OrderSummaryEmail, {
      fullName: payload.userDetails.fullName,
      email: payload.userDetails.email,
      phoneNumber: payload.userDetails.phoneNumber,
      total,
      paymentMethod: payload.userDetails.paymentMethod,
      shippingMethod: payload.userDetails.shippingMethod,
      address: {
        country: payload.userDetails.country,
        department: payload.userDetails.department,
        province: payload.userDetails.province,
        district: payload.userDetails.district,
        address: payload.userDetails.address,
      },
      cartItems: payload.cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        finalPrice: item.finalPrice,
        selectedSize: item.selectedSize,
      })),
      isForCustomer: true,
    })
  )

  // Opciones para el correo a ti mismo
  const mailOptionsToSelf = {
    from: `"La tienda Aini28" <${process.env.FROM_EMAIL_USER_AINI}>`,
    to: process.env.TO_EMAIL,
    subject: `Nuevo pedido recibido de ${payload.userDetails.fullName}`,
    html: emailHtmlForSelf,
    headers: {
      "X-Priority": "1",
    },
  }

  const mailOptionsToCustomer = {
    from: `"La tienda Aini28" <${process.env.FROM_EMAIL_USER_AINI}>`,
    to: payload.userDetails.email,
    subject: "Confirmación de tu pedido en Aini28",
    html: emailHtmlForCustomer,
  }

  try {
    await transporter.sendMail(mailOptionsToSelf)
    await transporter.sendMail(mailOptionsToCustomer)
    return NextResponse.json({ message: "Correo enviado correctamente" })
  } catch (error) {
    console.error("Error al enviar correo:", error)
    return NextResponse.json(
      { message: "Error al enviar el correo" },
      { status: 500 }
    )
  }
}
