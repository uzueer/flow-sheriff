export type RequestLogEntry = {
  id: string;
  time: string;
  endpoint: string;
  server: "API-1" | "API-2" | "API-3";
  status: 200 | 429;
  responseTime: number; // ms
};

const SERVERS: RequestLogEntry["server"][] = ["API-1", "API-2", "API-3"];
const ENDPOINTS = ["/api/users", "/api/orders", "/api/auth", "/api/products", "/api/search"];

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour12: false });
}

export function mockInitialLog(count = 8): RequestLogEntry[] {
  const now = Date.now();
  return Array.from({ length: count }).map((_, i) => {
    const blocked = Math.random() < 0.15;
    return {
      id: `seed-${i}`,
      time: formatTime(new Date(now - (count - i) * 4200)),
      endpoint: ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)],
      server: SERVERS[Math.floor(Math.random() * SERVERS.length)],
      status: blocked ? 429 : 200,
      responseTime: Math.round(20 + Math.random() * 80),
    };
  });
}

export function mockRequest(forceBlocked = false): RequestLogEntry {
  const blocked = forceBlocked || Math.random() < 0.12;
  return {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: formatTime(new Date()),
    endpoint: ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)],
    server: SERVERS[Math.floor(Math.random() * SERVERS.length)],
    status: blocked ? 429 : 200,
    responseTime: Math.round(15 + Math.random() * 90),
  };
}

export function mockRpsSeries(points = 30) {
  const now = Date.now();
  return Array.from({ length: points }).map((_, i) => ({
    t: new Date(now - (points - i) * 2000).toLocaleTimeString([], {
      hour12: false,
      minute: "2-digit",
      second: "2-digit",
    }),
    rps: Math.round(40 + Math.sin(i / 2.4) * 18 + Math.random() * 14),
  }));
}
