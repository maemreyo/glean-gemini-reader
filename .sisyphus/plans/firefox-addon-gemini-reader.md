# Work Plan: Firefox Addon "Gemini Ultimate Reader" với WXT + React 19

## Context

### Original Request
Xây dựng Firefox addon "Gemini Ultimate Reader" sử dụng WXT framework với React 19. Target: gemini.google.com. Features: Theme switching (Light/Sepia/Dark + System), auto-expand sources, clean reading mode với WCAG 2.1 AA accessibility. Build cho Firefox và prepare cho Mozilla Add-ons Store submission.

### Interview Summary
**Key Discussions:**
- React 19 được yêu cầu (không phải React 18 mặc định)
- Chỉ build cho Firefox (không cần Chrome)
- Thêm System theme option (tự động theo OS theme)
- Full accessibility (WCAG 2.1 AA) cho Mozilla review
- Tests sau khi implement (không phải TDD)
- Include Mozilla Store prep (icons, privacy policy, zip packaging)

**Research Findings:**
- `@wxt-dev/module-react` v1.1.5 hỗ trợ React 19
- System theme dùng `window.matchMedia('(prefers-color-scheme: dark)')`
- Accessibility: keyboard navigation, ARIA labels, focus management trong shadow DOM
- Privacy policy: simple statement về không thu thập data
- Build: `wxt build -b firefox`

### Metis Review
**Identified Gaps (addressed):**
- React 19 compatibility → Verified với @wxt-dev/module-react
- Chrome build removed → Focus Firefox only
- System theme → Thêm `window.matchMedia` detection
- WCAG compliance → Full keyboard nav, ARIA, focus indicators
- Privacy policy → Simple template included

---

## Work Objectives

### Core Objective
Tạo Firefox addon "Gemini Ultimate Reader" với WXT + React 19, features: theme switching (Light/Sepia/Dark/System), auto-expand sources, clean reading mode, WCAG 2.1 AA accessibility, và prepare cho Mozilla Add-ons Store submission.

### Concrete Deliverables
- WXT project với React 19 template
- Theme menu component (floating button với 4 options)
- Auto-expand sources functionality (interval-based)
- CSS styling cho clean reading mode (từ idea.md)
- Accessibility: keyboard nav, ARIA, focus management
- Firefox build output (.zip)
- Store prep: icons (32/48/128px PNG), privacy policy
- Unit tests (sau implementation)

### Definition of Done
- [ ] Theme switching hoạt động đúng (Light/Sepia/Dark/System)
- [ ] Auto-expand sources triggers tự động trong 2 giây
- [ ] Clean reading mode CSS áp dụng đúng
- [ ] Keyboard navigation hoạt động (Tab, Escape, Arrow keys)
- [ ] ARIA labels và roles đầy đủ
- [ ] Focus indicators visible
- [ ] `wxt build -b firefox` thành công
- [ ] Icons đầy đủ (32/48/128px PNG)
- [ ] Privacy policy file tồn tại
- [ ] Tests thành công

### Must Have
- WXT project với React 19
- ThemeMenu component với 4 themes
- Auto-expand sources functionality
- Clean reading CSS (từ idea.md)
- WCAG 2.1 AA accessibility
- Firefox build output
- Icons (32/48/128px PNG)
- Privacy policy
- Unit tests

### Must NOT Have (Guardrails)
- NO Chrome build (chỉ Firefox như yêu cầu)
- NO external API calls (localStorage only)
- NO tracking/analytics
- NO backend server
- NO user accounts
- NO cloud sync
- NO export features
- NO additional dependencies beyond WXT + React 19

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: [TO CHECK - will verify in first task]
- **User wants tests**: YES (tests after implementation)
- **Framework**: [TO DECIDE based on existing infra]

### If Manual QA Only

**For WXT Extension:**
- Run: `npm run dev:firefox` → Firefox opens with extension loaded
- Navigate to: `https://gemini.google.com/`
- Verify: Theme menu appears as floating button
- Click each theme → Background changes correctly
- Test system theme → Changes with OS theme
- Trigger auto-expand → Sources expand within 2 seconds
- Keyboard test: Tab to menu, Enter to select, Escape to close
- Console: No errors in DevTools console

**For Build:**
- Run: `wxt build -b firefox`
- Verify: `.output/` contains `gemini-reader-*.zip`
- Unzip và load trong Firefox → Extension hoạt động

---

## Task Flow

