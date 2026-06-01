<script lang="ts">
  import { TIER_PRESET_COLORS, type TierDef } from "../../config/defaultTiers";

  let {
    tier,
    onUpdate,
    onDelete,
    onAddAbove,
    onAddBelow,
    onClear,
    onClose,
  }: {
    tier: TierDef;
    onUpdate: (patch: Partial<TierDef>) => void;
    onDelete: () => void;
    onAddAbove: () => void;
    onAddBelow: () => void;
    onClear: () => void;
    onClose: () => void;
  } = $props();

  let label = $state(tier.label);
  let score = $state(tier.score);
  let scoreText = $state(scoreToText(tier.score));
  let color = $state(tier.color);
  let showCustom = $state(!TIER_PRESET_COLORS.includes(tier.color));
  let confirmDelete = $state(false);

  function scoreToText(s: number): string {
    if (s === Infinity) return "∞";
    if (s === -Infinity) return "-∞";
    return String(s);
  }

  function handleScoreInput(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    let val = input.value;

    const cleaned = val.replace(/[^0-9.\-+∞]/g, "");
    if (cleaned !== val) {
      input.value = cleaned;
      val = cleaned;
    }
    scoreText = val;

    if (
      val === "∞" ||
      val === "+∞" ||
      val.toLowerCase() === "inf" ||
      val.toLowerCase() === "+inf"
    ) {
      score = Infinity;
      return;
    }
    if (val === "-∞" || val.toLowerCase() === "-inf") {
      score = -Infinity;
      return;
    }
    const n = parseFloat(val);
    if (!isNaN(n)) score = n;
  }

  function setInfinity(sign: 1 | -1) {
    score = sign === 1 ? Infinity : -Infinity;
    scoreText = sign === 1 ? "∞" : "-∞";
  }

  const isPreset = $derived(TIER_PRESET_COLORS.includes(color));

  function save() {
    onUpdate({ label: label.trim() || "?", score, color });
    onClose();
  }

  function handleHexInput(e: Event) {
    const val = (e.currentTarget as HTMLInputElement).value;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) color = val;
  }

  function handleDelete() {
    if (!confirmDelete) {
      confirmDelete = true;
      return;
    }
    onDelete();
  }

  function handleAction(fn: () => void) {
    fn();
    onClose();
  }
</script>

<div class="flex flex-col gap-0">
  <!-- ── Config fields ─────────────────────────────────── -->
  <div class="flex flex-col gap-4 p-5">
    <!-- Texto + Puntaje row -->
    <div class="flex gap-3">
      <div class="flex flex-col gap-1.5 flex-1">
        <label class="text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Texto
        </label>
        <textarea
          bind:value={label}
          rows={2}
          class="w-full resize-none rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm font-bold text-white placeholder-white/20 outline-none focus:border-white/30 focus:bg-white/8 transition"
          placeholder="S"
        ></textarea>
      </div>
      <div class="flex flex-col gap-1.5 w-20 shrink-0">
        <label class="text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Puntaje
        </label>
        <input
          type="text"
          value={scoreText}
          oninput={handleScoreInput}
          class="w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-white/30 transition"
          placeholder="100"
        />
        <div class="flex gap-1">
          <button
            onclick={() => setInfinity(1)}
            class="flex-1 rounded border border-green-500/30 bg-green-500/10 py-1 text-xs transition hover:bg-green-500/20 {score ===
            Infinity
              ? 'ring-1 ring-green-400/60'
              : ''}"
            title="Infinito positivo">♾️</button
          >
          <button
            onclick={() => setInfinity(-1)}
            class="flex-1 rounded border border-red-500/30 bg-red-500/10 py-1 text-xs transition hover:bg-red-500/20 {score ===
            -Infinity
              ? 'ring-1 ring-red-400/60'
              : ''}"
            title="Infinito negativo">♾️</button
          >
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        Color
      </label>

      <div class="grid grid-cols-5 gap-1.5">
        {#each TIER_PRESET_COLORS as preset}
          <button
            onclick={() => {
              color = preset;
              showCustom = false;
            }}
            class="relative h-7 w-full rounded-md transition hover:scale-110 active:scale-95"
            style="background-color: {preset};"
            title={preset}
          >
            {#if color === preset}
              <span class="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="h-3.5 w-3.5 text-black/60"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            {/if}
          </button>
        {/each}
      </div>

      <button
        onclick={() => (showCustom = !showCustom)}
        class="flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition
          {showCustom
          ? 'border-white/20 bg-white/8 text-white'
          : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20'}"
      >
        <span>🎨</span>
        <span>Color personalizado</span>
        {#if !isPreset && !showCustom}
          <span
            class="ml-auto h-4 w-4 rounded-sm border border-white/20"
            style="background-color: {color};"
          ></span>
        {/if}
      </button>

      {#if showCustom}
        <div class="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 p-2">
          <input
            type="color"
            bind:value={color}
            class="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0 outline-none"
          />
          <input
            type="text"
            value={color}
            oninput={handleHexInput}
            maxlength={7}
            class="flex-1 bg-transparent text-xs font-mono text-white/80 outline-none placeholder-white/20"
            placeholder="#rrggbb"
          />
          <div
            class="h-6 w-6 shrink-0 rounded border border-white/20"
            style="background-color: {color};"
          ></div>
        </div>
      {/if}
    </div>
  </div>

  <div class="border-t border-white/8 px-5 py-3">
    <button
      onclick={save}
      class="w-full rounded-md bg-white/10 py-2 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.98]"
    >
      Guardar cambios
    </button>
  </div>

  <div class="border-t border-white/8 px-5 py-4">
    <p class="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/30">
      Acciones del slot
    </p>
    <div class="flex flex-col gap-1.5">
      <button
        onclick={() => handleAction(onClear)}
        class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4 shrink-0 text-white/40"
        >
          <path
            fill-rule="evenodd"
            d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 3.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
            clip-rule="evenodd"
          />
        </svg>
        Limpiar slot
        <span class="ml-auto text-[11px] text-white/30">Devuelve cards al pool</span>
      </button>

      <button
        onclick={() => handleAction(onAddAbove)}
        class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4 shrink-0 text-white/40"
        >
          <path
            d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
          />
        </svg>
        Añadir slot arriba
      </button>

      <button
        onclick={() => handleAction(onAddBelow)}
        class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4 shrink-0 text-white/40"
        >
          <path
            d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
          />
        </svg>
        Añadir slot abajo
      </button>
    </div>
  </div>

  <div class="border-t border-white/8 px-5 py-4">
    {#if !confirmDelete}
      <button
        onclick={handleDelete}
        class="flex w-full items-center gap-2.5 rounded-md border border-red-500/20 px-3 py-2 text-sm text-red-400/70 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4 shrink-0"
        >
          <path
            fill-rule="evenodd"
            d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 3.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
            clip-rule="evenodd"
          />
        </svg>
        Borrar slot
      </button>
    {:else}
      <div class="rounded-md border border-red-500/30 bg-red-500/10 p-3">
        <p class="mb-2.5 text-xs text-red-300">¿Borrar este slot? Los cards volverán al pool.</p>
        <div class="flex gap-2">
          <button
            onclick={() => (confirmDelete = false)}
            class="flex-1 rounded border border-white/10 py-1.5 text-xs text-white/60 transition hover:bg-white/8"
          >
            Cancelar
          </button>
          <button
            onclick={onDelete}
            class="flex-1 rounded bg-red-500 py-1.5 text-xs font-semibold text-white transition hover:bg-red-400"
          >
            Confirmar
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
