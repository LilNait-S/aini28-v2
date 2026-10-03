import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const phoneSchema = z
  .string()
  .max(30)
  .refine((value) => {
    try {
      return isValidPhoneNumber(value);
    } catch {
      return false;
    }
  }, "Número de celular inválido");
