"use client";

import { ShippingAgencySelect } from "@/components/shipping-agency-select";
import type { ShippingAgency } from "@/types/shipping";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCartState } from "@/lib/states/shopping-car";
import { deliveryTypeLabels, paymentMethodLabels } from "@/lib/checkout";
import {
  listDepartments,
  listDistricts,
  listMotorbikeProvinces,
  listProvinces,
} from "@/lib/ubigeo";
import {
  customerContactSchema,
  type CustomerContact,
} from "@/lib/validations/customer-contact";
import { saveReceipt } from "@/lib/checkout-receipt";
import { useOrder } from "@/services/api/order";
import { Turnstile, captchaEnabled } from "@/components/security/turnstile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";

/** Flat form fields; on submit they become the Plush delivery shape. */
const formSchema = z
  .object({
    fullName: z.string(),
    phoneNumber: z.string(),
    email: z.string(),
    paymentMethod: z.string(),
    deliveryType: z.string(),
    department: z.string(),
    province: z.string(),
    district: z.string(),
    address: z.string(),
    agencyId: z.string(),
    agencyNote: z.string(),
    unknownAgency: z.boolean(),
  })
  .superRefine((value, context) => {
    const result = customerContactSchema.safeParse(toContact(value));
    if (result.success) return;
    for (const issue of result.error.issues) {
      const [first, second] = issue.path;
      const path =
        first === "delivery"
          ? second === "agencyId" || second === "agencyNote"
            ? "agencyId"
            : second === "ubigeo"
              ? "district"
              : second === "address"
                ? "address"
                : "deliveryType"
          : String(first);
      context.addIssue({
        code: "custom",
        message: issue.message,
        path: [path],
      });
    }
  });
type FormValues = z.infer<typeof formSchema>;

function toContact(value: FormValues): CustomerContact {
  const delivery =
    value.deliveryType === "MOTORBIKE"
      ? {
          type: "MOTORBIKE" as const,
          ubigeo: value.district,
          address: value.address.trim(),
        }
      : value.deliveryType === "AGENCY"
        ? {
            type: "AGENCY" as const,
            ubigeo: value.district,
            ...(value.unknownAgency
              ? { agencyNote: value.agencyNote }
              : value.agencyId
                ? { agencyId: value.agencyId }
                : {}),
          }
        : { type: "PICKUP" as const };
  return {
    fullName: value.fullName.trim(),
    phoneNumber: value.phoneNumber,
    email: value.email.trim(),
    paymentMethod: value.paymentMethod as CustomerContact["paymentMethod"],
    delivery: value.deliveryType
      ? delivery
      : (undefined as unknown as CustomerContact["delivery"]),
  };
}

