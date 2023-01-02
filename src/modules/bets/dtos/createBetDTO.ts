import { z } from "zod";

export const createBetDTO = z.object({
  numbers: z.array(z.string().length(2).regex(/\d{2}/)),
})

export type CreateBetDTO = z.infer<typeof createBetDTO>
