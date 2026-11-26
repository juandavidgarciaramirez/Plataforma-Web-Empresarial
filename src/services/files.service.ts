import { api } from "@/lib/api/axios";

export interface ApiFile {
  id: string;
  originalName: string;
  fileName: string;
  extension: string | null;
  mimeType: string | null;
  sizeBytes: string | null;
  folder: string | null;
  storagePath: string;
  publicUrl: string | null;
  description: string | null;
  isPublic: boolean;
  entityType: string | null;
  entityId: string | null;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Consume `/api/v1/files/**` (backend NestJS real, Etapa 11 — `foundation.files`). */
export const filesService = {
  getAll: (params?: { entityType?: string; entityId?: string }) =>
    api.get<{ data: ApiFile[] }>("/files", { params }).then((res) => res.data.data),

  upload: (file: File, description?: string) => {
    const formData = new FormData();
    formData.append("archivo", file);
    if (description) formData.append("description", description);
    return api
      .post<{ data: ApiFile }>("/files", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => res.data.data);
  },

  remove: (id: string) => api.delete(`/files/${id}`),

  /**
   * `/files/:id/download` exige el token de sesión (Bearer) — un `<a href>`
   * plano no lo adjunta. Se descarga como blob autenticado y se dispara la
   * descarga en el navegador con un enlace temporal.
   */
  download: async (file: ApiFile) => {
    const response = await api.get(`/files/${file.id}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data as Blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
