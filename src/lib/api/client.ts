import { env as cfEnv } from "cloudflare:workers";

function getConfig(): { baseUrl: string; token: string; fileBaseUrl: string } {
  const e = cfEnv as unknown as Record<string, string | undefined>;
  return {
    baseUrl:
      e.API_BASE_URL ??
      (import.meta.env.API_BASE_URL as string | undefined) ??
      "http://localhost:8788",
    token: e.READ_TOKEN ?? (import.meta.env.READ_TOKEN as string | undefined) ?? "dev-read-token",
    fileBaseUrl:
      e.PUBLIC_FILE_BASE_URL ??
      (import.meta.env.PUBLIC_FILE_BASE_URL as string | undefined) ??
      "http://localhost:8788/files",
  };
}

export function getFileUrl(hash: string | null): string | null {
  if (!hash) return null;
  return `${getConfig().fileBaseUrl}/${hash}`;
}

async function apiFetch<T>(path: string): Promise<T> {
  const { baseUrl, token } = getConfig();
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    headers: { "X-Read-Token": token, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

export interface ApiTeam {
  id: string;
  name: string;
  image_hash: string | null;
  sort_order: number;
  member_count: number;
}

export interface ApiManga {
  id: number;
  slug: string;
  name: string;
  cover_hash: string | null;
  team_id: string | null;
  is_popular: boolean | number;
  status_id: string | null;
  genre_id: number | null;
  last_chapter_slug: string | null;
  weekly_is_active: boolean;
}

interface ApiMangaRaw extends Omit<ApiManga, "weekly_is_active"> {
  weekly_is_active?: boolean | number;
}

function normalizeManga(raw: ApiMangaRaw): ApiManga {
  return {
    ...raw,
    weekly_is_active: raw.weekly_is_active === true || raw.weekly_is_active === 1,
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function fetchTeams(): Promise<ApiTeam[]> {
  const res = await apiFetch<ApiResponse<{ teams: ApiTeam[] }>>("/api/public/teams");
  if (!res.success || !Array.isArray(res.data?.teams)) return [];
  return res.data.teams;
}

/** Fetch mangas filtered to a specific team. Uses the unfiltered list (cached). */
export async function fetchMangasByTeam(teamId: string): Promise<ApiManga[]> {
  const res = await apiFetch<ApiResponse<{ mangas: ApiMangaRaw[] }>>("/api/public/mangas");
  if (!res.success || !Array.isArray(res.data?.mangas)) return [];
  return res.data.mangas
    .filter((m) => m.team_id === teamId && m.status_id !== "eliminado")
    .map(normalizeManga);
}
