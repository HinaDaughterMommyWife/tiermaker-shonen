<script lang="ts">
  import TierMaker from "./tiermaker/TierMaker.svelte";
  import VsResult from "./results/VsResult.svelte";
  import VsBarSticky from "./results/VsBarSticky.svelte";
  import StatsSection from "./results/StatsSection.svelte";
  import type { MangaItem, VsData } from "../stores/tierStore";
  import { audioManager } from "../lib/audio";

  const { initialItems }: { initialItems: MangaItem[] } = $props();

  type Phase = "tier" | "fading" | "void" | "vs" | "editing";

  let phase = $state<Phase>("tier");
  let vsData = $state<VsData | null>(null);
  let statsVisible = $state(false);
  let statsFading = $state(false);
  let reservedHeight = $state(0);
  let tierWrap = $state<HTMLElement | null>(null);

  function handleCalculate(data: VsData) {
    vsData = data;
    reservedHeight = tierWrap?.offsetHeight ?? 600;
    phase = "fading";
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      phase = "void";
      setTimeout(() => {
        phase = "vs";
      }, 800);
    }, 520);
  }

  function handleSettled() {
    statsVisible = true;
  }

  function handleBack() {
    statsFading = true;
    setTimeout(() => {
      statsVisible = false;
      statsFading = false;
      phase = "editing";
    }, 380);
  }

  let finalizingOut = $state(false);

  function handleFinalize() {
    window.scrollTo({ top: 0, behavior: "instant" });
    finalizingOut = true;
    audioManager.init();
    setTimeout(() => {
      statsVisible = false;
      finalizingOut = false;
      phase = "vs";
    }, 280);
  }

  function handleLiveUpdate(data: VsData) {
    vsData = data;
  }
</script>

{#if phase === "tier" || phase === "fading"}
  <div
    bind:this={tierWrap}
    class="tier-wrap"
    class:fading={phase === "fading"}
    style={phase === "fading" ? `min-height:${reservedHeight}px` : ""}
  >
    <TierMaker {initialItems} onCalculate={handleCalculate} />
  </div>
{:else if phase === "void"}
  <div style="min-height:{reservedHeight}px"></div>
{:else if vsData}
  <VsBarSticky
    {vsData}
    active={phase === "editing" && !finalizingOut}
    onFinalize={handleFinalize}
  />

  {#if phase === "vs"}
    <VsResult
      scoreRed={vsData.red.score}
      scoreBlue={vsData.blue.score}
      pctRed={vsData.barPct.red}
      pctBlue={vsData.barPct.blue}
      infinityMarkRed={vsData.red.infinityMark}
      infinityMarkBlue={vsData.blue.infinityMark}
      onSettled={handleSettled}
      onBack={handleBack}
    />
    {#if statsVisible}
      <div class="stats-wrap" class:fading={statsFading}>
        <StatsSection {vsData} />
      </div>
    {/if}
  {/if}

  {#if phase === "editing"}
    <div class="editing-body">
      <TierMaker {initialItems} onLiveUpdate={handleLiveUpdate} />
    </div>
  {/if}
{/if}

<style>
  .tier-wrap {
    transition: opacity 0.5s ease;
  }
  .tier-wrap.fading {
    opacity: 0;
    pointer-events: none;
  }

  .stats-wrap {
    transition: opacity 0.35s ease;
  }
  .stats-wrap.fading {
    opacity: 0;
    pointer-events: none;
  }

  .editing-body {
    padding-top: 1rem;
    animation: body-in 0.3s ease forwards;
  }
  @keyframes body-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
