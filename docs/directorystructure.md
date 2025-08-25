# ディレクトリ構成 - Prompt Manager App

以下のディレクトリ構造に従って実装を行ってください：

```
/
├── src/                          # ソースコードディレクトリ
│   ├── components/               # Reactコンポーネント
│   │   ├── ui/                   # 基本UI（Button, Card, Input等）
│   │   ├── prompt/               # プロンプト関連コンポーネント
│   │   │   ├── PromptList.tsx
│   │   │   ├── PromptCard.tsx
│   │   │   ├── PromptCreateForm.tsx
│   │   │   └── PromptEditForm.tsx
│   │   ├── category/             # カテゴリ関連コンポーネント
│   │   │   ├── CategoryList.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   └── CategoryManager.tsx
│   │   ├── template/             # テンプレート関連コンポーネント
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── TemplatePreview.tsx
│   │   │   └── TemplateForm.tsx
│   │   ├── storage/              # ストレージ管理コンポーネント
│   │   │   ├── StorageMonitor.tsx
│   │   │   ├── BackupManager.tsx
│   │   │   └── CleanupManager.tsx
│   │   └── widget/               # ウィジェット設定コンポーネント
│   │       ├── WidgetSettings.tsx
│   │       ├── WidgetSizeSelector.tsx
│   │       ├── WidgetContentConfig.tsx
│   │       ├── WidgetPreview.tsx
│   │       └── PriorityPromptSelector.tsx
│   ├── screens/                  # React Nativeスクリーン
│   │   ├── PromptListScreen.tsx
│   │   ├── PromptDetailScreen.tsx
│   │   ├── PromptCreateScreen.tsx
│   │   ├── PromptEditScreen.tsx
│   │   ├── CategoryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── WidgetSettingsScreen.tsx
│   ├── services/                 # ビジネスロジック・サービス層
│   │   ├── PromptManager.ts
│   │   ├── CategoryManager.ts
│   │   ├── TemplateService.ts
│   │   ├── StorageService.ts
│   │   ├── ClipboardService.ts
│   │   └── WidgetConfigurationService.ts
│   ├── repositories/             # データアクセス層
│   │   ├── PromptRepository.ts
│   │   ├── CategoryRepository.ts
│   │   └── TemplateRepository.ts
│   ├── models/                   # データモデル・型定義
│   │   ├── Prompt.ts
│   │   ├── Category.ts
│   │   ├── Template.ts
│   │   ├── WidgetConfiguration.ts
│   │   └── index.ts
│   ├── storage/                  # ローカルストレージ管理
│   │   ├── AsyncStorageWrapper.ts
│   │   ├── SQLiteWrapper.ts
│   │   ├── BackupManager.ts
│   │   └── StorageAnalytics.ts
│   ├── navigation/               # React Navigation設定
│   │   ├── AppNavigator.tsx
│   │   ├── StackNavigator.tsx
│   │   └── types.ts
│   ├── hooks/                    # カスタムReactフック
│   │   ├── usePrompts.ts
│   │   ├── useCategories.ts
│   │   ├── useStorage.ts
│   │   └── useClipboard.ts
│   ├── utils/                    # ユーティリティ関数
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   ├── storage.ts
│   │   └── constants.ts
│   └── types/                    # TypeScript型定義
│       ├── navigation.ts
│       ├── storage.ts
│       └── global.ts
├── ios/                          # iOSネイティブコード
│   ├── PromptStocks/             # メインアプリ
│   │   ├── AppDelegate.h
│   │   ├── AppDelegate.m
│   │   └── Info.plist
│   ├── PromptStocksWidget/       # iOSウィジェット拡張
│   │   ├── PromptStocksWidget.swift
│   │   ├── WidgetView.swift
│   │   ├── WidgetDataProvider.swift
│   │   ├── WidgetConfigurationManager.swift
│   │   ├── WidgetSizeLayouts.swift
│   │   └── Info.plist
│   └── PromptStocks.xcodeproj/   # Xcodeプロジェクト
├── android/                      # Android（将来拡張用）
├── assets/                       # アプリケーション資産
│   ├── images/
│   ├── icons/
│   └── fonts/
├── docs/                         # プロジェクト文書
│   ├── requirements.md
│   ├── design.md
│   ├── tasks.md
│   ├── technologystack.md
│   └── directorystructure.md
├── __tests__/                    # テストファイル
│   ├── components/
│   ├── services/
│   ├── repositories/
│   └── utils/
├── node_modules/                 # 依存パッケージ
├── .expo/                        # Expo設定
├── .git/                         # Gitリポジトリ
├── .cursor/                      # Cursor設定
├── expo-go/                      # ExpoGo開発専用ファイル
│   ├── mock-widgets/             # ウィジェット機能のモック実装
│   ├── dev-utils/                # ExpoGo開発用ユーティリティ
│   └── compatibility-checks/     # ExpoGo互換性チェック
├── package.json                  # プロジェクト設定
├── package-lock.json             # 依存関係ロックファイル
├── tsconfig.json                 # TypeScript設定
├── app.json                      # Expo設定
├── babel.config.js               # Babel設定
├── metro.config.js               # Metro bundler設定
├── jest.config.js                # Jest設定
├── eslint.config.mjs             # ESLint設定
├── .gitignore                    # Git除外設定
└── README.md                     # プロジェクト概要
```

### 配置ルール

#### コンポーネント配置
- **基本UIコンポーネント** → `src/components/ui/`
- **機能別コンポーネント** → `src/components/[feature]/`
- **画面コンポーネント** → `src/screens/`

#### サービス・ロジック配置
- **ビジネスロジック** → `src/services/`
- **データアクセス** → `src/repositories/`
- **ストレージ管理** → `src/storage/`
- **ウィジェット設定管理** → `src/services/WidgetConfigurationService.ts`

#### 型定義・モデル配置
- **データモデル** → `src/models/`
- **TypeScript型定義** → `src/types/`

#### iOSネイティブ配置
- **メインアプリ** → `ios/PromptStocks/`
- **ウィジェット拡張** → `ios/PromptStocksWidget/`
- **ウィジェット設定管理** → `ios/PromptStocksWidget/WidgetConfigurationManager.swift`
- **ウィジェットレイアウト** → `ios/PromptStocksWidget/WidgetSizeLayouts.swift`

#### テスト配置
- **全テストファイル** → `__tests__/[対応するsrc構造]/`

#### ExpoGo開発配置
- **ウィジェットモック** → `expo-go/mock-widgets/`
- **開発ユーティリティ** → `expo-go/dev-utils/`
- **互換性チェック** → `expo-go/compatibility-checks/`

### アーキテクチャ原則
- **レイヤー分離**: UI → Services → Repositories → Storage
- **ローカルストレージ専用**: 外部API呼び出しなし
- **オフライン最優先**: すべての機能がオフラインで動作
- **型安全性**: TypeScriptによる厳格な型チェック
- **段階的開発**: ExpoGo互換性を保持しつつネイティブ機能への拡張を考慮

### ExpoGo開発の考慮事項
- **基本機能重視**: ExpoGoで動作する機能を優先的に開発
- **モック実装**: ウィジェット等のネイティブ機能のモック版を提供
- **互換性管理**: ExpoGo制限事項の明確な管理と代替手段の実装
- **段階的移行**: ExpoGo → ネイティブビルドへのスムーズな移行計画
