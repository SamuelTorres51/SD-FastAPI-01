import type { Task } from "../schemas/tasks";

export function formatDueDate(dueDate: string) {
  const [year, month, day] = dueDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

export function isOverdue(task: Task) {
  if (task.status === "concluida") {
    return false;
  }

  const [year, month, day] = task.due_date.split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}
