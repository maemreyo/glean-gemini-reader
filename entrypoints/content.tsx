import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
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

function App() {
  const [readingMode, setReadingMode] = useState(true);

  useEffect(() => {
    if (readingMode) {
      injectStyles();
    } else {
      document.getElementById('gemini-reader-styles')?.remove();
      document.body.classList.remove('theme-sepia', 'theme-dark', 'theme-light', 'theme-system');
    }
  }, [readingMode]);

  return (
    <ThemeMenu
      readingMode={readingMode}
      onToggleReadingMode={setReadingMode}
      onThemeChange={(theme) => {
        if (readingMode) {
          applyThemeVariables(theme);
          styleAngularComponent();
        }
      }}
    />
  );
}

export default defineContentScript({
  matches: ['https://gemini.google.com/*'],
  cssInjectionMode: 'manual',

  async main(ctx): Promise<void> {
    console.log('[Gemini Reader] Initialized');

    // Initial injection
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



    const ui = await createShadowRootUi(ctx, {
      name: 'gemini-reader-menu',
      position: 'overlay',
      anchor: 'body',
      append: 'last',
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
        return { root };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
      },
    });

    ui.mount();
  },
});
