import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  alias: {
    '@': 'src',
  },
  srcDir: 'src',
  manifest: {
    name: 'Gemini Ultimate Reader',
    description: 'Beautiful reading mode for Gemini with theme switching',
    permissions: ['storage'],
    host_permissions: ['https://gemini.google.com/*'],
    browser_specific_settings: {
      gecko: {
        id: 'gemini-ultimate-reader@example.com',
        strict_min_version: '109.0',
      },
    },
  },
});
