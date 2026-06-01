<script lang="ts">
  import type { MangaItem } from "../../stores/tierStore";

  const { item }: { item: MangaItem } = $props();

  const teamColor = item.teamId === "red" ? "#ef4444" : item.teamId === "blue" ? "#3b82f6" : null;
</script>

<div
  class="relative w-[58px] h-[80px] shrink-0 overflow-hidden rounded border border-white/10 bg-bg-card shadow-md cursor-grab active:cursor-grabbing {item.weeklyIsActive
    ? ''
    : 'opacity-30'}"
  title={item.name}
>
  {#if teamColor}
    <div
      class="absolute top-0 left-0 w-0 h-0"
      style="border-top: 12px solid {teamColor}; border-right: 12px solid transparent;"
    ></div>
  {/if}
  {#if item.coverUrl}
    <img src={item.coverUrl} alt={item.name} class="h-full w-full object-cover" loading="lazy" />
  {:else}
    <div class="flex h-full w-full items-center justify-center bg-bg-surface p-1">
      <span class="text-center text-[9px] font-semibold leading-tight text-white/70">
        {item.name}
      </span>
    </div>
  {/if}
</div>
