import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, storeTokens, clearTokens } from "@/lib/auth/tokens";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001/api/v1";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Endpoints de auth que nunca deben disparar un intento de refresh: si
// alguno de estos responde 401, el problema es la credencial/token en sí,
// no una sesión vencida — reintentar entraría en bucle.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/refresh", "/auth/logout"];

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function redirectToLogin() {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Un solo refresh en vuelo a la vez: si varias requests fallan con 401 en
// paralelo, todas se suman a esta cola y se reintentan con el token nuevo
// en cuanto la renovación (única) termina.
let refreshInFlight: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
      }

      // Cliente axios "limpio" (sin los interceptors de arriba): evita
      // reenviar el access token vencido y evita que un 401 de este mismo
      // request vuelva a pasar por este interceptor.
      const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = data.data as {
        accessToken: string;
        refreshToken: string;
      };

      storeTokens(accessToken, newRefreshToken);
      return accessToken;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => originalRequest.url?.includes(path));

    // Un 401 en /auth/login o /auth/logout es del propio endpoint (credencial
    // inválida, token ya revocado) — no de una sesión vencida. Se deja pasar
    // tal cual para que quien hizo la llamada (p. ej. el formulario de login)
    // lo maneje; forzar un redirect aquí le pisaría el mensaje de error.
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Solo un 401 del propio /auth/refresh confirma que el refresh token
      // ya no sirve (revocado/expirado) — ahí sí hay que cerrar sesión. Un
      // 429 (rate limit), timeout o 5xx es transitorio: no hay que destruir
      // la sesión por una respuesta momentánea del servidor, o un usuario
      // navegando rápido entre varias páginas quedaría deslogueado en cascada.
      const refreshStatus = axios.isAxiosError(refreshError) ? refreshError.response?.status : undefined;
      if (refreshStatus === 401) {
        redirectToLogin();
      }
      return Promise.reject(refreshError);
    }
  },
);
