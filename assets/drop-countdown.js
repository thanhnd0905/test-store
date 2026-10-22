/**
 * Counts down to `data-drop-at` (Unix seconds). At zero it sets `data-state="live"`,
 * which hides the banner and countdown and lets the product's add-to-cart controls show again
 * (see the style rule in sections/drop-countdown.liquid).
 */
class DropCountdown extends HTMLElement {
  /** @type {number | undefined} */
  #interval;

  connectedCallback() {
    this.dropAt = Number(this.dataset.dropAt) * 1000;
    if (!this.dropAt) return;

    this.#tick();
    this.#interval = window.setInterval(() => this.#tick(), 1000);
  }

  disconnectedCallback() {
    window.clearInterval(this.#interval);
  }

  #tick() {
    const remaining = Math.max(0, this.dropAt - Date.now());

    if (remaining === 0) {
      window.clearInterval(this.#interval);
      this.dataset.state = 'live';
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const parts = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };

    for (const [unit, value] of Object.entries(parts)) {
      const el = this.querySelector(`[data-unit="${unit}"]`);
      if (el) el.textContent = String(value).padStart(2, '0');
    }
  }
}

if (!customElements.get('drop-countdown')) {
  customElements.define('drop-countdown', DropCountdown);
}
