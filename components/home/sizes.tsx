import Link from "next/link"

export function SizesSection() {
  return (
    <section className="flex space-x-4">
      <div className="flex flex-col justify-center bg-slate-50 px-12 rounded-4xl min-w-[250px] min-h-[250px]">
        <span className="text-accent-foreground">Todos los </span>
        <span className="text-primary font-bold text-3xl">Tamaños</span>
      </div>
      <div className="grid grid-cols-2 w-full gap-4">
        <Size title="Pequeño" size={1} />
        <Size title="Mediano" size={2} />
        <Size title="Grande" size={3} />
        <Size title="Gigante" size={4} />
      </div>
    </section>
  )
}

export function Size({
  title,
  imgUrl,
  size,
}: {
  title: string
  imgUrl?: string
  size: number
}) {
  return (
    <Link href={`/peluches?size=${size}&page=1`}>
      <div className="flex space-x-4 bg-slate-50 rounded-4xl p-4 items-center">
        <img
          src={
            imgUrl ??
            "https://cdn.sanity.io/images/cod9urb8/production/7dcc288b9771d914315b6e5762f7b588a9061fc3-800x800.jpg"
          }
          alt="imagen"
          className="rounded-3xl size-36 object-cover aspect-square"
        />
        <div className="flex flex-col w-full items-center">
          <span className="text-accent-foreground/50">Peluches</span>
          <span className="text-primary font-bold text-2xl">{title}</span>
        </div>
      </div>
    </Link>
  )
}
