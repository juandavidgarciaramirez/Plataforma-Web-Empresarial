"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Can } from "@/components/atoms/Can";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  vacanciesService,
  VACANCY_MODALITIES,
  type ApiVacancy,
  type VacancyModality,
  type VacancyStatus,
} from "@/services/careers/vacancies.service";
import {
  applicationsService,
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/services/careers/applications.service";
import { ImageGalleryUpload, ImageUpload, useUploadTracker } from "@/components/molecules/ImageUpload";
import {
  galleryPayload,
  primaryImageField,
  primaryImagePayload,
  toImageField,
  type ImageFieldValue,
} from "@/services/media.service";
import { mediaService, type CareersPageSlot } from "@/services/media.service";
import { cn } from "@/lib/utils/cn";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const MODALITY_LABELS: Record<VacancyModality, string> = {
  ONSITE: "Presencial",
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
};

const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  RECEIVED: "Recibida",
  REVIEWED: "En revisión",
  REJECTED: "Rechazada",
  HIRED: "Contratada",
};

interface FormState {
  id?: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  modality: VacancyModality;
  description: string;
  status: VacancyStatus;
  image: ImageFieldValue | null;
  originalImage: ImageFieldValue | null;
  gallery: ImageFieldValue[];
}

const emptyForm: FormState = {
  slug: "",
  title: "",
  department: "",
  location: "",
  modality: "ONSITE",
  description: "",
  status: "OPEN",
  image: null,
  originalImage: null,
  gallery: [],
};

