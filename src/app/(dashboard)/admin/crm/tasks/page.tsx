"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Can } from "@/components/atoms/Can";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tasksService, type ApiTask, type TaskPriority, type TaskStatus } from "@/services/crm/tasks.service";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const PRIORITY_LABELS: Record<TaskPriority, string> = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta", URGENT: "Urgente" };
const PRIORITY_STYLES: Record<TaskPriority, string> = {
  LOW: "bg-slate-100 text-slate-500",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-red-50 text-red-700",
  URGENT: "bg-red-600 text-white",
};

const STATUSES: TaskStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};
const STATUS_STYLES: Record<TaskStatus, string> = {
  PENDING: "bg-slate-100 text-slate-500",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-slate-200 text-slate-500 line-through",
};

/** Activas = todavía requieren acción; el resto (completadas/canceladas) va a la sección "Completadas". */
const isActive = (status: TaskStatus) => status === "PENDING" || status === "IN_PROGRESS";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

interface FormState {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

const emptyForm: FormState = { title: "", description: "", dueDate: "", priority: "MEDIUM", status: "PENDING" };

export default function AdminTasksPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);

  const { data: tasks, isLoading } = useQuery({ queryKey: ["admin-tasks"], queryFn: tasksService.getAll });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });

  const createMutation = useMutation({
    mutationFn: (data: FormState) =>
      tasksService.create({
        title: data.title,
        description: data.description || undefined,
        dueDate: data.dueDate || undefined,
        priority: data.priority,
        status: data.status,
      }),
    onSuccess: () => {
      toast.success("Tarea creada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear la tarea"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: FormState) =>
      tasksService.update(id!, {
        title: data.title,
        description: data.description || undefined,
        dueDate: data.dueDate || undefined,
        priority: data.priority,
        status: data.status,
      }),
    onSuccess: () => {
      toast.success("Tarea actualizada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar la tarea"),
  });

  const toggleMutation = useMutation({
    mutationFn: (task: ApiTask) =>
      tasksService.update(task.id, { status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED" }),
    onSuccess: invalidate,
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar la tarea"),
  });

  const deleteMutation = useMutation({
    mutationFn: tasksService.remove,
    onSuccess: () => {
      toast.success("Tarea eliminada");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar la tarea"),
  });

  const startEdit = (task: ApiTask) =>
    setForm({
      id: task.id,
      title: task.title,
      description: task.description ?? "",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      priority: task.priority,
      status: task.status,
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  // Sección 26 del brief: Hoy / Próximas / Vencidas / Completadas.
  const today = startOfDay(new Date());
  const active = tasks?.filter((t) => isActive(t.status)) ?? [];
  const completed = tasks?.filter((t) => !isActive(t.status)) ?? [];

  const overdue = active.filter((t) => t.dueDate && startOfDay(new Date(t.dueDate)) < today);
  const dueToday = active.filter((t) => t.dueDate && startOfDay(new Date(t.dueDate)).getTime() === today.getTime());
  const upcoming = active.filter((t) => !t.dueDate || startOfDay(new Date(t.dueDate)) > today);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Tareas</h1>
          <p className="text-muted-foreground">Pendientes del equipo comercial</p>
        </div>
        <Can permission="crm.tasks.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Nueva tarea
          </Button>
        </Can>
      </div>

      {form && (
        <Card title={form.id ? "Editar tarea" : "Crear tarea"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Título</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Fecha límite</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TaskPriority })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TaskStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descripción</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
              <Button type="submit" variant="corporate" loading={createMutation.isPending || updateMutation.isPending}>
                Guardar
              </Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title={`Vencidas (${overdue.length})`}>
        <TaskTable
          tasks={overdue}
          isLoading={isLoading}
          emptyLabel="Sin tareas vencidas."
          onToggle={(t) => toggleMutation.mutate(t)}
          onEdit={startEdit}
          onDelete={(id, title) => {
            if (confirm(`¿Eliminar la tarea "${title}"?`)) deleteMutation.mutate(id);
          }}
        />
      </Card>

      <Card title={`Hoy (${dueToday.length})`}>
        <TaskTable
          tasks={dueToday}
          isLoading={isLoading}
          emptyLabel="Nada programado para hoy."
          onToggle={(t) => toggleMutation.mutate(t)}
          onEdit={startEdit}
          onDelete={(id, title) => {
            if (confirm(`¿Eliminar la tarea "${title}"?`)) deleteMutation.mutate(id);
          }}
        />
      </Card>

      <Card title={`Próximas (${upcoming.length})`}>
        <TaskTable
          tasks={upcoming}
          isLoading={isLoading}
          emptyLabel="No hay próximas tareas."
          onToggle={(t) => toggleMutation.mutate(t)}
          onEdit={startEdit}
          onDelete={(id, title) => {
            if (confirm(`¿Eliminar la tarea "${title}"?`)) deleteMutation.mutate(id);
          }}
        />
      </Card>

      {completed.length > 0 && (
        <Card title={`Completadas (${completed.length})`}>
          <TaskTable
            tasks={completed}
            isLoading={false}
            emptyLabel=""
            onToggle={(t) => toggleMutation.mutate(t)}
            onEdit={startEdit}
            onDelete={(id, title) => {
              if (confirm(`¿Eliminar la tarea "${title}"?`)) deleteMutation.mutate(id);
            }}
          />
        </Card>
      )}
    </div>
  );
}

function TaskTable({
  tasks,
  isLoading,
  emptyLabel,
  onToggle,
  onEdit,
  onDelete,
}: {
  tasks: ApiTask[];
  isLoading: boolean;
  emptyLabel: string;
  onToggle: (task: ApiTask) => void;
  onEdit: (task: ApiTask) => void;
  onDelete: (id: string, title: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-slate-500">
            <th className="pb-2 font-medium">Hecha</th>
            <th className="pb-2 font-medium">Título</th>
            <th className="pb-2 font-medium">Fecha límite</th>
            <th className="pb-2 font-medium">Estado</th>
            <th className="pb-2 font-medium">Prioridad</th>
            <th className="pb-2 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-muted-foreground">
                Cargando…
              </td>
            </tr>
          )}
          {!isLoading && tasks.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-muted-foreground">
                {emptyLabel || "Nada por aquí."}
              </td>
            </tr>
          )}
          {tasks.map((task) => (
            <tr key={task.id} className="border-b last:border-0">
              <td className="py-3">
                <Checkbox checked={task.status === "COMPLETED"} onCheckedChange={() => onToggle(task)} />
              </td>
              <td
                className={`py-3 font-medium ${
                  task.status === "COMPLETED" || task.status === "CANCELLED"
                    ? "text-muted-foreground line-through"
                    : "text-slate-900"
                }`}
              >
                {task.title}
              </td>
              <td className="py-3 text-muted-foreground">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString("es-CO") : "—"}
              </td>
              <td className="py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
                  {STATUS_LABELS[task.status]}
                </span>
              </td>
              <td className="py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
                  {PRIORITY_LABELS[task.priority]}
                </span>
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <Can permission="crm.tasks.update">
                    <button
                      onClick={() => onEdit(task)}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </Can>
                  <Can permission="crm.tasks.delete">
                    <button
                      onClick={() => onDelete(task.id, task.title)}
                      className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Can>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
