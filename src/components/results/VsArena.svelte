<script lang="ts">
  import { fmtTeamAvg } from "../../lib/vsScore";

  const {
    pctRed,
    pctBlue,
    settled,
    winner,
    showRedLabel,
    showBlueLabel,
    scoreRed,
    scoreBlue,
    infinityMarkRed,
    infinityMarkBlue,
  }: {
    pctRed: number;
    pctBlue: number;
    settled: boolean;
    winner: "red" | "blue" | "tie" | null;
    showRedLabel: boolean;
    showBlueLabel: boolean;
    scoreRed: number;
    scoreBlue: number;
    infinityMarkRed: "∞" | "-∞" | null;
    infinityMarkBlue: "∞" | "-∞" | null;
  } = $props();
</script>

<div class="relative w-full z-1">
  <div class="bar-container" class:settled>
    <div
      class="fill fill--red"
      class:winner-red={winner === "red"}
      class:winner-blue={winner === "blue"}
      class:winner-tie={winner === "tie"}
      style="width:{pctRed}%"
    >
      <div class="winner-glow absolute inset-0 pointer-events-none"></div>
      {#if showRedLabel}
        <div class="label label--red">
          <span class="team-name">Team Rojo</span>
          <span class="team-score">{fmtTeamAvg(scoreRed, infinityMarkRed)} pts · {pctRed}%</span>
        </div>
      {/if}
    </div>

    <div
      class="fill fill--blue"
      class:winner-red={winner === "red"}
      class:winner-blue={winner === "blue"}
      class:winner-tie={winner === "tie"}
      style="width:{pctBlue}%"
    >
      <div class="winner-glow absolute inset-0 pointer-events-none"></div>
      {#if showBlueLabel}
        <div class="label label--blue">
          <span class="team-name">Team Azul</span>
          <span class="team-score">{fmtTeamAvg(scoreBlue, infinityMarkBlue)} pts · {pctBlue}%</span>
        </div>
      {/if}
    </div>
  </div>

  <div class="collision" class:settled style="left:{pctRed}%">
    <div class="col-line"></div>
    <div class="col-flash"></div>
    <div class="sw sw1"></div>
    <div class="sw sw2"></div>
    <div class="sw sw3"></div>
    <div class="vs-badge" class:settled>VS</div>
  </div>
</div>

<style>
  .bar-container {
    position: relative;
    width: 100%;
    height: 144px;
    overflow: hidden;
    background: var(--color-vs-bg);
    transition: height 0.85s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .bar-container.settled {
    height: 80px;
  }

  .bar-container::before,
  .bar-container::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(239, 68, 68, 0.9) 0%,
      rgba(255, 245, 140, 1) 50%,
      rgba(59, 130, 246, 0.9) 100%
    );
    opacity: 0;
    animation: seam-in 0.3s 1.05s ease forwards;
  }
  .bar-container::before {
    top: 0;
  }
  .bar-container::after {
    bottom: 0;
  }

  @keyframes seam-in {
    to {
      opacity: 1;
    }
  }

  .fill {
    position: absolute;
    top: 0;
    height: 100%;
    transition:
      filter 1.2s ease,
      box-shadow 1.2s ease;
  }

  .fill--red {
    left: 0;
    transform: translateX(-105%);
    background: linear-gradient(90deg, #7f1d1d 0%, #b91c1c 35%, #ef4444 75%, #fca5a5 100%);
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.4);
    animation: slam-left 0.9s 0.15s cubic-bezier(0.2, 0, 0.1, 1) forwards;
  }
  .fill--blue {
    right: 0;
    transform: translateX(105%);
    background: linear-gradient(270deg, #1e3a8a 0%, #1d4ed8 35%, #3b82f6 75%, #93c5fd 100%);
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.4);
    animation: slam-right 0.9s 0.15s cubic-bezier(0.2, 0, 0.1, 1) forwards;
  }

  @keyframes slam-left {
    to {
      transform: translateX(0);
    }
  }
  @keyframes slam-right {
    to {
      transform: translateX(0);
    }
  }

  .fill--red::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: rgba(255, 200, 100, 0.9);
    box-shadow: 0 0 24px 12px rgba(255, 180, 60, 0.5);
    opacity: 0;
    animation: edge-hot 0.5s 1.1s ease-out forwards;
  }
  .fill--blue::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: rgba(200, 220, 255, 0.9);
    box-shadow: 0 0 24px 12px rgba(120, 160, 255, 0.5);
    opacity: 0;
    animation: edge-hot 0.5s 1.1s ease-out forwards;
  }
  @keyframes edge-hot {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .fill--red::after {
    content: "";
    position: absolute;
    top: 0;
    left: -55%;
    width: 45%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent);
    opacity: 0;
    animation: shimmer-l 0.5s 1.2s ease-out forwards;
  }
  .fill--blue::after {
    content: "";
    position: absolute;
    top: 0;
    right: -55%;
    width: 45%;
    height: 100%;
    background: linear-gradient(270deg, transparent, rgba(255, 255, 255, 0.18), transparent);
    opacity: 0;
    animation: shimmer-r 0.5s 1.2s ease-out forwards;
  }
  @keyframes shimmer-l {
    0% {
      opacity: 1;
      left: -55%;
    }
    100% {
      opacity: 0;
      left: 130%;
    }
  }
  @keyframes shimmer-r {
    0% {
      opacity: 1;
      right: -55%;
    }
    100% {
      opacity: 0;
      right: 130%;
    }
  }

  .fill--red.winner-blue,
  .fill--blue.winner-red {
    filter: grayscale(0.75) brightness(0.55) sepia(0.15);
  }
  .fill--red.winner-tie,
  .fill--blue.winner-tie {
    filter: grayscale(0.9) brightness(0.6);
  }

  .winner-glow {
    opacity: 0;
    transition: opacity 1s ease;
  }
  .fill--red.winner-red .winner-glow {
    opacity: 1;
    background-image: url("/glow-red.svg");
    background-size: 100% 100%;
    animation: pulse-glow 2s ease-in-out infinite;
  }
  .fill--blue.winner-blue .winner-glow {
    opacity: 1;
    background-image: url("/glow-blue.svg");
    background-size: 100% 100%;
    animation: pulse-glow 2s ease-in-out infinite;
  }
  @keyframes pulse-glow {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }

  .label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 4px;
    opacity: 0;
    animation: label-in 0.35s 1.7s ease forwards;
    pointer-events: none;
  }
  .label--red {
    left: 20px;
    align-items: flex-start;
  }
  .label--blue {
    right: 20px;
    align-items: flex-end;
  }

  @keyframes label-in {
    from {
      opacity: 0;
      transform: translateY(calc(-50% + 6px));
    }
    to {
      opacity: 1;
      transform: translateY(-50%);
    }
  }

  .team-name {
    font-size: 0.9rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.95);
    transition: font-size 0.85s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .team-score {
    font-size: 0.68rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    font-variant-numeric: tabular-nums;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.95);
    transition: font-size 0.85s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .bar-container.settled .team-name {
    font-size: 0.65rem;
  }
  .bar-container.settled .team-score {
    font-size: 0.5rem;
  }

  .collision {
    position: absolute;
    top: 0;
    height: 144px;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
    transition: height 0.85s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .collision.settled {
    height: 80px;
  }

  .col-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    transform: translateX(-50%);
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(255, 245, 140, 0.9) 25%,
      rgba(255, 245, 140, 0.9) 75%,
      transparent 100%
    );
    opacity: 0;
    animation: line-in 0.25s 1.08s ease forwards;
  }
  @keyframes line-in {
    to {
      opacity: 1;
    }
  }

  .col-flash {
    position: absolute;
    top: -60px;
    left: 50%;
    width: 180px;
    height: calc(100% + 120px);
    transform: translateX(-50%);
    background-image: url("/col-flash.svg");
    background-size: 100% 100%;
    opacity: 0;
    animation: col-flash-burst 0.45s 1.05s ease-out forwards;
  }
  @keyframes col-flash-burst {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .sw {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    opacity: 0;
    border-style: solid;
  }
  .sw1 {
    width: 60px;
    height: 60px;
    border-width: 3px;
    border-color: rgba(255, 220, 80, 0.95);
    transform: translate(-50%, -50%) scale(0);
    animation: sw-burst 0.85s 1.05s ease-out forwards;
  }
  .sw2 {
    width: 44px;
    height: 44px;
    border-width: 2px;
    border-color: rgba(239, 68, 68, 0.8);
    transform: translate(-50%, -50%) scale(0);
    animation: sw-burst 0.85s 1.22s ease-out forwards;
  }
  .sw3 {
    width: 32px;
    height: 32px;
    border-width: 2px;
    border-color: rgba(59, 130, 246, 0.8);
    transform: translate(-50%, -50%) scale(0);
    animation: sw-burst 0.85s 1.4s ease-out forwards;
  }
  @keyframes sw-burst {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(9);
    }
  }

  .vs-badge {
    position: relative;
    z-index: 11;
    font-size: 3.8rem;
    font-weight: 900;
    font-style: italic;
    letter-spacing: 0.14em;
    color: #fff;
    text-shadow:
      0 0 18px rgba(255, 255, 255, 0.9),
      0 0 55px rgba(255, 230, 100, 0.6),
      0 0 100px rgba(255, 180, 50, 0.35);
    opacity: 0;
    transform: scale(0.1) rotate(-15deg);
    transition: font-size 0.85s cubic-bezier(0.4, 0, 0.2, 1);
    animation:
      vs-appear 0.38s 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
      vs-glow 2.5s 1.6s ease-in-out infinite;
  }
  .vs-badge.settled {
    font-size: 1.8rem;
  }

  @keyframes vs-appear {
    to {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }
  @keyframes vs-glow {
    0%,
    100% {
      text-shadow:
        0 0 18px rgba(255, 255, 255, 0.8),
        0 0 50px rgba(255, 230, 100, 0.45);
    }
    50% {
      text-shadow:
        0 0 32px rgba(255, 255, 255, 1),
        0 0 85px rgba(255, 210, 60, 0.85),
        0 0 140px rgba(255, 140, 40, 0.45);
    }
  }
</style>
