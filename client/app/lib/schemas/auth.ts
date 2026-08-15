import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 6;

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
