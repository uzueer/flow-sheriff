import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Coins,
  Github,
  Gauge,
  Play,
  RotateCcw,
  Send,
  ShieldBan,
  Zap,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ArchitectureDiagram } from "@/components/dashboard/ArchitectureDiagram";
import { RequestLog } from "@/components/dashboard/RequestLog";
import { RpsChart } from "@/components/dashboard/RpsChart";
import { getDashboardStats, getRecentLogs, sendRateLimitRequest, type RequestLogEntry } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Distributed Rate Limiter" },
      {
        name: "description",
        content:
          "Dashboard for a distributed rate limiter — monitor requests, servers and throughput in real time.",
      },
      { property: "og:title", content: "Distributed Rate Limiter" },
      {
        property: "og:description",
        content:
          "Dashboard for a distributed rate limiter — monitor requests, servers and throughput in real time.",
      },
    ],
  }),
  component: Dashboard,
});

const TOKEN_CAPACITY = 10;

function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border p-5 shadow-[var(--shadow-card)] ${className}`}
      style={{ background: "var(--gradient-card)" }}
    >
      <header className="mb-4">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function ActionButton({
  onClick,
  icon: Icon,
  children,
  variant = "default",
  disabled,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  children: React.ReactNode;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
}) {
  const styles = {
    default:
      "border-border bg-accent/40 text-foreground hover:bg-accent/70",
    primary:
      "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90",
    danger:
      "border-border bg-accent/40 text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/15",
  } as const;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      <Icon size={15} strokeWidth={2.25} />
      {children}
    </button>
  );
}

function Dashboard() {
  const [log, setLog] = useState<RequestLogEntry[]>([]);
  const [allowed, setAllowed] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [tokens, setTokens] = useState(TOKEN_CAPACITY);
  const [avgResponse, setAvgResponse] = useState(0);
  const [activeServer, setActiveServer] = useState<RequestLogEntry["server"] | null>(null);
  const [lastResult, setLastResult] = useState<RequestLogEntry | null>(null);
  const [rps, setRps] = useState<{ t: string; rps: number }[]>([]);
  const activeTimer = useRef<number | null>(null);

  const refreshDashboard = async () => {
    try {
      const stats = await getDashboardStats();
      setAllowed(stats.allowedRequests);
      setBlocked(stats.blockedRequests);
      setAvgResponse(Math.round(stats.averageLatency || 0));
      const recentLogs = await getRecentLogs();
      setLog(recentLogs);
      const latestRps = recentLogs.slice(0, 12).map((entry, index) => ({
        t: entry.time,
        rps: entry.status === 200 ? 1 + index : 0,
      }));
      setRps(latestRps.length > 0 ? latestRps : [{ t: "--", rps: 0 }]);
    } catch (error) {
      console.error("Failed to refresh dashboard", error);
    }
  };

  useEffect(() => {
    void refreshDashboard();
    const intervalId = window.setInterval(() => {
      void refreshDashboard();
    }, 4000);
    return () => clearInterval(intervalId);
  }, []);

  const flashActive = (server: RequestLogEntry["server"]) => {
    setActiveServer(server);
    if (activeTimer.current) window.clearTimeout(activeTimer.current);
    activeTimer.current = window.setTimeout(() => setActiveServer(null), 700);
  };

  const performRequest = async () => {
    try {
      const result = await sendRateLimitRequest();
      const entry: RequestLogEntry = {
        id: `req-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour12: false, minute: "2-digit", second: "2-digit" }),
        endpoint: "/api/test",
        server: (result.serverId as RequestLogEntry["server"]) || "API-1",
        status: result.status,
        responseTime: 20 + Math.round(Math.random() * 60),
      };
      flashActive(entry.server);
      setLastResult(entry);
      setLog((l) => [entry, ...l].slice(0, 50));
      setAvgResponse((prev) => Math.round(prev * 0.7 + entry.responseTime * 0.3));
      setTokens(Math.max(0, result.remainingTokens));
      if (entry.status === 200) {
        setAllowed((a) => a + 1);
      } else {
        setBlocked((b) => b + 1);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  const sendBatch = (n: number) => {
    let i = 0;
    const id = window.setInterval(() => {
      void performRequest();
      i += 1;
      if (i >= n) window.clearInterval(id);
    }, 120);
  };

  const resetCounters = async () => {
    setAllowed(0);
    setBlocked(0);
    setTokens(TOKEN_CAPACITY);
    setLog([]);
    setLastResult(null);
    setAvgResponse(0);
    await refreshDashboard();
  };

  const runLoadTest = () => sendBatch(40);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
              <Zap size={18} strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
                Distributed Rate Limiter
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Token bucket · Redis-backed · Multi-node
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-accent/30 px-3 py-1.5 sm:inline-flex">
              <span className="relative grid place-items-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-[var(--color-success)] opacity-60" />
                <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
              </span>
              <span className="text-xs font-medium">Connected</span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-accent/40 text-foreground transition hover:bg-accent/70"
            >
              <Github size={16} strokeWidth={2.25} />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Allowed Requests" value={allowed.toLocaleString()} icon={CheckCircle2} tone="success" />
          <StatCard label="Blocked Requests" value={blocked.toLocaleString()} icon={ShieldBan} tone="danger" />
          <StatCard label="Remaining Tokens" value={`${tokens}/${TOKEN_CAPACITY}`} icon={Coins} tone="warning" />
          <StatCard label="Response Time" value={`${avgResponse}ms`} icon={Gauge} tone="info" />
        </div>

        {/* Middle row */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <SectionCard
            title="Architecture"
            subtitle="Active server highlights on each request"
            className="lg:col-span-2"
          >
            <ArchitectureDiagram activeServer={activeServer} />
          </SectionCard>

          <SectionCard
            title="Send Requests"
            subtitle="Simulate traffic against the limiter"
            className="lg:col-span-3"
          >
            <div className="flex flex-wrap gap-2">
              <ActionButton onClick={() => void performRequest()} icon={Send} variant="primary">
                Send Request
              </ActionButton>
              <ActionButton onClick={() => sendBatch(10)} icon={Activity}>
                Send 10 Requests
              </ActionButton>
              <ActionButton onClick={runLoadTest} icon={Play}>
                Run Load Test
              </ActionButton>
              <ActionButton onClick={() => void resetCounters()} icon={RotateCcw} variant="danger">
                Reset Counter
              </ActionButton>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <ResultCell
                label="Status"
                value={lastResult ? String(lastResult.status) : "—"}
                tone={
                  !lastResult
                    ? "muted"
                    : lastResult.status === 200
                      ? "success"
                      : "danger"
                }
              />
              <ResultCell
                label="Handled By"
                value={lastResult ? lastResult.server : "—"}
              />
              <ResultCell label="Remaining Tokens" value={`${tokens}`} />
            </div>
          </SectionCard>
        </div>

        {/* Charts + Log */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <SectionCard
            title="Requests / Second"
            subtitle="Live throughput across all API nodes"
            className="lg:col-span-3"
          >
            <RpsChart data={rps} />
          </SectionCard>

          <SectionCard title="Request Log" subtitle="Most recent 50 requests" className="lg:col-span-2">
            <RequestLog entries={log} />
          </SectionCard>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          Built with React, Node.js, Express, Redis, Docker, and AWS.
        </div>
      </footer>
    </div>
  );
}

function ResultCell({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "muted" | "success" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "text-[var(--color-success)]"
      : tone === "danger"
        ? "text-[var(--color-destructive)]"
        : tone === "muted"
          ? "text-muted-foreground"
          : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-background/40 px-3 py-2.5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1 font-mono text-lg font-semibold tabular-nums ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}