export function CheckoutForm() {
  const { cartItems, resetCart } = useCartState();
  const [agency, setAgency] = useState<ShippingAgency | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const { createOrder, loading } = useOrder();
  const requestId = useRef(crypto.randomUUID());
  const { push } = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      paymentMethod: "",
      deliveryType: "",
      department: "",
      province: "",
      district: "",
      address: "",
      agencyId: "",
      agencyNote: "",
      unknownAgency: false,
    },
  });
  const deliveryType = form.watch("deliveryType");
  const unknownAgency = form.watch("unknownAgency");
  const department = form.watch("department");
  const province = form.watch("province");
  const provinces =
    deliveryType === "MOTORBIKE"
      ? listMotorbikeProvinces()
      : listProvinces(department);

  async function onSubmit(values: FormValues) {
    await createOrder({
      clientRequestId: requestId.current,
      userDetails: toContact(values),
      cartItems,
      captchaToken,
    })
      .then((receipt) => {
        saveReceipt(receipt);
        toast.success("Solicitud registrada. Continúa por WhatsApp.");
        form.reset();
        resetCart();
        push("/checkout/confirmation");
      })
      .catch((error: Error & { status?: number }) => {
        if (error.status && error.status < 500)
          requestId.current = crypto.randomUUID();
        toast.error("No se envió la solicitud", {
          description: error.message,
        });
      });
  }

  const selectField = (
    name: "department" | "province" | "district",
    label: string,
    options: { code: string; name: string }[],
    placeholder: string,
    reset: ("province" | "district")[],
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              for (const child of reset) form.setValue(child, "");
            }}
            value={field.value}
            disabled={!options.length}
          >
            <FormControl>
              <SelectTrigger id={name} className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="on"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  placeholder="Escribe tu nombre completo"
                  {...field}
                />
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
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <span className="flex h-9 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                    +51
                  </span>
                  <Input
                    className="rounded-l-none"
                    autoComplete="tel-national"
                    inputMode="tel"
                    placeholder="987 654 321"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Usa el número desde el que nos escribirás por WhatsApp.
              </FormDescription>
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
                <Input
                  autoComplete="email"
                  inputMode="email"
                  placeholder="tu@correo.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Te enviaremos el resumen de tu solicitud.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="paymentMethod">Pagarás con</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger id="paymentMethod" className="w-full">
                    <SelectValue placeholder="Elige cómo pagarás" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(paymentMethodLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                El pedido se paga completo antes de salir de la tienda.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="deliveryType">Entrega</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setAgency(null);
                  form.setValue("agencyId", "");
                  for (const child of [
                    "department",
                    "province",
                    "district",
                  ] as const)
                    form.setValue(child, "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger id="deliveryType" className="w-full">
                    <SelectValue placeholder="Elige cómo recibirás tu pedido" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(deliveryTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                El costo de envío se coordina por WhatsApp.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {deliveryType === "AGENCY" ? (
          <div className="space-y-3">
            {!unknownAgency ? (
              <ShippingAgencySelect
                value={agency}
                onChange={(value) => {
                  setAgency(value);
                  form.setValue("agencyId", value?.id ?? "", {
                    shouldValidate: true,
                  });
                  form.setValue("district", value?.ubigeo ?? "");
                }}
              />
            ) : null}
            <label className="flex gap-2 items-center text-sm">
              <input
                type="checkbox"
                checked={unknownAgency}
                onChange={(e) => {
                  form.setValue("unknownAgency", e.target.checked);
                  form.setValue(
                    "district",
                    !e.target.checked && agency ? agency.ubigeo : "",
                  );
                }}
              />
              No encuentro mi agencia
            </label>
            {unknownAgency ? (
              <label className="block text-sm">
                Ciudad, sede y dirección o referencia
                <Input
                  {...form.register("agencyNote")}
                  maxLength={300}
                  placeholder="La tienda revisará esta sede contigo"
                />
              </label>
            ) : null}
            {form.formState.errors.agencyId ? (
              <p role="alert" className="text-sm text-destructive">
                {form.formState.errors.agencyId.message}
              </p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              Después te enviaremos un enlace para confirmar quién recoge el
              paquete y su DNI.
            </p>
          </div>
        ) : null}
        {deliveryType === "MOTORBIKE" ||
        (deliveryType === "AGENCY" && unknownAgency) ? (
          <>
            <Separator />
            <h2 className="text-xl font-semibold">
              {deliveryType === "MOTORBIKE"
                ? "¿Dónde lo entregamos?"
                : "¿A qué ciudad lo enviamos?"}
            </h2>
            {deliveryType === "AGENCY"
              ? selectField(
                  "department",
                  "Departamento",
                  listDepartments(),
                  "Elige tu departamento",
                  ["province", "district"],
                )
              : null}
            {selectField(
              "province",
              "Provincia",
              provinces,
              "Elige tu provincia",
              ["district"],
            )}
            {selectField(
              "district",
              "Distrito",
              listDistricts(province),
              "Elige tu distrito",
              [],
            )}
            {deliveryType === "MOTORBIKE" ? (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="street-address"
                        placeholder="Calle, número y referencia"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Confirmaremos la agencia contigo antes del envío.
              </p>
            )}
          </>
        ) : null}

        <p className="text-sm text-muted-foreground">
          Registraremos tu solicitud y podrás enviarnos su resumen por WhatsApp
          para concretar tu compra. El mensaje lo envías tú; todavía no se
          realiza ningún pago.
        </p>

        <Turnstile onToken={setCaptchaToken} />

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={
            !cartItems.length ||
            form.formState.isSubmitting ||
            loading ||
            (captchaEnabled && !captchaToken)
          }
        >
          {form.formState.isSubmitting || loading
            ? "Enviando..."
            : "Continuar por WhatsApp"}
        </Button>
      </form>
    </Form>
  );
}
