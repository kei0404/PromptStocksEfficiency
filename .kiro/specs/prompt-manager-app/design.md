# Design Document

## Overview

This design document outlines the architecture and implementation approach for a work efficiency prompt stock management iOS application. The app is built using React Native/Expo and focuses on providing users with a streamlined way to store, organize, and quickly access AI prompts for various work tasks including email creation, meeting minutes summarization, document summarization, SNS planning, data aggregation, and translation.

The design emphasizes simplicity, speed, and professional aesthetics with a blue-themed color scheme. The application supports both ExpoGo development and native iOS builds for production features like widgets and Siri Shortcuts.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
├─────────────────────────────────────────────────────────────┤
│  React Native Components  │  iOS Widget (Native)            │
│  - Home Screen            │  - Quick Access Widget          │
│  - Category Management    │  - Prompt Display               │
│  - Prompt CRUD            │                                 │
│  - Search & Filter        │                                 │
│  - Settings               │                                 │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Services & Managers      │  Utilities                      │
│  - PromptManager          │  - SearchEngine                 │
│  - CategoryManager        │  - UsageTracker                 │
│  - TemplateManager        │  - ExportManager                │
│  - WidgetManager          │  - ValidationUtils              │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Storage Services         │  External Integrations         │
│  - AsyncStorageService    │  - Clipboard API                │
│  - SecureStorageService   │  - Siri Shortcuts               │
│  - FileSystemService      │  - iOS Universal Clipboard      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React Native with Expo SDK 49+
- **Navigation**: React Navigation 6.x
- **State Management**: React Context + useReducer (lightweight approach)
- **Local Storage**: AsyncStorage for app data, iOS Keychain for sensitive data
- **Styling**: StyleSheet with blue-themed design system
- **Development**: ExpoGo for development, EAS Build for production
- **iOS Integration**: Native modules for widget and Siri Shortcuts

## Components and Interfaces

### Core Data Models

```typescript
interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  lastUsedAt: Date;
  effectivenessRating?: number;
  isFavorite: boolean;
  isArchived: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  promptCount: number;
  isDefault: boolean;
}

interface Template {
  id: string;
  name: string;
  category: string;
  structure: string;
  placeholders: string[];
  description: string;
}

interface UsageStats {
  promptId: string;
  usageCount: number;
  lastUsed: Date;
  effectivenessRating: number;
  averageRating: number;
}
```

### Screen Components

#### HomeScreen
- **Purpose**: Main dashboard showing categories and recent prompts
- **Key Features**: Category tiles, recent prompts, quick search, favorites section
- **Navigation**: Entry point to all major features

#### CategoryDetailScreen
- **Purpose**: Display prompts within a specific category
- **Key Features**: Filtered prompt list, category-specific templates, bulk actions
- **Interactions**: Tap to copy, long-press for options menu

#### CreatePromptScreen
- **Purpose**: Create new prompts with templates or custom content
- **Key Features**: Template selection, rich text input, category assignment, tag management
- **Validation**: Title and content required, duplicate detection

#### SearchScreen
- **Purpose**: Advanced search and filtering capabilities
- **Key Features**: Real-time search, multiple filters, search history, suggestions
- **Performance**: Debounced search, indexed content

#### SettingsScreen
- **Purpose**: App configuration and data management
- **Key Features**: Widget settings, export/import, usage statistics, theme options

### Service Layer Interfaces

```typescript
interface IPromptManager {
  createPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt>;
  updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt>;
  deletePrompt(id: string): Promise<void>;
  getPrompt(id: string): Promise<Prompt | null>;
  getPromptsByCategory(categoryId: string): Promise<Prompt[]>;
  searchPrompts(query: string, filters?: SearchFilters): Promise<Prompt[]>;
  getFavoritePrompts(): Promise<Prompt[]>;
  getMostUsedPrompts(limit: number): Promise<Prompt[]>;
}

interface ICategoryManager {
  createCategory(category: Omit<Category, 'id' | 'promptCount'>): Promise<Category>;
  updateCategory(id: string, updates: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  getCategories(): Promise<Category[]>;
  getDefaultCategories(): Category[];
}

interface IStorageService {
  store(key: string, data: any): Promise<void>;
  retrieve(key: string): Promise<any>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}
```

## Data Models

### Database Schema (AsyncStorage Structure)

```
Storage Keys:
- prompts: Prompt[]
- categories: Category[]
- templates: Template[]
- usage_stats: UsageStats[]
- app_settings: AppSettings
- search_history: string[]
- widget_config: WidgetConfig
```

### Default Categories

