<script lang="ts">
  import { dndzone, type DndEvent, type Options } from "svelte-dnd-action";
  import MangaCard from "./MangaCard.svelte";
  import type { MangaItem } from "../../stores/tierStore";

  let {
    items = $bindable([]),
  }: {
    items: MangaItem[];
  } = $props();

  type ExtendedOptions = Options<MangaItem>;

  const dndOpts = (it: MangaItem[]): ExtendedOptions => ({
    items: it,
    flipDurationMs: 0,
    type: "manga",
    useCursorForDetection: true,
    morphDisabled: true,
    dropTargetStyle: {},
  });

  function handleConsider(e: CustomEvent<DndEvent<MangaItem>>) {
    items = e.detail.items;
  }

  function handleFinalize(e: CustomEvent<DndEvent<MangaItem>>) {
    items = e.detail.items;
  }
</script>

<div class="my-4">
  <p class="mb-2 text-sm font-semibold text-white/50 uppercase tracking-widest">Disponibles</p>

  <div
    class="flex min-h-[100px] flex-wrap gap-2 rounded-lg border border-white/10 bg-bg-card p-2 outline-none"
    use:dndzone={dndOpts(items)}
    onconsider={handleConsider}
    onfinalize={handleFinalize}
  >
    {#if items.length === 0}
      <div class="flex h-20 w-full items-center justify-center text-sm text-white/30 italic">
        Arrastra mangas aquí para quitarlos del tier list
      </div>
    {:else}
      {#each items as item (item.id)}
        <MangaCard {item} />
      {/each}
    {/if}
  </div>
</div>
