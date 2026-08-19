import { apiRequest } from "../api";
import { getToken } from "../auth/session";
import type { Task, TaskFormValues } from "../schemas/tasks";

export interface TaskService {
  create: (input: TaskFormValues) => Promise<Task>;
  list: () => Promise<Task[]>;
  remove: (id: string) => Promise<void>;
  update: (id: string, input: Partial<TaskFormValues>) => Promise<Task>;
}

export function changedFields(
  original: Task,
  values: TaskFormValues
): Partial<TaskFormValues> {
  const changed: Partial<TaskFormValues> = {};

  if (values.description !== original.description) {
    changed.description = values.description;
  }
  if (values.due_date !== original.due_date) {
    changed.due_date = values.due_date;
  }
  if (values.priority !== original.priority) {
    changed.priority = values.priority;
  }
  if (values.status !== original.status) {
    changed.status = values.status;
  }
  if (values.title !== original.title) {
    changed.title = values.title;
  }

  return changed;
}

export const httpTaskService: TaskService = {
  create(input) {
    return apiRequest<Task>("/tasks/", {
      body: input,
      method: "POST",
      token: getToken(),
    });
  },
  list() {
    return apiRequest<Task[]>("/tasks/", {
      token: getToken(),
    });
  },
  async remove(id) {
    await apiRequest<{ message: string }>(`/tasks/${id}`, {
      method: "DELETE",
      token: getToken(),
    });
  },
  update(id, input) {
    return apiRequest<Task>(`/tasks/${id}`, {
      body: input,
      method: "PUT",
      token: getToken(),
    });
  },
};

export const taskService = httpTaskService;
