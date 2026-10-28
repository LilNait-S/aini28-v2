import { z } from "zod";
export const shippingAgencySchema = z.object({
  id: z.string().uuid(), name: z.string(), address: z.string(),
  department: z.string(), province: z.string(), district: z.string(), ubigeo: z.string().regex(/^\d{6}$/),
});
export const shippingAgenciesSchema = z.object({agencies: z.array(shippingAgencySchema)});
export type ShippingAgency = z.infer<typeof shippingAgencySchema>;
