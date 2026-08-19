import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigate } from "react-router";
import { AuthShell } from "~/components/auth/auth-shell";
import { PasswordInput } from "~/components/auth/password-input";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { ApiError } from "~/lib/api";
import { useAuth } from "~/lib/auth/auth-context";
import {
  MIN_PASSWORD_LENGTH,
  type RegisterValues,
  registerSchema,
} from "~/lib/schemas/auth";
import type { Route } from "./+types/register";
import { isAuthenticated } from "~/lib/auth/session";

export function clientLoader() {
  if (isAuthenticated()) {
    throw redirect("/tasks")
  }

  return null
}

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Registrar — Gerenciador de Tarefas" }];
}

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<RegisterValues>({
    defaultValues: { confirmPassword: "", email: "", name: "", password: "" },
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterValues) {
    try {
      await signUp({
        email: values.email,
        name: values.name,
        password: values.password,
      });
      navigate("/tasks");
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Não foi possível criar a conta no momento. Tente novamente mais tarde!",
      });
    }
  }

  return (
    <AuthShell
      description="Crie sua conta e comece a organizar suas tarefas."
      footer={
        <>
          Já possui uma conta?{" "}
          <Link className="text-foreground underline" to="/login">
            Entrar
          </Link>
        </>
      }
      title="Criar conta"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {errors.root ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-destructive text-sm">
              {errors.root.message}
            </p>
          ) : null}

          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              aria-invalid={Boolean(errors.name)}
              id="name"
              placeholder="Seu nome"
              type="text"
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              aria-invalid={Boolean(errors.email)}
              id="email"
              placeholder="seu@email.com"
              type="email"
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field data-invalid={Boolean(errors.password)}>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <PasswordInput
              aria-invalid={Boolean(errors.password)}
              id="password"
              placeholder="Sua senha"
              {...register("password", { deps: ["confirmPassword"] })}
            />
            <FieldDescription>
              Mínimo de {MIN_PASSWORD_LENGTH} caracteres.
            </FieldDescription>
            <FieldError errors={[errors.password]} />
          </Field>

          <Field data-invalid={Boolean(errors.confirmPassword)}>
            <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
            <PasswordInput
              aria-invalid={Boolean(errors.confirmPassword)}
              id="confirmPassword"
              placeholder="Digite sua senha novamente"
              {...register("confirmPassword")}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            {isSubmitting ? "" : "Criar conta"}
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
