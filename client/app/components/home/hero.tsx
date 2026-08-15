import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-28">
      <h1 className="mt-6 font-bold text-4xl tracking-tight sm:text-5xl">
        Gerencie suas tarefas em um só lugar
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
        Gerencie, acompanhe e finalize suas tarefas com prioridade, status e
        prazo.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg">
          <Link className="flex items-center gap-2" to="/register">
            Começar agora
            <ArrowRight className="size-4 animate-pulse" />
          </Link>
        </Button>
        <Button size="lg" variant="outline">
          <Link to="/login">Já tenho conta</Link>
        </Button>
      </div>
    </section>
  );
}
