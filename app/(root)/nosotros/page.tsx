import { Card, CardContent } from "@/components/ui/card"
import { Heart, Package, ShieldCheck, Truck } from "lucide-react"

export default function Nosotros() {
  return (
    <div className="flex flex-col">
      <section
        className="relative w-full py-12 md:py-24 lg:py-32 bg-muted bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/nosotros/wallpaper-us.webp')" }}
      >
        <div className="absolute inset-0 bg-white/80"></div>

        <div className="relative container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl text-primary font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Sobre Nosotros
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Descubre nuestra historia, misión y el equipo detrás de nuestra
                tienda online.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Nuestra Historia
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-primary">
                De un sueño a la realidad
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Aini 28 nació en 2018 con el objetivo de ofrecer los mejores
                peluches importados a precios accesibles. Nuestros peluches
                están hechos de felpa antialérgica de alta calidad, ideales para
                niños, jóvenes y adultos. Contamos con una amplia variedad de
                modelos y tamaños, perfectos para regalar o coleccionar.
                Realizamos envíos a nivel nacional a través de agencias de
                transporte, además de ofrecer delivery rápido en todo Lima.
                Visítanos en nuestra tienda física: Centro Comercial Arenales,
                tienda 305A, Lince. Estamos abiertos todos los días de 12 p.m. a
                8 p.m. ¡Te esperamos para que vivas la mejor experiencia y
                encuentres el peluche perfecto!
              </p>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-lg">
              <img
                src="/nosotros/foto-tienda.webp"
                alt="Nuestra tienda"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
                Nuestros Valores
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Estos son los principios que guían nuestro trabajo día a día.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card className="bg-background">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Pasión</h3>
                <p className="text-muted-foreground">
                  Amamos lo que hacemos y eso se refleja en cada producto que
                  ofrecemos.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Calidad</h3>
                <p className="text-muted-foreground">
                  Seleccionamos cuidadosamente cada producto para garantizar la
                  mejor calidad.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Servicio</h3>
                <p className="text-muted-foreground">
                  Nos esforzamos por ofrecer una experiencia de compra
                  excepcional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
                Nuestro Equipo
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Conoce a las personas que hacen posible nuestra tienda.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {[
              {
                name: "Sandra Arenas",
                role: "Fundadora y CEO",
                image: "/nosotros/sandra.webp",
              },
              {
                name: "Sergio Delgado",
                role: "Desarrollador de software",
                image: "/nosotros/sergio.webp",
                linkedin: "https://www.linkedin.com/in/sergio-delgado-arenas/",
              },
              {
                name: "Laura Arenas",
                role: "Atención al Cliente",
                image: "/nosotros/laura.webp",
              },
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  {member.role === "Desarrollador de software" &&
                    member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Ver en LinkedIn
                      </a>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
                ¿Por qué elegirnos?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Estas son algunas razones por las que nuestros clientes confían
                en nosotros.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
            {[
              {
                icon: Package,
                title: "Productos de Calidad",
                description: "Seleccionamos cuidadosamente cada producto.",
              },
              {
                icon: Truck,
                title: "Envío Rápido",
                description: "Entregamos en todo el país en 24-48 horas.",
              },
              {
                icon: ShieldCheck,
                title: "Garantía",
                description: "Todos nuestros productos tienen garantía.",
              },
              {
                icon: Heart,
                title: "Atención Personalizada",
                description: "Estamos aquí para ayudarte en todo momento.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 text-center"
              >
                <div className="p-2 rounded-full bg-background">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                ¿Tienes alguna pregunta?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Estamos aquí para ayudarte. No dudes en contactarnos.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/contacto">
                <Button className="w-full">
                  Contáctanos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Volver a la tienda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  )
}
