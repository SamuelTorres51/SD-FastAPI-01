import type { Task } from "../schemas/tasks";

/**
 * Converte "2026-08-20" para 20/08/2026.
 *
 * O Date é montado a partir dos números para evitar o `new Date("2026-08-20")`,
 * que é interpretado como UTC e volta um dia atrás em fusos negativos.
 */
export function formatDueDate(dueDate: string) {
  const [year, month, day] = dueDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

export function isOverdue(task: Task) {
  if (task.status === "concluida") {
    return false;
  }

  const [year, month, day] = task.dueDate.split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}
