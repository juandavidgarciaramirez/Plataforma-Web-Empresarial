"use client";

import { useState } from "react";
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
  contentServicesService,
  type ApiContentService,
  type ContentStatus,
} from "@/services/content/services.service";
import { ImageGalleryUpload, ImageUpload, useUploadTracker } from "@/components/molecules/ImageUpload";
import {
  galleryPayload,
  primaryImageField,
  primaryImagePayload,
  toImageField,
  type ImageFieldValue,
} from "@/services/media.service";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface FormState {
  id?: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  order: string;
  status: ContentStatus;
  image: ImageFieldValue | null;
  originalImage: ImageFieldValue | null;
  gallery: ImageFieldValue[];
}

const emptyForm: FormState = {
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  order: "0",
  status: "DRAFT",
  image: null,
  originalImage: null,
  gallery: [],
};

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);
  const { uploading, onBusyChange } = useUploadTracker();

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: contentServicesService.getAll,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-services"] });

  const toPayload = (data: FormState) => {
    const image = primaryImagePayload(data.originalImage, data.image);
    return {
      slug: data.slug,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      order: Number(data.order) || 0,
      status: data.status,
      ...(image.fileId !== undefined && { imageFileId: image.fileId }),
      ...(image.alt !== undefined && { imageAlt: image.alt }),
      galleryImages: galleryPayload(data.gallery),
    };
  };

  const createMutation = useMutation({
    mutationFn: (data: FormState) => contentServicesService.create(toPayload(data)),
    onSuccess: () => {
      toast.success("Servicio creado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear el servicio"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: FormState) => contentServicesService.update(id!, toPayload(data)),
    onSuccess: () => {
      toast.success("Servicio actualizado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar el servicio"),
  });

  const deleteMutation = useMutation({
    mutationFn: contentServicesService.remove,
    onSuccess: () => {
      toast.success("Servicio eliminado");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar el servicio"),
  });

  const startEdit = (service: ApiContentService) => {
    const image = primaryImageField(service.imageUrl, service.imageAlt, service.imageFileId);
    setForm({
      id: service.id,
      slug: service.slug,
      name: service.name,
      shortDescription: service.shortDescription,
      description: service.description,
      order: String(service.order),
      status: service.status,
      image,
      originalImage: image,
      gallery: (service.gallery ?? []).map(toImageField),
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Servicios</h1>
          <p className="text-muted-foreground">Líneas de servicio publicadas en el sitio</p>
        </div>
        <Can permission="cms.services.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo servicio
          </Button>
        </Can>
      </div>

      {form && (
        <Card title={form.id ? "Editar servicio" : "Crear servicio"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
            <div className="space-y-2 md:col-span-2">
              <Label>Descripción corta</Label>
              <Input
                required
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descripción completa</Label>
              <Textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                context="services"
                slot="cover"
                label="Imagen principal"
                value={form.image}
                onChange={(image) => setForm((current) => (current ? { ...current, image } : current))}
                onBusyChange={onBusyChange}
                hint="Reemplaza la imagen de cabecera de la página del servicio y se muestra en su tarjeta del inicio. Sin imagen, se usa la imagen actual del sitio."
              />
            </div>
            <div className="md:col-span-2">
              <ImageGalleryUpload
                context="services"
                label="Imágenes ilustrativas adicionales"
                value={form.gallery}
                onChange={(gallery) => setForm((current) => (current ? { ...current, gallery } : current))}
                onBusyChange={onBusyChange}
                hint="Se muestran como galería en la página pública del servicio."
              />
            </div>
            <div className="space-y-2">
              <Label>Orden</Label>
              <Input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ContentStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado</SelectItem>
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
                <th className="pb-2 font-medium">Slug</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium text-right">Acciones</th>
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
              {services?.map((service) => (
                <tr key={service.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      {service.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- miniatura del listado
                        <img src={service.imageUrl} alt={service.imageAlt ?? ""} className="h-10 w-14 shrink-0 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-14 shrink-0 rounded bg-slate-100" aria-hidden />
                      )}
                      <span>{service.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{service.slug}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        service.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {service.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Can permission="cms.services.update">
                        <button
                          onClick={() => startEdit(service)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Can>
                      <Can permission="cms.services.delete">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar el servicio ${service.name}?`)) deleteMutation.mutate(service.id);
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