```
1. Setup WXT Project (React 19)
     ↓
2. Configure WXT + React 19
     ↓
3. Create ThemeMenu Component
     ↓
4. Create Auto-Clicker Utility
     ↓
5. Create Content Script Entry
     ↓
6. Implement CSS Styling
     ↓
7. Add Accessibility Features
     ↓
8. Add System Theme Detection
     ↓
9. Create Icons
     ↓
10. Create Privacy Policy
     ↓
11. Build Firefox Output
     ↓
12. Write Unit Tests
     ↓
13. Final Verification
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 9, 10 | Independent assets |
| B | 2, 3, 4 | Dependencies: config → components |

| Task | Depends On | Reason |
|------|------------|--------|
| 3 | 2 | Needs React config first |
| 4 | 2 | Needs utils setup |
| 5 | 3, 4, 6 | Content script imports all |
| 7 | 3 | Accessibility in component |
| 8 | 3 | System theme in component |
| 11 | 1-10 | Needs all code ready |
| 12 | 1-10 | Tests all features |
| 13 | 11, 12 | Final check |

---

## TODOs

> Implementation + Test = ONE Task. Specify parallelizability for EVERY task.

- [ ] 1. Setup WXT Project với React 19 Template

  **What to do:**
  - Run `npx wxt@latest init .`
  - Select React template
  - cd và chạy `npm install`
  - Upgrade to React 19: `npm install react@19 react-dom@19`
  - Install WXT React module: `npm i -D @wxt-dev/module-react`

  **Must NOT do:**
  - NO Chrome template selection

  **Parallelizable**: NO (foundational setup)

  **References:**

  **Pattern References:**
  - `wxt-dev/examples` - WXT official patterns for project setup
  - `ongkay/WXT-Mantine-Tailwind-Browser-Extension` - React template structure

  **Documentation References:**
  - WXT docs: `https://wxt.dev/` - Official documentation
  - WXT React module: `@wxt-dev/module-react` for React 19 integration

  **External References:**
  - Official WXT React template: `npx wxt@latest init --template react`
  - React 19 install: `npm install react@19 react-dom@19`

  **Acceptance Criteria:**
  - [ ] Command: `npx wxt@latest init  --template react`
  - [ ] Command: `npm install`
  - [ ] Command: `npm install react@19 react-dom@19`
  - [ ] Command: `npm install -D @wxt-dev/module-react`
  - [ ] Verify: `package.json` has `"react": "^19.0.0"`, `"react-dom": "^19.0.0"`
  - [ ] Verify: `wxt.config.ts` has `modules: ['@wxt-dev/module-react']`

  **Evidence Required:**
  - [ ] Screenshot of terminal showing successful project creation
  - [ ] Screenshot of `package.json` with React 19 versions
  - [ ] Screenshot of `wxt.config.ts` with React module

  **Commit**: YES
  - Message: `feat: initialize WXT project with React 19`
  - Files: `package.json`, `wxt.config.ts`, initial project files

- [ ] 2. Configure WXT + React 19 Integration

  **What to do:**
  - Update `wxt.config.ts`:
    - Add `modules: ['@wxt-dev/module-react']`
    - Configure `manifest` with name, permissions, host_permissions
    - Add `browser_specific_settings` cho Firefox
    - Configure `alias: {'@': 'src'}`
  - Update `package.json` scripts nếu cần

  **Must NOT do:**
  - NO Chrome browser target (Firefox only)

  **Parallelizable**: NO (depends on task 1)

  **References:**

  **Pattern References:**
  - `wxt-dev/examples/wxt.config.ts` - Official config patterns
  - WXT docs: `https://wxt.dev/guide/config.html` - Configuration reference

  **API/Type References:**
  - WXT manifest config: `manifest: { name, permissions, host_permissions }`
  - Firefox settings: `browser_specific_settings: { gecko: { id, strict_min_version } }`

  **Documentation References:**
  - WXT React module: `@wxt-dev/module-react` config options
  - Firefox manifest V3: `browser_specific_settings` requirements

  **External References:**
  - WXT config docs: `https://wxt.dev/guide/config.html`
  - React 19 release: `https://react.dev/blog/2024/12/05/react-19`

  **Acceptance Criteria:**
  - [ ] `wxt.config.ts` has:
    ```typescript
    export default defineConfig({
      modules: ['@wxt-dev/module-react'],
      alias: { '@': 'src' },
      manifest: {
        name: 'Gemini Ultimate Reader',
        description: 'Beautiful reading mode for Gemini with theme switching',
        permissions: ['storage'],
        host_permissions: ['https://gemini.google.com/*'],
      },
      browser_specific_settings: {
        gecko: {
          id: 'gemini-ultimate-reader@example.com',
          strict_min_version: '109.0',
        },
      },
    })
    ```
  - [ ] Command: `wxt --version` → Shows version info
  - [ ] Command: `wxt build -b firefox --dry-run` → No errors

  **Evidence Required:**
  - [ ] Copy of complete `wxt.config.ts` file
  - [ ] Terminal output showing config validation

  **Commit**: YES
  - Message: `feat: configure WXT with React 19 and Firefox manifest`
  - Files: `wxt.config.ts`