export default function AdminCareersPage() {
  const [tab, setTab] = useState<"vacancies" | "applications" | "section">("vacancies");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Talento</h1>
        <p className="text-muted-foreground">Vacantes publicadas y postulaciones recibidas</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {[
          { key: "vacancies" as const, label: "Vacantes" },
          { key: "applications" as const, label: "Postulaciones" },
          { key: "section" as const, label: "Imágenes de la sección" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition",
              tab === t.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "vacancies" && <VacanciesTab />}
      {tab === "applications" && <ApplicationsTab />}
      {tab === "section" && <CareersSectionImagesTab />}
    </div>
  );
}

function VacanciesTab() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);
  const { uploading, onBusyChange } = useUploadTracker();

  const { data: vacancies, isLoading } = useQuery({ queryKey: ["admin-vacancies"], queryFn: vacanciesService.getAll });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });

  const toPayload = (data: FormState) => {
    const image = primaryImagePayload(data.originalImage, data.image);
    return {
      slug: data.slug,
      title: data.title,
      department: data.department || undefined,
      location: data.location || undefined,
      modality: data.modality,
      description: data.description,
      status: data.status,
      ...(image.fileId !== undefined && { imageFileId: image.fileId }),
      ...(image.alt !== undefined && { imageAlt: image.alt }),
      galleryImages: galleryPayload(data.gallery),
    };
  };

  const createMutation = useMutation({
    mutationFn: (data: FormState) => vacanciesService.create(toPayload(data)),
    onSuccess: () => {
      toast.success("Vacante creada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear la vacante"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: FormState) => vacanciesService.update(id!, toPayload(data)),
    onSuccess: () => {
      toast.success("Vacante actualizada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar la vacante"),
  });

  const deleteMutation = useMutation({
    mutationFn: vacanciesService.remove,
    onSuccess: () => {
      toast.success("Vacante eliminada");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar la vacante"),
  });

  const startEdit = (vacancy: ApiVacancy) => {
    const image = primaryImageField(vacancy.imageUrl, vacancy.imageAlt, vacancy.imageFileId);
    setForm({
      id: vacancy.id,
      slug: vacancy.slug,
      title: vacancy.title,
      department: vacancy.department ?? "",
      location: vacancy.location ?? "",
      modality: vacancy.modality,
      description: vacancy.description,
      status: vacancy.status,
      image,
      originalImage: image,
      gallery: (vacancy.gallery ?? []).map(toImageField),
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Can permission="jobs.vacancies.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Nueva vacante
          </Button>
        </Can>
      </div>

      {form && (
        <Card title={form.id ? "Editar vacante" : "Crear vacante"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                required
                disabled={!!form.id}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Área</Label>
              <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Modalidad</Label>
              <Select value={form.modality} onValueChange={(v) => setForm({ ...form, modality: v as VacancyModality })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VACANCY_MODALITIES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {MODALITY_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as VacancyStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Abierta</SelectItem>
                  <SelectItem value="CLOSED">Cerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descripción</Label>
              <Textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                context="vacancies"
                slot="cover"
                label="Imagen de portada de la oferta"
                value={form.image}
                onChange={(image) => setForm((current) => (current ? { ...current, image } : current))}
                onBusyChange={onBusyChange}
                hint="Se muestra en la tarjeta y en el detalle de la vacante. No confundir con las hojas de vida que adjuntan los candidatos."
              />
            </div>
            <div className="md:col-span-2">
              <ImageGalleryUpload
                context="vacancies"
                label="Imágenes ilustrativas"
                value={form.gallery}
                onChange={(gallery) => setForm((current) => (current ? { ...current, gallery } : current))}
                onBusyChange={onBusyChange}
                hint="Se muestran en el detalle de la vacante."
              />
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
                <th className="pb-2 font-medium">Vacante</th>
                <th className="pb-2 font-medium">Área</th>
                <th className="pb-2 font-medium">Modalidad</th>
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
              {vacancies?.map((vacancy) => (
                <tr key={vacancy.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      {vacancy.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- miniatura del listado
                        <img src={vacancy.imageUrl} alt={vacancy.imageAlt ?? ""} className="h-10 w-14 shrink-0 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-14 shrink-0 rounded bg-slate-100" aria-hidden />
                      )}
                      <span>{vacancy.title}</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{vacancy.department || "—"}</td>
                  <td className="py-3 text-muted-foreground">{MODALITY_LABELS[vacancy.modality]}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        vacancy.status === "OPEN" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {vacancy.status === "OPEN" ? "Abierta" : "Cerrada"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Can permission="jobs.vacancies.update">
                        <button
                          onClick={() => startEdit(vacancy)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Can>
                      <Can permission="jobs.vacancies.delete">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la vacante "${vacancy.title}"?`)) deleteMutation.mutate(vacancy.id);
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

const CAREERS_SECTION_SLOTS: { slot: CareersPageSlot; label: string; hint: string }[] = [
  { slot: "hero", label: "Imagen de cabecera", hint: "Encabezado de /trabaja-con-nosotros." },
  { slot: "talent", label: "Imagen principal de la cultura", hint: "Bloque «Talento que impulsa el cambio»." },
  { slot: "growth", label: "Imagen complementaria", hint: "Imagen pequeña junto a la anterior." },
];

type SectionForm = Record<CareersPageSlot, ImageFieldValue | null>;

/** Imágenes de la página pública "Trabaja con nosotros". Sin imagen, el sitio conserva sus imágenes actuales. */
function CareersSectionImagesTab() {
  const queryClient = useQueryClient();
  const { uploading, onBusyChange } = useUploadTracker();
  const [form, setForm] = useState<SectionForm | null>(null);
  const [original, setOriginal] = useState<SectionForm | null>(null);

  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-careers-page-images"], queryFn: mediaService.getCareersPage });

  useEffect(() => {
    if (!data) return;
    const loaded: SectionForm = {
      hero: data.hero ? toImageField(data.hero) : null,
      talent: data.talent ? toImageField(data.talent) : null,
      growth: data.growth ? toImageField(data.growth) : null,
    };
    setForm(loaded);
    setOriginal(loaded);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (values: SectionForm) =>
      mediaService.updateCareersPage(
        Object.fromEntries(
          CAREERS_SECTION_SLOTS.map(({ slot }) => {
            const image = values[slot];
            return [slot, image?.fileId ? { fileId: image.fileId, alt: image.alt.trim() || undefined } : null];
          }),
        ),
      ),
    onSuccess: () => {
      toast.success("Imágenes de la sección actualizadas");
      queryClient.invalidateQueries({ queryKey: ["admin-careers-page-images"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudieron guardar las imágenes"),
  });

  if (isLoading || !form) {
    return <Card>{isError ? <p className="text-sm text-red-600">No se pudieron cargar las imágenes de la sección.</p> : <p className="text-sm text-muted-foreground">Cargando…</p>}</Card>;
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(original);

  return (
    <Card title="Imágenes de la sección pública" description="Reemplazan las imágenes por defecto de la página Trabaja con nosotros.">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate(form);
        }}
      >
        <div className="grid gap-6 md:grid-cols-3">
          {CAREERS_SECTION_SLOTS.map(({ slot, label, hint }) => (
            <ImageUpload
              key={slot}
              context="careers_page"
              slot={slot}
              label={label}
              hint={hint}
              value={form[slot]}
              onChange={(image) => setForm((current) => (current ? { ...current, [slot]: image } : current))}
              onBusyChange={onBusyChange}
            />
          ))}
        </div>
        <Can permission="jobs.vacancies.update">
          <Button type="submit" variant="corporate" disabled={uploading || !dirty} loading={saveMutation.isPending}>
            {uploading ? "Subiendo imagen…" : "Guardar imágenes"}
          </Button>
        </Can>
      </form>
    </Card>
  );
}

function ApplicationsTab() {
  const queryClient = useQueryClient();
  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: applicationsService.getAll,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) => applicationsService.update(id, status),
    onSuccess: () => {
      toast.success("Postulación actualizada");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar la postulación"),
  });

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-2 font-medium">Candidato</th>
              <th className="pb-2 font-medium">Correo</th>
              <th className="pb-2 font-medium">Vacante</th>
              <th className="pb-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted-foreground">
                  Cargando…
                </td>
              </tr>
            )}
            {!isLoading && applications?.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted-foreground">
                  Sin postulaciones todavía.
                </td>
              </tr>
            )}
            {applications?.map((application) => (
              <tr key={application.id} className="border-b last:border-0">
                <td className="py-3 font-medium text-slate-900">{application.fullName}</td>
                <td className="py-3 text-muted-foreground">{application.email}</td>
                <td className="py-3 text-muted-foreground">{application.vacancyTitle}</td>
                <td className="py-3">
                  <Can
                    permission="jobs.vacancies.update"
                    fallback={
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {APPLICATION_STATUS_LABELS[application.status]}
                      </span>
                    }
                  >
                    <Select
                      value={application.status}
                      onValueChange={(v) =>
                        statusMutation.mutate({ id: application.id, status: v as ApplicationStatus })
                      }
                    >
                      <SelectTrigger className="h-8 w-40 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APPLICATION_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {APPLICATION_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Can>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
