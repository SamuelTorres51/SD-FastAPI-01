import type { Task, TaskFormValues } from "../schemas/tasks";

export interface TaskService {
  create: (input: TaskFormValues) => Promise<Task>;
  list: () => Promise<Task[]>;
  remove: (id: string) => Promise<void>;
  update: (id: string, input: TaskFormValues) => Promise<Task>;
}

const STORAGE_KEY = "tasks";
const FAKE_DELAY = 250;

function delay() {
  return new Promise((resolve) => setTimeout(resolve, FAKE_DELAY));
}

function readTasks(): Task[] {
  if (typeof localStorage === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

function writeTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export const localTaskService: TaskService = {
  async create(input) {
    await delay();
    const task: Task = {
      ...input,
      created_at: new Date().toISOString(),
      id: crypto.randomUUID(),
    };
    writeTasks([task, ...readTasks()]);
    return task;
  },
  async list() {
    await delay();
    return readTasks();
  },
  async remove(id) {
    await delay();
    const tasks = readTasks();
    if (!tasks.some((task) => task.id === id)) {
      throw new Error("Tarefa não encontrada.");
    }
    writeTasks(tasks.filter((task) => task.id !== id));
  },
  async update(id, input) {
    await delay();
    const tasks = readTasks();
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new Error("Tarefa não encontrada.");
    }
    const updated: Task = { ...tasks[index], ...input };
    tasks[index] = updated;
    writeTasks(tasks);
    return updated;
  },
};

export const taskService = localTaskService;
