<script lang="ts">
  import type { VsData } from "../../stores/tierStore";
  import MvpCard from "./MvpCard.svelte";
  import TierComparisonChart from "./TierComparisonChart.svelte";
  import TeamMangaList from "./TeamMangaList.svelte";

  const { vsData }: { vsData: VsData } = $props();
</script>

<section class="bg-[#07070d] border-t border-white/6 px-8 py-16 animate-[stats-in_0.6s_ease_both]">
  <div class="text-center mb-10">
    <span
      class="block text-[0.6rem] font-bold tracking-[0.4em] uppercase text-white/25 mb-[0.35rem]"
    >
      POST-MATCH
    </span>
    <h2 class="text-[1.6rem] font-black tracking-[0.06em] uppercase text-white/85 m-0">
      Estadísticas
    </h2>
  </div>

  <div class="grid grid-cols-2 gap-6 max-w-[860px] mx-auto mb-14 max-sm:grid-cols-1">
    <MvpCard
      team="red"
      carry={vsData.red.carry}
      score={vsData.red.score}
      infinityMark={vsData.red.infinityMark}
      totalItems={vsData.red.totalItems}
    />
    <MvpCard
      team="blue"
      carry={vsData.blue.carry}
      score={vsData.blue.score}
      infinityMark={vsData.blue.infinityMark}
      totalItems={vsData.blue.totalItems}
    />
  </div>

  {#if vsData.tiers.length > 0}
    <TierComparisonChart tiers={vsData.tiers} />
  {/if}

  <div class="max-w-[860px] mx-auto mt-12 pt-8 border-t border-white/6">
    <h3 class="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-white/30 mb-5 text-center">
      Mangas Clasificados
    </h3>
    <div class="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
      <TeamMangaList team="red" items={vsData.red.items} />
      <TeamMangaList team="blue" items={vsData.blue.items} />
    </div>
  </div>
</section>
