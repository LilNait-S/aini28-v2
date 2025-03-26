import { z } from "zod"

export const claimsBookSchema = z.object({
  // Datos del consumidor
  nombre: z.string().min(2, { message: "El nombre es requerido" }),
  apellido: z.string().min(2, { message: "El apellido es requerido" }),
  tipoDocumento: z.enum(["dni", "ce", "pasaporte"], {
    required_error: "Seleccione un tipo de documento",
  }),
  numeroDocumento: z.string().min(8, { message: "Documento inválido" }),
  domicilio: z.string().min(5, { message: "Domicilio es requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  telefono: z.string().min(9, { message: "Teléfono inválido" }),

  // Datos de la reclamación
  tipoReclamacion: z.enum(["queja", "reclamo"], {
    required_error: "Seleccione el tipo de reclamación",
  }),
  detalleReclamacion: z.string().min(10, { message: "Detalle es requerido" }),
  pedidoConsumidor: z.string().min(5, { message: "Campo requerido" }),

  // Fecha
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
})
