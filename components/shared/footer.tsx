import Link from "next/link"
import { IsoLogoAini28 } from "./logo-aini"
import { IconFacebook, IconInstagram, IconTikTok } from "../icons"

export function Footer() {
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
              <a
                href="https://www.instagram.com"
                className="cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconInstagram className="transition duration-200 ease-in-out fill-slate-500 hover:fill-primary w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com"
                className="cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconTikTok className="transition duration-200 ease-in-out fill-slate-500 hover:fill-primary w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com"
                className="cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconFacebook className="transition duration-200 ease-in-out fill-slate-500 hover:fill-primary w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6 text-center sm:text-left">
            <div className="flex flex-col">
              <span className="font-semibold">Dirección</span>
              <p className="text-slate-500">
                Av. Arenales 1737, Centro Comercial Arenales, Tienda 3-05A
              </p>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Celular</span>
              <p className="text-slate-500">+51 927-742-710</p>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Correo Electrónico</span>
              <p className="text-slate-500">Aini28.onlinestore@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
