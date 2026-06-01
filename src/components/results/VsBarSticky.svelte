<script lang="ts">
  import { fmtTeamAvg, showBarLabel } from "../../lib/vsScore";
  import type { VsData } from "../../stores/tierStore";

  const {
    vsData,
    active = true,
    onFinalize,
  }: {
    vsData: VsData;
    active?: boolean;
    onFinalize?: () => void;
  } = $props();

  const pctRed = $derived(vsData.barPct.red);
  const pctBlue = $derived(vsData.barPct.blue);
  const showRed = $derived(showBarLabel(vsData.red.infinityMark, pctRed));
  const showBlue = $derived(showBarLabel(vsData.blue.infinityMark, pctBlue));
</script>

<div class="vs-sticky" class:inactive={!active} aria-hidden={!active}>
  <div class="w-full relative">
    <div class="bar">
      <div class="fill fill--red" style="width:{pctRed}%">
        {#if showRed}
          <div class="label label--red">
            <span class="team-name">Team Rojo</span>
            <span class="team-score"
              >{fmtTeamAvg(vsData.red.score, vsData.red.infinityMark)} pts · {pctRed}%</span
            >
          </div>
        {/if}
      </div>
      <div class="fill fill--blue" style="width:{pctBlue}%">
        {#if showBlue}
          <div class="label label--blue">
            <span class="team-name">Team Azul</span>
            <span class="team-score"
              >{fmtTeamAvg(vsData.blue.score, vsData.blue.infinityMark)} pts · {pctBlue}%</span
            >
          </div>
        {/if}
      </div>
      <div class="divider" style="left:{pctRed}%">
        <span class="vs-text">VS</span>
      </div>
    </div>
  </div>

  <div class="flex justify-center py-2 bg-vs-bg">
    <button
      onclick={onFinalize}
      class="px-[1.4rem] py-[0.35rem] text-[0.72rem] font-bold tracking-[0.08em] text-white/85 bg-white/6 border border-white/15 rounded-md cursor-pointer transition hover:text-white hover:bg-white/12 hover:border-white/30"
    >
      Finalizar cambios
    </button>
  </div>
</div>

<style>
  .vs-sticky {
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    background: var(--color-vs-bg);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .vs-sticky.inactive {
    opacity: 0;
    pointer-events: none;
    height: 0;
    overflow: hidden;
    border: none;
  }

  .bar {
    position: relative;
    width: 100%;
    height: 64px;
    overflow: hidden;
    background: var(--color-vs-bg);
    border-top: 2px solid;
    border-image: linear-gradient(
        90deg,
        rgba(239, 68, 68, 0.9) 0%,
        rgba(255, 245, 140, 1) 50%,
        rgba(59, 130, 246, 0.9) 100%
      )
      1;
  }

  .fill {
    position: absolute;
    top: 0;
    height: 100%;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fill--red {
    left: 0;
    background: linear-gradient(90deg, #7f1d1d 0%, #b91c1c 35%, #ef4444 75%, #fca5a5 100%);
  }

  .fill--blue {
    right: 0;
    background: linear-gradient(270deg, #1e3a8a 0%, #1d4ed8 35%, #3b82f6 75%, #93c5fd 100%);
  }

  .label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 2px;
    pointer-events: none;
  }
  .label--red {
    left: 12px;
    align-items: flex-start;
  }
  .label--blue {
    right: 12px;
    align-items: flex-end;
  }

  .team-name {
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.95);
  }

  .team-score {
    font-size: 0.5rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.55);
    font-variant-numeric: tabular-nums;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.95);
  }

  .divider {
    position: absolute;
    top: 0;
    height: 100%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
    transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .vs-text {
    font-size: 1.1rem;
    font-weight: 900;
    font-style: italic;
    letter-spacing: 0.1em;
    color: #fff;
    text-shadow:
      0 0 12px rgba(255, 255, 255, 0.9),
      0 0 30px rgba(255, 230, 100, 0.5);
  }
</style>
