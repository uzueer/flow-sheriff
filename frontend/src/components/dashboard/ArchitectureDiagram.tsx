import { Globe, Server, Database, Layers, HardDrive } from "lucide-react";

interface ArchitectureDiagramProps {
  activeServer: "API-1" | "API-2" | "API-3" | null;
}

function Node({
  icon: Icon,
  label,
  active = false,
  accent = false,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  active?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex min-w-[110px] flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 transition-all duration-300 ${
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-[var(--shadow-glow)] scale-105"
          : accent
            ? "border-border bg-accent/40"
            : "border-border bg-card"
      }`}
    >
      <Icon size={18} strokeWidth={2} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function Connector({ vertical = true }: { vertical?: boolean }) {
  return vertical ? (
    <div className="h-6 w-px bg-border" />
  ) : (
    <div className="h-px w-full bg-border" />
  );
}

export function ArchitectureDiagram({ activeServer }: ArchitectureDiagramProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <Node icon={Globe} label="Browser" />
      <Connector />
      <Node icon={Layers} label="Load Balancer" accent />
      <Connector />
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <Node icon={Server} label="API-1" active={activeServer === "API-1"} />
        <Node icon={Server} label="API-2" active={activeServer === "API-2"} />
        <Node icon={Server} label="API-3" active={activeServer === "API-3"} />
      </div>
      <div className="relative my-1 h-6 w-full max-w-[280px]">
        <div className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-border" />
        <div className="absolute left-[16%] top-0 h-3 w-px bg-border" />
        <div className="absolute right-[16%] top-0 h-3 w-px bg-border" />
        <div className="absolute left-[16%] right-[16%] top-3 h-px bg-border" />
      </div>
      <Node icon={HardDrive} label="Redis" accent />
      <Connector />
      <Node icon={Database} label="PostgreSQL" accent />
    </div>
  );
}
