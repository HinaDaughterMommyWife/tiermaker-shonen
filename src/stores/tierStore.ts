

export interface MangaItem {
  id: string;
  mangaId: number;
  name: string;
  slug: string;
  coverUrl: string | null;
  teamId: string | null;
  weeklyIsActive: boolean;
}

export interface CarryItem {
  name: string;
  coverUrl: string | null;
  tierLabel: string;
  tierScore: number;
  tierColor: string;
}

export interface TierStatRow {
  label: string;
  score: number;
  color: string;
  redCount: number;
  blueCount: number;
}

export interface ListedItem {
  name: string;
  coverUrl: string | null;
  tierLabel: string;
  tierScore: number;
  tierColor: string;
}

export interface TeamStats {
  score: number;
  infinityMark: "∞" | "-∞" | null;
  carry: CarryItem | null;
  totalItems: number;
  items: ListedItem[];
}

export interface VsData {
  red: TeamStats;
  blue: TeamStats;
  tiers: TierStatRow[];
  barPct: { red: number; blue: number };
}
