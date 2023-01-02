import { z } from "zod";

export const updateBetDTO = z.object({
  id: z.string().uuid(),
  numbers: z.array(z.string().length(2).regex(/\d{2}/)),
})

export type UpdateBetDTO = z.infer<typeof updateBetDTO>
