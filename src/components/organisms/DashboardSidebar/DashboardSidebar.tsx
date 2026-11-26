"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ChartLine,
  ChevronDown,
  FileQuestion,
  FileText,
  Folder,
  GraduationCap,
  Home,
  Settings,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Can } from "@/components/atoms/Can";
import { cn } from "@/lib/utils/cn";

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavLeaf {
  name: string;
  href: string;
  /** Sin permiso => siempre visible para cualquier usuario autenticado. */
  permission?: string;
}

interface NavGroup {
  name: string;
  icon: LucideIcon;
  href?: string;
  children: NavLeaf[];
}

type NavEntry = (NavLeaf & { icon: LucideIcon }) | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

/**
 * Navegación del admin (Fase Admin+CRM). Cada hoja declara el permiso que
 * la habilita; sin `permission`, es visible para cualquier usuario con
 * sesión (p. ej. Dashboard, Configuración). El filtrado real de acceso lo
 * sigue haciendo el backend — esto solo oculta la UI (ver `usePermissions`).
 */
const navigation: NavEntry[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  {
    name: "CRM",
    icon: Users,
    href: "/admin/crm",
    children: [
      { name: "Leads", href: "/admin/crm/leads", permission: "crm.leads.read" },
      { name: "Empresas", href: "/admin/crm/companies", permission: "crm.companies.read" },
      { name: "Contactos", href: "/admin/crm/contacts", permission: "crm.contacts.read" },
      { name: "Oportunidades", href: "/admin/crm/opportunities", permission: "crm.opportunities.read" },
      { name: "Pipeline", href: "/admin/crm/pipeline", permission: "crm.pipeline.read" },
      { name: "Tareas", href: "/admin/crm/tasks", permission: "crm.tasks.read" },
      { name: "Actividades", href: "/admin/crm/activities", permission: "crm.activities.read" },
    ],
  },
  // Analítica web del sitio público (Etapa 15), junto al CRM: alimenta decisiones comerciales y de marketing.
  { name: "Analítica web", href: "/admin/analytics", icon: ChartLine, permission: "analytics.dashboard.read" },
  {
    name: "Contenido",
    icon: FileText,
    children: [
      { name: "Noticias", href: "/admin/news", permission: "cms.news.read" },
      { name: "Blog", href: "/admin/blog", permission: "cms.blog.read" },
      { name: "Equipo / Organigrama", href: "/admin/team", permission: "cms.team.read" },
      { name: "Home / Nosotros", href: "/admin/home-nosotros", permission: "cms.home.read" },
    ],
  },
  { name: "Servicios", href: "/admin/services", icon: BriefcaseBusiness, permission: "cms.services.read" },
  { name: "Archivos", href: "/admin/files", icon: Folder, permission: "foundation.files.read" },
  { name: "PQR", href: "/admin/pqr", icon: FileQuestion, permission: "pqrs.tickets.read" },
  { name: "Talento", href: "/admin/careers", icon: GraduationCap, permission: "jobs.vacancies.read" },
  {
    name: "Usuarios",
    icon: ShieldCheck,
    children: [
      { name: "Usuarios", href: "/admin/users", permission: "security.users.read" },
      { name: "Roles", href: "/admin/roles", permission: "security.roles.read" },
      { name: "Permisos", href: "/admin/permissions", permission: "security.roles.read" },
    ],
  },
  {
    name: "Configuración",
    icon: Settings,
    children: [
      { name: "Configuración", href: "/admin/settings" },
      { name: "Auditoría", href: "/admin/audit", permission: "audit.logs.read" },
    ],
  },
];

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      navigation.filter(isGroup).map((group) => [
        group.name,
        group.children.some((child) => pathname?.startsWith(child.href)),
      ]),
    ),
  );

  const toggleGroup = (name: string) => setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 border-r border-slate-200
          bg-white
          transition-transform duration-300
          lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-20 items-center justify-between border-b px-5">
          <Link href="/admin/dashboard" className="text-xl font-bold text-blue-600">
            Capital
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 overflow-y-auto p-4">
          {navigation.map((entry) => {
            const Icon = entry.icon;

            if (!isGroup(entry)) {
              const link = (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    pathname?.startsWith(entry.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{entry.name}</span>
                </Link>
              );
              return entry.permission ? (
                <Can key={entry.href} permission={entry.permission}>
                  {link}
                </Can>
              ) : (
                link
              );
            }

            const visibleChildren = entry.children.filter(
              (child) => !child.permission,
            );
            const permissionKeys = entry.children.map((c) => c.permission).filter(Boolean) as string[];

            return (
              <Can key={entry.name} permissions={permissionKeys} any fallback={null}>
                <SidebarGroup
                  group={entry}
                  Icon={Icon}
                  pathname={pathname}
                  isOpen={!!openGroups[entry.name]}
                  onToggle={() => toggleGroup(entry.name)}
                  alwaysVisibleChildren={visibleChildren}
                />
              </Can>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function SidebarGroup({
  group,
  Icon,
  pathname,
  isOpen,
  onToggle,
}: {
  group: NavGroup;
  Icon: LucideIcon;
  pathname: string | null;
  isOpen: boolean;
  onToggle: () => void;
  alwaysVisibleChildren: NavLeaf[];
}) {
  const isActive = group.children.some((child) => pathname?.startsWith(child.href));

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
          isActive ? "text-blue-600" : "text-slate-600 hover:bg-blue-50 hover:text-blue-600",
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="flex-1 text-left">{group.name}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l border-slate-100 pl-4">
          {group.children.map((child) => {
            const link = (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition",
                  pathname?.startsWith(child.href)
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-600",
                )}
              >
                {child.name}
              </Link>
            );
            return child.permission ? (
              <Can key={child.href} permission={child.permission}>
                {link}
              </Can>
            ) : (
              link
            );
          })}
        </div>
      )}
    </div>
  );
}
