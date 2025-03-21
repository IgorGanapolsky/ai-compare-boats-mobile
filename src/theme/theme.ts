// Colors
const palette = {
  blue: {
    primary: '#0077B6',
    secondary: '#90E0EF',
    light: '#CAF0F8',
    dark: '#03045E',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};

// Shared values
const baseTheme = {
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
  },
};

// Light theme
export const lightTheme = {
  ...baseTheme,
  colors: {
    primary: palette.blue.primary,
    secondary: palette.blue.secondary,
    background: palette.white,
    card: palette.gray[50],
    text: palette.gray[900],
    border: palette.gray[200],
    notification: palette.blue.primary,
    error: palette.error,
    warning: palette.warning,
    success: palette.success,
  },
};

// Dark theme
export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: palette.blue.secondary,
    secondary: palette.blue.primary,
    background: palette.gray[900],
    card: palette.gray[800],
    text: palette.gray[50],
    border: palette.gray[700],
    notification: palette.blue.secondary,
    error: palette.error,
    warning: palette.warning,
    success: palette.success,
  },
};
