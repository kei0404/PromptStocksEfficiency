export const BlueTheme = {
  primary: {
    50: '#E3F2FD',   // Light background
    100: '#BBDEFB',  // Card backgrounds
    200: '#90CAF9',  // Secondary elements
    300: '#64B5F6',  // Interactive elements
    400: '#42A5F5',  // Primary buttons
    500: '#2196F3',  // Main brand color
    600: '#1E88E5',  // Active states
    700: '#1976D2',  // Headers
    800: '#1565C0',  // Dark accents
    900: '#0D47A1'   // Text on light backgrounds
  },
  neutral: {
    50: '#FAFAFA',   // Pure white alternative
    100: '#F5F5F5',  // Background
    200: '#EEEEEE',  // Dividers
    300: '#E0E0E0',  // Borders
    400: '#BDBDBD',  // Disabled text
    500: '#9E9E9E',  // Secondary text
    600: '#757575',  // Primary text light
    700: '#616161',  // Primary text
    800: '#424242',  // Headers
    900: '#212121'   // High emphasis text
  },
  semantic: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3'
  }
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: BlueTheme.primary[700],
    lineHeight: 34
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: BlueTheme.primary[600],
    lineHeight: 30
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: BlueTheme.neutral[800],
    lineHeight: 26
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: BlueTheme.neutral[700],
    lineHeight: 22
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: BlueTheme.neutral[600],
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: BlueTheme.neutral[500],
    lineHeight: 16
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16
};

export const CategoryColors = {
  emailCreation: BlueTheme.primary[500],      // #2196F3
  meetingSummary: BlueTheme.primary[700],     // #1976D2
  documentSummary: BlueTheme.primary[800],    // #1565C0
  snsPlanning: BlueTheme.primary[900],        // #0D47A1
  dataAggregation: BlueTheme.primary[400],    // #42A5F5
  translation: BlueTheme.primary[300]         // #64B5F6
};

export const ComponentStyles = {
  categoryTile: {
    dimensions: {
      width: '47%' as const,
      height: 120,
      borderRadius: BorderRadius.lg
    },
    colors: {
      background: BlueTheme.primary[50],
      border: BlueTheme.primary[200],
      iconBackground: BlueTheme.primary[100],
      text: BlueTheme.primary[800]
    },
    layout: {
      padding: Spacing.md,
      iconSize: 32,
      spacing: Spacing.sm
    }
  },
  promptCard: {
    dimensions: {
      minHeight: 80,
      borderRadius: BorderRadius.md,
      marginVertical: 4
    },
    colors: {
      background: BlueTheme.neutral[50],
      border: BlueTheme.primary[100],
      titleText: BlueTheme.neutral[800],
      contentText: BlueTheme.neutral[600],
      categoryBadge: BlueTheme.primary[500]
    },
    interactions: {
      pressedOpacity: 0.7,
      longPressScale: 0.98,
      animationDuration: 150
    }
  },
  button: {
    primary: {
      backgroundColor: BlueTheme.primary[500],
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md
    },
    secondary: {
      backgroundColor: BlueTheme.primary[100],
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderWidth: 1,
      borderColor: BlueTheme.primary[300]
    }
  }
};