import { z } from "zod";

export const loginDTO = z.object({
  phone: z.string().trim().regex(/\d{11}/),
})

export type LoginDTO = z.infer<typeof loginDTO>
