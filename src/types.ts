export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface BookmarkItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  categoryId: string;
  favorite: boolean;
  createdAt: number;
}

export type ActiveView = 'all' | 'favorites' | 'uncategorized' | string;
export type ViewMode = 'grid' | 'list';
export type SortOption = 'custom' | 'newest' | 'oldest' | 'alpha';
export type ColorMode = 'light' | 'dark' | 'system';
export type RadiusPreset = 'sharp' | 'balanced' | 'soft';
export type DensityPreset = 'comfortable' | 'compact';

export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  accentFg: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  light: ThemeTokens;
  dark: ThemeTokens;
}

export interface AppearanceSettings {
  themeId: string;
  colorMode: ColorMode;
  customAccent: string | null;
  logoColor: string; // 'original' | 'accent' | hex string
  radiusPreset: RadiusPreset;
  densityPreset: DensityPreset;
}
