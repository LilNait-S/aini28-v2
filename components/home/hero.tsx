"use client"

import { getAllBanners } from "@/lib/actions/banner"
import { cn } from "@/lib/utils"
import { urlFor } from "@/sanity/lib/image"
import { Banners } from "@/sanity/types"
import Link from "next/link"
import { useEffect, useLayoutEffect, useState } from "react"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

const links = [
  { label: "Gorila", path: "gorila" },
  { label: "Cocodrilo", path: "cocodrilo" },
  { label: "Charmander", path: "charmander" },
  { label: "Doraemon", path: "doraemon" },
  { label: "Oso", path: "oso" },
  { label: "Siberiano", path: "siberiano" },
  { label: "Erizo", path: "erizo" },
  { label: "Unicornio", path: "unicornio" },
]

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [images, setImages] = useState<Banners[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex: number) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
      setImages((prevImages) =>
        prevImages.map((image, index) => ({
          ...image,
          isActive: index === (currentImageIndex + 1) % images.length,
        }))
      )
    }, 4000)
    return () => clearInterval(interval)
  }, [currentImageIndex, images.length])

  useLayoutEffect(() => {
    if (images.length > 0) {
      const calculateColumnStart = (length: number) => Math.min(length + 1, 6)
      const columnStart = calculateColumnStart(images.length)
      const columnEnd = 7

      document.documentElement.style.setProperty(
        "--dynamic-column",
        `${columnStart} / ${columnEnd}`
      )
    }
  }, [images.length])

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { banners } = await getAllBanners()
        setImages(banners)
      } catch (error) {
        console.error("Error fetching banners:", error)
      }
    }
    fetchBanners()
  }, [])

  return (
    <>
      <div className="md:hidden flex flex-col">
        <ScrollArea className="whitespace-nowrap">
          <div className="flex w-max space-x-4 pb-4">
            {images.map(({ _id, image, isActive }, index) => (
              <div
                key={_id}
                className="overflow-hidden rounded-lg cursor-pointer"
                onClick={() => {
                  setCurrentImageIndex(index)
                  setImages((prevImages) =>
                    prevImages.map((img, i) => ({
                      ...img,
                      isActive: i === index,
                    }))
                  )
                }}
              >
                <img
                  src={image ? urlFor(image).url() : "/placeholder-image.webp"}
                  alt={image?.alt || "Imagen del producto"}
                  className={cn(
                    "h-20 aspect-video object-cover",
                    isActive ? "" : "grayscale"
                  )}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Link href={`${images[currentImageIndex]?.link}`} className="relative">
          <div className="degrade" />
          <div className="absolute bottom-4 left-4 flex justify-end items-end p-6">
            <span className="font-[family-name:var(--font-bento)] text-3xl md:text-8xl text-white">
              Tienda de regalos
            </span>
          </div>
          <img
            src={
              images[currentImageIndex]?.image
                ? urlFor(images[currentImageIndex].image).url()
                : "/placeholder-image.webp"
            }
            alt={images[currentImageIndex]?.image?.alt || "Imagen del producto"}
            className="rounded-2xl"
          />
        </Link>
      </div>
      <div className="wrapped-bento mb-12 md:!grid !hidden">
        {images.map(({ _id, image, isActive }, index) => (
          <div
            key={_id}
            className="list-images cursor-pointer"
            style={{
              borderBottomRightRadius:
                index === images.length - 1 ? "var(--_br)" : "0",
            }}
            onClick={() => {
              setCurrentImageIndex(index)
              setImages((prevImages) =>
                prevImages.map((img, i) => ({
                  ...img,
                  isActive: i === index,
                }))
              )
            }}
          >
            <img
              src={image ? urlFor(image).url() : "/placeholder-image.webp"}
              alt={image?.alt || "Imagen del producto"}
              className={cn(isActive ? "" : "grayscale")}
            />
          </div>
        ))}

        <Link href={`${images[currentImageIndex]?.link}`} className="big-image">
          <div className="degrade" />
          <div className="text-big-image flex h-full max-w-2xl justify-end items-end px-16 py-14">
            <span className="font-[family-name:var(--font-bento)] text-8xl text-white">
              Tienda de regalos
            </span>
          </div>
          <img
            src={
              images[currentImageIndex]?.image
                ? urlFor(images[currentImageIndex].image).url()
                : "/placeholder-image.webp"
            }
            alt={images[currentImageIndex]?.image?.alt || "Imagen del producto"}
          />
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
  )
}
