/**
 * Default tier configuration, presets and dev flags.
 */

/**
 * Set to true to skip localStorage and always use hardcoded defaults.
 * Useful for development/testing without polluting stored state.
 */
export const DEV_SKIP_LOCALSTORAGE = false;

export interface TierDef {
  id: string;
  label: string;
  score: number;
  color: string;
}

export const DEFAULT_TIERS: TierDef[] = [
  { id: "tier-10", label: "EL MEJOR DE LA SEMANA", score: 10, color: "#7E7EFE" },
  { id: "tier-9", label: "SIMBOLICO", score: 9, color: "#7DBEFE" },
  { id: "tier-8", label: "TUVO BLACK SOULS", score: 8, color: "#7FFFFF" },
  { id: "tier-7", label: "NO PASA DEL 7", score: 7, color: "#FD7D7D" },
  { id: "tier-6", label: "VALE TIO", score: 6, color: "#7FFF80" },
  { id: "tier-5", label: "DANDADAN", score: 5, color: "#FFFF7F" },
  { id: "tier-4", label: "¿ALGUIEN LO DEFENDERIA? (yo)", score: 4, color: "#FFDE7F" },
  { id: "tier-3", label: "ESTÁ CONDENADO", score: 2, color: "#FFBE7D" },
  { id: "tier-0", label: "SAKAMOTO LORE", score: 0, color: "#FD7D7D" },
  {
    id: "tier-minus30",
    label: "CALAVERA CALAVERA CALAVERA CALAVERA",
    score: -30,
    color: "#3A3A3A",
  },
  { id: "tier-minus9000", label: "NO LO PAGARON", score: -9000, color: "#FDFE7E" },
  {
    id: "tier-minusInfinity",
    label: "CANCELARON CHAINSAW MAN",
    score: -Infinity,
    color: "#FD7D7D",
  },
];

export const TIER_PRESET_COLORS: string[] = [
  "#ff7f7f", // red
  "#ffbf7f", // orange
  "#ffdf7f", // yellow
  "#ffff7f", // lime
  "#7fff7f", // green
  "#7fffff", // cyan
  "#7fbfff", // blue
  "#bf7fff", // purple
  "#ff7fbf", // pink
  "#cccccc", // gray
];
