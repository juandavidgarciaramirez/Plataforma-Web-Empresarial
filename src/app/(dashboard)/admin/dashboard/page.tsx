'use client'

import { Card } from '@/components/molecules/Card'
import { StatCard } from '@/components/molecules/StatCard'
import { ChartCard } from '@/components/molecules/ChartCard'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const STAGE_LABELS: Record<string, string> = {
  NEW: 'Nuevo',
  QUALIFYING: 'Calificando',
  PROPOSAL: 'Propuesta',
  NEGOTIATION: 'Negociación',
  WON: 'Ganada',
  LOST: 'Perdida',
}

const SOURCE_LABELS: Record<string, string> = {
  YURI: 'Yuri',
  WEBSITE_FORM: 'Formulario web',
  REFERRAL: 'Referido',
  MANUAL: 'Manual',
  CHAT: 'Chat',
}

const PIE_COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444']

const currency = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  })

  const { data: charts } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: dashboardService.getCharts,
  })

  const pipelineData = (charts?.pipelineByStage ?? []).map((p) => ({
    stage: STAGE_LABELS[p.stage] ?? p.stage,
    Valor: p.totalValue,
  }))

  const sourceData = (charts?.leadsBySource ?? []).map((s) => ({
    name: SOURCE_LABELS[s.source] ?? s.source,
    value: s.count,
  }))

  const serviceData = (charts?.leadsByService ?? []).map((s) => ({
    service: s.service,
    Leads: s.count,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido de nuevo, equipo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Leads nuevos" value={isLoading ? '—' : (stats?.leadsNew ?? 0)} icon="rocket" />
        <StatCard title="Oportunidades abiertas" value={isLoading ? '—' : (stats?.opportunitiesOpen ?? 0)} icon="target" />
        <StatCard
          title="Valor del pipeline"
          value={isLoading ? '—' : currency(stats?.pipelineValue ?? 0)}
          icon="wallet"
        />
        <StatCard title="Tareas pendientes" value={isLoading ? '—' : (stats?.tasksPending ?? 0)} icon="list-checks" />
        <StatCard title="PQR abiertas" value={isLoading ? '—' : (stats?.pendingPqrs ?? 0)} icon="alert-circle" />
        <StatCard
          title="Postulaciones recientes"
          value={isLoading ? '—' : (stats?.recentApplications ?? 0)}
          icon="user-plus"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Pipeline por etapa" description="Valor total de las oportunidades en cada etapa">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => currency(value)} />
              <Bar dataKey="Valor" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Leads por fuente" description="De dónde vienen los leads, incluido Yuri">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {sourceData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Leads por servicio" description="Interés por línea de servicio">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={serviceData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis dataKey="service" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Leads" fill="#7c3aed" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card title="Últimas actividades">
          <div className="space-y-3">
            {stats?.recentActivities?.length ? (
              stats.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 border-b border-border/40 pb-2 last:border-0"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p className="text-sm">{activity.description}</p>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sin actividad registrada todavía.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
