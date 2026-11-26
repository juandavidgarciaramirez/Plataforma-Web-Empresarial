"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { api } from "@/lib/api/axios";
import { getAccessToken, getRefreshToken, storeTokens, clearTokens } from "@/lib/auth/tokens";

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  permissions?: string[];
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    if (error.response?.status === 401) {
      return data?.message ?? "Credenciales inválidas";
    }
    if (data?.message) return data.message;
    if (error.code === "ECONNABORTED" || !error.response) {
      return "No fue posible conectar con el servidor. Intenta nuevamente.";
    }
  }
  return "Ocurrió un error inesperado. Intenta nuevamente.";
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Restaura la sesión al montar (recarga de página) si hay un access token guardado.
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    api
      .get<{ data: User }>("/auth/me")
      .then(({ data }) => {
        setState((prev) => ({ ...prev, user: data.data, isAuthenticated: true }));
      })
      .catch(() => {
        // No limpiamos tokens aquí: si la sesión de verdad ya no es válida
        // (refresh token revocado/expirado), el interceptor de axios.ts ya
        // la cerró y redirigió a /login. Si esto fue un fallo transitorio
        // (429 por el rate limit, timeout, red), no hay que destruir una
        // sesión válida solo porque ESTA instancia del hook — hay varias
        // montadas a la vez en cada página vía `usePermissions`/`<Can>` —
        // no logró resolver `/auth/me` esta vez.
      });
  }, []);

  const login = useCallback(
    async ({ email, password }: LoginCredentials): Promise<LoginResult> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { data } = await api.post<{
          data: {
            accessToken: string;
            refreshToken: string;
            user: User;
          };
        }>("/auth/login", { email, password });

        const { accessToken, refreshToken, user } = data.data;

        storeTokens(accessToken, refreshToken);

        setState({ user, isAuthenticated: true, isLoading: false, error: null });
        router.push("/admin/dashboard");

        return { success: true };
      } catch (error) {
        const message = extractErrorMessage(error);
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        return { success: false, error: message };
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Si el backend no responde, igual limpiamos la sesión localmente.
    } finally {
      clearTokens();
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      router.push("/login");
    }
  }, [router]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
  };
}
