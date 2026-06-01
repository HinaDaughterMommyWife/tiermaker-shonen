<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
  import { showBarLabel } from "../../lib/vsScore";
  import { audioManager } from "../../lib/audio";
  import ImpactCanvas from "./ImpactCanvas.svelte";
  import VsArena from "./VsArena.svelte";
  import VsResultBanner from "./VsResultBanner.svelte";

  const {
    scoreRed = 80,
    scoreBlue = 40,
    pctRed,
    pctBlue,
    infinityMarkRed = null,
    infinityMarkBlue = null,
    onSettled,
    onBack,
  }: {
    scoreRed?: number;
    scoreBlue?: number;
    pctRed?: number;
    pctBlue?: number;
    infinityMarkRed?: "∞" | "-∞" | null;
    infinityMarkBlue?: "∞" | "-∞" | null;
    onSettled?: () => void;
    onBack?: () => void;
  } = $props();

  const SCORE_RED = scoreRed;
  const SCORE_BLUE = scoreBlue;

  const total = SCORE_RED + SCORE_BLUE || 1;
  const PCT_RED = pctRed ?? Math.round((SCORE_RED / total) * 100);
  const PCT_BLUE = pctBlue ?? 100 - PCT_RED;

  const showRedLabel = showBarLabel(infinityMarkRed, PCT_RED);
  const showBlueLabel = showBarLabel(infinityMarkBlue, PCT_BLUE);

  let key = $state(0);
  let winner = $state<"red" | "blue" | "tie" | null>(null);
  let settled = $state(false);
  let backFading = $state(false);

  let impactRef = $state<ReturnType<typeof ImpactCanvas> | null>(null);

  function handleBack() {
    backFading = true;
    setTimeout(() => onBack?.(), 380);
  }

  $effect(() => {
    void key;

    document.documentElement.style.overflow = "hidden";
    document.body.classList.remove("winner-red", "winner-blue", "winner-tie");

    const tImpact = setTimeout(() => {
      impactRef?.trigger(PCT_RED);
      audioManager.playImpact();
    }, 1050);

    const t1 = setTimeout(() => {
      winner = PCT_RED > PCT_BLUE ? "red" : PCT_BLUE > PCT_RED ? "blue" : "tie";
      document.body.classList.add(`winner-${winner}`);
    }, 2400);

    const t2 = setTimeout(() => {
      settled = true;
      document.documentElement.style.overflow = "";
      onSettled?.();
    }, 3200);

    return () => {
      clearTimeout(tImpact);
      clearTimeout(t1);
      clearTimeout(t2);
      audioManager.stop();
      document.body.classList.remove("winner-red", "winner-blue", "winner-tie");
      document.documentElement.style.overflow = "";
    };
  });
</script>

<ImpactCanvas bind:this={impactRef} />

{#key key}
  <div
    class="vs-root"
    class:settled
    class:winner-red={winner === "red"}
    class:winner-blue={winner === "blue"}
    class:winner-tie={winner === "tie"}
  >
    <VsArena
      pctRed={PCT_RED}
      pctBlue={PCT_BLUE}
      {settled}
      {winner}
      {showRedLabel}
      {showBlueLabel}
      scoreRed={SCORE_RED}
      scoreBlue={SCORE_BLUE}
      {infinityMarkRed}
      {infinityMarkBlue}
    />

    <VsResultBanner {winner} {settled} {backFading} onBack={handleBack} />
  </div>
{/key}

<style>
  .vs-root {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: 100vh;
    padding-top: max(3rem, calc(50vh - 72px));
    background: var(--color-bg-base);
    overflow: hidden;
    transition:
      padding-top 0.85s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 1.6s ease;
    animation:
      root-fade 0.3s ease forwards,
      shake 0.5s 1.05s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  .vs-root.settled {
    padding-top: 3rem;
  }

  .vs-root.winner-red {
    background-color: #1a0808;
  }
  .vs-root.winner-blue {
    background-color: #06061a;
  }
  .vs-root.winner-tie {
    background-color: #0d0d0d;
  }

  .vs-root::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.014) 0,
        rgba(255, 255, 255, 0.014) 1px,
        transparent 1px,
        transparent 56px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.014) 0,
        rgba(255, 255, 255, 0.014) 1px,
        transparent 1px,
        transparent 56px
      );
    pointer-events: none;
  }

  .vs-root::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("/vignette.svg");
    background-size: 100% 100%;
    pointer-events: none;
  }

  @keyframes root-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translate(0, 0);
    }
    10% {
      transform: translate(-12px, -4px) rotate(-0.5deg);
    }
    22% {
      transform: translate(14px, 3px) rotate(0.5deg);
    }
    34% {
      transform: translate(-9px, 5px);
    }
    46% {
      transform: translate(11px, -3px);
    }
    58% {
      transform: translate(-7px, 3px);
    }
    70% {
      transform: translate(8px, -1px);
    }
    82% {
      transform: translate(-4px, 0);
    }
    92% {
      transform: translate(4px, 0);
    }
  }
</style>
