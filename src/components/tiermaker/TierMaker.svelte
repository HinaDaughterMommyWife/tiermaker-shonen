<script lang="ts">
  import { onMount, tick } from "svelte";
  import { DEFAULT_TIERS, type TierDef } from "../../config/defaultTiers";
  import { saveState, loadState, checkAutoReset } from "../../lib/persistence";
  import type {
    MangaItem,
    VsData,
    CarryItem,
    TierStatRow,
    ListedItem,
  } from "../../stores/tierStore";
  import {
    compareTierScore,
    resolveBarPct,
    pctFromAvgs,
    teamInfinityMark,
  } from "../../lib/vsScore";
  import TierRow from "./TierRow.svelte";
  import TierControls from "./TierControls.svelte";
  import MangaPool from "./MangaPool.svelte";
  import Modal from "../ui/Modal.svelte";
  import TierSettings from "./TierSettings.svelte";
  import { audioManager } from "../../lib/audio";

  const {
    initialItems,
    onCalculate,
    onLiveUpdate,
  }: {
    initialItems: MangaItem[];
    onCalculate?: (data: VsData) => void;
    onLiveUpdate?: (data: VsData) => void;
  } = $props();

  interface TierEntry extends TierDef {
    items: MangaItem[];
  }

  function defaultTierEntries(): TierEntry[] {
    return DEFAULT_TIERS.map((t) => ({ ...t, items: [] }));
  }

  let tiers = $state<TierEntry[]>([]);
  let pool = $state<MangaItem[]>([]);
  let ready = $state(false);

  let settingsId = $state<string | null>(null);
  let settingsOpen = $state(false);
  let factoryResetOpen = $state(false);
  let darkraiMsgOpen = $state(false);

  const settingsTier = $derived(tiers.find((t) => t.id === settingsId) ?? null);

  onMount(async () => {
    const autoReset = checkAutoReset();
    const saved = loadState();

    if (saved) {
      if (autoReset) {
        tiers = saved.tiers.map((st) => ({
          id: st.id,
          label: st.label,
          score: st.score,
          color: st.color,
          items: [],
        }));
        pool = [...initialItems];
      } else {
        const itemMap = new Map(initialItems.map((i) => [i.id, i]));
        const assignedIds = new Set<string>();
        tiers = saved.tiers.map((st) => ({
          id: st.id,
          label: st.label,
          score: st.score,
          color: st.color,
          items: st.itemIds
            .map((id) => itemMap.get(id))
            .filter((i): i is MangaItem => i !== undefined),
        }));
        tiers.forEach((t) => t.items.forEach((i) => assignedIds.add(i.id)));
        pool = initialItems.filter((i) => !assignedIds.has(i.id));
      }
    } else {
      tiers = defaultTierEntries();
      pool = [...initialItems];
    }

    await tick();
    ready = true;
    document.getElementById("tiermaker-skeleton")?.remove();
  });

  $effect(() => {
    if (!ready) return;
    saveState(tiers);
    onLiveUpdate?.(computeVsData());
  });

  // ── Tier operations ──────────────────────────────────────────────────────

  function moveTierUp(id: string) {
    const idx = tiers.findIndex((t) => t.id === id);
    if (idx <= 0) return;
    const next = [...tiers];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    tiers = next;
  }

  function moveTierDown(id: string) {
    const idx = tiers.findIndex((t) => t.id === id);
    if (idx >= tiers.length - 1) return;
    const next = [...tiers];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    tiers = next;
  }

  function updateTierConfig(id: string, patch: Partial<TierDef>) {
    const idx = tiers.findIndex((t) => t.id === id);
    if (idx === -1) return;
    tiers[idx] = { ...tiers[idx], ...patch };
  }

  function deleteTier(id: string) {
    const tier = tiers.find((t) => t.id === id);
    if (tier) pool = [...pool, ...tier.items];
    tiers = tiers.filter((t) => t.id !== id);
    settingsOpen = false;
  }

  function addTier(relativeToId: string, position: "above" | "below") {
    const idx = tiers.findIndex((t) => t.id === relativeToId);
    if (idx === -1) return;
    const newTier: TierEntry = {
      id: `tier-${Date.now()}`,
      label: "?",
      score: 50,
      color: "#888888",
      items: [],
    };
    const next = [...tiers];
    next.splice(position === "above" ? idx : idx + 1, 0, newTier);
    tiers = next;
  }

  function clearTier(id: string) {
    const idx = tiers.findIndex((t) => t.id === id);
    if (idx === -1) return;
    pool = [...pool, ...tiers[idx].items];
    tiers[idx] = { ...tiers[idx], items: [] };
  }

  function confirmFactoryReset() {
    pool = [...initialItems];
    tiers = defaultTierEntries();
    factoryResetOpen = false;
  }

  function clearAllToPool() {
    pool = [...tiers.flatMap((t) => t.items), ...pool];
    tiers = tiers.map((t) => ({ ...t, items: [] }));
  }

  function openSettings(id: string) {
    settingsId = id;
    settingsOpen = true;
  }

  // ── VS score computation ─────────────────────────────────────────────────

  function computeVsData(): VsData {
    const sorted = [...tiers].sort((a, b) => compareTierScore(a.score, b.score));

    let redTotal = 0,
      redCount = 0,
      redCarry: CarryItem | null = null;
    let blueTotal = 0,
      blueCount = 0,
      blueCarry: CarryItem | null = null;
    let posInfRed = 0,
      posInfBlue = 0,
      negInfRed = 0,
      negInfBlue = 0;
    const redItems: ListedItem[] = [];
    const blueItems: ListedItem[] = [];
    const tierRows: TierStatRow[] = [];

    for (const tier of sorted) {
      const reds = tier.items.filter((i) => i.teamId === "red");
      const blues = tier.items.filter((i) => i.teamId === "blue");

      if (tier.score === Infinity) {
        posInfRed += reds.length;
        posInfBlue += blues.length;
      } else if (tier.score === -Infinity) {
        negInfRed += reds.length;
        negInfBlue += blues.length;
      } else {
        redTotal += tier.score * reds.length;
        blueTotal += tier.score * blues.length;
      }

      redCount += reds.length;
      blueCount += blues.length;

      const toItem = (item: MangaItem): ListedItem => ({
        name: item.name,
        coverUrl: item.coverUrl,
        tierLabel: tier.label,
        tierScore: tier.score,
        tierColor: tier.color,
      });
      reds.forEach((i) => redItems.push(toItem(i)));
      blues.forEach((i) => blueItems.push(toItem(i)));

      if (!redCarry && reds.length > 0)
        redCarry = {
          name: reds[0].name,
          coverUrl: reds[0].coverUrl,
          tierLabel: tier.label,
          tierScore: tier.score,
          tierColor: tier.color,
        };
      if (!blueCarry && blues.length > 0)
        blueCarry = {
          name: blues[0].name,
          coverUrl: blues[0].coverUrl,
          tierLabel: tier.label,
          tierScore: tier.score,
          tierColor: tier.color,
        };

      if (reds.length > 0 || blues.length > 0)
        tierRows.push({
          label: tier.label,
          score: tier.score,
          color: tier.color,
          redCount: reds.length,
          blueCount: blues.length,
        });
    }

    const ceil3 = (n: number) => Math.ceil(n * 1000) / 1000;
    const avgRed = redCount > 0 ? ceil3(redTotal / redCount) : 0;
    const avgBlue = blueCount > 0 ? ceil3(blueTotal / blueCount) : 0;
    const barPct =
      resolveBarPct({
        posRed: posInfRed,
        posBlue: posInfBlue,
        negRed: negInfRed,
        negBlue: negInfBlue,
      }) ?? pctFromAvgs(avgRed, avgBlue);

    return {
      red: {
        score: avgRed,
        infinityMark: teamInfinityMark(posInfRed, negInfRed),
        carry: redCarry,
        totalItems: redCount,
        items: redItems,
      },
      blue: {
        score: avgBlue,
        infinityMark: teamInfinityMark(posInfBlue, negInfBlue),
        carry: blueCarry,
        totalItems: blueCount,
        items: blueItems,
      },
      tiers: tierRows,
      barPct,
    };
  }
