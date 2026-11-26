import type { ApiErrorBody, ApiSuccessBody } from "./response"

/**
 * Cliente ligero para el backend NestJS real (`NEXT_PUBLIC_API_URL`, por
 * defecto `http://localhost:3001/api/v1` — mismo backend que `axios.ts`).
 *
 * Etapa 3 (2026-08-26): antes apuntaba a las rutas `/api/v1/**` de este
 * mismo proyecto Next.js (un segundo backend en memoria, `src/features/**`
 * + `src/app/api/v1/**`), que se retiraron para consolidar en un único
 * backend real (regla 7 del encargo — ver docs/backend-audit.md). Se
 * mantiene como un cliente `fetch` simple (en vez de reusar `axios.ts`)
 * porque los formularios públicos son anónimos (no necesitan el interceptor
 * de `Authorization` de `axios.ts`) y porque `apiPostForm` sube archivos
 * como `multipart/form-data`, que `fetch` maneja de forma nativa.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

export class ApiRequestError extends Error {
  errors: string[]

  constructor(message: string, errors: string[] = []) {
    super(message)
    this.name = "ApiRequestError"
    this.errors = errors
  }
}

function resolveUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiSuccessBody<T> | ApiErrorBody

  if (body.success === false) {
    throw new ApiRequestError(body.message, body.errors)
  }

  return body.data
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(resolveUrl(path), init)
  return parseResponse<T>(response)
}

export async function apiPostJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(resolveUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return parseResponse<T>(response)
}

export async function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(resolveUrl(path), { method: "POST", body: formData })
  return parseResponse<T>(response)
}
