import { DEV_SKIP_LOCALSTORAGE, DEFAULT_TIERS, type TierDef } from "../config/defaultTiers";

const LS_KEY = "tiermaker-shonen-v1";
const LS_SESSION_KEY = "tiermaker-shonen-session";
const AUTO_CLEAR_MS = 8 * 60 * 60 * 1000;

interface SavedTier extends TierDef {
  itemIds: string[];
}

export interface SavedState {
  version: 1;
  tiers: SavedTier[];
}

export interface SavableTierEntry extends TierDef {
  items: { id: string }[];
}

function replacer(_key: string, value: unknown) {
  if (value === Infinity) return "__INF__";
  if (value === -Infinity) return "__NEG_INF__";
  return value;
}

function reviver(_key: string, value: unknown) {
  if (value === "__INF__") return Infinity;
  if (value === "__NEG_INF__") return -Infinity;
  return value;
}

export function saveState(tiers: SavableTierEntry[]): void {
  if (DEV_SKIP_LOCALSTORAGE) return;
  try {
    const state: SavedState = {
      version: 1,
      tiers: tiers.map((t) => ({
        id: t.id,
        label: t.label,
        score: t.score,
        color: t.color,
        itemIds: t.items.map((i) => i.id),
      })),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(state, replacer));
  } catch {
    // Silently ignore quota errors
  }
}

export function loadState(): SavedState | null {
  if (DEV_SKIP_LOCALSTORAGE) return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw, reviver) as SavedState;
    if (parsed?.version !== 1 || !Array.isArray(parsed.tiers)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearState(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(LS_KEY);
  }
}

export function checkAutoReset(): boolean {
  if (typeof localStorage === "undefined") return false;
  const raw = localStorage.getItem(LS_SESSION_KEY);
  const now = Date.now();
  let shouldReset = false;

  if (raw) {
    const last = Number(raw);
    if (!isNaN(last) && now - last >= AUTO_CLEAR_MS) {
      shouldReset = true;
    }
  }

  localStorage.setItem(LS_SESSION_KEY, String(now));
  return shouldReset;
}

export { DEFAULT_TIERS };
