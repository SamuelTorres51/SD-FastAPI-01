import { ClipboardList, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { SiteFooter } from "~/components/layout/site-footer";
import { SiteHeader } from "~/components/layout/site-header";
import { DeleteTaskDialog } from "~/components/tasks/delete-task-dialog";
import { TaskCard } from "~/components/tasks/task-card";
import { TaskFormDialog } from "~/components/tasks/task-form-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskFormValues,
  type TaskPriority,
  type TaskStatus,
} from "~/lib/schemas/tasks";
import { taskService } from "~/lib/tasks/task-service";
import type { Route } from "./+types/tasks";

const ALL = "all";

type StatusFilter = TaskStatus | typeof ALL;
type PriorityFilter = TaskPriority | typeof ALL;

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  ...STATUS_LABELS,
  all: "Todos os status",
};

const PRIORITY_FILTER_LABELS: Record<PriorityFilter, string> = {
  ...PRIORITY_LABELS,
  all: "Todas as prioridades",
};

const PLACEHOLDER_USER = {
  email: "johndoe@email.com",
  name: "John Doe",
};

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Minhas Tarefas — Gerenciador de Tarefas" }];
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(ALL);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>(ALL);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [taskBeingDeleted, setTaskBeingDeleted] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    taskService
      .list()
      .then(setTasks)
      .catch(() => toast.error("Não foi possível carregar suas tarefas."))
      .finally(() => setIsLoading(false));
  }, []);

  const navigate = useNavigate();
  const visibleTasks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks.filter(
      (task) =>
        (statusFilter === ALL || task.status === statusFilter) &&
        (priorityFilter === ALL || task.priority === priorityFilter) &&
        (term === "" || task.title.toLowerCase().includes(term))
    );
  }, [priorityFilter, search, statusFilter, tasks]);

  function handleSignOut() {
    // implementar dps
    navigate("/");
  }

  function openCreateDialog() {
    setTaskBeingEdited(null);
    setIsFormOpen(true);
  }

  function openEditDialog(task: Task) {
    setTaskBeingEdited(task);
    setIsFormOpen(true);
  }

  async function handleSubmit(values: TaskFormValues) {
    try {
      if (taskBeingEdited) {
        const updated = await taskService.update(taskBeingEdited.id, values);
        setTasks((current) =>
          current.map((task) => (task.id === updated.id ? updated : task))
        );
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        const created = await taskService.create(values);
        setTasks((current) => [created, ...current]);
        toast.success("Tarefa criada com sucesso!");
      }

      setIsFormOpen(false);
      setTaskBeingEdited(null);
    } catch {
      toast.error(
        taskBeingEdited
          ? "Não foi possível atualizar a tarefa."
          : "Não foi possível criar a tarefa."
      );
    }
  }

  async function handleDelete() {
    if (!taskBeingDeleted) {
      return;
    }

    setIsDeleting(true);
    try {
      await taskService.remove(taskBeingDeleted.id);
      setTasks((current) =>
        current.filter((task) => task.id !== taskBeingDeleted.id)
      );
      toast.success("Tarefa excluída com sucesso!");
      setTaskBeingDeleted(null);
    } catch {
      toast.error("Não foi possível excluir a tarefa.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader onSignOut={handleSignOut} user={PLACEHOLDER_USER} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-2xl tracking-tight">
              Minhas Tarefas
            </h1>
            <p className="text-muted-foreground text-sm">
              {tasks.length === 0
                ? "Nenhuma tarefa cadastrada"
                : `${tasks.length} tarefa(s) — ${visibleTasks.length} exibida(s).`}
            </p>
          </div>
          <Button
            className="flex cursor-pointer items-center gap-1.5"
            onClick={openCreateDialog}
          >
            <Plus />
            Nova Tarefa
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Buscar por título"
              className="pl-8"
              // biome-ignore lint/performance/noJsxPropsBind: .
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título..."
              value={search}
            />
          </div>

          <Select
            items={STATUS_FILTER_LABELS}
            // biome-ignore lint/performance/noJsxPropsBind: .
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            value={statusFilter}
          >
            <SelectTrigger aria-label="Filtrar por status" className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos os status</SelectItem>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={PRIORITY_FILTER_LABELS}
            // biome-ignore lint/performance/noJsxPropsBind: .
            onValueChange={(value) =>
              setPriorityFilter(value as PriorityFilter)
            }
            value={priorityFilter}
          >
            <SelectTrigger
              aria-label="Filtrar por prioridade"
              className="sm:w-44"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas as prioridades</SelectItem>
              {TASK_PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : null}

          {!isLoading && visibleTasks.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
              <ClipboardList className="size-8 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {tasks.length === 0
                    ? "Você ainda não tem tarefas"
                    : "Nenhuma tarefa encontrada"}
                </p>
                <p className="text-muted-foreground text-sm">
                  {tasks.length === 0
                    ? "Crie a primeira e comece a se organizar."
                    : "Tente ajustar a busca ou os filtros."}
                </p>
              </div>
              {tasks.length === 0 ? (
                <Button onClick={openCreateDialog} variant="outline">
                  <Plus />
                  Nova tarefa
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                onDelete={setTaskBeingDeleted}
                onEdit={openEditDialog}
                task={task}
              />
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />

      <TaskFormDialog
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        open={isFormOpen}
        task={taskBeingEdited}
      />

      <DeleteTaskDialog
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        // biome-ignore lint/performance/noJsxPropsBind: .
        onOpenChange={(open) => {
          if (!open) {
            setTaskBeingDeleted(null);
          }
        }}
        task={taskBeingDeleted}
      />
    </div>
  );
}
