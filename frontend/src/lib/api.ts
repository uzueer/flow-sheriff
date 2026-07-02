export type RequestLogEntry = {
  id: string;
  time: string;
  endpoint: string;
  server: "API-1" | "API-2" | "API-3";
  status: 200 | 429;
  responseTime: number;
};

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(typeof payload === "string" ? payload : payload?.message || "Request failed");
  }

  return payload as T;
}

export async function getDashboardStats() {
  const response = await fetchJson<{
    success: boolean;
    data: {
      totalRequests: number;
      allowedRequests: number;
      blockedRequests: number;
      activeClients: number;
      averageLatency: number;
    };
  }>("/stats");

  return response.data;
}

export async function getRecentLogs() {
  const response = await fetchJson<{
    success: boolean;
    data: Array<{
      id: number;
      endpoint: string;
      method: string;
      status: number;
      response_time_ms?: number;
      responseTime?: number;
      created_at?: string;
      createdAt?: string;
      remaining_tokens?: number;
    }>;
  }>("/logs");

  return (response.data || []).map((entry, index) => ({
    id: `log-${entry.id ?? index}`,
    time: new Date(entry.created_at || entry.createdAt || Date.now()).toLocaleTimeString([], {
      hour12: false,
      minute: "2-digit",
      second: "2-digit",
    }),
    endpoint: entry.endpoint || "/api/test",
    server: "API-1" as const,
    status: entry.status === 429 ? 429 : 200,
    responseTime: Number(entry.response_time_ms ?? entry.responseTime ?? 0),
  }));
}

export async function sendRateLimitRequest() {
  const response = await fetch(`${API_BASE}/test`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  const remainingTokens = Number(
    (payload && typeof payload === "object" && "remainingTokens" in payload && payload.remainingTokens != null
      ? payload.remainingTokens
      : response.headers.get("x-ratelimit-remaining")) || 0
  );
  const serverId = (
    (payload && typeof payload === "object" && "serverId" in payload && payload.serverId)
      ? payload.serverId
      : response.headers.get("x-server-id")
  ) || "API-1";

  return {
    ok: response.ok,
    status: response.status as 200 | 429,
    remainingTokens,
    retryAfter: Number(response.headers.get("retry-after") || 0),
    serverId,
    payload,
  };
}
