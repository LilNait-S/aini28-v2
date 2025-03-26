"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle, ChevronRight } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { claimsBookSchema } from "@/lib/validations/claims-book"
import { Container } from "@/components/container"
import { es } from "date-fns/locale"

export default function ReclamacionForm() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<z.infer<typeof claimsBookSchema>>({
    resolver: zodResolver(claimsBookSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      tipoDocumento: "dni",
      numeroDocumento: "",
      domicilio: "",
      email: "",
      telefono: "",
      tipoReclamacion: "reclamo",
      detalleReclamacion: "",
      pedidoConsumidor: "",
      fecha: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof claimsBookSchema>) {
    console.log(values)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="h-[800px] flex items-center justify-center">
        <Card className="p-6 border-0 shadow-none">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              ¡Reclamación Registrada!
            </h2>
            <p className="mb-4">
              Su reclamación ha sido registrada correctamente. Nos pondremos en
              contacto con usted a la brevedad.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Número de reclamación:{" "}
              {Math.floor(Math.random() * 100)
                .toString()
                .padStart(6, "0")}
            </p>
            <Button onClick={() => setSubmitted(false)}>
              Registrar nueva reclamación
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Container className="pt-16 pb-32">
      <h1 className="text-3xl font-bold text-center mb-8">
        Libro de Reclamaciones
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
            <p className="text-sm text-yellow-800">
              Conforme a lo establecido en el Código de Protección y Defensa del
              Consumidor, este establecimiento cuenta con un Libro de
              Reclamaciones a tu disposición.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">
              1. Identificación del Consumidor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese sus nombres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese sus apellidos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoDocumento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dni" id="dni" />
                          <FormLabel htmlFor="dni" className="font-normal">
                            DNI
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ce" id="ce" />
                          <FormLabel htmlFor="ce" className="font-normal">
                            CE
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pasaporte" id="pasaporte" />
                          <FormLabel
                            htmlFor="pasaporte"
                            className="font-normal"
                          >
                            Pasaporte
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numeroDocumento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Documento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese su número de documento"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese su teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domicilio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domicilio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese su domicilio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese su correo electrónico"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">
              2. Detalle de la Reclamación
            </h2>

            <FormField
              control={form.control}
              name="tipoReclamacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormDescription>
                    Reclamo: Disconformidad relacionada a los productos o
                    servicios.
                    <br />
                    Queja: Disconformidad no relacionada a los productos o
                    servicios, o malestar o descontento respecto a la atención
                    al público.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reclamo" id="reclamo" />
                        <FormLabel htmlFor="reclamo" className="font-normal">
                          Reclamo
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="queja" id="queja" />
                        <FormLabel htmlFor="queja" className="font-normal">
                          Queja
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detalleReclamacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalle</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa con detalle su reclamo o queja"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pedidoConsumidor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pedido del Consumidor</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="¿Qué solución espera obtener?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={{
                          after: new Date(),
                          before: new Date(1900, 1, 1),
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4 border-t">
            <Button
              type="submit"
              className="w-full md:w-auto md:!pl-7"
              size="lg"
            >
              Enviar Reclamación
              <ChevronRight />
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  )
}