</script>

<Modal bind:open={factoryResetOpen} title="Reinicio de Fábrica">
  <div class="px-5 py-5">
    <p class="text-sm text-white/70 leading-relaxed mb-1">
      Esto restablecerá todos los tiers a los valores por defecto y devolverá todos los mangas a la
      lista de disponibles.
    </p>
    <p class="text-xs text-white/30 mb-5">Esta acción no se puede deshacer.</p>
    <div class="flex gap-2 justify-end">
      <button
        onclick={() => {
          factoryResetOpen = false;
        }}
        class="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
        >Cancelar</button
      >
      <button
        onclick={confirmFactoryReset}
        class="rounded-lg bg-red-600/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95"
        >Reiniciar</button
      >
    </div>
  </div>
</Modal>

<Modal bind:open={darkraiMsgOpen} title="Mensaje para Darkrai">
  <div class="px-5 py-5 space-y-3">
    <p class="text-sm text-white/80 leading-relaxed">
      Buenas Sapo Perro ( <img
        src="https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_47e825274dcb405981374b875bc0ff66/default/dark/3.0"
        alt="Darkrai"
        class="size-6 inline-block"
      />) , este es el proyecto que tenia en la raja desde hace medio año xd. Nunca lo termine
      porque me daba paja, espero que te guste.
    </p>
    <br />
    <p class="text-sm text-white/80 leading-relaxed">
      En la parte inferior hay un boton para "Calcular Ganador". Es un boton rojo, lo digo esto para
      que no te pases de GAGA, es solo darle click y listo <img
        src="https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_47e825274dcb405981374b875bc0ff66/default/dark/3.0"
        alt="Darkrai"
        class="size-6 inline-block"
      />
    </p>
    <br />
    <p class="text-sm text-white/80 leading-relaxed">
      Si hay algun problema visual o funcional, estare atento al VOD. Saludos y recuerden <span
        class="text-red-500 font-bold italic"
        ><b class="text-white">SIEMPRE</b>
        𝓒𝓞𝓡𝓡𝓔𝓖𝓘𝓡 𝓐 𝓢𝓤𝓢 𝓟𝓘Ñ𝓐𝓢</span
      >🍍😭💢
    </p>
    <div class="flex justify-end pt-2">
      <button
        onclick={() => {
          darkraiMsgOpen = false;
        }}
        class="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
        >Cerrar</button
      >
    </div>
  </div>
