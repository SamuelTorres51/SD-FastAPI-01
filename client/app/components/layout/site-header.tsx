import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link className="flex items-center gap-2 font-semibold" to="/">
          <CircleCheckBig className="size-5" />
          <span>Tarefas</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button render={<Link to="/login" />} size="sm" variant="ghost">
            Entrar
          </Button>
          <Button render={<Link to="/register" />} size="sm">
            Criar Conta
          </Button>
        </nav>
      </div>
    </header>
  );
}
