"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

/** Traducciones legibles para segmentos de ruta conocidos del admin. */
const LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  crm: "CRM",
  leads: "Leads",
  companies: "Empresas",
  contacts: "Contactos",
  opportunities: "Oportunidades",
  pipeline: "Pipeline",
  tasks: "Tareas",
  activities: "Actividades",
  news: "Noticias",
  blog: "Blog",
  team: "Equipo",
  services: "Servicios",
  pqr: "PQR",
  careers: "Talento",
  users: "Usuarios",
  roles: "Roles",
  permissions: "Permisos",
  settings: "Configuración",
  audit: "Auditoría",
  analytics: "Analítica web",
};

function labelFor(segment: string) {
  return LABELS[segment] ?? segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  let href = "";

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 border-b border-slate-100 bg-white px-4 py-2.5 text-sm text-slate-500 md:px-6">
      <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-blue-600">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, index) => {
        href += `/${segment}`;
        const isLast = index === segments.length - 1;
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            {isLast ? (
              <span className="font-medium text-slate-700">{labelFor(segment)}</span>
            ) : (
              <Link href={href} className="hover:text-blue-600">
                {labelFor(segment)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
