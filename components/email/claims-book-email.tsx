import { ClaimsBookPayload } from "@/lib/validations/claims-book"
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from "@react-email/components"
import * as React from "react"

type ClaimsBookEmailProps = ClaimsBookPayload

export default function ClaimsBookEmail({
  nombre,
  apellido,
  tipoDocumento,
  numeroDocumento,
  domicilio,
  email,
  telefono,
  tipoReclamacion,
  detalleReclamacion,
  pedidoConsumidor,
  fecha,
}: ClaimsBookEmailProps) {
  // Convertir `fecha` a un objeto Date si no lo es
  const formattedDate =
    typeof fecha === "string" ? new Date(fecha) : fecha

  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
          padding: "20px",
        }}
      >
        <Container
          style={{
            padding: "20px",
            maxWidth: "600px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Heading as="h2" style={{ color: "#333", marginBottom: "20px" }}>
            Nuevo Registro en el Libro de Reclamaciones
          </Heading>

          <Section>
            <Heading as="h3" style={{ fontSize: "18px", marginBottom: "10px" }}>
              Datos del Consumidor
            </Heading>
            <Text>
              <strong>Nombre:</strong> {nombre} {apellido}
            </Text>
            <Text>
              <strong>Tipo de Documento:</strong> {tipoDocumento.toUpperCase()}
            </Text>
            <Text>
              <strong>Número de Documento:</strong> {numeroDocumento}
            </Text>
            <Text>
              <strong>Domicilio:</strong> {domicilio}
            </Text>
            <Text>
              <strong>Email:</strong> {email}
            </Text>
            <Text>
              <strong>Teléfono:</strong> {telefono}
            </Text>
          </Section>

          <Section style={{ marginTop: "20px" }}>
            <Heading as="h3" style={{ fontSize: "18px", marginBottom: "10px" }}>
              Detalle de la Reclamación
            </Heading>
            <Text>
              <strong>Tipo:</strong> {tipoReclamacion.toUpperCase()}
            </Text>
            <Text>
              <strong>Detalle:</strong> {detalleReclamacion}
            </Text>
            <Text>
              <strong>Pedido del Consumidor:</strong> {pedidoConsumidor}
            </Text>
          </Section>

          <Section style={{ marginTop: "20px" }}>
            <Text>
              <strong>Fecha:</strong>{" "}
              {formattedDate.toLocaleDateString("es-PE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}