import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JSDOM } from 'jsdom';

// Setup jsdom before tests
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>');
global.document = dom.window.document;
global.window = dom.window as unknown as Window;

describe('ThemeMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
  });

  describe('Initial State', () => {
    it('should render theme toggle button', () => {
      const { default: ThemeMenu } = require('../components/ThemeMenu');
      render(<ThemeMenu />, { container: document.getElementById('root')! });

      const toggleButton = screen.getByRole('button', { name: /theme selector/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it('should load saved theme from localStorage', () => {
      vi.stubGlobal('localStorage', {
        getItem: vi.fn().mockReturnValue('theme-dark'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      });
      
      const { default: ThemeMenu } = require('../components/ThemeMenu');
      render(<ThemeMenu />, { container: document.getElementById('root')! });

      expect(document.body.classList.contains('theme-dark')).toBe(true);
    });
  });

  describe('Theme Switching', () => {
    it('should save theme to localStorage when changed', () => {
      const setItemSpy = vi.fn();
      vi.stubGlobal('localStorage', {
        getItem: vi.fn().mockReturnValue(null),
        setItem: setItemSpy,
        removeItem: vi.fn(),
      });
      
      const { default: ThemeMenu } = require('../components/ThemeMenu');
      render(<ThemeMenu />, { container: document.getElementById('root')! });

      const toggleButton = screen.getByRole('button', { name: /theme selector/i });
      fireEvent.click(toggleButton);

      const sepiaButton = screen.getByRole('menuitem', { name: /sepia theme/i });
      fireEvent.click(sepiaButton);

      expect(setItemSpy).toHaveBeenCalledWith('gemini-reader-theme', 'theme-sepia');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { default: ThemeMenu } = require('../components/ThemeMenu');
      render(<ThemeMenu />, { container: document.getElementById('root')! });

      const toggleButton = screen.getByRole('button', { name: /theme selector/i });
      expect(toggleButton).toHaveAttribute('aria-haspopup', 'menu');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('System Theme Detection', () => {
    it('should listen for system theme changes', () => {
      const addEventListenerSpy = vi.fn();
      vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: addEventListenerSpy,
        removeEventListener: vi.fn(),
      })));

      const { default: ThemeMenu } = require('../components/ThemeMenu');
      render(<ThemeMenu />, { container: document.getElementById('root')! });

      expect(addEventListenerSpy).toHaveBeenCalled();
    });
  });
});
