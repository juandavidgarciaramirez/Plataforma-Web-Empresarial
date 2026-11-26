"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Can } from "@/components/atoms/Can";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Trash2, Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { filesService, type ApiFile } from "@/services/files.service";

function formatBytes(value: string | null): string {
  if (!value) return "—";
  const bytes = Number(value);
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminFilesPage() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const { data: files, isLoading } = useQuery({ queryKey: ["admin-files"], queryFn: () => filesService.getAll() });

  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!pendingFile) throw new Error("Selecciona un archivo primero");
      return filesService.upload(pendingFile, description || undefined);
    },
    onSuccess: () => {
      toast.success("Archivo subido correctamente");
      setPendingFile(null);
      setDescription("");
      if (inputRef.current) inputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo subir el archivo"),
  });

  const deleteMutation = useMutation({
    mutationFn: filesService.remove,
    onSuccess: () => {
      toast.success("Archivo eliminado");
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar el archivo"),
  });

  const handleDownload = async (file: ApiFile) => {
    try {
      await filesService.download(file);
    } catch {
      toast.error("No se pudo descargar el archivo");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Archivos</h1>
        <p className="text-muted-foreground">
          Registro real de archivos (foundation.files) — PDF, Word, Excel, CSV e imágenes, hasta 25 MB.
        </p>
      </div>

      <Can permission="foundation.files.create">
        <Card title="Subir archivo">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              uploadMutation.mutate();
            }}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <Label>Archivo</Label>
              <Input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.webp"
                onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" variant="corporate" loading={uploadMutation.isPending} disabled={!pendingFile}>
                <Upload className="mr-2 h-4 w-4" /> Subir
              </Button>
            </div>
          </form>
        </Card>
      </Can>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Archivo</th>
                <th className="pb-2 font-medium">Tamaño</th>
                <th className="pb-2 font-medium">Descripción</th>
                <th className="pb-2 font-medium">Subido</th>
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
              {!isLoading && files?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Sin archivos subidos todavía.
                  </td>
                </tr>
              )}
              {files?.map((file) => (
                <tr key={file.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{file.originalName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{formatBytes(file.sizeBytes)}</td>
                  <td className="py-3 text-muted-foreground">{file.description ?? "—"}</td>
                  <td className="py-3 text-muted-foreground">{formatDate(file.createdAt)}</td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Can permission="foundation.files.read">
                        <button
                          onClick={() => handleDownload(file)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          aria-label="Descargar"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </Can>
                      <Can permission="foundation.files.delete">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar "${file.originalName}"?`)) deleteMutation.mutate(file.id);
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
