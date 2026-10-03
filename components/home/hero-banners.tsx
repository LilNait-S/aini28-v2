"use client";

import { cn } from "@/lib/utils";
import type { Banner } from "@/types/catalog";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

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

export function HeroBanners({ images }: { images: Banner[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(
      () => setCurrentImageIndex((i) => (i + 1) % images.length),
      4000,
    );
    return () => clearInterval(timer);
  }, [images.length]);
  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      "--dynamic-column",
      Math.min(images.length + 1, 6) + " / 7",
    );
    return () => {
      document.documentElement.style.removeProperty("--dynamic-column");
    };
  }, [images.length]);
  const selected = images[currentImageIndex] ?? images[0];
  if (!selected) return null;
  return (
    <>
      <div className="md:hidden flex flex-col">
        <ScrollArea className="whitespace-nowrap">
          <div className="flex w-max space-x-4 pb-4">
            {images.map(({ id, imageUrl, alt }, index) => (
              <div
                key={id}
                className="overflow-hidden rounded-lg cursor-pointer"
                onClick={() => {
                  setCurrentImageIndex(index);
                }}
              >
                <img
                  src={imageUrl}
                  alt={alt}
                  className={cn(
                    "h-20 aspect-video object-cover",
                    index === currentImageIndex ? "" : "grayscale",
                  )}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Link href={selected.link || "/peluches"} className="relative">
          <div className="degrade" />
          <div className="absolute bottom-4 left-4 flex justify-end items-end p-6">
            <span className="font-[family-name:var(--font-bento)] text-3xl md:text-8xl text-white">
              Tienda de regalos
            </span>
          </div>
          <img
            src={selected.imageUrl}
            alt={selected.alt}
            className="rounded-2xl"
          />
        </Link>
      </div>
      <div className="wrapped-bento mb-12 md:!grid !hidden">
        {images.map(({ id, imageUrl, alt }, index) => (
          <div
            key={id}
            className="list-images cursor-pointer"
            style={{
              borderBottomRightRadius:
                index === images.length - 1 ? "var(--_br)" : "0",
            }}
            onClick={() => {
              setCurrentImageIndex(index);
            }}
          >
            <img
              src={imageUrl}
              alt={alt}
              className={cn(index === currentImageIndex ? "" : "grayscale")}
            />
          </div>
        ))}

        <Link href={selected.link || "/peluches"} className="big-image">
          <div className="degrade" />
          <div className="text-big-image flex h-full max-w-2xl justify-end items-end px-16 py-14">
            <span className="font-[family-name:var(--font-bento)] text-8xl text-white">
              Tienda de regalos
            </span>
          </div>
          <img src={selected.imageUrl} alt={selected.alt} />
        </Link>

        <div className="fox-large-image">
          <div className="degrade" />
          <div className="list-peluches flex flex-col w-full h-full justify-end p-5">
            <span className="text-3xl text-white font-bold mb-3">Peluches</span>
            <div className="flex flex-wrap gap-3">
              {links.map(({ path, label }) => (
                <div
                  key={path}
                  className="text-md font-bold inline-flex items-center rounded-full bg-secondary text-secondary-foreground py-1 px-5"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          <img src={"/fox.webp"} alt={"alt"} />
        </div>

        <Link href={"/ofertas"} className="button-right">
          <div className="message font-[family-name:var(--font-nexus)] text-8xl">
            Ofertas
          </div>
        </Link>

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
    </>
  );
}
