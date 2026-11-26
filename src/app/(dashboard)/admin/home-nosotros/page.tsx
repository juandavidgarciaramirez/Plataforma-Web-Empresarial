"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  companyProfileService,
  heroSlidesService,
  companyValuesService,
  whoWeAreConceptsService,
  type ApiCompanyProfile,
  type ApiHeroSlide,
  type ApiCompanyValue,
  type ApiWhoWeAreConcept,
} from "@/services/content/site-content.service";

const TABS = [
  { key: "contenido", label: "Contenido Home/Nosotros" },
  { key: "hero", label: "Hero de Home" },
  { key: "valores", label: "Valores" },
  { key: "conceptos", label: "Quiénes somos" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminHomeNosotrosPage() {
  const [tab, setTab] = useState<TabKey>("contenido");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Home / Nosotros</h1>
        <p className="text-muted-foreground">
          Contenido institucional del sitio público: Home, página Nosotros, valores y "Quiénes somos".
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-primary text-white" : "text-muted-foreground hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "contenido" && <ContentTab />}
      {tab === "hero" && <HeroSlidesTab />}
      {tab === "valores" && <ValuesTab />}
      {tab === "conceptos" && <ConceptsTab />}
    </div>
  );
}

/* ============================================================================
   TAB 1 — Contenido singular de Home/Nosotros
============================================================================ */

