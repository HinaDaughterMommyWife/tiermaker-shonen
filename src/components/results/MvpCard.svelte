<script lang="ts">
  import { fmtScore, fmtTeamAvg } from "../../lib/vsScore";
  import type { CarryItem } from "../../stores/tierStore";

  const {
    team,
    carry,
    score,
    infinityMark,
    totalItems,
  }: {
    team: "red" | "blue";
    carry: CarryItem | null;
    score: number;
    infinityMark: "∞" | "-∞" | null;
    totalItems: number;
  } = $props();

  // svelte-ignore state_referenced_locally
  const isRed = team === "red";
</script>

<div class="mvp-card" class:mvp-card--red={isRed} class:mvp-card--blue={!isRed}>
  <div
    class="text-[0.6rem] font-bold tracking-[0.35em] uppercase"
    style="color: {isRed ? 'rgba(252,165,165,0.8)' : 'rgba(147,197,253,0.8)'}"
  >
    {isRed ? "Team Rojo" : "Team Azul"}
  </div>

  <div class="text-[0.65rem] font-semibold tracking-widest uppercase text-white/35">🏆 Carreó</div>

  {#if carry}
    <div class="flex gap-[0.85rem] items-center">
      <div class="relative shrink-0">
        {#if carry.coverUrl}
          <img src={carry.coverUrl} alt={carry.name} class="carry-cover" />
        {:else}
          <div
            class="carry-cover flex items-center justify-center text-[1.4rem] font-black text-black/60"
            style="background:{carry.tierColor}"
          >
            {carry.name[0]}
          </div>
        {/if}
        <div
          class="absolute bottom-[-6px] right-[-6px] w-5 h-5 rounded border border-black/20"
          style="background:{carry.tierColor}"
          title={carry.tierLabel}
          aria-label={carry.tierLabel}
        ></div>
      </div>

      <div class="flex flex-col gap-[0.3rem] min-w-0">
        <span class="text-[0.85rem] font-bold text-white/90 leading-tight wrap-break-word">
          {carry.name}
        </span>
        <span class="text-[0.6rem] font-medium text-white/35 tabular-nums">
          {fmtScore(carry.tierScore)} pts en tier
        </span>
      </div>
    </div>
  {:else}
    <p class="text-[0.75rem] text-white/25 italic m-0">Sin mangas clasificados</p>
  {/if}

  <div class="flex items-baseline justify-between border-t border-white/6 pt-3">
    <span class="text-[0.6rem] font-semibold tracking-[0.08em] uppercase text-white/30">
      Promedio equipo
    </span>
    <span
      class="text-[1.5rem] font-black tabular-nums leading-none"
      style="color: {isRed ? '#fca5a5' : '#93c5fd'}"
    >
      {fmtTeamAvg(score, infinityMark)}
      <span class="text-[0.65rem] font-medium opacity-50">pts</span>
    </span>
  </div>

  <div class="text-[0.6rem] text-white/20 text-right">
    {totalItems} mangas clasificados
  </div>
</div>

<style>
  /* Card frame: kept as CSS for ::before accent bar, gradient, animation */
  .mvp-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    padding: 1.4rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    position: relative;
    overflow: hidden;
    animation: card-in 0.5s ease both;
  }

  .mvp-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    border-radius: 12px 0 0 12px;
  }

  .mvp-card--red {
    animation-delay: 0.1s;
  }
  .mvp-card--blue {
    animation-delay: 0.2s;
  }
  .mvp-card--red::before {
    background: linear-gradient(180deg, #ef4444, #7f1d1d);
  }
  .mvp-card--blue::before {
    background: linear-gradient(180deg, #3b82f6, #1e3a8a);
  }

  /* Cover image: non-standard size (52×72px), can't use Tailwind sizing utilities cleanly */
  .carry-cover {
    width: 52px;
    height: 72px;
    object-fit: cover;
    border-radius: 6px;
    display: block;
  }
</style>
