"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { label: "Gorila", path: "gorila" },
  { label: "Cocodrilo", path: "cocodrilo" },
  { label: "Charmander", path: "charmander" },
  { label: "Doraemon", path: "doraemon" },
  { label: "Oso", path: "oso" },
  { label: "Siberiano", path: "siberiano" },
  { label: "Erizo", path: "erizo" },
  { label: "Unicornio", path: "unicornio" },
];

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([
    { src: "/gato.webp", alt: "Imagen de un gato", isActive: true },
    { src: "/gato-2.webp", alt: "Imagen de un perro", isActive: false },
    { src: "/totoro.webp", alt: "Imagen de un zorro", isActive: false },
    { src: "/unicornio.webp", alt: "Imagen de un conejo", isActive: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex: number) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setImages((prevImages) =>
        prevImages.map((image, index) => ({
          ...image,
          isActive: index === (currentImageIndex + 1) % images.length,
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [currentImageIndex, images.length]);

  return (
    <div className="wrapped-bento mb-12">
      {images.map(({ alt, src, isActive }) => (
        <div key={alt} className="list-images">
          <img
            src={src}
            alt={alt}
            className={cn(isActive ? "" : "grayscale")}
          />
        </div>
      ))}

      <div className="big-image">
        <div className="degrade" />
        <div className="text-big-image flex h-full max-w-2xl justify-end items-end px-16 py-14">
          <span className="font-[family-name:var(--font-bento)] text-8xl text-white">
            Tienda de regalos
          </span>
        </div>
        <img
          src={images[currentImageIndex].src}
          alt={images[currentImageIndex].alt}
        />
      </div>

      <div className="fox-large-image">
        <div className="degrade" />
        <div className="list-peluches flex flex-col w-full h-full justify-end p-5">
          <span className="text-3xl text-white font-bold mb-3">Peluches</span>
          <div className="flex flex-wrap gap-3">
            {links.map(({ path, label }) => (
              <Link href={`/${path}`} key={path}>
                <div className="text-md font-bold inline-flex items-center rounded-full bg-secondary text-secondary-foreground py-1 px-5">
                  {label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <img src={"/fox.webp"} alt={"alt"} />
      </div>

      <div className="button-right">
        <div className="message font-[family-name:var(--font-nexus)] text-8xl">
          Ofertas
        </div>
      </div>

      <div className="store-image">
        <div className="direction font-bold z-10 flex justify-between items-center px-12">
          <div className="text-md font-bold inline-flex items-center rounded-full bg-secondary py-1 px-5 max-w-[250px] text-center text-primary">
            ¡Visítanos en nuestra tienda física!
          </div>
          <div className="text-white max-w-[350px] text-lg text-balance">
            Centro Comercial Arenales, Tienda 3-05A, Lince, Lima.
            <span className="font-normal ">
              Abierto todos los días de 1:00 p.m. a 8:00 p.m.
            </span>
          </div>
        </div>
        <div className="degrade" />
        <img src={"/store.webp"} alt={"alt"} />
      </div>

      <div className="explore-bottom">
        <div className="message font-[family-name:var(--font-bento)] text-5xl">
          explorar
        </div>
      </div>
    </div>
  );
}
