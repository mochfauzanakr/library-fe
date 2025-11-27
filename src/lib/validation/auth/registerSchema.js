import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(20, "Username terlalu panjang"),

    email: z.email("Format email salah"),

    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(50, "Password terlalu panjang"),

    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password tidak sama",
    path: ["confirm"],
  });
