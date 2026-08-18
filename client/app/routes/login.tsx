import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AuthShell } from "~/components/auth/auth-shell";
import { PasswordInput } from "~/components/auth/password-input";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { type LoginValues, loginSchema } from "~/lib/schemas/auth";
import type { Route } from "./+types/login";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Entrar — Gerenciador de Tarefas" }];
}

export default function Login() {
  const navigate = useNavigate();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(_values: LoginValues) {
    try {
      // implementar depois com o supabeisi
      await new Promise((resolve) => setTimeout(resolve, 600));
      navigate("/tasks");
    } catch {
      setError("root", {
        message: "Email ou senha inválidos. Tente novamente",
      });
    }
  }

  return (
    <AuthShell
      description="Entre com seu e-mail e senha para acessar suas tarefas"
      footer={
        <>
          Não tem conta ainda?{" "}
          <Link className="text-foreground underline" to="/register">
            Criar conta
          </Link>
        </>
      }
      title="Entrar"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {errors.root ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-destructive text-sm">
              {errors.root.message}
            </p>
          ) : null}

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
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
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            {isSubmitting ? "" : "Entrar"}
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
