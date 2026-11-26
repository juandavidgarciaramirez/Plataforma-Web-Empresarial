import { api } from "@/lib/api/axios";

/** Consume `/api/v1/auth/**` (backend NestJS) — recuperación y cambio de contraseña. */
export const authService = {
  forgotPassword: (email: string) =>
    api.post<{ data: { message: string } }>("/auth/forgot-password", { email }).then((res) => res.data.data),

  resetPassword: (token: string, newPassword: string) =>
    api.post<{ data: { message: string } }>("/auth/reset-password", { token, newPassword }).then((res) => res.data.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api
      .post<{ data: { message: string } }>("/auth/change-password", { currentPassword, newPassword })
      .then((res) => res.data.data),
};
