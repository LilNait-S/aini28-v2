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
import { CountryData, PhoneInput } from "@/components/ui/phone-input"
import { customerContactSchema } from "@/lib/validations/customer-contact"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export function CheckoutForm() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [countryData, setCountryData] = useState<CountryData>()
  const form = useForm<z.infer<typeof customerContactSchema>>({
    resolver: zodResolver(customerContactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  })

  console.log("countryData", countryData)

  function onSubmit(values: z.infer<typeof customerContactSchema>) {
    console.log(values)
  }

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
                      setCountryData(country)

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
                      setCountryData(country)
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

        <Button type="submit" className="w-full mt-6">
          Confirmar Pedido
        </Button>
      </form>
    </Form>
  )
}
