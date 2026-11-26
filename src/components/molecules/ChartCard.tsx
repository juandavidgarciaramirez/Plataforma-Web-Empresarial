"use client";

import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  description?: string;
}

export function ChartCard({
  title,
  children,
  description,
}: ChartCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="min-h-[250px]">
        {children}
      </div>
    </div>
  );
}