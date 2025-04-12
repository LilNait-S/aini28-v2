import Link from "next/link"

export function SizesSection() {
  return (
    <section className="flex flex-col lg:flex-row gap-4">
      <div className="flex flex-col justify-center bg-slate-50 px-8 lg:px-12 rounded-4xl min-w-[200px] lg:min-w-[250px] min-h-[200px] lg:min-h-[250px]">
        <span className="text-accent-foreground text-center lg:text-left">
          Todos los
        </span>
        <span className="text-primary font-bold text-2xl lg:text-3xl text-center lg:text-left">
          Tamaños
        </span>
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
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 bg-slate-50 rounded-4xl p-4 items-center">
      <img
        src={
          imgUrl ??
          "https://cdn.sanity.io/images/cod9urb8/production/7dcc288b9771d914315b6e5762f7b588a9061fc3-800x800.jpg"
        }
        alt="imagen"
        className="rounded-3xl w-24 h-24 lg:w-36 lg:h-36 object-cover lg:aspect-square"
      />
      <div className="flex flex-col w-full items-center">
        <span className="text-accent-foreground/50 text-sm lg:text-base">
          Peluches
        </span>
        <span className="text-primary font-bold text-xl lg:text-2xl">
          {title}
        </span>
      </div>
    </div>
  </Link>
  )
}
