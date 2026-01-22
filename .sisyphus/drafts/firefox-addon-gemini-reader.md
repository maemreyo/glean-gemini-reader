# Draft: FirefoxAddon-GeminiReader-WXT

## Requirements (confirmed)
- User wants to build a Firefox addon called "Gemini Ultimate Reader"
- Uses WXT framework with React
- Target website: gemini.google.com
- Features: Theme switching (Light/Sepia/Dark), auto-expand sources, clean reading mode
- Follows idea.md specification with CSS Stylus conversion to CSS

## Technical Decisions (from research)
- **Framework**: WXT (latest) with React template
- **CSS Approach**: `cssInjectionMode: 'ui'` with `createShadowRootUi` for isolated styling
- **UI Library**: React (via `@wxt-dev/module-react` or manual Vite React plugin)
- **State Management**: localStorage for theme persistence
- **Content Script**: content.tsx entrypoint with defineContentScript

## Research Findings

### WXT Framework Patterns (from bg_a1f3c086)
**Project Structure:**
- File-based routing: `entrypoints/` directory
- Content scripts use `.content` suffix: `entrypoints/content.content/`
- Support for `src/` directory via `srcDir: 'src'` config
- Related files grouped in subdirectories

**Content Script Implementation:**
```typescript
export default defineContentScript({
  matches: ['https://gemini.google.com/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'gemini-theme-menu',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(<ThemeMenu />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });
    ui.mount();
  },
});
```

**Build Commands:**
- `wxt build -b firefox` for Firefox
- `wxt build -b chrome` for Chrome
- `npm run dev:firefox` for development

**Configuration (wxt.config.ts):**
```typescript
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Gemini Ultimate Reader',
    permissions: ['storage'],
    host_permissions: ['https://gemini.google.com/*'],
  },
});
```

### Firefox Addon Requirements (from bg_a5c03a2c)
**Manifest V3 Requirements:**
- Required keys: manifest_version, name, version, description
- Firefox-specific: browser_specific_settings with gecko.id
- Firefox supports Manifest V3 from version 109

**Submission Process:**
- Create Mozilla account at addons.mozilla.org
- Package as .zip file (no root directory)
- Review timeline: 3-5 business days initial

**Permissions Pattern:**
```json
{
  "permissions": ["storage"],
  "host_permissions": ["https://gemini.google.com/*"],
  "content_scripts": [{
    "matches": ["https://gemini.google.com/*"],
    "js": ["content.js"],
    "run_at": "document_idle"
  }]
}
```

**Icon Requirements:**
- 32x32px minimum, 128x128px recommended
- PNG format preferred

**Common Rejections:**
- Missing privacy policy
- Overly broad permissions
- Inaccurate descriptions

## Open Questions (for user clarification)
1. Should this also build for Chrome (not just Firefox)?
2. Should this be published to Mozilla Add-ons Store?
3. Any specific icons or branding requirements?
4. Privacy policy needed for store submission?
5. Testing preference: TDD with tests, or manual verification?

## Scope Boundaries
- **INCLUDED**: WXT project setup, theme switching, auto-expand sources, CSS styling, Firefox build
- **EXCLUDED**: Chrome build (unless specified), backend server, user accounts

---

## Research Status: COMPLETE
All three background research tasks have completed successfully.

