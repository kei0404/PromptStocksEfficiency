# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PromptStocks is a React Native/Expo iOS app for managing LLM prompts with complete offline functionality. The app allows users to organize, store, and quickly access various types of prompts categorized by tasks, supporting both structured prompt templates and free-form text. It includes a persistent iOS widget for quick prompt access even when the main app is closed.

## Development Commands

### Project Setup
```bash
# Initialize Expo React Native project
npx create-expo-app PromptStocks --template typescript
cd PromptStocks

# Install core dependencies
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install expo-clipboard
npx expo install expo-sqlite

# Install UI and development dependencies
npm install react-native-elements react-native-vector-icons
npm install -D jest @testing-library/react-native detox
```

### Development
```bash
# Start development server (preferred method)
npm start

# Start with tunnel for ExpoGo
npm run start:tunnel

# Alternative start methods (if npx has issues)
npm run start:local
./node_modules/.bin/expo start --tunnel

# Run on iOS simulator
npx expo start --ios

# Run tests
npm test

# Type checking
npx tsc --noEmit

# Linting
npx eslint src/
```

### Build
```bash
# Build for iOS
npx expo build:ios

# Create development build
npx expo run:ios
```

## Architecture

### Core Principles
- **Offline-first**: No external API calls or cloud services
- **Local storage only**: All data stored on device using AsyncStorage/SQLite
- **Privacy-focused**: No external data transmission
- **iOS-optimized**: Native iOS widget with App Groups for data sharing

### Directory Structure
```
src/
├── components/          # React components by feature
│   ├── ui/             # Basic UI components (Button, Card, Input)
│   ├── prompt/         # Prompt-related components
│   ├── category/       # Category management components
│   ├── template/       # Template components
│   └── storage/        # Storage management components
├── screens/            # React Native screens
├── services/           # Business logic layer
├── repositories/       # Data access layer
├── models/            # TypeScript data models
├── storage/           # Local storage management
├── navigation/        # React Navigation setup
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── types/             # TypeScript type definitions

ios/
├── PromptStocks/           # Main iOS app
└── PromptStocksWidget/     # iOS widget extension
```

### Data Models

#### Prompt Model
```typescript
interface Prompt {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'user' | 'assistant' | 'custom';
  categoryId: string;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isFavorite: boolean;
  size: number;           // Storage size in bytes
  lastAccessed: Date;     // For cleanup and usage analytics
}
```

#### Category Model
```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  promptCount: number;
  totalSize: number;      // Total storage size of prompts in this category
}
```

### Service Layer Architecture

#### PromptManager
- Central service for prompt CRUD operations
- Methods: createPrompt, updatePrompt, deletePrompt, getPromptsByCategory, copyPromptToClipboard
- Includes storage size tracking and usage analytics

#### CategoryManager
- Manages task categories and organization
- Methods: createCategory, getCategories, updateCategory, deleteCategory
- Tracks storage usage per category

#### StorageService
- Handles local data persistence with AsyncStorage/SQLite
- Methods: saveData, getData, deleteData, getAllPrompts, getStorageUsage, createBackup, restoreBackup
- Includes storage monitoring and cleanup mechanisms

#### TemplateService
- Manages prompt templates for different tasks
- Methods: getTemplatesByTask, createCustomTemplate, applyTemplate
- Tracks template usage for optimization

### iOS Widget Implementation

#### Key Components
- **WidgetDataProvider**: Provides data from shared storage to iOS widget
- **WidgetView**: Native iOS widget UI implementation using SwiftUI
- **App Groups**: Secure local data sharing between main app and widget

#### Widget Features
- Small, medium, large widget sizes
- Category-based prompt organization
- Quick copy functionality
- Completely offline operation with cached local data

## Testing Strategy

### Unit Tests
```bash
# Test individual services
npm test -- --testPathPattern=services

# Test components
npm test -- --testPathPattern=components

# Test storage operations
npm test -- --testPathPattern=storage
```

### Integration Tests
```bash
# Test complete workflows
npm test -- --testPathPattern=integration

# Test widget integration
npm test -- --testPathPattern=widget
```

## Storage Management

### Local Storage Priority
1. **AsyncStorage**: Simple key-value pairs for basic data
2. **SQLite**: Complex queries and better performance for larger datasets
3. **App Groups**: Secure data sharing between main app and widget

### Storage Monitoring
- Real-time storage usage tracking
- Storage capacity warnings
- Automated cleanup recommendations
- Storage optimization for large prompt collections

### Backup & Recovery
- Local backup system for all prompt data
- Data restoration with integrity validation
- Data migration tools for app updates

## Development Guidelines

### TypeScript Usage
- Strict mode enabled for type safety
- All models and interfaces defined in `src/models/`
- Type definitions in `src/types/`

### Error Handling
- Robust offline error handling
- Storage failure fallback mechanisms
- User-friendly error messages for validation errors
- Silent widget failures with fallback to main app

### Performance Optimization
- Lazy loading for large prompt collections
- Local caching for frequently accessed data
- Minimal widget update frequency to save battery
- Memory management for unused components

### Privacy & Security
- No external network dependencies
- Local data encryption for sensitive content
- Secure data sharing via App Groups
- Complete offline functionality

## Key Constraints

### Offline-First Design
- **No network dependencies**: Completely eliminate external API calls
- **Local storage exclusive**: All data stored on device local storage
- **Complete offline operation**: Full functionality without internet connection

### Data Privacy
- **No external data transmission**: Strict prohibition of data sent to external servers
- **App Groups only**: Secure app-widget data sharing using iOS App Groups
- **Local data encryption**: Protection of sensitive data in local storage

### iOS Optimization
- **iOS 14.0+ compatibility**: Support for modern iOS versions
- **Widget integration**: Native iOS widget with SwiftUI
- **Performance optimization**: Efficient local storage and caching strategies