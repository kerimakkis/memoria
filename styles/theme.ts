export type ThemeMode = 'light' | 'dark';

type Palette = {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  muted: string;
  success: string;
  danger: string;
};

export interface Theme {
  mode: ThemeMode;
  colors: Palette;
  spacing: (value?: number) => number;
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
}

const createSpacing = (base = 8) => (value = 1) => base * value;

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#f5f6fa',
    surface: '#ffffff',
    primary: '#5b8def',
    secondary: '#f7c948',
    text: '#1f2937',
    muted: '#6b7280',
    success: '#34d399',
    danger: '#f87171'
  },
  spacing: createSpacing(),
  radius: {
    sm: 8,
    md: 12,
    lg: 20
  }
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#0f172a',
    surface: '#111827',
    primary: '#60a5fa',
    secondary: '#eab308',
    text: '#f9fafb',
    muted: '#94a3b8',
    success: '#22c55e',
    danger: '#f87171'
  },
  spacing: createSpacing(),
  radius: {
    sm: 8,
    md: 12,
    lg: 20
  }
};
