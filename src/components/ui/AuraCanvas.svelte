<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  const { color }: { color: "green" | "red" } = $props();

  let canvas: HTMLCanvasElement;
  let raf: number;

  const DEBUG = false;

  const PALETTE = {
    green: { r: 74, g: 222, b: 128 },
    red: { r: 248, g: 113, b: 113 },
  };

  const W = 110;
  const H = 110;
  const CX = W / 2;
  const CY = H / 2;
  const MAX_RADIUS = 18;
  const MIN_RADIUS = 5;

  interface Particle {
    angle: number;
    dist: number;
    radius: number;
    alpha: number;
    speed: number;
    vr: number;
  }

  function spawn(): Particle {
    return {
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 4,
      radius: Math.random() * 8 + MIN_RADIUS,
      alpha: 0,
      speed: Math.random() * 0.12 + 0.05,
      vr: Math.random() * 0.12 + 0.06,
    };
  }

  onMount(() => {
    const ctx = canvas.getContext("2d")!;
    const { r, g, b } = PALETTE[color];

    const particles: Particle[] = Array.from({ length: 10 }, () => {
      const p = spawn();
      p.dist = Math.random() * MAX_RADIUS * 0.8;
      p.alpha = Math.random() * 0.3;
      return p;
    });

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.dist += p.speed;
        p.radius += p.vr;

        const t = p.dist / MAX_RADIUS;
        const peak = Math.sin(t * Math.PI);
        p.alpha = peak * 0.5;

        if (p.dist >= MAX_RADIUS) {
          Object.assign(p, spawn());
        }

        const x = CX + Math.cos(p.angle) * p.dist;
        const y = CY + Math.sin(p.angle) * p.dist;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, p.radius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${p.alpha})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${p.alpha * 0.25})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      if (DEBUG) {
        ctx.beginPath();
        ctx.arc(CX, CY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,0,0,0.9)";
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
  });

  onDestroy(() => {
    cancelAnimationFrame(raf);
  });
</script>

<canvas
  bind:this={canvas}
  width={W}
  height={H}
  class="absolute top-1/2 left-1/2"
  style="transform: translate(calc(-50%), -50%); width:{W}px; height:{H}px; pointer-events:none;"
></canvas>
