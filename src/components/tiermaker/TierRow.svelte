<script lang="ts">
  import { dndzone, type DndEvent, type Options } from "svelte-dnd-action";
  import MangaCard from "./MangaCard.svelte";
  import AuraCanvas from "../ui/AuraCanvas.svelte";
  import type { MangaItem } from "../../stores/tierStore";
  import type { TierDef } from "../../config/defaultTiers";
  import { textOnBackground } from "../../lib/colorContrast";

  type ExtendedOptions = Options<MangaItem>;

  let {
    config,
    items = $bindable([]),
    isFirst,
    isLast,
    onMoveUp,
    onMoveDown,
    onSettings,
  }: {
    config: TierDef;
    items: MangaItem[];
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onSettings: () => void;
  } = $props();

  const dndOptions = (it: MangaItem[]): ExtendedOptions => ({
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

  const labelColor = $derived(textOnBackground(config.color));
</script>

<div class="flex border-b border-white/10">
  <!-- Tier label -->
  <div
    class="relative flex w-24 shrink-0 items-center justify-center border-r border-black/20 min-h-[82px] px-2 pb-5 pt-2"
    style="background-color: {config.color};"
  >
    <span
      class="text-center text-xs font-medium leading-tight break-words w-full"
      style="color: {labelColor};">{config.label}</span
    >
    <!-- Score footer absolute -->
    <div
      class="absolute bottom-0 left-0 right-0 flex items-center justify-center border-t border-black/40 bg-black/40 py-0.5"
    >
      {#if config.score === Infinity}
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <AuraCanvas color="green" />
        </div>
        <span
          class="relative z-10 text-sm font-black leading-none text-green-300 pointer-events-none"
          >∞</span
        >
      {:else if config.score === -Infinity}
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <AuraCanvas color="red" />
        </div>
        <span class="relative z-10 text-sm font-black leading-none text-red-400 pointer-events-none"
          >-∞</span
        >
      {:else}
        <span
          class="text-[9px] font-semibold tabular-nums {config.score < 0
            ? 'text-red-300'
            : 'text-green-300'}"
        >
          {(config.score > 0 ? "+" : "") + (config.score ?? 0)}
        </span>
      {/if}
    </div>
  </div>

  <!-- Drop zone -->
  <div
    class="flex min-h-[82px] flex-1 flex-wrap content-start gap-0.5 outline-none"
    use:dndzone={dndOptions(items)}
    onconsider={handleConsider}
    onfinalize={handleFinalize}
  >
    {#each items as item (item.id)}
      <MangaCard {item} />
    {/each}
  </div>

  <!-- Gear + move arrows -->
  <div class="flex shrink-0 items-center gap-0.5 px-1">
    <!-- Gear -->
    <button
      onclick={onSettings}
      class="flex h-6 w-6 items-center justify-center rounded text-white/40 transition hover:bg-white/10 hover:text-white"
      title="Configurar tier {config.label}"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-3.5 w-3.5"
      >
        <path
          fill-rule="evenodd"
          d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .205 1.251l-1.18 2.044a1 1 0 0 1-1.186.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.113a7.047 7.047 0 0 1 0-2.228l-1.267-1.114a1 1 0 0 1-.205-1.251l1.18-2.044a1 1 0 0 1 1.186-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456L7.84 1.804ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Arrows -->
    <div class="flex flex-col items-center gap-0.5">
      <button
        onclick={onMoveUp}
        disabled={isFirst}
        class="flex h-6 w-6 items-center justify-center rounded text-white/40 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
        title="Subir fila"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-3.5 w-3.5"
        >
          <path
            fill-rule="evenodd"
            d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04L10.75 5.612V16.25A.75.75 0 0 1 10 17Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button
        onclick={onMoveDown}
        disabled={isLast}
        class="flex h-6 w-6 items-center justify-center rounded text-white/40 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
        title="Bajar fila"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-3.5 w-3.5"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</div>