- [ ] 3. Create ThemeMenu React Component

  **What to do:**
  - Create `src/components/ThemeMenu.tsx`
  - Features:
    - 4 theme options: Light ☀️, Sepia 📖, Dark 🌙, System 🖥️
    - localStorage persistence
    - localStorage key: `gemini-reader-theme`
    - Default: `theme-system`
    - System theme detection: `window.matchMedia('(prefers-color-scheme: dark)')`
    - Listen for system theme changes
    - Floating button: fixed position bottom-right, z-index cao
    - Ripple/hover effects
    - Active state indicator
  - Accessibility:
    - `aria-label` on button
    - `aria-expanded` state
    - `role="menu"` or `role="dialog"`
    - `tabindex="0"` for keyboard focus
    - Keyboard: Escape to close, Arrow keys to navigate

  **Must NOT do:**
  - NO analytics or tracking
  - NO external API calls

  **Parallelizable**: NO (depends on task 2)

  **References:**

  **Pattern References:**
  - `ongkay/WXT-Mantine-Tailwind-Browser-Extension/components/` - React component patterns
  - `wxt-dev/examples` - createShadowRootUi patterns
  - `bg_6b5c7474` - Accessibility patterns for shadow DOM

  **API/Type References:**
  - React hooks: `useState`, `useEffect`, `useCallback`
  - localStorage API: `localStorage.getItem/setItem`
  - matchMedia: `window.matchMedia('(prefers-color-scheme: dark)')`

  **Documentation References:**
  - React 19 hooks: `https://react.dev/reference/react`
  - WCAG 2.1 AA: keyboard nav, ARIA labels, focus management

  **External References:**
  - System theme detection: `bg_1d7f44e5` - window.matchMedia patterns
  - Accessibility: `bg_6b5c7474` - keyboard nav, ARIA, focus patterns

  **Acceptance Criteria:**
  - [ ] File: `src/components/ThemeMenu.tsx` exists
  - [ ] Component renders 4 theme buttons
  - [ ] Clicking changes theme (localStorage updated)
  - [ ] System theme follows OS preference
  - [ ] System theme change listener works
  - [ ] Button positioned: bottom: 24px, right: 24px
  - [ ] z-index: 2147483647 (topmost)
  - [ ] Button has visual ripple/hover effect
  - [ ] Active theme has border/styling
  - [ ] Keyboard: Tab reaches button
  - [ ] Keyboard: Enter/Space selects theme
  - [ ] Keyboard: Escape closes menu
  - [ ] Keyboard: Arrow keys navigate themes
  - [ ] aria-label: "Theme selector"
  - [ ] aria-expanded: toggles correctly
  - [ ] role: "menu" or "dialog"
  - [ ] tabindex: "0" on menu items
  - [ ] Focus visible: 2px solid outline

  **Evidence Required:**
  - [ ] Screenshot of theme menu on gemini.google.com
  - [ ] Terminal output: no TypeScript errors
  - [ ] Console: no React warnings

  **Commit**: YES
  - Message: `feat: add ThemeMenu component with 4 themes and accessibility`
  - Files: `src/components/ThemeMenu.tsx`

