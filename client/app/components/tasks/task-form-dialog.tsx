import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskFormValues,
  taskFormSchema,
} from "~/lib/schemas/tasks";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const FORM_ID = "task-form";
const MAX_DESCRIPTION_LENGTH = 500;

const EMPTY_TASK: TaskFormValues = {
  description: "",
  dueDate: "",
  priority: "media",
  status: "pendente",
  title: "",
};

interface TaskFormDialogProps {
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  open: boolean;
  task: Task | null;
}

export function TaskFormDialog({
  onOpenChange,
  onSubmit,
  open,
  task,
}: TaskFormDialogProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<TaskFormValues>({
    defaultValues: EMPTY_TASK,
    mode: "onTouched",
    resolver: zodResolver(taskFormSchema),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      task
        ? {
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
            title: task.title,
          }
        : EMPTY_TASK
    );
  }, [open, task, reset]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Altere as informações da tarefa e salve."
              : "Preencha as informações para criar uma nova tarefa."}
          </DialogDescription>
        </DialogHeader>

        <form id={FORM_ID} noValidate onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <Input
                aria-invalid={Boolean(errors.title)}
                id="title"
                placeholder="Ex.: Entregar o Trabalho de SD dia 20/08"
                {...register("title")}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <Textarea
                aria-invalid={Boolean(errors.description)}
                id="description"
                maxLength={MAX_DESCRIPTION_LENGTH}
                placeholder="Detalhes da tarefa"
                rows={3}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field data-invalid={Boolean(errors.dueDate)}>
              <FieldLabel htmlFor="dueDate">Data limite</FieldLabel>
              <Input
                aria-invalid={Boolean(errors.dueDate)}
                id="dueDate"
                type="date"
                {...register("dueDate")}
              />
              <FieldError errors={[errors.dueDate]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.priority)}>
                <FieldLabel htmlFor="priority">Prioridade</FieldLabel>
                <Controller
                  control={control}
                  name="priority"
                  // biome-ignore lint/performance/noJsxPropsBind: relaxa.
                  render={({ field }) => (
                    <Select
                      items={PRIORITY_LABELS}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full" id="priority">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {PRIORITY_LABELS[priority]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.priority]} />
              </Field>

              <Field data-invalid={Boolean(errors.status)}>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  // biome-ignore lint/performance/noJsxPropsBind: relaxa².
                  render={({ field }) => (
                    <Select
                      items={STATUS_LABELS}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full" id="status">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.status]} />
              </Field>
            </div>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            disabled={isSubmitting}
            // biome-ignore lint/performance/noJsxPropsBind: relaxa³.
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            Cancelar
          </Button>
          <Button disabled={isSubmitting} form={FORM_ID} type="submit">
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            {task ? "Salvar alterações" : "Criar tarefa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
