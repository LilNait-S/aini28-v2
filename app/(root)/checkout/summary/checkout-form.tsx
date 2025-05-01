"use client"

import { Button } from "@/components/ui/button"
import { Country, CountryDropdown } from "@/components/ui/country-dropdown"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { customerContactSchema } from "@/lib/validations/customer-contact"
import { cleanObject } from "@/utils/clean-object"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  departamentosPeru,
  distritosPorProvincia,
  paymentMethods,
  provinciasLima,
  shippingMethods,
} from "./checkout-data"
import { useCartState } from "@/lib/states/shopping-car"
import { io, Socket } from "socket.io-client"
import { environment, makeBasePath } from "@/services/api/base"

export function CheckoutForm() {
  const { cartItems } = useCartState()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const form = useForm<z.infer<typeof customerContactSchema>>({
    resolver: zodResolver(customerContactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      country: "peru",
      department: "",
      province: "",
      district: "",
      address: "",
    },
  })

  const socketRef = useRef<Socket | null>(null)

  const socketURL = makeBasePath(environment, false)
  console.log("🔗 Intentando conectar al socket en:", socketURL)

  useEffect(() => {
    if (!socketRef.current) {
      console.log("socket1")
      const socket = io(makeBasePath(environment, false), {
        transports: ["websocket"],
        rejectUnauthorized: environment !== "development",
      })

      socketRef.current = socket

      console.log("socket2", socket)

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.connected)
      })

      socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message)
      })

      socket.on("disconnect", (reason) => {
        console.warn("⚠️ Socket disconnected:", reason)
      })
    }

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  function onSubmit(values: z.infer<typeof customerContactSchema>) {
    const orderDetails = { userDetails: cleanObject(values), cartItems }
    console.log("Order details:", orderDetails)
    socketRef.current?.emit("order", orderDetails)
  }

  const { watch } = form

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Escribe tu nombre completo" {...field} />
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
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="tu@correo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <div className="flex items-center w-full">
                  <CountryDropdown
                    onChange={(country) => {
                      setSelectedCountry(country)

                      const countryCode = country.countryCallingCodes[0]
                      const formattedCode = countryCode.startsWith("+")
                        ? countryCode
                        : `+${countryCode}`
                      form.setValue("phoneNumber", formattedCode)
                    }}
                    defaultValue={selectedCountry?.alpha3}
                    inline
                  />
                  <PhoneInput
                    {...field}
                    value={field.value}
                    placeholder="Ej: +51987654321"
                    defaultCountry={selectedCountry?.alpha2}
                    onCountryChange={(country) => {
                      setSelectedCountry(country as Country)
                    }}
                    inline
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="paymentMethod">Metodo de pago</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value}
              >
                <SelectTrigger id="paymentMethod" className="w-full">
                  <SelectValue placeholder="Selecciona un metodo de pago" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shippingMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="shippingMethod">Metodo de envio</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value}
              >
                <SelectTrigger id="shippingMethod" className="w-full">
                  <SelectValue placeholder="Selecciona un metodo de envio" />
                </SelectTrigger>
                <SelectContent>
                  {shippingMethods.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watch("shippingMethod") === 1 && (
          <>
            <Separator />
            <h2 className="text-xl font-semibold mb-4">Información de envío</h2>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="country">Pais</FormLabel>
                  <Select
                    value="peru"
                    disabled
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue placeholder="Selecciona un país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="peru">Perú</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="department">Departamento</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.setValue("province", "")
                      form.setValue("district", "")
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="department" className="w-full">
                        <SelectValue placeholder="Selecciona tu departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Departamentos del Perú</SelectLabel>
                        {departamentosPeru.map((departamento) => (
                          <SelectItem key={departamento} value={departamento}>
                            {departamento}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watch("department") === "Lima" && (
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="province">Provincia</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue("district", "")
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger id="province" className="w-full">
                          <SelectValue placeholder="Selecciona tu provincia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Provincias</SelectLabel>
                          {provinciasLima.map((provincia) => (
                            <SelectItem key={provincia} value={provincia}>
                              {provincia}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watch("province") &&
              distritosPorProvincia[
                watch("province") as keyof typeof distritosPorProvincia
              ] && (
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="district">Distrito</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="district" className="w-full">
                            <SelectValue placeholder="Selecciona tu distrito" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Distritos</SelectLabel>
                            {distritosPorProvincia[
                              watch(
                                "province"
                              ) as keyof typeof distritosPorProvincia
                            ].map((distrito) => (
                              <SelectItem key={distrito} value={distrito}>
                                {distrito}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribe tu dirección" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={!cartItems.length || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Cargando..." : "Confirmar pedido"}
        </Button>
      </form>
    </Form>
  )
}