- [ ] 4. Create Auto-Clicker Utility

  **What to do:**
  - Create `src/utils/autoClicker.ts`
  - Features:
    - `triggerClick(element: Element)` - Nuclear click simulation
    - `autoExpandSources()` - Auto-expand sources carousel
    - Selector: `sources-carousel-inline button[aria-label="Learn More"][aria-expanded="false"]`
    - Retry logic: max 10 attempts per button
    - Interval: check every 1.5 seconds
    - Visibility check: `(btn as HTMLElement).offsetParent !== null`

  **Must NOT do:**
  - NO external dependencies

  **Parallelizable**: NO (depends on task 2)

  **References:**

  **Pattern References:**
  - idea.md: `utils/autoClicker.ts` - Original implementation
  - `bg_82beb64e` - Similar extension patterns

  **API/Type References:**
  - MouseEvent: `new MouseEvent(eventType, { bubbles, cancelable, buttons, view })`
  - querySelectorAll: `document.querySelectorAll(selector)`
  - getAttribute/setAttribute for retry tracking

  **Documentation References:**
  - MouseEvent: `https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent`

  **Acceptance Criteria:**
  - [ ] File: `src/utils/autoClicker.ts` exists
  - [ ] Function: `triggerClick(element)` triggers all pointer/mouse events
  - [ ] Function: `autoExpandSources()` finds and clicks sources
  - [ ] Selector matches: `sources-carousel-inline button[aria-label="Learn More"][aria-expanded="false"]`
  - [ ] Retry count limits to 10 attempts
  - [ ] Visibility check: offsetParent !== null
  - [ ] Console log: `[Gemini Reader] Auto-opening source...`

  **Evidence Required:**
  - [ ] Terminal: no TypeScript errors
  - [ ] Console: verification logs when sources auto-expand

  **Commit**: YES
  - Message: `feat: add auto-clicker utility for source expansion`
  - Files: `src/utils/autoClicker.ts`

- [ ] 5. Create Content Script Entry Point

  **What to do:**
  - Create `src/entrypoints/content.tsx`
  - Features:
    - `defineContentScript` with:
      - `matches: ['https://gemini.google.com/*']`
      - `cssInjectionMode: 'ui'`
    - Mount ThemeMenu using `createShadowRootUi`:
      - `name: 'gemini-reader-menu'`
      - `position: 'overlay'`
      - `anchor: 'body'`
      - `append: 'last'`
    - Start auto-clicker interval (1.5 seconds)
    - Cleanup on unmount: clear interval
  - Import:
    - `@/assets/styles.css` (CSS injection)
    - `ThemeMenu` component
    - `autoExpandSources` function

  **Must NOT do:**
  - NO Chrome-specific code
  - NO manifest v2 references

  **Parallelizable**: NO (depends on tasks 3, 4)

  **References:**

  **Pattern References:**
  - `wxt-dev/examples/entrypoints/` - Content script patterns
  - WXT docs: `createShadowRootUi` usage
  - `bg_82beb64e` - Real-world content script examples

  **API/Type References:**
  - `defineContentScript`: matches, cssInjectionMode, main
  - `createShadowRootUi`: ctx, name, position, anchor, onMount, onRemove
  - `setInterval`/`clearInterval` for auto-clicker

  **Documentation References:**
  - WXT content scripts: `https://wxt.dev/guide/content-scripts.html`
  - WXT UI injection: `https://wxt.dev/guide/ui-injection.html`

  **External References:**
  - WXT content script docs: `https://wxt.dev/guide/content-scripts.html`
  - ReactDOM.createRoot: `https://react.dev/reference/react-dom/client/createRoot`

  **Acceptance Criteria:**
  - [ ] File: `src/entrypoints/content.tsx` exists
  - [ ] Content script runs on: `https://gemini.google.com/*`
  - [ ] CSS injection mode: 'ui'
  - [ ] Shadow root UI created with name: 'gemini-reader-menu'
  - [ ] ThemeMenu mounted to shadow DOM
  - [ ] Auto-clicker interval: 1500ms
  - [ ] Interval cleared on unmount
  - [ ] Console log: `[Gemini Reader] Initialized`
  - [ ] No memory leaks (proper cleanup)

  **Evidence Required:**
  - [ ] Terminal: no TypeScript errors
  - [ ] Console: `[Gemini Reader] Initialized` log on gemini.google.com
  - [ ] Screenshot: Theme menu visible on page

  **Commit**: YES
  - Message: `feat: add content script entry point with UI injection`
  - Files: `src/entrypoints/content.tsx`

