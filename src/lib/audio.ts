const IMPACT_URL = "https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsnbbA0MFBEwi4ZKzYNLpRc1xlWyOGXngAU87D";
const WINNER_URL = "https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsBrl7p4bNV64s5bjuGWe37Ic8z19wEDvlqmRx";

const MAX_VOL = 0.5;
const WINNER_FADEIN_MS = 2000;

class AudioManager {
  private impact: HTMLAudioElement | null = null;
  private winner: HTMLAudioElement | null = null;
  private winnerFadeRaf: number | null = null;
  private ready = false;

  init(): void {
    if (this.ready) return;

    this.impact = new Audio(IMPACT_URL);
    this.impact.preload = "auto";
    this.impact.volume = 0;

    this.winner = new Audio(WINNER_URL);
    this.winner.preload = "auto";
    this.winner.volume = 0;

    this.impact.addEventListener("ended", () => {
      if (!this.winner) return;
      this.winner.currentTime = 0;
      this.winner.volume = 0;
      this.winner.play().catch(() => {});
      this.fadeIn(this.winner, WINNER_FADEIN_MS);
    });

    this.ready = true;
  }

  playImpact(): void {
    if (!this.impact) return;
    this.impact.currentTime = 0;
    this.impact.volume = MAX_VOL;
    this.impact.play().catch(() => {});
  }

  stop(): void {
    if (this.winnerFadeRaf !== null) {
      cancelAnimationFrame(this.winnerFadeRaf);
      this.winnerFadeRaf = null;
    }
    if (this.impact) {
      this.impact.pause();
      this.impact.currentTime = 0;
      this.impact.volume = 0;
    }
    if (this.winner) {
      this.winner.pause();
      this.winner.currentTime = 0;
      this.winner.volume = 0;
    }
  }

  private fadeIn(el: HTMLAudioElement, durationMs: number): void {
    if (this.winnerFadeRaf !== null) cancelAnimationFrame(this.winnerFadeRaf);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      el.volume = t * MAX_VOL;
      if (t < 1) {
        this.winnerFadeRaf = requestAnimationFrame(tick);
      } else {
        this.winnerFadeRaf = null;
      }
    };
    this.winnerFadeRaf = requestAnimationFrame(tick);
  }
}

export const audioManager = new AudioManager();
