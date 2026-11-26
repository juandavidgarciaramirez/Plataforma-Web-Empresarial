"use client";

import {
  AlertCircle,
  DollarSign,
  ListChecks,
  Rocket,
  Target,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const icons: Record<string, LucideIcon> = {
  users: Users,
  rocket: Rocket,
  "alert-circle": AlertCircle,
  "dollar-sign": DollarSign,
  target: Target,
  wallet: Wallet,
  "list-checks": ListChecks,
  "user-plus": UserPlus,
};

export function StatCard({
  title,
  value,
  icon,
  trend,
}: StatCardProps) {
  const Icon = icon ? icons[icon] : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          {trend && (
            <p
              className={`mt-2 text-xs font-medium ${
                trend.isPositive
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value}% desde el último período
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}