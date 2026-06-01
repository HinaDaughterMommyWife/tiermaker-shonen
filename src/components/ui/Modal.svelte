<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { portal } from "../../lib/portal";
  import type { Snippet } from "svelte";

  let {
    open = $bindable(false),
    title = "",
    children,
  }: {
    open: boolean;
    title?: string;
    children: Snippet;
  } = $props();

  function close() {
    open = false;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }

  // Lock body scroll when open
  $effect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  });
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
  <div use:portal>
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      transition:fade={{ duration: 150 }}
    >
      <div class="absolute inset-0 bg-black/70" onclick={close} aria-hidden="true"></div>

      <!-- Panel -->
      <div
        class="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e] shadow-2xl"
        transition:scale={{ duration: 150, start: 0.96 }}
      >
        <!-- Header -->
        {#if title}
          <div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 class="text-sm font-semibold tracking-wide text-white">{title}</h2>
            <button
              onclick={close}
              class="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-4 w-4"
              >
                <path
                  d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
                />
              </svg>
            </button>
          </div>
        {/if}

        <!-- Content -->
        <div class="modal-scroll max-h-[80vh] overflow-y-auto">
          {@render children()}
        </div>
      </div>
    </div>
  </div>
{/if}
