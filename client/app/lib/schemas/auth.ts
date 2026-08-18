import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_NAME_LENGHT = 3;
export const MAX_NAME_LENGHT = 100;

export const loginSchema = z.object({
  email: z.email({ error: "Informe um e-mail válido." }),
  password: z
    .string({ error: "Informe sua senha." })
    .min(1, { error: "Informe sua senha." }),
});

export const registerSchema = z
  .object({
    confirmPassword: z
      .string({ error: "Confirme sua senha." })
      .min(1, { error: "Confirme sua senha." }),
    email: z.email({ error: "Informe um e-mail válido." }),
    name: z
      .string({ error: "Informe seu nome" })
      .trim()
      .min(MIN_NAME_LENGHT, {
        error: `O nome deve ter no mínimo ${MIN_NAME_LENGHT} caracteres`,
      })
      .max(MAX_NAME_LENGHT, {
        error: `O nome deve ter no máximo ${MAX_NAME_LENGHT} caracteres`,
      }),
    password: z
      .string({ error: "Informe sua senha." })
      .min(MIN_PASSWORD_LENGTH, {
        error: `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`,
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
