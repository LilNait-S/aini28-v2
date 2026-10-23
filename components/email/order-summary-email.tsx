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
} from "@react-email/components";

interface Props {
  fullName: string;
  total: number;
  /** "Yape", "Plin" or "Transferencia bancaria". */
  paymentMethod: string;
  /** "Recojo en tienda", "Motorizado · Miraflores, Lima, Lima"… */
  delivery: string;
  address?: string;
  cartItems: {
    name: string;
    qty: number;
    finalPrice: number;
    variantLabel: string;
  }[];
}

/**
 * Confirmation the customer receives after the checkout. The store works the
 * request from its Solicitudes inbox, so there is no store copy.
 */
export default function OrderSummaryEmail({
  fullName,
  total,
  paymentMethod,
  delivery,
  address,
  cartItems,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Solicitud recibida en Aini28</Preview>
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
          <Heading style={{ color: "#333" }}>Solicitud recibida</Heading>
          <Text>
            Hola {fullName}, gracias por tu solicitud. Te escribiremos por
            WhatsApp para confirmar tu pedido y los datos de pago.
          </Text>
          <Text>
            Esta solicitud no confirma una venta ni reserva productos. El
            envío se coordina aparte.
          </Text>
          <Heading as="h3" style={{ fontSize: "18px" }}>
            📦 Productos
          </Heading>
          <Section>
            {cartItems.map((item, idx) => (
              <Text key={idx}>
                {item.qty} × {item.name} ({item.variantLabel}) — S/.{" "}
                {(item.qty * item.finalPrice).toFixed(2)}
              </Text>
            ))}
          </Section>
          <Text>
            <strong>Total referencial:</strong> S/. {total.toFixed(2)}
          </Text>
          <Hr />
          <Text>
            <strong>Pagarás con:</strong> {paymentMethod}
          </Text>
          <Text>
            <strong>Entrega:</strong> {delivery}
          </Text>
          {address ? (
            <Text>
              <strong>Dirección:</strong> {address}
            </Text>
          ) : null}
          <Hr />
          <Text style={{ color: "#888", fontSize: "12px" }}>
            Gracias por confiar en nosotros.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
