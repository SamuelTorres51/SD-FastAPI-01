/** biome-ignore-all lint/performance/noJsxPropsBind: handlers precisam da task. */
import { CalendarClock, Pencil, Trash2, TriangleAlert } from "lucide-react";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "~/lib/schemas/tasks";
import { formatDueDate, isOverdue } from "~/lib/tasks/format";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const PRIORITY_VARIANTS: Record<
  TaskPriority,
  "default" | "destructive" | "secondary"
> = {
  alta: "destructive",
  baixa: "secondary",
  media: "default",
};

const STATUS_VARIANTS: Record<TaskStatus, "default" | "outline" | "secondary"> =
  {
    concluida: "secondary",
    em_andamento: "default",
    pendente: "outline",
  };

interface TaskCardProps {
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  task: Task;
}

export function TaskCard({ onDelete, onEdit, task }: TaskCardProps) {
  const overdue = isOverdue(task);

  return (
    <Card size="sm">
      <CardContent className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={
              task.status === "concluida"
                ? "font-medium text-muted-foreground line-through"
                : "font-medium"
            }
          >
            {task.title}
          </h3>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              aria-label={`Editar ${task.title}`}
              onClick={() => onEdit(task)}
              size="icon-sm"
              variant="ghost"
            >
              <Pencil />
            </Button>
            <Button
              aria-label={`Excluir ${task.title}`}
              onClick={() => onDelete(task)}
              size="icon-sm"
              variant="ghost"
            >
              <Trash2 />
            </Button>
          </div>
        </div>

        {task.description ? (
          <p className="text-muted-foreground text-sm">{task.description}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={STATUS_VARIANTS[task.status]}>
            {STATUS_LABELS[task.status]}
          </Badge>
          <Badge variant={PRIORITY_VARIANTS[task.priority]}>
            {PRIORITY_LABELS[task.priority]}
          </Badge>
          <span
            className={
              overdue
                ? "flex items-center gap-1.5 text-destructive text-xs"
                : "flex items-center gap-1.5 text-muted-foreground text-xs"
            }
          >
            {overdue ? (
              <TriangleAlert className="size-3.5" />
            ) : (
              <CalendarClock className="size-3.5" />
            )}
            {formatDueDate(task.dueDate)}
            {overdue ? " — atrasada" : null}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
