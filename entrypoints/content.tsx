import ReactDOM from 'react-dom/client';
import ThemeMenu from '@/components/ThemeMenu';
import { autoExpandSources } from '@/utils/autoClicker';
import '@/assets/styles.css';

export default defineContentScript({
  matches: ['https://gemini.google.com/*'],
  cssInjectionMode: 'ui',

  async main(ctx): Promise<void> {
    console.log('[Gemini Reader] Initialized');

    let interval: ReturnType<typeof setInterval>;

    const ui = await createShadowRootUi(ctx, {
      name: 'gemini-reader-menu',
      position: 'overlay',
      anchor: 'body',
      append: 'last',
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(<ThemeMenu />);
        interval = setInterval(autoExpandSources, 1500);
        return { root };
      },
      onRemove: (elements) => {
        clearInterval(interval);
        elements?.root.unmount();
      },
    });

    ui.mount();
  },
});