function ContentTab() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin-company-profile"],
    queryFn: companyProfileService.get,
  });

  const [form, setForm] = useState<Partial<ApiCompanyProfile>>({});

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ApiCompanyProfile>) => companyProfileService.update(data),
    onSuccess: (data) => {
      toast.success("Contenido actualizado");
      queryClient.setQueryData(["admin-company-profile"], data);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar"),
  });

  const set = (key: keyof ApiCompanyProfile) => (value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  if (isLoading) return <Card><p className="text-muted-foreground">Cargando…</p></Card>;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card title="Home — preview &quot;Conócenos&quot;" description="Sección de Home debajo de Servicios.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow" value={form.homeAboutEyebrow} onChange={set("homeAboutEyebrow")} />
          <Field label="Título" value={form.homeAboutTitle} onChange={set("homeAboutTitle")} />
          <Field label="Imagen (URL)" value={form.homeAboutImageUrl} onChange={set("homeAboutImageUrl")} />
          <div />
          <TextField label="Texto" value={form.homeAboutText} onChange={set("homeAboutText")} className="md:col-span-2" />
          <Field label="Estadística 1 — valor" placeholder='p. ej. "50+"' value={form.homeAboutStat1Value} onChange={set("homeAboutStat1Value")} />
          <Field label="Estadística 1 — etiqueta" value={form.homeAboutStat1Label} onChange={set("homeAboutStat1Label")} />
          <Field label="Estadística 2 — valor" placeholder='p. ej. "98%"' value={form.homeAboutStat2Value} onChange={set("homeAboutStat2Value")} />
          <Field label="Estadística 2 — etiqueta" value={form.homeAboutStat2Label} onChange={set("homeAboutStat2Label")} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Mientras las estadísticas queden vacías, no se muestran en el sitio (no se rellenan con datos ficticios).
        </p>
      </Card>

      <Card title="Nosotros — Hero">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título" value={form.aboutHeroTitle} onChange={set("aboutHeroTitle")} />
          <Field label="Imagen (URL)" value={form.aboutHeroImageUrl} onChange={set("aboutHeroImageUrl")} />
          <TextField label="Subtítulo" value={form.aboutHeroSubtitle} onChange={set("aboutHeroSubtitle")} className="md:col-span-2" />
        </div>
      </Card>

      <Card title="Nosotros — Quiénes somos">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título" value={form.aboutWhoTitle} onChange={set("aboutWhoTitle")} />
          <Field label="Imagen (URL)" value={form.aboutWhoImageUrl} onChange={set("aboutWhoImageUrl")} />
          <TextField label="Texto" value={form.aboutWhoText} onChange={set("aboutWhoText")} className="md:col-span-2" />
        </div>
      </Card>

      <Card title="Nosotros — Misión y Visión">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Misión" value={form.aboutMissionText} onChange={set("aboutMissionText")} className="md:col-span-2" />
          <Field label="Imagen misión (URL)" value={form.aboutMissionImageUrl} onChange={set("aboutMissionImageUrl")} />
          <Field label="Año de la visión" value={form.aboutVisionYear} onChange={set("aboutVisionYear")} />
          <TextField label="Visión" value={form.aboutVisionText} onChange={set("aboutVisionText")} className="md:col-span-2" />
          <Field label="Imagen visión (URL)" value={form.aboutVisionImageUrl} onChange={set("aboutVisionImageUrl")} />
          <div className="flex items-center gap-3 pt-6">
            <Switch
              checked={form.missionVisionIsPlaceholder ?? true}
              onCheckedChange={(v) => set("missionVisionIsPlaceholder")(v)}
            />
            <Label>Texto provisional (pendiente del documento oficial del cliente)</Label>
          </div>
        </div>
      </Card>

      <Card title="Nosotros — Ecosistema Capital">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título" value={form.aboutEcosystemTitle} onChange={set("aboutEcosystemTitle")} />
          <TextField label="Texto" value={form.aboutEcosystemText} onChange={set("aboutEcosystemText")} />
        </div>
      </Card>

      <Card title="Nosotros — sección Equipo (encabezado)">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título" value={form.aboutTeamTitle} onChange={set("aboutTeamTitle")} />
          <TextField label="Subtítulo" value={form.aboutTeamSubtitle} onChange={set("aboutTeamSubtitle")} />
        </div>
      </Card>

      <Card title="Nosotros — CTA final">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título" value={form.aboutCtaTitle} onChange={set("aboutCtaTitle")} />
          <Field label="Imagen (URL)" value={form.aboutCtaImageUrl} onChange={set("aboutCtaImageUrl")} />
          <TextField label="Mensaje" value={form.aboutCtaMessage} onChange={set("aboutCtaMessage")} className="md:col-span-2" />
        </div>
      </Card>

      <Button type="submit" variant="corporate" loading={updateMutation.isPending}>
        Guardar cambios
      </Button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value?: string | null;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      <Input value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value?: string | null;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      <Textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ============================================================================
   TAB 2 — Hero slides de Home
============================================================================ */

interface HeroForm {
  id?: string;
  slug: string;
  serviceCode: string;
  nameWhite: string;
  nameBlue: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePosition: string;
  href: string;
  order: string;
  isActive: boolean;
}

const emptyHeroForm: HeroForm = {
  slug: "",
  serviceCode: "",
  nameWhite: "",
  nameBlue: "",
  title: "",
  description: "",
  imageUrl: "",
  imagePosition: "",
  href: "",
  order: "1",
  isActive: true,
};

function HeroSlidesTab() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<HeroForm | null>(null);
  const { data: slides, isLoading } = useQuery({ queryKey: ["admin-hero-slides"], queryFn: heroSlidesService.getAll });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-hero-slides"] });

  const toPayload = (f: HeroForm) => ({
    slug: f.slug,
    serviceCode: f.serviceCode || undefined,
    nameWhite: f.nameWhite,
    nameBlue: f.nameBlue,
    title: f.title,
    description: f.description || undefined,
    imageUrl: f.imageUrl || undefined,
    imagePosition: f.imagePosition || undefined,
    href: f.href,
    order: Number(f.order) || 1,
    isActive: f.isActive,
  });

  const createMutation = useMutation({
    mutationFn: (f: HeroForm) => heroSlidesService.create(toPayload(f)),
    onSuccess: () => { toast.success("Slide creado"); setForm(null); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...f }: HeroForm) => heroSlidesService.update(id!, toPayload(f as HeroForm)),
    onSuccess: () => { toast.success("Slide actualizado"); setForm(null); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: heroSlidesService.remove,
    onSuccess: () => { toast.success("Slide eliminado"); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar"),
  });

  const startEdit = (s: ApiHeroSlide) =>
    setForm({
      id: s.id,
      slug: s.slug,
      serviceCode: s.serviceCode ?? "",
      nameWhite: s.nameWhite,
      nameBlue: s.nameBlue,
      title: s.title,
      description: s.description ?? "",
      imageUrl: s.imageUrl ?? "",
      imagePosition: s.imagePosition ?? "",
      href: s.href,
      order: String(s.order),
      isActive: s.isActive,
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) updateMutation.mutate(form);
    else createMutation.mutate(form);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="corporate" onClick={() => setForm({ ...emptyHeroForm })}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo slide
        </Button>
      </div>

      {form && (
        <Card title={form.id ? "Editar slide" : "Nuevo slide"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
            <Field label="Código de servicio (opcional)" value={form.serviceCode} onChange={(v) => setForm({ ...form, serviceCode: v })} />
            <Field label="Nombre (blanco)" value={form.nameWhite} onChange={(v) => setForm({ ...form, nameWhite: v })} />
            <Field label="Nombre (azul)" value={form.nameBlue} onChange={(v) => setForm({ ...form, nameBlue: v })} />
            <Field label="Título" value={form.title} onChange={(v) => setForm({ ...form, title: v })} className="md:col-span-2" />
            <TextField label="Descripción" value={form.description} onChange={(v) => setForm({ ...form, description: v })} className="md:col-span-2" />
            <Field label="Imagen (URL)" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
            <Field label="Posición de imagen (object-position)" value={form.imagePosition} onChange={(v) => setForm({ ...form, imagePosition: v })} />
            <Field label="Enlace (href)" value={form.href} onChange={(v) => setForm({ ...form, href: v })} />
            <Field label="Orden" value={form.order} onChange={(v) => setForm({ ...form, order: v })} />
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label>Activo</Label>
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
              <Button type="submit" variant="corporate" loading={createMutation.isPending || updateMutation.isPending}>Guardar</Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Slug</th>
                <th className="pb-2 font-medium">Título</th>
                <th className="pb-2 font-medium">Orden</th>
                <th className="pb-2 font-medium">Activo</th>
                <th className="pb-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Cargando…</td></tr>}
              {slides?.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">{s.slug}</td>
                  <td className="py-3 text-muted-foreground">{s.title}</td>
                  <td className="py-3">{s.order}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {s.isActive ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(s)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm(`¿Eliminar el slide "${s.slug}"?`)) deleteMutation.mutate(s.id); }} className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Eliminar"><Trash2 className="h-4 w-4" /></button>
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

/* ============================================================================
   TAB 3 — Valores corporativos
============================================================================ */

interface ValueForm {
  id?: string;
  key: string;
  title: string;
  description: string;
  iconKey: string;
  imageUrl: string;
  order: string;
  isActive: boolean;
}

const emptyValueForm: ValueForm = { key: "", title: "", description: "", iconKey: "", imageUrl: "", order: "1", isActive: true };

function ValuesTab() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ValueForm | null>(null);
  const { data: values, isLoading } = useQuery({ queryKey: ["admin-company-values"], queryFn: companyValuesService.getAll });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-company-values"] });

  const toPayload = (f: ValueForm) => ({
    key: f.key,
    title: f.title,
    description: f.description || undefined,
    iconKey: f.iconKey || undefined,
    imageUrl: f.imageUrl || undefined,
    order: Number(f.order) || 1,
    isActive: f.isActive,
  });

  const createMutation = useMutation({
    mutationFn: (f: ValueForm) => companyValuesService.create(toPayload(f)),
    onSuccess: () => { toast.success("Valor creado"); setForm(null); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear"),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...f }: ValueForm) => companyValuesService.update(id!, toPayload(f as ValueForm)),
    onSuccess: () => { toast.success("Valor actualizado"); setForm(null); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar"),
  });
  const deleteMutation = useMutation({
    mutationFn: companyValuesService.remove,
    onSuccess: () => { toast.success("Valor eliminado"); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar"),
  });

  const startEdit = (v: ApiCompanyValue) =>
    setForm({ id: v.id, key: v.key, title: v.title, description: v.description ?? "", iconKey: v.iconKey ?? "", imageUrl: v.imageUrl ?? "", order: String(v.order), isActive: v.isActive });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) updateMutation.mutate(form);
    else createMutation.mutate(form);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="corporate" onClick={() => setForm({ ...emptyValueForm })}><Plus className="mr-2 h-4 w-4" /> Nuevo valor</Button>
      </div>

      {form && (
        <Card title={form.id ? "Editar valor" : "Nuevo valor"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="Key (slug)" value={form.key} onChange={(v) => setForm({ ...form, key: v })} />
            <Field label="Título" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <TextField label="Descripción" value={form.description} onChange={(v) => setForm({ ...form, description: v })} className="md:col-span-2" />
            <Field label="Icono (nombre lucide-react)" placeholder="p. ej. ShieldCheck" value={form.iconKey} onChange={(v) => setForm({ ...form, iconKey: v })} />
            <Field label="Imagen (URL)" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
            <Field label="Orden" value={form.order} onChange={(v) => setForm({ ...form, order: v })} />
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label>Activo</Label>
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
              <Button type="submit" variant="corporate" loading={createMutation.isPending || updateMutation.isPending}>Guardar</Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Key</th>
                <th className="pb-2 font-medium">Título</th>
                <th className="pb-2 font-medium">Activo</th>
                <th className="pb-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Cargando…</td></tr>}
              {values?.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">{v.key}</td>
                  <td className="py-3 text-muted-foreground">{v.title}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{v.isActive ? "Sí" : "No"}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(v)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm(`¿Eliminar el valor "${v.title}"?`)) deleteMutation.mutate(v.id); }} className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Eliminar"><Trash2 className="h-4 w-4" /></button>
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

/* ============================================================================
   TAB 4 — Conceptos de "Quiénes somos"
============================================================================ */

interface ConceptForm {
  id?: string;
  key: string;
  label: string;
  description: string;
  order: string;
  isActive: boolean;
}

const emptyConceptForm: ConceptForm = { key: "", label: "", description: "", order: "1", isActive: true };

function ConceptsTab() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ConceptForm | null>(null);
  const { data: concepts, isLoading } = useQuery({ queryKey: ["admin-who-we-are-concepts"], queryFn: whoWeAreConceptsService.getAll });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-who-we-are-concepts"] });

  const toPayload = (f: ConceptForm) => ({
    key: f.key,
    label: f.label,
    description: f.description || undefined,
    order: Number(f.order) || 1,
    isActive: f.isActive,
  });

  const createMutation = useMutation({
    mutationFn: (f: ConceptForm) => whoWeAreConceptsService.create(toPayload(f)),
    onSuccess: () => { toast.success("Concepto creado"); setForm(null); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear"),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...f }: ConceptForm) => whoWeAreConceptsService.update(id!, toPayload(f as ConceptForm)),
    onSuccess: () => { toast.success("Concepto actualizado"); setForm(null); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar"),
  });
  const deleteMutation = useMutation({
    mutationFn: whoWeAreConceptsService.remove,
    onSuccess: () => { toast.success("Concepto eliminado"); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar"),
  });

  const startEdit = (c: ApiWhoWeAreConcept) =>
    setForm({ id: c.id, key: c.key, label: c.label, description: c.description ?? "", order: String(c.order), isActive: c.isActive });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) updateMutation.mutate(form);
    else createMutation.mutate(form);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="corporate" onClick={() => setForm({ ...emptyConceptForm })}><Plus className="mr-2 h-4 w-4" /> Nuevo concepto</Button>
      </div>

      {form && (
        <Card title={form.id ? "Editar concepto" : "Nuevo concepto"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="Key (slug)" value={form.key} onChange={(v) => setForm({ ...form, key: v })} />
            <Field label="Etiqueta" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
            <TextField label="Descripción" value={form.description} onChange={(v) => setForm({ ...form, description: v })} className="md:col-span-2" />
            <Field label="Orden" value={form.order} onChange={(v) => setForm({ ...form, order: v })} />
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label>Activo</Label>
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
              <Button type="submit" variant="corporate" loading={createMutation.isPending || updateMutation.isPending}>Guardar</Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Key</th>
                <th className="pb-2 font-medium">Etiqueta</th>
                <th className="pb-2 font-medium">Activo</th>
                <th className="pb-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Cargando…</td></tr>}
              {concepts?.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">{c.key}</td>
                  <td className="py-3 text-muted-foreground">{c.label}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{c.isActive ? "Sí" : "No"}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(c)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm(`¿Eliminar el concepto "${c.label}"?`)) deleteMutation.mutate(c.id); }} className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Eliminar"><Trash2 className="h-4 w-4" /></button>
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
