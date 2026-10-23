import Link from "next/link"
import { readCompany } from "@/lib/catalog/plush"
import { IconInstagram, IconTikTok } from "../icons"
import { IsoLogoAini28 } from "./logo-aini"

const iconClass =
  "transition duration-200 ease-in-out fill-slate-500 hover:fill-primary w-6 h-6"

/** "+51987654321" or "987654321" → "+51 987-654-321". */
function displayPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^51(?=9\d{8}$)/, "")
  return /^9\d{8}$/.test(digits)
    ? `+51 ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    : value
}

/** Contact data comes from Plush; a missing field is simply not shown. */
export async function Footer() {
  const company = await readCompany()
  const address = [company?.address, company?.reference]
    .filter(Boolean)
    .join(", ")
  return (
    <div className="bg-slate-100 py-36">
      <footer className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 place-content-center">
          {/* Libro de reclamaciones */}
          <picture className="flex justify-center items-center">
            <Link href={"/claims-book"}>
              <img
                src="/libro.webp"
                alt="libro de reclamaciones"
                className="w-32 sm:w-40"
              />
            </Link>
          </picture>

          {/* Logo y redes sociales */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <Link href="/" className="py-2">
              <IsoLogoAini28 />
            </Link>
            <div className="flex space-x-3">
              {company?.instagramUrl ? (
                <a
                  aria-label="Instagram"
                  href={company.instagramUrl}
                  className="cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconInstagram className={iconClass} />
                </a>
              ) : null}
              {company?.tiktokUrl ? (
                <a
                  aria-label="TikTok"
                  href={company.tiktokUrl}
                  className="cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconTikTok className={iconClass} />
                </a>
              ) : null}
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6 text-center sm:text-left">
            {address ? (
              <div className="flex flex-col">
                <span className="font-semibold">Dirección</span>
                {company?.mapsUrl ? (
                  <a
                    className="text-slate-500 hover:text-primary"
                    href={company.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {address}
                  </a>
                ) : (
                  <p className="text-slate-500">{address}</p>
                )}
              </div>
            ) : null}
            {company?.whatsapp ? (
              <div className="flex flex-col">
                <span className="font-semibold">Celular</span>
                <p className="text-slate-500">{displayPhone(company.whatsapp)}</p>
              </div>
            ) : null}
            {company?.email ? (
              <div className="flex flex-col">
                <span className="font-semibold">Correo Electrónico</span>
                <p className="text-slate-500">{company.email}</p>
              </div>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  )
}