```typescript
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'email-creation',
    name: 'Eメール作成',
    color: '#2196F3',
    icon: 'mail',
    promptCount: 0,
    isDefault: true
  },
  {
    id: 'meeting-summary',
    name: '議事録要約',
    color: '#1976D2',
    icon: 'document-text',
    promptCount: 0,
    isDefault: true
  },
  {
    id: 'document-summary',
    name: '文書要約',
    color: '#1565C0',
    icon: 'document',
    promptCount: 0,
    isDefault: true
  },
  {
    id: 'sns-planning',
    name: 'SNS企画生成',
    color: '#0D47A1',
    icon: 'share',
    promptCount: 0,
    isDefault: true
  },
  {
    id: 'data-aggregation',
    name: '集計',
    color: '#42A5F5',
    icon: 'bar-chart',
    promptCount: 0,
    isDefault: true
  },
  {
    id: 'translation',
    name: '翻訳',
    color: '#64B5F6',
    icon: 'language',
    promptCount: 0,
    isDefault: true
  }
];
```

### Template Structures

```typescript
const EMAIL_TEMPLATE = {
  id: 'professional-email',
  name: 'Professional Email',
  category: 'email-creation',
  structure: `件名: [SUBJECT]

[RECIPIENT_NAME]様

いつもお世話になっております。[YOUR_NAME]です。

[MAIN_CONTENT]

ご確認のほど、よろしくお願いいたします。

[YOUR_NAME]`,
  placeholders: ['SUBJECT', 'RECIPIENT_NAME', 'YOUR_NAME', 'MAIN_CONTENT'],
  description: 'ビジネスメール用の基本テンプレート'
};
```

## Error Handling

### Error Categories

1. **Storage Errors**: AsyncStorage failures, quota exceeded
2. **Validation Errors**: Invalid input data, missing required fields
3. **Network Errors**: Clipboard access failures, widget communication
4. **System Errors**: iOS permission denials, memory issues

### Error Handling Strategy

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public category: 'storage' | 'validation' | 'network' | 'system',
    public recoverable: boolean = true
  ) {
    super(message);
  }
}

