import { useState, useEffect, useCallback } from 'react';

type Theme = 'theme-light' | 'theme-sepia' | 'theme-dark' | 'theme-system';

const themes: { id: Theme; icon: string; title: string }[] = [
  { id: 'theme-light', icon: '☀️', title: 'Light' },
  { id: 'theme-sepia', icon: '📖', title: 'Sepia' },
  { id: 'theme-dark', icon: '🌙', title: 'Dark' },
  { id: 'theme-system', icon: '🖥️', title: 'System' },
];

function getSystemTheme(): 'theme-light' | 'theme-dark' {
  if (typeof window === 'undefined') return 'theme-light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'theme-dark'
    : 'theme-light';
}

function applyTheme(theme: Theme) {
  const effectiveTheme = theme === 'theme-system' ? getSystemTheme() : theme;
  document.body.classList.remove('theme-light', 'theme-sepia', 'theme-dark');
  document.body.classList.add(effectiveTheme);
}

function exitReadingMode() {
  // Find and click the close button on the deep-research-immersive-panel
  const panel = document.querySelector('deep-research-immersive-panel');
  if (panel) {
    // Try to find a close button
    const closeButton = panel.querySelector('.close-button, [aria-label="Close"], button[class*="close"]');
    if (closeButton instanceof HTMLElement) {
      closeButton.click();
      return;
    }
  }
  
  // Alternative: close via Escape key
  document.body.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Escape',
    code: 'Escape',
    keyCode: 27,
    which: 27,
    bubbles: true
  }));
  
  // Fallback: reload page without deep-research query param
  const url = new URL(window.location.href);
  url.searchParams.delete('deep-research');
  window.history.replaceState({}, '', url);
  location.reload();
}

export function ThemeMenu() {
  const [activeTheme, setActiveTheme] = useState<Theme>('theme-system');
  const [isExpanded, setIsExpanded] = useState(false);

  // Exit button - always visible at top-left
  const handleExit = useCallback(() => {
    exitReadingMode();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('gemini-reader-theme') as Theme | null;
    const initialTheme = saved || 'theme-system';
    setActiveTheme(initialTheme);
    applyTheme(initialTheme);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const current = localStorage.getItem('gemini-reader-theme') as Theme | null;
      if (current === 'theme-system' || !current) {
        const newTheme = e.matches ? 'theme-dark' : 'theme-light';
        document.body.classList.remove('theme-light', 'theme-sepia', 'theme-dark');
        document.body.classList.add(newTheme);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const changeTheme = useCallback((themeId: Theme) => {
    setActiveTheme(themeId);
    localStorage.setItem('gemini-reader-theme', themeId);
    applyTheme(themeId);
    setIsExpanded(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
        return;
      }

      if (!isExpanded) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(true);
        }
        return;
      }

      let newIndex = index;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        newIndex = (index + 1) % themes.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        newIndex = (index - 1 + themes.length) % themes.length;
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setIsExpanded(false);
        return;
      }

      if (newIndex !== index) {
        const button = document.querySelector<HTMLButtonElement>(
          `[data-theme-index="${newIndex}"]`
        );
        button?.focus();
      }
    },
    [isExpanded]
  );

  const activeIndex = themes.findIndex((t) => t.id === activeTheme);

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
      }}
      role="menu"
      aria-label="Theme selector"
    >
      {/* Exit button - always visible at top-left */}
      <button
        onClick={handleExit}
        aria-label="Exit Reading Mode"
        tabIndex={0}
        type="button"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 2px #dc3545';
          e.currentTarget.style.borderColor = '#dc3545';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
        }}
      >
        ✕
      </button>

      {isExpanded && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '8px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
          role="menu"
          aria-label="Theme options"
        >
          {themes.map((theme, index) => (
            <button
              key={theme.id}
              data-theme-index={index}
              onClick={() => changeTheme(theme.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="menuitem"
              aria-label={`${theme.title} theme`}
              tabIndex={isExpanded ? 0 : -1}
              type="button"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border:
                  activeTheme === theme.id
                    ? '2px solid #007bff'
                    : '1px solid rgba(0, 0, 0, 0.2)',
                backgroundColor: activeTheme === theme.id ? '#eef6fc' : 'transparent',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 2px #007bff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {theme.icon}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => handleKeyDown(e, -1)}
        aria-label={`Theme selector, current: ${themes[activeIndex]?.title || 'System'}`}
        aria-expanded={isExpanded}
        aria-controls="theme-menu"
        aria-haspopup="menu"
        tabIndex={0}
        type="button"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '2px solid rgba(0, 0, 0, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 2px #007bff';
          e.currentTarget.style.borderColor = '#007bff';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
        }}
      >
        {themes[activeIndex]?.icon || '🖥️'}
      </button>
    </div>
  );
}

export default ThemeMenu;
