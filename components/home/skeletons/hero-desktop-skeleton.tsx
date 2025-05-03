import { Skeleton } from "@/components/ui/skeleton"

export function HeroDesktopSkeleton() {
  return (
    <div className="wrapped-bento mb-12 md:!grid !hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="list-images"
          style={{
            borderBottomRightRadius: index === 4 ? "var(--_br)" : "0",
          }}
        >
          <Skeleton className="h-full w-full rounded-[30px]" />
        </div>
      ))}

      <div className="big-image">
        <Skeleton className="h-full w-full rounded-[30px]" />
      </div>

      <div className="fox-large-image">
        <Skeleton className="h-full w-full rounded-[30px]" />
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
  )
}
