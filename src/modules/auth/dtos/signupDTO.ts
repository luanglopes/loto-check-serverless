import { z } from "zod";

export const signupDTO = z.object({
  phone: z.string().trim().regex(/\d{11}/),
})

export type SignupDTO = z.infer<typeof signupDTO>
