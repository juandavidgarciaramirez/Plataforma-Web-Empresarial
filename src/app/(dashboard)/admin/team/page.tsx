"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Can } from "@/components/atoms/Can";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  teamService,
  type ApiTeamMember,
  type TeamMemberStatus,
  type TeamMemberOrgLevel,
  type TeamMemberConnectorCurve,
} from "@/services/content/team.service";
import { ImageUpload, useUploadTracker } from "@/components/molecules/ImageUpload";
import {
  primaryImageField,
  primaryImagePayload,
  type ImageFieldValue,
} from "@/services/media.service";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const NONE = "__none__";

interface FormState {
  id?: string;
  name: string;
  position: string;
  bio: string;
  order: string;
  status: TeamMemberStatus;
  profession: string;
  area: string;
  serviceCode: string;
  specialties: string;
  certifications: string;
  certificationsLabel: string;
  isTransversal: boolean;
  orgLevel: string;
  parentId: string;
  connectorCurve: string;
  photo: ImageFieldValue | null;
  /** Fotografía al abrir el formulario: solo se envía al backend si cambió. */
  originalPhoto: ImageFieldValue | null;
}

const emptyForm: FormState = {
  name: "",
  position: "",
  bio: "",
  order: "0",
  status: "ACTIVE",
  profession: "",
  area: "",
  serviceCode: "",
  specialties: "",
  certifications: "",
  certificationsLabel: "",
  isTransversal: false,
  orgLevel: NONE,
  parentId: NONE,
  connectorCurve: NONE,
  photo: null,
  originalPhoto: null,
};

const csv = (s: string) => s.split(",").map((v) => v.trim()).filter(Boolean);

