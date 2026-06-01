<script lang="ts">
  const {
    onFactoryReset,
    onDarkraiMsg,
    onClear,
  }: {
    onFactoryReset: () => void;
    onDarkraiMsg: () => void;
    onClear: () => void;
  } = $props();
</script>

<div class="mb-4 flex items-center justify-between gap-2 mt-10">
  <div class="flex items-center gap-2">
    <button
      onclick={onFactoryReset}
      class="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-1.5 text-xs font-semibold text-red-400/80 transition hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-300 active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-3.5 w-3.5"
      >
        <path
          fill-rule="evenodd"
          d="M8 1a.75.75 0 0 1 .75.75v1.927a5.002 5.002 0 0 1 0 9.646v.927a.75.75 0 0 1-1.5 0v-.927a5.002 5.002 0 0 1 0-9.646V1.75A.75.75 0 0 1 8 1ZM5.5 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
          clip-rule="evenodd"
        />
      </svg>
      Reinicio de Fábrica
    </button>
  </div>

  <button
    onclick={onClear}
    class="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:bg-white/10 hover:text-white/80 active:scale-95"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="h-3.5 w-3.5"
    >
      <path
        d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
      />
    </svg>
    Limpiar
  </button>
</div>
