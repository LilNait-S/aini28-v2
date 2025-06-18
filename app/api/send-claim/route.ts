import ClaimsBookEmail from "@/components/email/claims-book-email"
import { ClaimsBookPayload } from "@/lib/validations/claims-book"
import { render } from "@react-email/render"
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import React from "react"

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as ClaimsBookPayload

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FROM_EMAIL_USER_AINI,
        pass: process.env.FROM_EMAIL_PASS_AINI,
      },
    })

    const emailHtmlForSelf = await render(
      React.createElement(ClaimsBookEmail, {
        ...payload, // Pasar todos los datos del payload al componente
      })
    )

    const mailOptionsToSelf = {
      from: `"La tienda Aini28" <${process.env.FROM_EMAIL_USER_AINI}>`,
      to: process.env.TO_EMAIL,
      subject: `Nuevo registro en el Libro de Reclamaciones`,
      html: emailHtmlForSelf,
      headers: {
        "X-Priority": "1",
      },
    }

    await transporter.sendMail(mailOptionsToSelf)

    return NextResponse.json({ message: "Correo enviado correctamente" })
  } catch (error) {
    console.error("Error al enviar correo:", error)
    return NextResponse.json(
      { message: "Error al enviar el correo" },
      { status: 500 }
    )
  }
}
