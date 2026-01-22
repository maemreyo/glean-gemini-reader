import ReactDOM from 'react-dom/client';
import ThemeMenu from '@/components/ThemeMenu';
import { autoExpandSources } from '@/utils/autoClicker';
import '@/assets/styles.css';

export default defineContentScript({
  matches: ['https://gemini.google.com/*'],
  cssInjectionMode: 'ui',

  async main(ctx): Promise<void> {
    console.log('[Gemini Reader] Initialized');

    let clickerInterval: ReturnType<typeof setInterval> | undefined;

    const ui = await createShadowRootUi(ctx, {
      name: 'gemini-reader-menu',
      position: 'overlay',
      anchor: 'body',
      append: 'last',
      onMount: (container: HTMLElement) => {
        const root = ReactDOM.createRoot(container);
        root.render(<ThemeMenu />);
        clickerInterval = setInterval(autoExpandSources, 1500);
        return { root };
      },
      onRemove: (elements?: { root: ReturnType<typeof ReactDOM.createRoot> }) => {
        if (clickerInterval !== undefined) {
          clearInterval(clickerInterval);
        }
        elements?.root.unmount();
      },
    });

    await ui.mount();
  },
});
