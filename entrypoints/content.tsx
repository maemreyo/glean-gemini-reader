import ReactDOM from 'react-dom/client';
import ThemeMenu from '../src/components/ThemeMenu';
import themeStyles from '../src/assets/styles.css?inline';

function getCurrentTheme(): string {
  const body = document.body;
  if (body.classList.contains('theme-sepia')) return 'sepia';
  if (body.classList.contains('theme-dark')) return 'dark';
  return 'light';
}

function injectStyles(): void {
  const existing = document.getElementById('gemini-reader-styles');
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = 'gemini-reader-styles';
  style.textContent = themeStyles;
  document.head.appendChild(style);
}

function applyThemeVariables(themeName: string): void {
  const root = document.documentElement;
  const body = document.body;

  // Remove existing theme classes
  body.classList.remove('theme-sepia', 'theme-dark');

  // Add new theme class
  if (themeName !== 'light') {
    body.classList.add(`theme-${themeName}`);
  }

  // Force reflow to ensure CSS variables are applied
  void body.offsetHeight;
}

function styleAngularComponent(): void {
  // CSS file already handles all styling via style injection
  // No additional JS styling needed - styles.css defines all rules
}

export default defineContentScript({
  matches: ['https://gemini.google.com/*'],
  cssInjectionMode: 'manual',

  async main(ctx): Promise<void> {
    console.log('[Gemini Reader] Initialized');

    injectStyles();
    applyThemeVariables('light');

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) {
            const panel = node.querySelector?.('deep-research-immersive-panel') ||
                          (node as Element).matches?.('deep-research-immersive-panel') ? node : null;
            if (panel) {
              console.log('[Gemini Reader] Deep Research panel detected');
              setTimeout(styleAngularComponent, 1000);
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const checkInterval = setInterval(() => {
      styleAngularComponent();
    }, 2000);

    ctx.addEventListener('unload', () => {
      observer.disconnect();
      clearInterval(checkInterval);
      document.getElementById('gemini-reader-styles')?.remove();
    });

    const ui = await createShadowRootUi(ctx, {
      name: 'gemini-reader-menu',
      position: 'overlay',
      anchor: 'body',
      append: 'last',
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(
          <ThemeMenu
            onThemeChange={(theme) => {
              applyThemeVariables(theme);
              styleAngularComponent();
            }}
          />
        );
        return { root };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
      },
    });

    ui.mount();
  },
});