interface ErrorHandler {
  handleError(error: AppError): void;
  showUserFriendlyMessage(error: AppError): string;
  logError(error: AppError): void;
  canRecover(error: AppError): boolean;
}
```

### User-Friendly Error Messages

- **Storage Full**: "ストレージ容量が不足しています。古いプロンプトをアーカイブしますか？"
- **Invalid Input**: "タイトルと内容は必須項目です。"
- **Clipboard Error**: "クリップボードへのアクセスに失敗しました。設定を確認してください。"
- **Widget Error**: "ウィジェットの更新に失敗しました。アプリを再起動してください。"

## UI/UX Design System

### Blue Theme Color Palette

```typescript
const BlueTheme = {
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
```

### Typography System

```typescript
const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: BlueTheme.primary[700],
    lineHeight: 34
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    color: BlueTheme.primary[600],
    lineHeight: 30
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: BlueTheme.neutral[800],
    lineHeight: 26
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    color: BlueTheme.neutral[700],
    lineHeight: 22
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    color: BlueTheme.neutral[600],
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: BlueTheme.neutral[500],
    lineHeight: 16
  }
};
```

### Component Design Specifications

#### Category Tiles
```typescript
const CategoryTileDesign = {
  dimensions: {
    width: '47%',
    height: 120,
    borderRadius: 12
  },
  colors: {
    background: BlueTheme.primary[50],
    border: BlueTheme.primary[200],
    iconBackground: BlueTheme.primary[100],
    text: BlueTheme.primary[800]
  },
  layout: {
    padding: 16,
    iconSize: 32,
    spacing: 8
  }
};
```

#### Prompt Cards
```typescript
const PromptCardDesign = {
  dimensions: {
    minHeight: 80,
    borderRadius: 8,
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
};
```

## Widget Design

### Widget Layouts

#### Small Widget (2x2)
- **Content**: Top 3 most used prompts
- **Layout**: Vertical list with truncated titles
- **Interaction**: Tap to copy
- **Visual**: Category color indicators

#### Medium Widget (4x2)
- **Content**: Top 6 prompts with categories
- **Layout**: 2-column grid
- **Interaction**: Tap to copy, long-press for options
- **Visual**: Full category names and usage indicators

#### Large Widget (4x4)
- **Content**: Top 8 prompts with preview text
- **Layout**: List with expanded content
- **Interaction**: Full prompt preview, quick actions
- **Visual**: Rich formatting with effectiveness ratings

### Widget Data Synchronization

```typescript
interface WidgetConfig {
  size: 'small' | 'medium' | 'large';
  displayMode: 'mostUsed' | 'recent' | 'favorites' | 'category';
  selectedCategory?: string;
  maxPrompts: number;
  showPreview: boolean;
  updateInterval: number; // minutes
}

interface WidgetData {
  prompts: WidgetPrompt[];
  lastUpdated: Date;
  config: WidgetConfig;
}

interface WidgetPrompt {
  id: string;
  title: string;
  content: string;
  categoryColor: string;
  usageCount: number;
  truncatedContent: string;
}
```

## Security Design

### Data Encryption Strategy

```typescript
interface SecurityManager {
  encryptPrompt(prompt: Prompt): Promise<EncryptedPrompt>;
  decryptPrompt(encryptedPrompt: EncryptedPrompt): Promise<Prompt>;
  generateEncryptionKey(): Promise<string>;
  storeKeyInKeychain(key: string): Promise<void>;
  retrieveKeyFromKeychain(): Promise<string>;
}

interface EncryptedPrompt {
  id: string;
  encryptedData: string;
  iv: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Privacy Protection

1. **Local-Only Storage**: All data stored on device using iOS secure storage
2. **No Analytics**: Zero data transmission to external services
3. **Secure Export**: Encrypted export files with user-controlled keys
4. **Memory Protection**: Sensitive data cleared from memory after use
5. **Keychain Integration**: Encryption keys stored in iOS Keychain

## Performance Optimization

### Search Performance

```typescript
interface SearchIndex {
  buildIndex(prompts: Prompt[]): Promise<void>;
  search(query: string): Promise<SearchResult[]>;
  addToIndex(prompt: Prompt): Promise<void>;
  removeFromIndex(promptId: string): Promise<void>;
  updateIndex(prompt: Prompt): Promise<void>;
}

interface SearchResult {
  prompt: Prompt;
  relevanceScore: number;
  matchedFields: string[];
  highlightedContent: string;
}
```

### Memory Management

1. **Lazy Loading**: Load prompts on-demand for large datasets
2. **Virtual Lists**: Use FlatList with optimized rendering
3. **Image Caching**: Efficient icon and image caching
4. **Background Processing**: Use background tasks for indexing
5. **Memory Monitoring**: Track and optimize memory usage

## Accessibility Design

### VoiceOver Support

```typescript
interface AccessibilityLabels {
  categoryTile: (categoryName: string, promptCount: number) => string;
  promptCard: (title: string, category: string, usageCount: number) => string;
  actionButton: (action: string, context: string) => string;
  searchResult: (title: string, relevance: number) => string;
}

const AccessibilityLabels: AccessibilityLabels = {
  categoryTile: (name, count) => `${name}カテゴリ、${count}個のプロンプト`,
  promptCard: (title, category, usage) => `${title}、${category}カテゴリ、${usage}回使用`,
  actionButton: (action, context) => `${context}の${action}`,
  searchResult: (title, relevance) => `${title}、関連度${relevance}%`
};
```

### Keyboard Navigation

1. **Tab Order**: Logical navigation flow
2. **Focus Indicators**: Clear visual focus states
3. **Shortcuts**: Common keyboard shortcuts (⌘+N for new, ⌘+F for search)
4. **External Keyboard**: Full iPad keyboard support

## Testing Strategy

### Unit Testing
- **Models**: Data validation, encryption/decryption
- **Services**: CRUD operations, search algorithms
- **Utilities**: Helper functions, formatters
- **Security**: Encryption key management, data sanitization

### Integration Testing
- **Storage Layer**: AsyncStorage operations, Keychain integration
- **Navigation**: Screen transitions, parameter passing
- **External APIs**: Clipboard, Siri Shortcuts, Widget communication
- **Search**: Index building, query processing

### E2E Testing (Development)
- **Core Workflows**: Create → Save → Search → Copy prompt
- **Category Management**: Create category → Assign prompts → Filter
- **Data Management**: Export → Import → Validate data integrity
- **Security**: Encryption → Storage → Retrieval → Decryption

### Widget Testing (Production Build)
- **Widget Display**: Correct prompt display, truncation handling
- **Widget Interaction**: Tap to copy, configuration updates
- **Background Updates**: Data synchronization, performance impact
- **Memory Usage**: Widget memory footprint optimization

### Performance Testing
- **Large Dataset**: 1000+ prompts search performance
- **Memory Usage**: Long-running app stability
- **Startup Time**: Cold start optimization
- **Widget Performance**: Background processing efficiency
- **Search Speed**: Real-time search responsiveness

### Accessibility Testing
- **Screen Reader**: VoiceOver compatibility
- **Color Contrast**: Blue theme accessibility compliance (WCAG 2.1 AA)
- **Touch Targets**: Minimum 44pt touch areas
- **Keyboard Navigation**: External keyboard support
- **Dynamic Type**: iOS Dynamic Type support

### Security Testing
- **Data Encryption**: Verify encryption/decryption integrity
- **Key Management**: Keychain storage and retrieval
- **Memory Leaks**: Sensitive data cleanup
- **Export Security**: Encrypted export file validation

### Testing Tools
- **Unit/Integration**: Jest + React Native Testing Library
- **E2E**: Detox (for production builds)
- **Performance**: Flipper, React DevTools, Xcode Instruments
- **Accessibility**: iOS Accessibility Inspector
- **Security**: Static analysis tools, manual security review

### Test Data Management
- **Mock Data**: Realistic prompt samples for each category
- **Test Categories**: All default categories with sample prompts
- **Edge Cases**: Empty states, maximum content length, special characters
- **Localization**: Japanese text handling, character encoding
- **Security**: Test encryption keys, secure data handling