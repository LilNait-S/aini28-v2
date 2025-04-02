import Link from "next/link"
import { LogoAini28 } from "./logo-aini"
import { IconFacebook, IconInstagram, IconTikTok } from "../icons"

export function Footer() {
  return (
    <div className="bg-slate-100 py-20">
      <footer className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-3 place-content-center">
          <picture className="flex justify-center items-center">
            <Link href={"/claims-book"}>
              <img src="/libro.webp" alt="libro de reclamaciones" />
            </Link>
          </picture>

          <div className="flex flex-col gap-4 justify-center items-center">
            <Link href="/" className="py-2">
              <LogoAini28 />
            </Link>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com"
                className="cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconInstagram className="transition duration-200 ease-in-out fill-slate-500 hover:fill-primary" />
              </a>
              <a
                href="https://www.tiktok.com"
                className="cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconTikTok className="transition duration-200 ease-in-out fill-slate-500 hover:fill-primary" />
              </a>
              <a
                href="https://www.facebook.com"
                className="cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconFacebook className="transition duration-200 ease-in-out fill-slate-500 hover:fill-primary" />
              </a>
            </div>
          </div>
          <div className="space-y-6">
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
