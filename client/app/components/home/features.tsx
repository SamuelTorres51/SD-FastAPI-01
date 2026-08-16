import {
  CalendarClock,
  ListChecks,
  ShieldCheck,
  SignalHigh,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const features = [
  {
    description: "Classifique o que pode aguardar e o que é urgente.",
    icon: SignalHigh,
    tags: ["Baixa", "Média", "Alta"],
    title: "Prioridades",
  },
  {
    description: "Controle cada tarefa do início ao fim.",
    icon: ListChecks,
    tags: ["Pendente", "Em andamento", "Concluída"],
    title: "Status",
  },
  {
    description: "Defina uma data limite e saiba o que finaliza primeiro.",
    icon: CalendarClock,
    tags: ["Data limite"],
    title: "Prazos",
  },
  {
    description: "Autenticação por e-mail e senha.",
    icon: ShieldCheck,
    tags: ["Apenas suas tarefas"],
    title: "Privacidade",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20">
      <div className="grid gap-4">
        {features.map(({ description, icon: Icon, tags, title }) => (
          <Card key={title}>
            <CardHeader>
              <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-secondary">
                <Icon className="size-5" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
