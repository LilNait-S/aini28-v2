import { z } from "zod"

export const appConfig = {
  // Current environment (automatically managed by Next.js)
  environment: process.env.NODE_ENV,

  // Backend base URL (required, validated with zod)
  backend_base_path: z
    .string({ message: "BACKEND_BASE_PATH is required" })
    .min(1)
    .parse(process.env.NEXT_PUBLIC_BACKEND_BASE_PATH),
}
