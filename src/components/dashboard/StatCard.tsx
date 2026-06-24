import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "success" | "danger" | "info" | "warning";
  hint?: string;
}

const toneMap = {
  default: "text-foreground",
  success: "text-[var(--color-success)]",
  danger: "text-[var(--color-destructive)]",
  info: "text-[var(--color-chart-2)]",
  warning: "text-[var(--color-warning)]",
} as const;

export function StatCard({ label, value, icon: Icon, tone = "default", hint }: StatCardProps) {
  return (
    <div
      className="rounded-2xl border border-border p-5 shadow-[var(--shadow-card)]"
      style={{ background: "var(--gradient-card)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className={`rounded-lg bg-accent/60 p-2 ${toneMap[tone]}`}>
          <Icon size={16} strokeWidth={2.25} />
        </div>
      </div>
      <div className={`mt-4 font-mono text-3xl font-semibold tabular-nums ${toneMap[tone]}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
