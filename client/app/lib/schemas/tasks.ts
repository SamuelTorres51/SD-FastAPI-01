import { z } from "zod";

export const TASK_PRIORITIES = ["baixa", "media", "alta"] as const;
export const TASK_STATUSES = ["pendente", "em_andamento", "concluida"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  alta: "Alta",
  baixa: "Baixa",
  media: "Média",
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  concluida: "Concluída",
  em_andamento: "Em andamento",
  pendente: "Pendente",
};

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;

export function todayAsISODate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function buildTaskFormSchema(originalDueDate?: string) {
  return z.object({
    description: z.string().max(MAX_DESCRIPTION_LENGTH, {
      error: `A descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`,
    }),
    due_date: z
      .string()
      .min(1, { error: "Informe a data limite." })
      .refine(
        (value) =>
          value === "" ||
          value === originalDueDate ||
          value >= todayAsISODate(),
        { error: "A data limite não pode estar no passado." }
      ),
    priority: z.enum(TASK_PRIORITIES, { error: "Selecione a prioridade." }),
    status: z.enum(TASK_STATUSES, { error: "Selecione o status." }),
    title: z
      .string()
      .min(1, { error: "Informe o título da tarefa." })
      .max(MAX_TITLE_LENGTH, {
        error: `O título deve ter no máximo ${MAX_TITLE_LENGTH} caracteres.`,
      }),
  });
}

export const taskFormSchema = buildTaskFormSchema();

export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type Task = TaskFormValues & {
  created_at: string;
  id: string;
};
