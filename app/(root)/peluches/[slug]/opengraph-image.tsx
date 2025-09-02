import { ImageResponse } from "next/og"
import { getPeluche } from "@/lib/actions/product"

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const peluche = await getPeluche({ slug })
    const firstImageUrl = peluche.images?.[0]?.asset?._ref
      ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${peluche.images[0].asset._ref.replace("image-", "").replace("-webp", ".webp").replace("-jpg", ".jpg").replace("-png", ".png")}`
      : null

    const basePrice = peluche.sizePricing?.find((s) => s.isActive)?.price || 0
    const salePrice = peluche.sizePricing?.find((s) => s.isActive)?.salePrice

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Container principal */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "60px",
            }}
          >
            {/* Lado izquierdo - Información del producto */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "50%",
                paddingRight: "40px",
              }}
            >
              {/* Logo/Marca */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#8b5cf6",
                    marginRight: "10px",
                  }}
                >
                  🧸 Aini28
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#64748b",
                  }}
                >
                  Peluches de Calidad
                </div>
              </div>

              {/* Nombre del producto */}
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  lineHeight: "1.1",
                  marginBottom: "20px",
                  margin: "0 0 20px 0",
                }}
              >
                {peluche.name || slug}
              </h1>

              {/* Precio */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "30px",
                }}
              >
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: salePrice ? "#dc2626" : "#8b5cf6",
                  }}
                >
                  S/.{salePrice ? salePrice.toFixed(2) : basePrice.toFixed(2)}
                </span>
                {salePrice && (
                  <span
                    style={{
                      fontSize: "24px",
                      textDecoration: "line-through",
                      color: "#94a3b8",
                      marginLeft: "15px",
                    }}
                  >
                    S/.{basePrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Características */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ✅ Calidad antialérgica
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ✅ Relleno de napa siliconada
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  🚚 Envío gratis en Lima
                </div>
              </div>
            </div>

            {/* Lado derecho - Imagen del producto */}
            <div
              style={{
                display: "flex",
                width: "50%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {firstImageUrl ? (
                <div
                  style={{
                    width: "400px",
                    height: "400px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={firstImageUrl}
                    alt={peluche.name || "Peluche"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "400px",
                    height: "400px",
                    borderRadius: "20px",
                    background: "linear-gradient(45deg, #e2e8f0, #cbd5e1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "120px",
                  }}
                >
                  🧸
                </div>
              )}
            </div>
          </div>

          {/* Footer con URL */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "40px",
              fontSize: "14px",
              color: "#94a3b8",
            }}
          >
            aini28.com/peluches/{slug}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch {
    // Fallback en caso de error
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "120px",
                marginBottom: "20px",
              }}
            >
              🧸
            </div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#1e293b",
                margin: "0 0 10px 0",
              }}
            >
              Aini28
            </h1>
            <p
              style={{
                fontSize: "24px",
                color: "#64748b",
                margin: "0",
              }}
            >
              Peluches de Calidad
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}