</Modal>

<Modal bind:open={settingsOpen} title="Configuración · {settingsTier?.label ?? ''}">
  {#if settingsTier}
    <TierSettings
      tier={settingsTier}
      onUpdate={(patch) => updateTierConfig(settingsTier!.id, patch)}
      onDelete={() => deleteTier(settingsTier!.id)}
      onAddAbove={() => addTier(settingsTier!.id, "above")}
      onAddBelow={() => addTier(settingsTier!.id, "below")}
      onClear={() => clearTier(settingsTier!.id)}
      onClose={() => {
        settingsOpen = false;
      }}
    />
  {/if}
</Modal>

{#if ready}
  <div class="w-full max-w-4xl mx-auto tiermaker-fadein px-2">
    <TierControls
      onFactoryReset={() => {
        factoryResetOpen = true;
      }}
      onDarkraiMsg={() => {
        darkraiMsgOpen = true;
      }}
      onClear={clearAllToPool}
    />

    <div
      class="rounded-lg border border-white/10 overflow-visible [&>*:first-child]:rounded-tl-lg [&>*:first-child]:rounded-tr-lg [&>*:last-child]:rounded-bl-lg [&>*:last-child]:rounded-br-lg [&>*:last-child]:border-b-0"
    >
      {#each tiers as tier, idx (tier.id)}
        <TierRow
          config={tier}
          bind:items={tier.items}
          isFirst={idx === 0}
          isLast={idx === tiers.length - 1}
          onMoveUp={() => moveTierUp(tier.id)}
          onMoveDown={() => moveTierDown(tier.id)}
          onSettings={() => openSettings(tier.id)}
        />
      {/each}
    </div>

    <MangaPool bind:items={pool} />

    {#if onCalculate}
      <div class="mt-8 flex justify-center pb-8">
        <button
          onclick={() => {
            audioManager.init();
            onCalculate!(computeVsData());
          }}
          class="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-accent px-8 py-3.5 text-base font-bold tracking-wide text-white shadow-lg shadow-accent/30 transition-all duration-200 hover:scale-105 hover:shadow-accent/50 active:scale-95"
        >
          <span class="text-xl transition-transform duration-300 group-hover:rotate-12">🤖</span>
          <span>Calcular Ganador</span>
          <div
            class="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full"
          ></div>
        </button>
      </div>
    {/if}
  </div>
{/if}
