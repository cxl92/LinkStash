import { AppearanceSettings, RadiusPreset, ThemePreset } from './types';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'oceanic',
    name: 'Oceanic Slate',
    description: 'Crisp cobalt & cool slate surfaces',
    light: {
      bg: '#f8fafc',
      surface: '#ffffff',
      surfaceMuted: '#f1f5f9',
      surfaceHover: '#f8fafc',
      border: '#e2e8f0',
      borderStrong: '#cbd5e1',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#64748b',
      accent: '#0284c7',
      accentHover: '#0369a1',
      accentText: '#0369a1',
      accentFg: '#ffffff',
    },
    dark: {
      bg: '#090d16',
      surface: '#111827',
      surfaceMuted: '#1e293b',
      surfaceHover: '#172033',
      border: '#1f2937',
      borderStrong: '#334155',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      accent: '#38bdf8',
      accentHover: '#0ea5e9',
      accentText: '#7dd3fc',
      accentFg: '#082f49',
    },
  },
  {
    id: 'indigo',
    name: 'Indigo Studio',
    description: 'Classic electric indigo workspace',
    light: {
      bg: '#f8fafc',
      surface: '#ffffff',
      surfaceMuted: '#f1f5f9',
      surfaceHover: '#f8fafc',
      border: '#e2e8f0',
      borderStrong: '#cbd5e1',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#64748b',
      accent: '#4f46e5',
      accentHover: '#4338ca',
      accentText: '#4338ca',
      accentFg: '#ffffff',
    },
    dark: {
      bg: '#0b0e17',
      surface: '#131726',
      surfaceMuted: '#1e2438',
      surfaceHover: '#181e30',
      border: '#232a40',
      borderStrong: '#364161',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      accent: '#818cf8',
      accentHover: '#6366f1',
      accentText: '#a5b4fc',
      accentFg: '#1e1b4b',
    },
  },
  {
    id: 'emerald',
    name: 'Nordic Pine',
    description: 'Calm botanical emerald & neutral ash',
    light: {
      bg: '#f7f9f8',
      surface: '#ffffff',
      surfaceMuted: '#eef2f0',
      surfaceHover: '#f4f7f5',
      border: '#dfe6e2',
      borderStrong: '#c5d1cb',
      text: '#101c16',
      textSecondary: '#3f5248',
      textMuted: '#5f7368',
      accent: '#059669',
      accentHover: '#047857',
      accentText: '#047857',
      accentFg: '#ffffff',
    },
    dark: {
      bg: '#09110e',
      surface: '#111d18',
      surfaceMuted: '#1a2c24',
      surfaceHover: '#15241e',
      border: '#1f332a',
      borderStrong: '#2f4b3e',
      text: '#f2f7f4',
      textSecondary: '#c4d6cc',
      textMuted: '#8ba396',
      accent: '#34d399',
      accentHover: '#10b981',
      accentText: '#6ee7b7',
      accentFg: '#022c22',
    },
  },
  {
    id: 'amber',
    name: 'Warm Paper',
    description: 'Editorial stone & burnished amber',
    light: {
      bg: '#faf8f5',
      surface: '#ffffff',
      surfaceMuted: '#f3efe9',
      surfaceHover: '#f8f5f0',
      border: '#e7e1d8',
      borderStrong: '#d4cabd',
      text: '#1c1917',
      textSecondary: '#57534e',
      textMuted: '#78716c',
      accent: '#d97706',
      accentHover: '#b45309',
      accentText: '#b45309',
      accentFg: '#ffffff',
    },
    dark: {
      bg: '#12100e',
      surface: '#1c1916',
      surfaceMuted: '#292420',
      surfaceHover: '#221e1a',
      border: '#2e2924',
      borderStrong: '#443c35',
      text: '#fafaf9',
      textSecondary: '#d6d3d1',
      textMuted: '#a8a29e',
      accent: '#fbbf24',
      accentHover: '#f59e0b',
      accentText: '#fcd34d',
      accentFg: '#271704',
    },
  },
  {
    id: 'rose',
    name: 'Rosewood',
    description: 'Neutral zinc with vivid crimson rose',
    light: {
      bg: '#fafafa',
      surface: '#ffffff',
      surfaceMuted: '#f4f4f5',
      surfaceHover: '#f8f8fa',
      border: '#e4e4e7',
      borderStrong: '#d4d4d8',
      text: '#18181b',
      textSecondary: '#52525b',
      textMuted: '#71717a',
      accent: '#e11d48',
      accentHover: '#be123c',
      accentText: '#be123c',
      accentFg: '#ffffff',
    },
    dark: {
      bg: '#0e0c0f',
      surface: '#18151a',
      surfaceMuted: '#252028',
      surfaceHover: '#1f1b22',
      border: '#2b2530',
      borderStrong: '#413847',
      text: '#fafafa',
      textSecondary: '#d4d4d8',
      textMuted: '#a1a1aa',
      accent: '#fb7185',
      accentHover: '#f43f5e',
      accentText: '#fda4af',
      accentFg: '#4c0519',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome Ink',
    description: 'High-contrast architectural grayscale',
    light: {
      bg: '#f7f7f7',
      surface: '#ffffff',
      surfaceMuted: '#ededed',
      surfaceHover: '#f3f3f3',
      border: '#e0e0e0',
      borderStrong: '#c7c7c7',
      text: '#111111',
      textSecondary: '#444444',
      textMuted: '#6b6b6b',
      accent: '#18181b',
      accentHover: '#27272a',
      accentText: '#18181b',
      accentFg: '#ffffff',
    },
    dark: {
      bg: '#0a0a0a',
      surface: '#141414',
      surfaceMuted: '#222222',
      surfaceHover: '#1b1b1b',
      border: '#262626',
      borderStrong: '#3d3d3d',
      text: '#fafafa',
      textSecondary: '#cccccc',
      textMuted: '#8f8f8f',
      accent: '#f4f4f5',
      accentHover: '#e4e4e7',
      accentText: '#ffffff',
      accentFg: '#09090b',
    },
  },
];

