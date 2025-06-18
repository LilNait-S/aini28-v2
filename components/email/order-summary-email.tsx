import { parseSize } from "@/utils/parse-size"
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components"

interface Props {
  fullName: string
  email: string
  phoneNumber: string
  total: number
  paymentMethod: string
  shippingMethod: string
  address: {
    country?: string
    department?: string
    province?: string
    district?: string
    address?: string
  }
  cartItems: {
    name: string
    qty: number
    finalPrice: number
    selectedSize: number
  }[]
  isForCustomer?: boolean // Nueva propiedad para diferenciar el correo
}

export default function OrderSummaryEmail({
  fullName,
  email,
  total,
  paymentMethod,
  shippingMethod,
  address,
  cartItems,
  phoneNumber,
  isForCustomer = false, // Valor predeterminado: falso (correo para ti mismo)
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        {isForCustomer
          ? `Confirmación de tu pedido en Aini28`
          : `Nuevo pedido recibido de ${fullName}`}
      </Preview>
      <Body
        style={{
          backgroundColor: "#f4f4f4",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <Heading style={{ color: "#333" }}>
            {isForCustomer
              ? "🎉 Confirmación de tu pedido"
              : "🧾 Nuevo pedido recibido"}
          </Heading>
          {isForCustomer ? (
            <Text>
              Hola {fullName}, gracias por tu pedido. Aquí tienes un resumen de
              tu compra:
            </Text>
          ) : (
            <Text>
              Has recibido un nuevo pedido de <strong>{fullName}</strong>. Aquí
              tienes los detalles:
            </Text>
          )}
          <Text>
            <strong>Cliente:</strong> {fullName}
          </Text>
          <Text>
            <strong>Email:</strong> {email}
          </Text>
          <Text>
            <strong>Teléfono:</strong> {phoneNumber}
          </Text>
          <Text>
            <strong>Total:</strong> S/. {total.toFixed(2)}
          </Text>
          <Text>
            <strong>Forma de pago:</strong> {paymentMethod}
          </Text>
          <Text>
            <strong>Método de envío:</strong> {shippingMethod}
          </Text>
          <Hr />
          <Heading as="h3" style={{ fontSize: "18px" }}>
            📦 Productos:
          </Heading>
          <Section>
            {cartItems.map((item, idx) => (
              <Text key={idx}>
                {item.name} — Talla: {parseSize(item.selectedSize).label} —
                Cant: {item.qty} — Subtotal: S/.{" "}
                {(item.qty * item.finalPrice).toFixed(2)}
              </Text>
            ))}
          </Section>
          <Hr />
          <Heading as="h3" style={{ fontSize: "18px" }}>
            🏠 Información de envío:
          </Heading>
          <Text>
            <strong>Dirección:</strong> {address.address}
          </Text>
          <Text>
            <strong>Distrito:</strong> {address.district}
          </Text>
          <Text>
            <strong>Provincia:</strong> {address.province}
          </Text>
          <Text>
            <strong>Departamento:</strong> {address.department}
          </Text>
          <Text>
            <strong>País:</strong> {address.country}
          </Text>
          <Hr />
          {isForCustomer ? (
            <Text style={{ color: "#888", fontSize: "12px" }}>
              Gracias por confiar en nosotros. Nos pondremos en contacto contigo
              pronto para más detalles.
            </Text>
          ) : (
            <Text style={{ color: "#888", fontSize: "12px" }}>
              Este correo fue generado automáticamente desde tu tienda.
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  )
}
