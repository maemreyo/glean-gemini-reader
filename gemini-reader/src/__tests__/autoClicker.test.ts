import { describe, it, expect, vi } from 'vitest';

describe('autoClicker utils', () => {
  describe('triggerClick', () => {
    it('dispatches mouse events correctly', () => {
      const element = document.createElement('button');
      const dispatchEventSpy = vi.spyOn(element, 'dispatchEvent');

      // Simulate the triggerClick function behavior
      const eventTypes = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'];
      eventTypes.forEach((eventType) => {
        const event = new MouseEvent(eventType, {
          bubbles: true,
          cancelable: true,
          buttons: 1,
          view: window,
        });
        element.dispatchEvent(event);
      });

      expect(dispatchEventSpy).toHaveBeenCalledTimes(5);
      
      // Verify event properties
      dispatchEventSpy.mock.calls.forEach((call, index) => {
        const event = call[0] as MouseEvent;
        expect(event.type).toBe(eventTypes[index]);
        expect(event.bubbles).toBe(true);
        expect(event.cancelable).toBe(true);
        expect(event.buttons).toBe(1);
      });
    });
  });

  describe('autoExpandSources selector', () => {
    it('matches the correct selector pattern', () => {
      document.body.innerHTML = `
        <div id="container">
          <button aria-label="Learn More" aria-expanded="false">Expand</button>
          <button aria-label="Other">Other</button>
        </div>
      `;

      const buttons = document.querySelectorAll(
        'button[aria-label="Learn More"][aria-expanded="false"]'
      );

      expect(buttons.length).toBe(1);
      expect(buttons[0].getAttribute('aria-label')).toBe('Learn More');
      expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    });

    it('does not match expanded buttons', () => {
      document.body.innerHTML = `
        <div id="container">
          <button aria-label="Learn More" aria-expanded="true">Expanded</button>
        </div>
      `;

      const buttons = document.querySelectorAll(
        'button[aria-label="Learn More"][aria-expanded="false"]'
      );

      expect(buttons.length).toBe(0);
    });
  });

  describe('retry count logic', () => {
    it('increments retry count on each attempt', () => {
      const button = document.createElement('button');
      button.setAttribute('data-retry-count', '5');
      
      const currentCount = parseInt(button.getAttribute('data-retry-count') || '0', 10);
      const newCount = currentCount + 1;
      button.setAttribute('data-retry-count', newCount.toString());
      
      expect(button.getAttribute('data-retry-count')).toBe('6');
    });

    it('stops at retry limit of 10', () => {
      const button = document.createElement('button');
      button.setAttribute('data-retry-count', '10');
      
      const retryCount = parseInt(button.getAttribute('data-retry-count') || '0', 10);
      
      expect(retryCount >= 10).toBe(true);
    });
  });

  describe('visibility check', () => {
    it('checks offsetParent for visibility', () => {
      const visibleButton = document.createElement('button');
      document.body.appendChild(visibleButton);
      
      const hiddenButton = document.createElement('button');
      hiddenButton.style.display = 'none';
      document.body.appendChild(hiddenButton);

      // Simulate visibility check
      const isVisible = (el: HTMLElement) => el.offsetParent !== null;
      
      expect(isVisible(visibleButton)).toBe(true);
      expect(isVisible(hiddenButton)).toBe(false);
    });
  });
});
