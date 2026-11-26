"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { notificationsService } from "@/services/notifications.service";
import { cn } from "@/lib/utils/cn";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

function NotificationsBell() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: notificationsService.getUnreadCount,
    refetchInterval: 60000,
  });

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsService.getMine(),
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
  };

  const handleMarkRead = async (id: string) => {
    await notificationsService.markRead(id);
    invalidate();
  };

  const handleMarkAllRead = async () => {
    await notificationsService.markAllRead();
    invalidate();
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 hover:bg-slate-100"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5 text-slate-600" />
        {Boolean(unreadCount) && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount! > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notificaciones</p>
            {Boolean(unreadCount) && (
              <button onClick={handleMarkAllRead} className="text-xs font-medium text-blue-600 hover:underline">
                Marcar todas como leídas
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {isLoading && <p className="p-4 text-center text-sm text-muted-foreground">Cargando…</p>}
            {!isLoading && notifications?.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">No tienes notificaciones.</p>
            )}
            {notifications?.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.isRead && handleMarkRead(n.id)}
                className={cn(
                  "block w-full border-b px-4 py-3 text-left last:border-0 hover:bg-slate-50",
                  !n.isRead && "bg-blue-50/50",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">{n.title}</p>
                  {!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
                </div>
                {n.message && <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>}
                <p className="mt-1 text-[11px] text-slate-400">{formatRelativeTime(n.createdAt)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CC";
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />

          <input
            type="search"
            placeholder="Buscar..."
            className="w-64 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationsBell />

        <div className="flex items-center gap-3 border-l pl-3">
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
            title="Mi perfil"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {initials}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.name ?? "Administrador"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.roleName ?? "Capital Consulting"}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => logout()}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
