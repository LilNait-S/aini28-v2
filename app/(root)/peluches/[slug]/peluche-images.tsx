"use client"

import { useState } from "react"
import { urlFor } from "@/sanity/lib/image"
import { Product } from "@/sanity/types"

interface PelucheImagesProps {
  peluche: Product
}

export function PelucheImages({ peluche }: PelucheImagesProps) {
  const { images } = peluche
  const [currentImage, setCurrentImage] = useState({
    src: images?.[0] ? urlFor(images[0]).url() : "/placeholder-image.webp",
    alt: images?.[0]?.alt || "Imagen del producto",
  })

  console.log(images)

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Imagen Principal */}
      <picture className="rounded-2xl overflow-hidden w-full">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="h-full w-full object-cover aspect-square"
        />
      </picture>

      {/* Miniaturas */}
      <div className="flex space-x-2">
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() =>
              setCurrentImage({
                src: urlFor(image).url(),
                alt: image?.alt || "Imagen del producto",
              })
            }
            className={`
              rounded-lg cursor-pointer overflow-hidden border-4 transition-all
              ${currentImage.src === urlFor(image).url() ? "border-primary" : "border-transparent"}
            `}
          >
            <img
              src={urlFor(image).url()}
              alt={image.alt || "Miniatura"}
              className="w-16 h-16 object-cover aspect-square"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
