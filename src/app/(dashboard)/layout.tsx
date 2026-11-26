'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/organisms/DashboardSidebar'
import { DashboardHeader } from '@/components/organisms/DashboardHeader'
import { Breadcrumbs } from '@/components/molecules/Breadcrumbs'
import { cn } from '@/lib/utils/cn'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { markInternalTraffic } from '@/lib/analytics/tracker'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  // Quien usa el panel en este navegador deja de contarse en la analítica del sitio (tráfico interno).
  useEffect(() => {
    markInternalTraffic()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <Breadcrumbs />
        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 transition-all duration-300 md:p-6',
            sidebarOpen && !isMobile ? 'lg:ml-0' : ''
          )}
        >
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}