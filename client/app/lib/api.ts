export const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ApiError";
    this.status = status;
  }
}

const FALLBACK_MESSAGE = "Não foi possível completar a operação";
const NETWORK_MESSAGE =
  "Não foi possível conectar ao servidor. Verifique se ele está sendo executado";

interface RequestOptions {
  body?: unknown;
  method?: "DELETE" | "GET" | "POST" | "PUT";
  token?: string | null;
}

async function readErrorMessage(response: Response) {
  try {
    const data: unknown = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof data.detail === "string"
    ) {
      return data.detail;
    }
  } catch {
    return FALLBACK_MESSAGE;
  }

  return FALLBACK_MESSAGE;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, method = "GET", token } = options;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      body: body === undefined ? undefined : JSON.stringify(body),
      headers,
      method,
    });
  } catch (error) {
    throw new ApiError(0, NETWORK_MESSAGE, { cause: error });
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
