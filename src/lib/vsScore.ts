/** Sort tiers: +∞ first, finite middle, -∞ last. */
export function compareTierScore(a: number, b: number): number {
  if (a === b) return 0;
  if (a === Infinity) return -1;
  if (b === Infinity) return 1;
  if (a === -Infinity) return 1;
  if (b === -Infinity) return -1;
  return b - a;
}

export interface InfinityCounts {
  posRed: number;
  posBlue: number;
  negRed: number;
  negBlue: number;
}

export function pctFromAvgs(avgRed: number, avgBlue: number): { red: number; blue: number } {
  if (avgRed === avgBlue) return { red: 50, blue: 50 };
  const shift = Math.min(avgRed, avgBlue, 0);
  const shiftedRed = avgRed - shift;
  const shiftedBlue = avgBlue - shift;
  const total = shiftedRed + shiftedBlue || 1;
  const red = Math.round((shiftedRed / total) * 100);
  return { red, blue: 100 - red };
}

/**
 * Bar % override when infinity applies. Pts stay as real averages.
 * +∞: more items wins bar. -∞: more items loses bar. Equal counts → 50/50.
 */
export function resolveBarPct(counts: InfinityCounts): { red: number; blue: number } | null {
  const { posRed, posBlue, negRed, negBlue } = counts;

  if (posRed > 0 || posBlue > 0) {
    if (posRed > posBlue) return { red: 100, blue: 0 };
    if (posBlue > posRed) return { red: 0, blue: 100 };
    return { red: 50, blue: 50 };
  }

  if (negRed > 0 || negBlue > 0) {
    if (negRed > negBlue) return { red: 0, blue: 100 };
    if (negBlue > negRed) return { red: 100, blue: 0 };
    return { red: 50, blue: 50 };
  }

  return null;
}

export function fmtScore(n: number): string {
  if (n === Infinity) return "∞";
  if (n === -Infinity) return "-∞";
  return n % 1 === 0 ? String(n) : n.toFixed(3).replace(/\.?0+$/, "");
}

export function teamInfinityMark(posCount: number, negCount: number): "∞" | "-∞" | null {
  if (posCount > 0) return "∞";
  if (negCount > 0) return "-∞";
  return null;
}

export function fmtTeamAvg(score: number, mark: "∞" | "-∞" | null | undefined): string {
  return mark ?? fmtScore(score);
}

export function showBarLabel(mark: "∞" | "-∞" | null, pct: number): boolean {
  return !(mark === "-∞" && pct === 0);
}