- [ ] 6. Implement CSS Styling

  **What to do:**
  - Create `src/assets/styles.css`
  - Features từ idea.md:
    - CSS variables for themes: `--bg-page`, `--bg-paper`, `--text-main`, v.v.
    - Theme classes: `theme-light`, `theme-sepia`, `theme-dark`
    - Typography: Merriweather/Georgia for body, Segoe UI for headings
    - Table styling: proper borders, header background
    - Source carousel styling: compact, minimal
    - Print styles: `@media print` for PDF export
  - Z-index fixes:
    - `deep-research-immersive-panel`: z-index: 9000
    - Theme menu: z-index: 2147483647
  - Hide unwanted elements:
    - toolbar, create-button-container, close-button
    - action-buttons, thinking-panel
    - response-container-footer, source-footnote

  **Must NOT do:**
  - NO Stylus syntax (convert to standard CSS)
  - NO duplicate or conflicting styles

  **Parallelizable**: NO (depends on task 2)

  **References:**

  **Pattern References:**
  - idea.md: `assets/styles.css` - Original CSS Stylus
  - `bg_82beb64e` - CSS patterns for extensions

  **Documentation References:**
  - CSS custom properties: `https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties`
  - Print styles: `@media print` pattern

  **External References:**
  - Original idea.md CSS sections 1-6

  **Acceptance Criteria:**
  - [ ] File: `src/assets/styles.css` exists
  - [ ] CSS variables defined for: bg-page, bg-paper, text-main, text-heading, text-sub, accent-color, link-bg, link-border, link-text, shadow, table-header, table-border
  - [ ] Theme classes: body.theme-light, body.theme-sepia, body.theme-dark
  - [ ] Typography: Merriweather/Georgia body, Segoe UI headings
  - [ ] Tables: proper styling with borders and headers
  - [ ] Sources: compact list style
  - [ ] Print: @media print removes menu and shadows
  - [ ] Panel z-index: 9000
  - [ ] Menu z-index: 2147483647
  - [ ] Unwanted elements hidden (toolbar, buttons, etc.)

  **Evidence Required:**
  - [ ] Terminal: no CSS errors
  - [ ] Screenshot: Clean reading mode on gemini.google.com
  - [ ] Screenshot: Theme switching works (Light/Sepia/Dark)

  **Commit**: YES
  - Message: `feat: add CSS styling for clean reading mode`
  - Files: `src/assets/styles.css`

