"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Can } from "@/components/atoms/Can";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { activitiesService, ACTIVITY_TYPES, type ActivityType } from "@/services/crm/activities.service";
import {
  Camera,
  Globe,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Repeat,
  StickyNote,
  ThumbsUp,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

const TYPE_LABELS: Record<ActivityType, string> = {
  CALL: "Llamada",
  EMAIL: "Correo",
  WHATSAPP: "WhatsApp",
  MEETING: "Reunión",
  NOTE: "Nota",
  WEB: "Web",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  FOLLOW_UP: "Seguimiento",
  OTHER: "Otro",
};

const TYPE_ICONS: Record<ActivityType, typeof Phone> = {
  CALL: Phone,
  EMAIL: Mail,
  WHATSAPP: MessageCircle,
  MEETING: Users,
  NOTE: StickyNote,
  WEB: Globe,
  INSTAGRAM: Camera,
  FACEBOOK: ThumbsUp,
  FOLLOW_UP: Repeat,
  OTHER: MoreHorizontal,
};

interface FormState {
  type: ActivityType;
  description: string;
}

const emptyForm: FormState = { type: "NOTE", description: "" };

export default function AdminActivitiesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);

  const { data: activities, isLoading } = useQuery({
    queryKey: ["admin-activities"],
    queryFn: activitiesService.getAll,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-activities"] });

  const createMutation = useMutation({
    mutationFn: (data: FormState) => activitiesService.create(data),
    onSuccess: () => {
      toast.success("Actividad registrada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo registrar la actividad"),
  });

  const deleteMutation = useMutation({
    mutationFn: activitiesService.remove,
    onSuccess: () => {
      toast.success("Actividad eliminada");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar la actividad"),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !form.description.trim()) return;
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Actividades</h1>
          <p className="text-muted-foreground">Llamadas, correos, reuniones y notas del equipo comercial</p>
        </div>
        <Can permission="crm.activities.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Registrar actividad
          </Button>
        </Can>
      </div>

      {form && (
        <Card title="Registrar actividad">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TYPES.map((type) => {
                const Icon = TYPE_ICONS[type];
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setForm({ ...form, type })}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      form.type === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {TYPE_LABELS[type]}
                  </button>
                );
              })}
            </div>
            <Textarea
              required
              rows={3}
              placeholder="¿Qué pasó?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit" variant="corporate" loading={createMutation.isPending}>
                Guardar
              </Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {isLoading && <p className="py-6 text-center text-muted-foreground">Cargando…</p>}
        {!isLoading && activities?.length === 0 && (
          <p className="py-6 text-center text-muted-foreground">
            <MessageSquare className="mx-auto mb-2 h-6 w-6 text-slate-300" />
            Sin actividades todavía.
          </p>
        )}
        <div className="space-y-3">
          {activities?.map((activity) => {
            const Icon = TYPE_ICONS[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3 border-b border-border/40 pb-3 last:border-0">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{TYPE_LABELS[activity.type]}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.occurredAt).toLocaleString("es-CO")}
                  </span>
                  <Can permission="crm.activities.delete">
                    <button
                      onClick={() => {
                        if (confirm("¿Eliminar esta actividad?")) deleteMutation.mutate(activity.id);
                      }}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Can>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
