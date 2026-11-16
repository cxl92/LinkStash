import React from 'react';
import { Sun, Moon, Monitor, Check, RotateCcw, X, Palette, Sparkles } from 'lucide-react';
import {
  AppearanceSettings,
  ColorMode,
  DensityPreset,
  RadiusPreset,
} from '../types';
import {
  CUSTOM_ACCENT_SWATCHES,
  DEFAULT_APPEARANCE,
  THEME_PRESETS,
  resolveIsDark,
} from '../themes';
import { LinkStashLogo } from './LinkStashLogo';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppearanceSettings;
  onChange: (next: AppearanceSettings) => void;
}

const LOGO_COLOR_SWATCHES = [
  '#059669',
  '#0284c7',
  '#4f46e5',
  '#7c3aed',
  '#d97706',
  '#e11d48',
  '#0f172a',
];

export const AppearanceModal: React.FC<AppearanceModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChange,
}) => {
  if (!isOpen) return null;

  const isDarkPreview = resolveIsDark(settings.colorMode);

  const update = (patch: Partial<AppearanceSettings>) => {
    onChange({ ...settings, ...patch });
  };

  const modeOptions: { id: ColorMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  const radiusOptions: { id: RadiusPreset; label: string }[] = [
    { id: 'sharp', label: 'Sharp' },
    { id: 'balanced', label: 'Balanced' },
    { id: 'soft', label: 'Soft' },
  ];

  const densityOptions: { id: DensityPreset; label: string }[] = [
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'compact', label: 'Compact' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appearance-title"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-xl bg-[var(--ls-surface)] border border-[var(--ls-border)] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        style={{ borderRadius: 'var(--ls-radius-card)' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--ls-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 flex items-center justify-center border border-[var(--ls-border)] bg-[var(--ls-surface-muted)] text-[var(--ls-accent-text)]"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 id="appearance-title" className="text-base font-semibold text-[var(--ls-text)]">
                Appearance & Theme
              </h2>
              <p className="text-xs text-[var(--ls-text-muted)]">
                Customize color mode, surface palette, logo color, and layout rhythm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] hover:bg-[var(--ls-surface-muted)] transition-colors"
            style={{ borderRadius: 'var(--ls-radius-control)' }}
            aria-label="Close appearance settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Color Mode */}
          <div>
            <label className="block text-xs font-semibold text-[var(--ls-text-secondary)] mb-2.5">
              Color Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {modeOptions.map((opt) => {
                const active = settings.colorMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update({ colorMode: opt.id })}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border transition-all whitespace-nowrap cursor-pointer ${
                      active
                        ? 'border-[var(--ls-accent)] bg-[var(--ls-accent-soft)] text-[var(--ls-accent-text)]'
                        : 'border-[var(--ls-border)] bg-[var(--ls-bg)] text-[var(--ls-text-secondary)] hover:border-[var(--ls-border-strong)] hover:text-[var(--ls-text)]'
                    }`}
                    style={{ borderRadius: 'var(--ls-radius-control)' }}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Presets */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-[var(--ls-text-secondary)]">
                Theme Palette
              </label>
              <span className="text-xs text-[var(--ls-text-muted)]">
                Previewing {isDarkPreview ? 'Dark' : 'Light'} variant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEME_PRESETS.map((preset) => {
                const active = settings.themeId === preset.id;
                const tokens = isDarkPreview ? preset.dark : preset.light;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => update({ themeId: preset.id, customAccent: null, logoColor: 'accent' })}
                    className={`group text-left p-3 border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      active
                        ? 'border-[var(--ls-accent)] bg-[var(--ls-accent-soft)]'
                        : 'border-[var(--ls-border)] bg-[var(--ls-bg)] hover:border-[var(--ls-border-strong)]'
                    }`}
                    style={{ borderRadius: 'var(--ls-radius-control)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 shrink-0 border flex flex-col justify-between p-1.5 shadow-xs"
                        style={{
                          backgroundColor: tokens.bg,
                          borderColor: tokens.borderStrong,
                          borderRadius: '8px',
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: tokens.accent }}
                          />
                          <span
                            className="h-1.5 flex-1 rounded-xs"
                            style={{ backgroundColor: tokens.text, opacity: 0.7 }}
                          />
                        </div>
                        <div
                          className="h-2.5 w-full rounded-xs border"
                          style={{
                            backgroundColor: tokens.surface,
                            borderColor: tokens.border,
                          }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[var(--ls-text)] truncate">
                          {preset.name}
                        </div>
                        <div className="text-xs text-[var(--ls-text-muted)] truncate">
                          {preset.description}
                        </div>
                      </div>
                    </div>

                    {active && (
                      <span className="w-5 h-5 rounded-full bg-[var(--ls-accent)] text-[var(--ls-accent-fg)] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* App Logo Color */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-[var(--ls-text-secondary)]">
                App Logo Color
              </label>
              <div className="flex items-center gap-2">
                <LinkStashLogo className="w-7 h-7" />
                <span className="text-xs text-[var(--ls-text-muted)]">Live Preview</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => update({ logoColor: 'original' })}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  settings.logoColor === 'original'
                    ? 'border-[var(--ls-accent)] bg-[var(--ls-accent-soft)] text-[var(--ls-accent-text)]'
                    : 'border-[var(--ls-border)] bg-[var(--ls-bg)] text-[var(--ls-text-secondary)] hover:border-[var(--ls-border-strong)]'
                }`}
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                Original
              </button>

              <button
                type="button"
                onClick={() => update({ logoColor: 'accent' })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  settings.logoColor === 'accent'
                    ? 'border-[var(--ls-accent)] bg-[var(--ls-accent-soft)] text-[var(--ls-accent-text)]'
                    : 'border-[var(--ls-border)] bg-[var(--ls-bg)] text-[var(--ls-text-secondary)] hover:border-[var(--ls-border-strong)]'
                }`}
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                <Sparkles className="w-3 h-3" />
                Match Theme
              </button>

              <div className="h-5 w-px bg-[var(--ls-border)] mx-0.5" />

              {LOGO_COLOR_SWATCHES.map((swatch) => {
                const isSelected = settings.logoColor?.toLowerCase() === swatch.toLowerCase();
                return (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => update({ logoColor: swatch })}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                      isSelected
                        ? 'scale-110 ring-2 ring-offset-2 ring-[var(--ls-text)] ring-offset-[var(--ls-surface)]'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch }}
                    aria-label={`Set logo color to ${swatch}`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}

              <label
                className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--ls-border)] bg-[var(--ls-bg)] text-xs font-medium text-[var(--ls-text-secondary)] hover:border-[var(--ls-border-strong)] cursor-pointer"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                <span>Custom</span>
                <input
                  type="color"
                  value={
                    settings.logoColor &&
                    settings.logoColor !== 'original' &&
                    settings.logoColor !== 'accent'
                      ? settings.logoColor
                      : '#059669'
                  }
                  onChange={(e) => update({ logoColor: e.target.value })}
                  className="w-4 h-4 p-0 border-0 bg-transparent cursor-pointer"
                  aria-label="Pick custom logo color"
                />
              </label>
            </div>
          </div>

          {/* Custom Accent Override */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-[var(--ls-text-secondary)]">
                Accent Color Override
              </label>
              {settings.customAccent && (
                <button
                  type="button"
                  onClick={() => update({ customAccent: null })}
                  className="text-xs font-medium text-[var(--ls-accent-text)] hover:underline cursor-pointer"
                >
                  Use theme default
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {CUSTOM_ACCENT_SWATCHES.map((swatch) => {
                const isSelected = settings.customAccent?.toLowerCase() === swatch.toLowerCase();
                return (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => update({ customAccent: swatch })}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                      isSelected
                        ? 'scale-110 ring-2 ring-offset-2 ring-[var(--ls-text)] ring-offset-[var(--ls-surface)]'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch }}
                    aria-label={`Select accent color ${swatch}`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}

              <label
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--ls-border)] bg-[var(--ls-bg)] text-xs font-medium text-[var(--ls-text-secondary)] hover:border-[var(--ls-border-strong)] cursor-pointer"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                <span>Custom</span>
                <input
                  type="color"
                  value={settings.customAccent || '#0284c7'}
                  onChange={(e) => update({ customAccent: e.target.value })}
                  className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
                  aria-label="Pick custom accent color"
                />
              </label>
            </div>
          </div>

          {/* Corner Radius & Layout Density */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--ls-text-secondary)] mb-2">
                Corner Style
              </label>
              <div
                className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--ls-surface-muted)] border border-[var(--ls-border)]"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                {radiusOptions.map((opt) => {
                  const active = settings.radiusPreset === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => update({ radiusPreset: opt.id })}
                      className={`py-1.5 px-2 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[var(--ls-surface)] text-[var(--ls-text)] shadow-xs'
                          : 'text-[var(--ls-text-muted)] hover:text-[var(--ls-text)]'
                      }`}
                      style={{ borderRadius: 'calc(var(--ls-radius-control) - 3px)' }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ls-text-secondary)] mb-2">
                Card Density
              </label>
              <div
                className="grid grid-cols-2 gap-1.5 p-1 bg-[var(--ls-surface-muted)] border border-[var(--ls-border)]"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                {densityOptions.map((opt) => {
                  const active = settings.densityPreset === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => update({ densityPreset: opt.id })}
                      className={`py-1.5 px-2 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[var(--ls-surface)] text-[var(--ls-text)] shadow-xs'
                          : 'text-[var(--ls-text-muted)] hover:text-[var(--ls-text)]'
                      }`}
                      style={{ borderRadius: 'calc(var(--ls-radius-control) - 3px)' }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--ls-border)] bg-[var(--ls-bg)] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => onChange(DEFAULT_APPEARANCE)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-[var(--ls-accent)] hover:bg-[var(--ls-accent-hover)] text-[var(--ls-accent-fg)] transition-colors cursor-pointer"
            style={{ borderRadius: 'var(--ls-radius-control)' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
