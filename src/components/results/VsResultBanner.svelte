<script lang="ts">
  const {
    winner,
    settled,
    backFading,
    onBack,
  }: {
    winner: "red" | "blue" | "tie" | null;
    settled: boolean;
    backFading: boolean;
    onBack: () => void;
  } = $props();
</script>

<div
  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center gap-6 z-2"
  style:opacity={backFading ? 0 : undefined}
  style:pointer-events={backFading ? "none" : undefined}
  style:transition={backFading ? "opacity 0.35s ease" : undefined}
>
  {#if winner !== null && settled}
    <div
      class="result-banner"
      class:red={winner === "red"}
      class:blue={winner === "blue"}
      class:tie={winner === "tie"}
    >
      {#if winner === "tie"}
        <span class="banner-title">EMPATE</span>
      {:else}
        <span class="text-[0.65rem] font-bold tracking-[0.35em] uppercase text-white/40">
          VICTORIA
        </span>
        <span class="banner-title">TEAM {winner === "red" ? "ROJO" : "AZUL"}</span>
      {/if}
    </div>
  {/if}

  <button class="reset-btn" class:settled onclick={onBack}>Volver al TierMaker</button>
</div>

<style>
  .result-banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    animation: banner-in 0.7s 0.9s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  }

  @keyframes banner-in {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .banner-title {
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    line-height: 1;
  }

  .result-banner.red .banner-title {
    color: #fff;
    animation: winner-pulse-red 2s ease-in-out infinite;
  }
  @keyframes winner-pulse-red {
    0%,
    100% {
      text-shadow:
        0 0 20px rgba(239, 68, 68, 0.7),
        0 0 50px rgba(239, 68, 68, 0.4);
    }
    50% {
      text-shadow:
        0 0 40px rgba(239, 68, 68, 1),
        0 0 100px rgba(239, 68, 68, 0.7),
        0 0 160px rgba(239, 68, 68, 0.3);
    }
  }

  .result-banner.blue .banner-title {
    color: #fff;
    animation: winner-pulse-blue 2s ease-in-out infinite;
  }
  @keyframes winner-pulse-blue {
    0%,
    100% {
      text-shadow:
        0 0 20px rgba(59, 130, 246, 0.7),
        0 0 50px rgba(59, 130, 246, 0.4);
    }
    50% {
      text-shadow:
        0 0 40px rgba(59, 130, 246, 1),
        0 0 100px rgba(59, 130, 246, 0.7),
        0 0 160px rgba(59, 130, 246, 0.3);
    }
  }

  .result-banner.tie .banner-title {
    color: rgba(255, 255, 255, 0.5);
    font-size: 2.5rem;
    text-shadow: none;
  }

  .reset-btn {
    padding: 0.4rem 1.2rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 6px;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition:
      color 0.2s,
      background 0.2s,
      border-color 0.2s,
      opacity 0.4s ease 1.7s;
  }
  .reset-btn.settled {
    opacity: 1;
    pointer-events: auto;
  }
  .reset-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
</style>
