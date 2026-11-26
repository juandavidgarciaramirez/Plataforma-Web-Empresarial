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
import { newsService, type ApiNews } from "@/services/content/news.service";
import type { ContentStatus } from "@/services/content/services.service";
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
  title: string;
  summary: string;
  content: string;
  category: string;
  status: ContentStatus;
  cover: ImageFieldValue | null;
  /** Imagen principal al abrir el formulario: solo se envía al backend si cambió. */
  originalCover: ImageFieldValue | null;
  gallery: ImageFieldValue[];
}

const emptyForm: FormState = {
  slug: "",
  title: "",
  summary: "",
  content: "",
  category: "",
  status: "DRAFT",
  cover: null,
  originalCover: null,
  gallery: [],
};

export default function AdminNewsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);
  const { uploading, onBusyChange } = useUploadTracker();

  const { data: news, isLoading } = useQuery({ queryKey: ["admin-news"], queryFn: newsService.getAll });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-news"] });

  const toPayload = (data: FormState) => {
    const cover = primaryImagePayload(data.originalCover, data.cover);
    return {
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      content: data.content,
      category: data.category || undefined,
      status: data.status,
      ...(cover.fileId !== undefined && { coverImageFileId: cover.fileId }),
      ...(cover.alt !== undefined && { imageAlt: cover.alt }),
      galleryImages: galleryPayload(data.gallery),
    };
  };

  const createMutation = useMutation({
    mutationFn: (data: FormState) => newsService.create(toPayload(data)),
    onSuccess: () => {
      toast.success("Noticia creada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear la noticia"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: FormState) => newsService.update(id!, toPayload(data)),
    onSuccess: () => {
      toast.success("Noticia actualizada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar la noticia"),
  });

  const deleteMutation = useMutation({
    mutationFn: newsService.remove,
    onSuccess: () => {
      toast.success("Noticia eliminada");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar la noticia"),
  });

  const startEdit = (item: ApiNews) => {
    const cover = primaryImageField(item.coverImageUrl, item.imageAlt, item.coverImageFileId);
    setForm({
      id: item.id,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: item.category ?? "",
      status: item.status,
      cover,
      originalCover: cover,
      gallery: (item.gallery ?? []).map(toImageField),
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
          <h1 className="font-display text-3xl font-bold">Noticias</h1>
          <p className="text-muted-foreground">Noticias corporativas publicadas en el sitio</p>
        </div>
        <Can permission="cms.news.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Nueva noticia
          </Button>
        </Can>
      </div>

      {form && (
        <Card title={form.id ? "Editar noticia" : "Crear noticia"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
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
              <Label>Categoría</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Resumen</Label>
              <Input required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Contenido</Label>
              <Textarea required rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                context="news"
                slot="cover"
                label="Imagen principal (portada)"
                value={form.cover}
                onChange={(cover) => setForm((current) => (current ? { ...current, cover } : current))}
                onBusyChange={onBusyChange}
                hint="Se muestra en la tarjeta del listado, en el encabezado de la noticia y al compartir en redes."
              />
            </div>
            <div className="md:col-span-2">
              <ImageGalleryUpload
                context="news"
                label="Imágenes adicionales"
                value={form.gallery}
                onChange={(gallery) => setForm((current) => (current ? { ...current, gallery } : current))}
                onBusyChange={onBusyChange}
                hint="Se muestran como galería al final del artículo."
              />
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
                <th className="pb-2 font-medium">Título</th>
                <th className="pb-2 font-medium">Categoría</th>
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
              {news?.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      {item.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- miniatura del listado
                        <img src={item.coverImageUrl} alt={item.imageAlt ?? ""} className="h-10 w-16 shrink-0 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-16 shrink-0 rounded bg-slate-100" aria-hidden />
                      )}
                      <span>{item.title}</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{item.category || "—"}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.status === "PUBLISHED" ? "Publicada" : "Borrador"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Can permission="cms.news.update">
                        <button
                          onClick={() => startEdit(item)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Can>
                      <Can permission="cms.news.delete">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la noticia "${item.title}"?`)) deleteMutation.mutate(item.id);
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
