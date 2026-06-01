<script lang="ts">
  import { fmtScore } from "../../lib/vsScore";
  import type { ListedItem } from "../../stores/tierStore";

  const {
    team,
    items,
  }: {
    team: "red" | "blue";
    items: ListedItem[];
  } = $props();
</script>

<div class="bg-white/2 border border-white/6 rounded-[10px] overflow-hidden">
  <div class="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
    <span
      class="w-2 h-2 rounded-full shrink-0"
      style="background: {team === 'red' ? 'var(--color-team-red)' : 'var(--color-team-blue)'}"
    ></span>
    <span class="text-[0.7rem] font-bold tracking-widest uppercase text-white/70 flex-1">
      {team === "red" ? "Team Rojo" : "Team Azul"}
    </span>
    <span class="text-[0.65rem] font-semibold text-white/35 bg-white/6 px-2 py-0.5 rounded">
      {items.length}
    </span>
  </div>

  <div class="max-h-80 overflow-y-auto p-2 list-scroll-bar">
    {#each items as item, i}
      <div
        class="flex items-center gap-[0.6rem] p-2 rounded-md bg-white/2 mb-[0.4rem] opacity-0 animate-[list-item-in_0.3s_ease_both]"
        style="animation-delay:{0.1 + i * 0.03}s"
      >
        {#if item.coverUrl}
          <img src={item.coverUrl} alt={item.name} class="w-8 h-11 object-cover rounded shrink-0" />
        {:else}
          <div
            class="w-8 h-11 flex items-center justify-center text-[0.9rem] font-black text-black/60 rounded shrink-0"
            style="background:{item.tierColor}"
          >
            {item.name[0]}
          </div>
        {/if}

        <div class="flex flex-col gap-[0.2rem] min-w-0 flex-1">
          <span class="text-[0.75rem] font-semibold text-white/85 truncate">{item.name}</span>
          <div class="flex items-center gap-[0.35rem] flex-wrap">
            <span
              class="inline-block w-4 h-4 shrink-0 rounded-[3px] border border-black/15"
              style="background:{item.tierColor}"
              title={item.tierLabel}
              aria-label={item.tierLabel}
            ></span>
            <span class="text-[0.55rem] font-semibold tabular-nums text-white/40">
              {fmtScore(item.tierScore)} pts
            </span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
