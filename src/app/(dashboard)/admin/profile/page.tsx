"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { LogOut, ShieldCheck, User } from "lucide-react";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresa tu contraseña actual"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

/** Perfil del usuario (sección 13 del brief): datos básicos, cambio de contraseña y cerrar sesión. */
export default function AdminProfilePage() {
  const { user, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsSubmitting(true);
    try {
      await authService.changePassword(data.currentPassword, data.newPassword);
      toast.success("Contraseña actualizada correctamente");
      reset();
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string } | undefined)?.message
          : undefined;
      toast.error(message ?? "No se pudo actualizar la contraseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CC";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Mi perfil</h1>
        <p className="text-muted-foreground">Tus datos de cuenta y seguridad</p>
      </div>

      <Card>
        <div className="flex flex-col items-center gap-4 border-b pb-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg font-semibold text-slate-900">{user?.name ?? "—"}</p>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <User className="h-3.5 w-3.5" /> {user?.email ?? "—"}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <ShieldCheck className="h-3.5 w-3.5" /> {user?.roleName ?? "—"}
            </p>
          </div>
          <Button variant="outline" onClick={() => logout()} className="gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-md space-y-4">
          <h2 className="font-medium text-slate-900">Cambiar contraseña</h2>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input id="currentPassword" type="password" {...register("currentPassword")} />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input id="newPassword" type="password" {...register("newPassword")} />
            {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" variant="corporate" loading={isSubmitting}>
            Actualizar contraseña
          </Button>
        </form>
      </Card>
    </div>
  );
}