export const CUSTOM_ACCENT_SWATCHES = [
  '#0284c7',
  '#4f46e5',
  '#7c3aed',
  '#059669',
  '#d97706',
  '#e11d48',
  '#0d9488',
  '#2563eb',
];

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  themeId: 'oceanic',
  colorMode: 'light',
  customAccent: null,
  logoColor: 'accent',
  radiusPreset: 'balanced',
  densityPreset: 'comfortable',
};

const RADIUS_VALUES: Record<RadiusPreset, { card: string; control: string }> = {
  sharp: { card: '6px', control: '5px' },
  balanced: { card: '14px', control: '10px' },
  soft: { card: '20px', control: '14px' },
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

function getContrastForeground(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.6 ? '#0f172a' : '#ffffff';
}

function adjustHexBrightness(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const r = clamp(rgb.r + factor);
  const g = clamp(rgb.g + factor);
  const b = clamp(rgb.b + factor);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function resolveIsDark(colorMode: AppearanceSettings['colorMode']): boolean {
  if (colorMode === 'dark') return true;
  if (colorMode === 'light') return false;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export function applyAppearanceToDocument(settings: AppearanceSettings): boolean {
  const isDark = resolveIsDark(settings.colorMode);
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);

  const preset = THEME_PRESETS.find((t) => t.id === settings.themeId) || THEME_PRESETS[0];
  const tokens = isDark ? preset.dark : preset.light;

  const accent = settings.customAccent || tokens.accent;
  const accentRgb = hexToRgb(accent);
  const accentSoft = accentRgb
    ? `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${isDark ? 0.18 : 0.11})`
    : `rgba(2, 132, 199, ${isDark ? 0.18 : 0.11})`;
  const accentHover = settings.customAccent
    ? adjustHexBrightness(accent, isDark ? 16 : -18)
    : tokens.accentHover;
  const accentFg = settings.customAccent ? getContrastForeground(accent) : tokens.accentFg;
  const accentText = settings.customAccent
    ? isDark
      ? adjustHexBrightness(accent, 45)
      : adjustHexBrightness(accent, -15)
    : tokens.accentText;

  const radius = RADIUS_VALUES[settings.radiusPreset] || RADIUS_VALUES.balanced;

  root.style.setProperty('--ls-bg', tokens.bg);
  root.style.setProperty('--ls-surface', tokens.surface);
  root.style.setProperty('--ls-surface-muted', tokens.surfaceMuted);
  root.style.setProperty('--ls-surface-hover', tokens.surfaceHover);
  root.style.setProperty('--ls-border', tokens.border);
  root.style.setProperty('--ls-border-strong', tokens.borderStrong);
  root.style.setProperty('--ls-text', tokens.text);
  root.style.setProperty('--ls-text-secondary', tokens.textSecondary);
  root.style.setProperty('--ls-text-muted', tokens.textMuted);
  root.style.setProperty('--ls-accent', accent);
  root.style.setProperty('--ls-accent-hover', accentHover);
  root.style.setProperty('--ls-accent-soft', accentSoft);
  root.style.setProperty('--ls-accent-text', accentText);
  root.style.setProperty('--ls-accent-fg', accentFg);
  let resolvedLogoColor =
    settings.logoColor === 'accent'
      ? accent
      : settings.logoColor && settings.logoColor !== 'original'
      ? settings.logoColor
      : 'original';

  if (resolvedLogoColor !== 'original') {
    const logoRgb = hexToRgb(resolvedLogoColor);
    const logoLum = logoRgb
      ? (0.299 * logoRgb.r + 0.587 * logoRgb.g + 0.114 * logoRgb.b) / 255
      : 0;
    if (logoLum > 0.8) {
      resolvedLogoColor = adjustHexBrightness(resolvedLogoColor, -145);
    }
  }

  root.style.setProperty('--ls-radius-card', radius.card);
  root.style.setProperty('--ls-radius-control', radius.control);
  root.style.setProperty('--ls-logo-color', resolvedLogoColor);
  root.dataset.lsLogoColor = resolvedLogoColor;
  window.dispatchEvent(new CustomEvent('ls-appearance-change', { detail: { logoColor: resolvedLogoColor } }));

  return isDark;
}
