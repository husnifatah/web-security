import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9 _.\-]+$/, "Hanya huruf, angka, spasi, . _ -"),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Minimal 8 karakter")
    .max(100, "Terlalu panjang")
    .regex(/[a-z]/, "Wajib ada huruf kecil")
    .regex(/[A-Z]/, "Wajib ada huruf besar")
    .regex(/[0-9]/, "Wajib ada angka")
    .regex(/[^a-zA-Z0-9]/, "Wajib ada simbol"),
  website: z
    .string()
    .url("URL tidak valid")
    .optional()
    .or(z.literal("")), // boleh kosong
  bio: z.string().max(500, "Bio maksimal 500 karakter").optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