- [ ] 7. Add Full Accessibility Features

  **What to do:**
  - Update `src/components/ThemeMenu.tsx`:
    - Keyboard navigation:
      - Tab: reach menu
      - Enter/Space: select theme
      - Escape: close menu
      - Arrow keys: navigate themes (circular)
      - Tab: exit menu (close)
    - ARIA attributes:
      - aria-label on container: "Theme selector menu"
      - aria-expanded on toggle button
      - aria-controls linking button to menu
      - role="menu" on container
      - role="menuitem" on buttons
    - Focus management:
      - Focus visible styles (2px solid outline)
      - Focus trap in menu (can't tab outside)
      - Return focus to trigger on close
    - Screen reader:
      - aria-live region for theme change announcement
      - Clear labels on each theme option

  **Must NOT do:**
  - NO aria-hidden on interactive elements

  **Parallelizable**: NO (depends on task 3)

  **References:**

  **Pattern References:**
  - `bg_6b5c7474` - Accessibility patterns for WXT extensions
  - WCAG 2.1 AA requirements

  **API/Type References:**
  - addEventListener('keydown', handler)
  - element.focus()
  - element.setAttribute()

  **Documentation References:**
  - WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
  - ARIA roles: https://www.w3.org/TR/wai-aria-1.2/#role_definitions
  - Keyboard navigation: https://www.w3.org/TR/wai-aria-practices-1.2/#aria_ex

  **External References:**
  - `bg_6b5c7474` - Full code examples for accessibility

  **Acceptance Criteria:**
  - [ ] Keyboard: Tab reaches theme button
  - [ ] Keyboard: Enter selects theme
  - [ ] Keyboard: Space selects theme
  - [ ] Keyboard: Escape closes menu
  - [ ] Keyboard: Arrow Down navigates to next theme
  - [ ] Keyboard: Arrow Up navigates to previous theme
  - [ ] Keyboard: Tab exits menu (closes)
  - [ ] Focus visible: 2px solid outline, color: high contrast
  - [ ] aria-label: "Theme selector, current: Dark"
  - [ ] aria-expanded: true/false toggles
  - [ ] aria-controls: links button to menu
  - [ ] role: "menu" on container
  - [ ] role: "menuitem" on theme buttons
  - [ ] Focus returns to button on Escape
  - [ ] No focus trap (can exit menu)

  **Evidence Required:**
  - [ ] Manual test: All keyboard navigation works
  - [ ] Screenshot: Focus visible on theme button
  - [ ] Screenshot: Focus visible on menu item

  **Commit**: YES
  - Message: `feat: implement WCAG 2.1 AA accessibility features`
  - Files: `src/components/ThemeMenu.tsx`

- [ ] 8. Add System Theme Detection

  **What to do:**
  - Update `src/components/ThemeMenu.tsx`:
    - Add `theme-system` option
    - On mount: detect current system theme
    - Listen for system theme changes: `window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handler)`
    - Apply system theme when active
    - localStorage value: `theme-system`
    - Toggle between system themes when active
    - Visual indicator: 🖥️ icon for  **Must NOT do:**
  - system

 NO polling (use event listener)

  **Parallelizable**: NO (depends on task 3)

  **References:**

  **Pattern References:**
  - `bg_1d7f44e5` - System theme detection patterns
  - WXT extension examples

  **API/Type References:**
  - `window.matchMedia('(prefers-color-scheme: dark)').matches`
  - `mediaQuery.addEventListener('change', (event) => { event.matches })`

  **Documentation References:**
  - matchMedia: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
  - prefers-color-scheme: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme

  **External References:**
  - `bg_1d7f44e5` - Complete code examples

  **Acceptance Criteria:**
  - [ ] Theme option: "System" with 🖥️ icon
  - [ ] On load: Detects correct system theme (dark/light)
  - [ ] When active: Follows system theme changes
  - [ ] Switch from Dark OS to Light OS → Theme updates immediately
  - [ ] localStorage: stores `theme-system`
  - [ ] Visual: System option has different icon
  - [ ] Console: No errors from matchMedia

  **Evidence Required:**
  - [ ] Screenshot: System theme option visible
  - [ ] Manual test: Change OS theme, extension updates
  - [ ] Console: Theme change logs

  **Commit**: YES
  - Message: `feat: add system theme detection with prefers-color-scheme`
  - Files: `src/components/ThemeMenu.tsx`

- [ ] 9. Create Extension Icons

  **What to do:**
  - Create icons directory: `src/assets/icons/`
  - Generate PNG icons:
    - `icon-16.png` (16x16px)
    - `icon-32.png` (32x32px)
    - `icon-48.png` (48x48px)
    - `icon-64.png` (64x64px)
    - `icon-96.png` (96x96px)
    - `icon-128.png` (128x128px)
  - Design: Simple, recognizable icon for "Gemini Reader"
  - Format: PNG (lossless, supports transparency)
  - Update `wxt.config.ts` to reference icons

  **Must NOT do:**
  - NO JPEG or WebP format (PNG required)
  - NO oversized files

  **Parallelizable**: YES (with task 10)

  **References:**

  **Documentation References:**
  - Mozilla icon requirements: 32x32 minimum, 128x128 recommended
  - WXT manifest icons: https://wxt.dev/guide/manifest.html#icons

  **External References:**
  - `bg_a5c02a3c` - Firefox icon requirements

  **Acceptance Criteria:**
  - [ ] Directory: `src/assets/icons/` exists
  - [ ] File: `icon-16.png` (16x16px, PNG)
  - [ ] File: `icon-32.png` (32x32px, PNG)
  - [ ] File: `icon-48.png` (48x48px, PNG)
  - [ ] File: `icon-128.png` (128x128px, PNG)
  - [ ] All icons: PNG format, transparent background
  - [ ] Icons: Simple, recognizable design
  - [ ] Config: `wxt.config.ts` references icons

  **Evidence Required:**
  - [ ] Screenshot: All icon files in directory
  - [ ] File sizes: Verify reasonable (under 50KB each)
  - [ ] Screenshot: Icons displayed correctly in Firefox

  **Commit**: YES
  - Message: `feat: add extension icons for Firefox`
  - Files: `src/assets/icons/*`

- [ ] 10. Create Privacy Policy Document

  **What to do:**
  - Create `src/assets/privacy-policy.md`
  - Content:
    - Extension name and description
    - Data collection: "This extension does not collect or share any personal data"
    - Permissions: storage (local theme preference only)
    - Third-party sharing: None
    - Cookies: None
    - Analytics: None
    - Contact: your-email@example.com
    - Effective date
  - Format: Markdown
  - Location: `src/assets/privacy-policy.md` or `docs/privacy-policy.md`

  **Must NOT do:**
  - NO mention of data collection (extension doesn't collect any)
  - NO third-party services mentioned

  **Parallelizable**: YES (with task 9)

  **References:**

  **Documentation References:**
  - Mozilla privacy policy requirements: https://addons.mozilla.org/policies/privacy
  - `bg_023b67fb` - Research on privacy policy requirements

  **External References:**
  - Mozilla Developer Hub privacy guidelines

  **Acceptance Criteria:**
  - [ ] File: `src/assets/privacy-policy.md` exists
  - [ ] Contains: Extension name and description
  - [ ] Contains: "does not collect or share any personal data"
  - [ ] Contains: Permissions explanation (storage only)
  - [ ] Contains: No third-party sharing
  - [ ] Contains: No cookies, no analytics
  - [ ] Contains: Contact email placeholder
  - [ ] Contains: Effective date
  - [ ] Length: 1 page (300-500 words)

  **Evidence Required:**
  - [ ] Copy of complete privacy policy document
  - [ ] Word count verification

  **Commit**: YES
  - Message: `docs: add privacy policy for Mozilla submission`
  - Files: `src/assets/privacy-policy.md`

- [ ] 11. Build Firefox Output

  **What to do:**
  - Run Firefox development: `npm run dev:firefox`
  - Verify extension loads correctly
  - Run production build: `wxt build -b firefox`
  - Verify output in `.output/`:
    - `gemini-reader-*.zip` file
    - Contains manifest.json
    - Contains all entrypoints
  - Test zip in temporary Firefox profile

  **Must NOT do:**
  - NO Chrome build output

  **Parallelizable**: NO (depends on tasks 1-10)

  **References:**

  **Documentation References:**
  - WXT build: `wxt build -b firefox`
  - `bg_a5c02a3c` - Firefox build requirements

  **External References:**
  - WXT build docs: https://wxt.dev/guide/build.html

  **Acceptance Criteria:**
  - [ ] Command: `npm run dev:firefox` → Firefox opens
  - [ ] Extension: Theme menu visible on gemini.google.com
  - [ ] Command: `wxt build -b firefox` → Success
  - [ ] Directory: `.output/` contains build artifacts
  - [ ] File: `gemini-reader-*.zip` exists
  - [ ] Zip contents: manifest.json, content.js, assets/
  - [ ] Zip size: Reasonable (under 1MB)
  - [ ] Unzip và load in Firefox → Extension works

  **Evidence Required:**
  - [ ] Screenshot: Dev mode Firefox with extension
  - [ ] Terminal: Successful build output
  - [ ] Screenshot: `.output/` directory contents
  - [ ] Screenshot: Zip file structure

  **Commit**: YES
  - Message: `build: generate Firefox extension package`
  - Files: `.output/` directory

- [ ] 12. Write Unit Tests

  **What to do:**
  - Create `src/__tests__/` directory
  - Test files:
    - `autoClicker.test.ts` - Test triggerClick, autoExpandSources
    - `themeMenu.test.tsx` - Test theme switching logic
  - Test approach:
    - Mock localStorage
    - Mock matchMedia
    - Mock document/querySelector
    - Test theme state changes
    - Test localStorage persistence
    - Test system theme detection
  - Run tests: `npm test` or `bun test`

  **Must NOT do:**
  - NO integration tests with live Gemini site
  - NO E2E tests (manual only)

  **Parallelizable**: NO (depends on tasks 3, 4)

  **References:**

  **Pattern References:**
  - WXT testing patterns (if available)
  - React Testing Library patterns

  **Documentation References:**
  - Vitest/Jest for testing
  - React Testing Library: https://testing-library.com/docs/react-testing-library/

  **External References:**
  - Testing best practices for browser extensions

  **Acceptance Criteria:**
  - [ ] Directory: `src/__tests__/` exists
  - [ ] File: `autoClicker.test.ts` exists
  - [ ] File: `themeMenu.test.tsx` exists
  - [ ] Test: `triggerClick` triggers all mouse events
  - [ ] Test: `autoExpandSources` selector matches buttons
  - [ ] Test: Theme state changes correctly
  - [ ] Test: localStorage persistence works
  - [ ] Test: System theme detection logic
  - [ ] Command: `npm test` → All tests pass
  - [ ] Coverage: > 70% for utils and components

  **Evidence Required:**
  - [ ] Terminal: Test output showing all tests pass
  - [ ] Coverage report: > 70%

  **Commit**: YES
  - Message: `test: add unit tests for utilities and components`
  - Files: `src/__tests__/*.test.ts*`

- [ ] 13. Final Verification

  **What to do:**
  - Manual testing checklist:
    - [ ] Navigate to gemini.google.com
    - [ ] Theme menu appears in bottom-right
    - [ ] Click each theme → Correct visual change
    - [ ] System theme → Follows OS preference
    - [ ] Auto-expand → Sources expand automatically
    - [ ] Clean reading → CSS applied correctly
    - [ ] Keyboard → Tab, Enter, Escape, Arrows work
    - [ ] Focus → Visible indicators on all elements
    - [ ] Console → No errors or warnings
    - [ ] DevTools → No React warnings
  - Build verification:
    - [ ] `wxt build -b firefox` succeeds
    - [ ] `.output/gemini-reader-*.zip` exists
    - [ ] Zip unzips correctly
    - [ ] Load unpacked extension → Works
  - Documentation:
    - [ ] README.md exists
    - [ ] Privacy policy exists
    - [ ] Icons exist

  **Must NOT do:**
  - NO skipping any verification step

  **Parallelizable**: NO (final check)

  **References:**

  **Documentation References:**
  - Mozilla review guidelines
  - WXT debugging guide

  **External References:**
  - `bg_a5c02a3c` - Mozilla submission requirements

  **Acceptance Criteria:**
  - [ ] Manual test: All 9 checklist items pass
  - [ ] Build test: All 4 build items pass
  - [ ] Documentation: All 3 items exist
  - [ ] Ready for Mozilla Add-ons Store submission

  **Evidence Required:**
  - [ ] Completed checklist with checkmarks
  - [ ] Screenshots of each test
  - [ ] Terminal output showing all checks pass

  **Commit**: YES
  - Message: `chore: final verification and readiness check`
  - Files: Updated docs if needed

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat: initialize WXT project with React 19` | package.json, wxt.config.ts | `wxt --version` |
| 2 | `feat: configure WXT with React 19 and Firefox manifest` | wxt.config.ts | `wxt build --dry-run` |
| 3 | `feat: add ThemeMenu component with 4 themes and accessibility` | src/components/ThemeMenu.tsx | `npm run dev:firefox` |
| 4 | `feat: add auto-clicker utility for source expansion` | src/utils/autoClicker.ts | Console logs |
| 5 | `feat: add content script entry point with UI injection` | src/entrypoints/content.tsx | Console: "Initialized" |
| 6 | `feat: add CSS styling for clean reading mode` | src/assets/styles.css | Screenshot |
| 7 | `feat: implement WCAG 2.1 AA accessibility features` | src/components/ThemeMenu.tsx | Keyboard test |
| 8 | `feat: add system theme detection with prefers-color-scheme` | src/components/ThemeMenu.tsx | OS theme test |
| 9 | `feat: add extension icons for Firefox` | src/assets/icons/* | Icon files |
| 10 | `docs: add privacy policy for Mozilla submission` | src/assets/privacy-policy.md | File exists |
| 11 | `build: generate Firefox extension package` | .output/ | Zip file |
| 12 | `test: add unit tests for utilities and components` | src/__tests__/* | npm test |
| 13 | `chore: final verification and readiness check` | All files | Checklist |

---

## Success Criteria

### Verification Commands
```bash
# Setup and build
npx wxt@latest init . --template react
npm install
npm install react@19 react-dom@19
npm install -D @wxt-dev/module-react

# Development
npm run dev:firefox

# Production build
wxt build -b firefox

# Testing
npm test
```

### Final Checklist
- [ ] All "Must Have" present (10 items)
- [ ] All "Must NOT Have" absent (8 exclusions)
- [ ] Theme switching works (4 themes + system)
- [ ] Auto-expand sources triggers
- [ ] Clean reading CSS applied
- [ ] Keyboard navigation functional
- [ ] ARIA attributes present
- [ ] Focus indicators visible
- [ ] Build succeeds (Firefox)
- [ ] Icons exist (16/32/48/128px)
- [ ] Privacy policy exists
- [ ] Tests pass
- [ ] No console errors
- [ ] Ready for Mozilla submission

---

## Notes

### Implementation Order
1. Setup → Config → ThemeMenu → AutoClicker → Content Script → CSS → Accessibility → System Theme → Icons → Privacy → Build → Tests → Final

### Key Technical Decisions
- React 19 via @wxt-dev/module-react
- CSS Modules for component styles
- Inline styles for shadow DOM
- localStorage for theme persistence
- matchMedia for system theme
- WXT createShadowRootUi for isolation

### Files Created
```
├── wxt.config.ts
├── src/
│   ├── components/
│   │   └── ThemeMenu.tsx
│   ├── utils/
│   │   └── autoClicker.ts
│   ├── entrypoints/
│   │   └── content.tsx
│   ├── assets/
│   │   ├── styles.css
│   │   ├── icons/
│   │   │   ├── icon-16.png
│   │   │   ├── icon-32.png
│   │   │   ├── icon-48.png
│   │   │   └── icon-128.png
│   │   └── privacy-policy.md
│   └── __tests__/
│       ├── autoClicker.test.ts
│       └── themeMenu.test.tsx
└── .output/
    └── gemini-reader-*.zip
```

### Estimated Timeline
- Tasks 1-2: 10 minutes (setup)
- Tasks 3-8: 45 minutes (implementation)
- Tasks 9-10: 15 minutes (assets)
- Task 11: 10 minutes (build)
- Task 12: 20 minutes (tests)
- Task 13: 15 minutes (verification)
- **Total: ~2 hours**

