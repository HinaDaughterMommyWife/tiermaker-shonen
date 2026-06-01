<script lang="ts">
  import type { TierStatRow } from "../../stores/tierStore";

  const { tiers }: { tiers: TierStatRow[] } = $props();

  const maxCount = $derived(Math.max(1, ...tiers.map((t) => Math.max(t.redCount, t.blueCount))));

  function rowDelay(i: number) {
    return `${0.15 + i * 0.07}s`;
  }
</script>

<div class="max-w-[860px] mx-auto">
  <h3 class="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-white/30 mb-3 text-center">
    Distribución por tier
  </h3>

  <div
    class="flex items-center justify-center gap-x-6 gap-y-2 flex-wrap text-[0.65rem] font-semibold tracking-[0.08em] uppercase text-white/35 mb-6"
  >
    <span class="w-2 h-2 rounded-full shrink-0 bg-team-red"></span>
    <span>Team Rojo</span>
    <span class="w-2 h-2 rounded-full shrink-0 bg-team-blue"></span>
    <span>Team Azul</span>
  </div>

  <div class="flex flex-col gap-2">
    {#each tiers as row, i}
      <div
        class="grid grid-cols-[2.5rem_1fr_1fr] gap-2 items-center opacity-0 animate-[row-in_0.4s_ease_both]"
        style="animation-delay:{rowDelay(i)}"
      >
        <div class="flex justify-center">
          <span
            class="inline-block w-7 h-7 rounded-md border border-black/15"
            style="background:{row.color}"
            title={row.label}
            aria-label={row.label}
          ></span>
        </div>

        <div class="relative h-[28px] overflow-hidden rounded bg-white/4">
          <div
            class="absolute top-0 left-0 h-full w-0 rounded bg-[linear-gradient(90deg,#b91c1c,var(--color-team-red))] animate-[bar-grow_0.7s_ease_both]"
            style="width:{(row.redCount / maxCount) * 100}%"
          ></div>
          {#if row.redCount > 0}
            <span
              class="absolute top-1/2 right-[6px] -translate-y-1/2 text-[0.65rem] font-bold tabular-nums text-white/70 pointer-events-none"
            >
              {row.redCount}
            </span>
          {/if}
        </div>

        <div class="relative h-[28px] overflow-hidden rounded bg-white/4 [direction:rtl]">
          <div
            class="absolute top-0 right-0 h-full w-0 rounded bg-[linear-gradient(270deg,#1d4ed8,var(--color-team-blue))] animate-[bar-grow-r_0.7s_ease_both]"
            style="width:{(row.blueCount / maxCount) * 100}%"
          ></div>
          {#if row.blueCount > 0}
            <span
              class="absolute top-1/2 left-[6px] -translate-y-1/2 text-[0.65rem] font-bold tabular-nums text-white/70 pointer-events-none"
            >
              {row.blueCount}
            </span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
