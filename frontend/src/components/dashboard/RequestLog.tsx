import type { RequestLogEntry } from "@/lib/api";

export function RequestLog({ entries }: { entries: RequestLogEntry[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="max-h-[360px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card/95 backdrop-blur">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Endpoint</th>
              <th className="px-4 py-3 font-medium">Server</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Response</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No requests yet. Send one to get started.
                </td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-border/60 hover:bg-accent/30">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{e.time}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{e.endpoint}</td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center rounded-md bg-accent/60 px-2 py-0.5 text-xs font-medium">
                    {e.server}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                      e.status === 200
                        ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
                        : "bg-[var(--color-destructive)]/15 text-[var(--color-destructive)]"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-muted-foreground">
                  {e.responseTime}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
