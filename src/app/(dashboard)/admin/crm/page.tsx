"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Building2,
  Contact,
  KanbanSquare,
  ListChecks,
  Sparkles,
  Target,
} from "lucide-react";
import { leadsService } from "@/services/crm/leads.service";
import { companiesService } from "@/services/crm/companies.service";
import { contactsService } from "@/services/crm/contacts.service";
import { opportunitiesService } from "@/services/crm/opportunities.service";
import { tasksService } from "@/services/crm/tasks.service";
import { activitiesService } from "@/services/crm/activities.service";
import { Can } from "@/components/atoms/Can";

const sections = [
  { name: "Leads", href: "/admin/crm/leads", icon: Sparkles, permission: "crm.leads.read", queryKey: "leads" },
  { name: "Empresas", href: "/admin/crm/companies", icon: Building2, permission: "crm.companies.read", queryKey: "companies" },
  { name: "Contactos", href: "/admin/crm/contacts", icon: Contact, permission: "crm.contacts.read", queryKey: "contacts" },
  { name: "Oportunidades", href: "/admin/crm/opportunities", icon: Target, permission: "crm.opportunities.read", queryKey: "opportunities" },
  { name: "Pipeline", href: "/admin/crm/pipeline", icon: KanbanSquare, permission: "crm.pipeline.read", queryKey: null },
  { name: "Tareas", href: "/admin/crm/tasks", icon: ListChecks, permission: "crm.tasks.read", queryKey: "tasks" },
  { name: "Actividades", href: "/admin/crm/activities", icon: Activity, permission: "crm.activities.read", queryKey: "activities" },
] as const;

export default function CrmHubPage() {
  const { data: leads } = useQuery({ queryKey: ["crm-hub-leads"], queryFn: () => leadsService.getAll() });
  const { data: companies } = useQuery({ queryKey: ["crm-hub-companies"], queryFn: companiesService.getAll });
  const { data: contacts } = useQuery({ queryKey: ["crm-hub-contacts"], queryFn: contactsService.getAll });
  const { data: opportunities } = useQuery({
    queryKey: ["crm-hub-opportunities"],
    queryFn: () => opportunitiesService.getAll(),
  });
  const { data: tasks } = useQuery({ queryKey: ["crm-hub-tasks"], queryFn: tasksService.getAll });
  const { data: activities } = useQuery({ queryKey: ["crm-hub-activities"], queryFn: activitiesService.getAll });

  const counts: Record<string, number | undefined> = {
    leads: leads?.length,
    companies: companies?.length,
    contacts: contacts?.length,
    opportunities: opportunities?.length,
    tasks: tasks?.length,
    activities: activities?.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">CRM</h1>
        <p className="text-muted-foreground">Leads, empresas, contactos y seguimiento comercial</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const count = section.queryKey ? counts[section.queryKey] : undefined;
          return (
            <Can key={section.href} permission={section.permission}>
              <Link
                href={section.href}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{section.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {count !== undefined ? `${count} registro${count === 1 ? "" : "s"}` : "Ver tablero"}
                  </p>
                </div>
              </Link>
            </Can>
          );
        })}
      </div>
    </div>
  );
}
