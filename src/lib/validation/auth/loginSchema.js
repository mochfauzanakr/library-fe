import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Format email salah"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});
