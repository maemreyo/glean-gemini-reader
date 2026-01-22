export function triggerClick(element: Element): void {
  const eventTypes = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'] as const;

  eventTypes.forEach((eventType) => {
    const event = new MouseEvent(eventType, {
      view: window,
      bubbles: true,
      cancelable: true,
      buttons: 1,
    });
    element.dispatchEvent(event);
  });
}

export function autoExpandSources(): void {
  const selector = 'sources-carousel-inline button[aria-label="Learn More"][aria-expanded="false"]';
  const buttons = document.querySelectorAll<HTMLButtonElement>(selector);

  buttons.forEach((btn) => {
    if (btn.offsetParent !== null) {
      let attempts = parseInt(btn.getAttribute('data-retry-count') || '0', 10);
      if (attempts >= 10) return;

      console.log(`[Gemini Reader] Auto-opening source... (${attempts + 1})`);

      btn.click();
      triggerClick(btn);

      btn.setAttribute('data-retry-count', (attempts + 1).toString());
    }
  });
}
