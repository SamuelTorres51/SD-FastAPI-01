import { CircleCheckBig } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface AuthShellProps {
  children: ReactNode;
  description: string;
  footer: ReactNode;
  title: string;
}

export function AuthShell({
  children,
  description,
  footer,
  title,
}: AuthShellProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <Link className="flex items-center gap-2 font-semibold text-lg" to="/">
        <CircleCheckBig className="size-5" />
        <span>Tarefas</span>
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      <p className="text-muted-foreground text-sm">{footer}</p>
    </main>
  );
}
