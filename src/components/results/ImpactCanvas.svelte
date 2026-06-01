<script lang="ts">
  interface Spark {
    angle: number;
    speed: number;
    r: number;
    isRed: boolean;
  }
  interface Slash {
    angle: number;
    startPct: number;
    color: string;
    width: number;
    delay: number;
    duration: number;
    len: number;
  }

  let canvas = $state<HTMLCanvasElement | null>(null);

  export function trigger(pctRed: number) {
    const el = canvas;
    if (!el) return;

    el.width = window.innerWidth;
    el.height = window.innerHeight;
    el.style.display = "block";

    const ctx = el.getContext("2d");
    if (!ctx) return;

    const c: CanvasRenderingContext2D = ctx;

    const W = el.width;
    const H = el.height;

    const cx = W * (pctRed / 100);

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const paddingTop = Math.max(3 * rem, H / 2 - 72);
    const cy = paddingTop + 72;

    const diag = Math.hypot(W, H);

    const slashes: Slash[] = [
      {
        angle: Math.PI / 4.5,
        startPct: -0.55,
        color: "255,220,80",
        width: 3.5,
        delay: 0,
        duration: 160,
        len: diag * 0.85,
      },
      {
        angle: -Math.PI / 4.5,
        startPct: -0.55,
        color: "180,220,255",
        width: 2.5,
        delay: 40,
        duration: 160,
        len: diag * 0.75,
      },
    ];

    const sparks: Spark[] = Array.from({ length: 48 }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: 90 + Math.random() * 260,
      r: 1.5 + Math.random() * 3.5,
      isRed: Math.random() < 0.5,
    }));

    const DURATION = 700;
    const FADE_START = 380;

    let rafId: number;
    const start = performance.now();

    function drawSlash(elapsed: number, sl: Slash, ga: number) {
      const local = elapsed - sl.delay;
      if (local < 0) return;

      const t = Math.min(local / sl.duration, 1);

      const totalTravel = (0.55 - sl.startPct) * sl.len;
      const headPos = sl.startPct * sl.len + totalTravel * t;
      const trailLen = sl.len * 0.3;
      const tailPos = headPos - trailLen;

      const fade = t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;
      const alpha = fade * ga;
      if (alpha <= 0.01) return;

      c.save();
      c.translate(cx, cy);
      c.rotate(sl.angle);

      const grad = c.createLinearGradient(tailPos, 0, headPos, 0);
      grad.addColorStop(0, `rgba(${sl.color},0)`);
      grad.addColorStop(0.4, `rgba(${sl.color},${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${sl.color},${alpha})`);

      c.beginPath();
      c.moveTo(tailPos, 0);
      c.lineTo(headPos, 0);
      c.strokeStyle = grad;
      c.lineWidth = sl.width;
      c.lineCap = "round";
      c.stroke();

      const glowGrad = c.createLinearGradient(tailPos, 0, headPos, 0);
      glowGrad.addColorStop(0, `rgba(${sl.color},0)`);
      glowGrad.addColorStop(1, `rgba(${sl.color},${alpha * 0.25})`);
      c.beginPath();
      c.moveTo(tailPos, 0);
      c.lineTo(headPos, 0);
      c.strokeStyle = glowGrad;
      c.lineWidth = sl.width * 5;
      c.stroke();

      c.restore();
    }

    function draw(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);
      const ga = elapsed < FADE_START ? 1 : 1 - (elapsed - FADE_START) / (DURATION - FADE_START);

      c.clearRect(0, 0, W, H);

      if (elapsed < 180) {
        const f = 1 - elapsed / 180;
        c.fillStyle = `rgba(255,245,200,${f * 0.32})`;
        c.fillRect(0, 0, W, H);
      }

      for (const sl of slashes) drawSlash(elapsed, sl, ga);

      if (elapsed > 20) {
        const se = elapsed - 20;
        for (const sp of sparks) {
          const dist = sp.speed * se * 0.001;
          const px = cx + Math.cos(sp.angle) * dist;
          const py = cy + Math.sin(sp.angle) * dist;
          const pa = Math.max(0, 1 - se / 560) * ga;
          if (pa <= 0.01) continue;
          const sr = sp.r * Math.max(0, 1 - se / 600);
          if (sr <= 0) continue;
          c.beginPath();
          c.arc(px, py, sr, 0, Math.PI * 2);
          c.fillStyle = sp.isRed ? `rgba(255,110,50,${pa})` : `rgba(80,160,255,${pa})`;
          c.fill();
        }
      }

      if (t < 1) {
        rafId = requestAnimationFrame(draw);
      } else {
        c.canvas.style.display = "none";
      }
    }

    rafId = requestAnimationFrame(draw);
  }
</script>

<canvas bind:this={canvas} class="impact-canvas" aria-hidden="true"></canvas>

<style>
  .impact-canvas {
    display: none;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  }
</style>
