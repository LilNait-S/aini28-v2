import { Container } from "@/components/container";
import { getPeluche } from "@/lib/actions/product";
import { Params } from "@/types/params";
import { PelucheBreadcrumb } from "./peluche-breadcrumb";
import { PelucheClient } from "./peluche-client";
import { PelucheImages } from "./peluche-images";
import { ProductSchema } from "@/components/seo/product-schema";
import { effectivePrice } from "@/types/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPeluche({ slug });
  if (!product)
    return {
      title: "Producto no encontrado",
      robots: { index: false, follow: true },
    };
  const price = Math.min(...product.variants.map(effectivePrice));
  return {
    title: product.name,
    description: `${product.description} Desde S/.${price.toFixed(2)}.`,
    alternates: { canonical: `https://aini28.com/peluches/${slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `https://aini28.com/peluches/${slug}`,
      images: [{ url: product.imageUrl, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}
export default async function Peluche({ params }: Params) {
  const { slug } = await params;
  const peluche = await getPeluche({ slug });
  if (!peluche) notFound();
  return (
    <>
      <ProductSchema peluche={peluche} slug={slug} />
      <Container className="pb-40">
        <section className="flex flex-col">
          <header className="py-4">
            <PelucheBreadcrumb pelucheName={peluche.name} />
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <PelucheImages peluche={peluche} />
            <div className="flex flex-col space-y-4">
              <span className="text-primary">Aini28</span>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
                {peluche.name}
              </h1>
              <PelucheClient peluche={peluche} slug={slug} />
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