export default function AdminTeamPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);
  const { uploading, onBusyChange } = useUploadTracker();

  const { data: members, isLoading } = useQuery({ queryKey: ["admin-team"], queryFn: teamService.getAll });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-team"] });

  const toPayload = (data: FormState) => {
    const photo = primaryImagePayload(data.originalPhoto, data.photo);
    return {
      name: data.name,
      position: data.position,
      bio: data.bio || undefined,
      order: Number(data.order) || 0,
      status: data.status,
      profession: data.profession || undefined,
      area: data.area || undefined,
      serviceCode: data.serviceCode || undefined,
      specialties: csv(data.specialties),
      certifications: data.certifications ? csv(data.certifications) : undefined,
      certificationsLabel: data.certificationsLabel || undefined,
      isTransversal: data.isTransversal,
      orgLevel: data.orgLevel === NONE ? undefined : (Number(data.orgLevel) as TeamMemberOrgLevel),
      parentId: data.parentId === NONE ? undefined : data.parentId,
      connectorCurve: data.connectorCurve === NONE ? undefined : (data.connectorCurve as TeamMemberConnectorCurve),
      ...(photo.fileId !== undefined && { photoFileId: photo.fileId }),
      ...(photo.alt !== undefined && { photoAlt: photo.alt }),
      };
  };

  const createMutation = useMutation({
    mutationFn: (data: FormState) => teamService.create(toPayload(data)),
    onSuccess: () => {
      toast.success("Integrante agregado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo agregar el integrante"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: FormState) => teamService.update(id!, toPayload(data)),
    onSuccess: () => {
      toast.success("Integrante actualizado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar el integrante"),
  });

  const deleteMutation = useMutation({
    mutationFn: teamService.remove,
    onSuccess: () => {
      toast.success("Integrante eliminado");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar el integrante"),
  });

  const startEdit = (member: ApiTeamMember) => {
    const photo = primaryImageField(member.photoUrl, member.photoAlt, member.photoFileId);
    setForm({
      id: member.id,
      name: member.name,
      position: member.position,
      bio: member.bio ?? "",
      order: String(member.order),
      status: member.status,
      profession: member.profession ?? "",
      area: member.area ?? "",
      serviceCode: member.serviceCode ?? "",
      specialties: member.specialties.join(", "),
      certifications: member.certifications?.join(", ") ?? "",
      certificationsLabel: member.certificationsLabel ?? "",
      isTransversal: member.isTransversal,
      orgLevel: member.orgLevel ? String(member.orgLevel) : NONE,
      parentId: member.parentId ?? NONE,
      connectorCurve: member.connectorCurve ?? NONE,
      photo,
      originalPhoto: photo,
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const possibleParents = members?.filter((m) => m.id !== form?.id) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Equipo / Organigrama</h1>
          <p className="text-muted-foreground">
            Integrantes del equipo publicados en el sitio y su posición en el organigrama de Nosotros.
          </p>
        </div>
        <Can permission="cms.team.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo integrante
          </Button>
        </Can>
      </div>

      {form && (
        <Card title={form.id ? "Editar integrante" : "Agregar integrante"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Input required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Profesión</Label>
              <Input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Área / línea (badge)</Label>
              <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Biografía</Label>
              <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div className="md:col-span-2 md:max-w-sm">
              <ImageUpload
                context="team"
                slot="photo"
                label="Fotografía"
                value={form.photo}
                onChange={(photo) => setForm((current) => (current ? { ...current, photo } : current))}
                onBusyChange={onBusyChange}
                previewAspect="aspect-[4/5]"
                hint="Se muestra en la tarjeta del organigrama y en el perfil del integrante (Nosotros)."
              />
            </div>

            <div className="space-y-2">
              <Label>Código de servicio (catalog.services)</Label>
              <Input placeholder="p. ej. capital-hse" value={form.serviceCode} onChange={(e) => setForm({ ...form, serviceCode: e.target.value })} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Especialidades (separadas por coma)</Label>
              <Textarea rows={2} value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Certificaciones (separadas por coma)</Label>
              <Input value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Etiqueta de certificaciones</Label>
              <Input placeholder='p. ej. "Auditora Líder"' value={form.certificationsLabel} onChange={(e) => setForm({ ...form, certificationsLabel: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Nivel del organigrama</Label>
              <Select value={form.orgLevel} onValueChange={(v) => setForm({ ...form, orgLevel: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>No aparece en el organigrama</SelectItem>
                  <SelectItem value="1">Nivel 1 — Dirección general</SelectItem>
                  <SelectItem value="2">Nivel 2</SelectItem>
                  <SelectItem value="3">Nivel 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Depende de</Label>
              <Select value={form.parentId} onValueChange={(v) => setForm({ ...form, parentId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Sin dependencia (raíz)</SelectItem>
                  {possibleParents.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Curvatura del conector</Label>
              <Select value={form.connectorCurve} onValueChange={(v) => setForm({ ...form, connectorCurve: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Recto</SelectItem>
                  <SelectItem value="left">Izquierda</SelectItem>
                  <SelectItem value="right">Derecha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={form.isTransversal} onCheckedChange={(v) => setForm({ ...form, isTransversal: v })} />
              <Label>Perfil transversal</Label>
            </div>

            <div className="space-y-2">
              <Label>Orden</Label>
              <Input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TeamMemberStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
              <Button
                type="submit"
                variant="corporate"
                disabled={uploading}
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {uploading ? "Subiendo imagen…" : "Guardar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Nombre</th>
                <th className="pb-2 font-medium">Cargo</th>
                <th className="pb-2 font-medium">Organigrama</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Cargando…
                  </td>
                </tr>
              )}
              {members?.map((member) => (
                <tr key={member.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      {member.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- miniatura del listado
                        <img src={member.photoUrl} alt={member.photoAlt ?? ""} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100" aria-hidden />
                      )}
                      <span>{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{member.position}</td>
                  <td className="py-3 text-muted-foreground">
                    {member.orgLevel ? `Nivel ${member.orgLevel}` : "—"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        member.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {member.status === "ACTIVE" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Can permission="cms.team.update">
                        <button
                          onClick={() => startEdit(member)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Can>
                      <Can permission="cms.team.delete">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar a ${member.name}?`)) deleteMutation.mutate(member.id);
                          }}
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
      </Card>
    </div>
  );
}
