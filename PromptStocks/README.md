# PromptStocks

**AIプロンプトライブラリ - オフライン対応のReact Native/Expoアプリ**

PromptStocksは、LLM用のプロンプトを管理、保存、迅速にアクセスできる完全オフライン対応のiOSアプリです。カテゴリ別の整理機能、テンプレートシステム、そしてアプリを閉じていてもプロンプトにアクセスできる常時表示ウィジェット機能を提供します。

## 🌟 主な機能

### 📝 プロンプト管理
- **オフライン完結**: インターネット接続不要の完全ローカルストレージ
- **カテゴリ別整理**: 作業効率、文章作成、データ分析、コミュニケーションなど
- **テンプレートシステム**: 構造化されたプロンプトテンプレートと自由記述モード
- **タグ機能**: 柔軟な分類とフィルタリング
- **お気に入り機能**: よく使うプロンプトのクイックアクセス

### 🎯 インテリジェントUI
- **美しいデザイン**: HTML prototypesをベースにしたiOS最適化UI
- **ガラスモーフィズム**: 現代的で洗練されたビジュアルデザイン
- **アニメーション**: スムーズなトランジションとマイクロインタラクション
- **ダークモード対応**: システム設定に応じた自動切り替え

### 📱 iOSウィジェット
- **常時アクセス**: アプリを開かずにプロンプトにアクセス
- **複数サイズ対応**: Small、Medium、Largeウィジェット
- **カテゴリ表示**: ウィジェット上でのカテゴリ切り替え
- **ワンタップコピー**: 素早いクリップボードコピー機能

### 🔒 プライバシー重視
- **外部通信なし**: データは一切外部に送信されません
- **ローカル暗号化**: 機密性の高いプロンプトの安全な保存
- **App Groups**: アプリとウィジェット間の安全なデータ共有

## 🛠 技術スタック

### フロントエンド
- **React Native** (0.74.5)
- **Expo** (SDK 51)
- **TypeScript** (Strict Mode)
- **React Navigation** (Stack Navigation)

### ストレージ
- **AsyncStorage**: 軽量データの高速アクセス
- **SQLite**: 複雑なクエリとパフォーマンス最適化
- **キャッシュシステム**: メモリ効率的なデータアクセス

### iOS統合
- **SwiftUI**: ネイティブウィジェット実装
- **WidgetKit**: iOS 14+対応ウィジェット
- **App Groups**: セキュアなデータ共有

## 📁 プロジェクト構造

```
PromptStocks/
├── src/
│   ├── components/          # UI コンポーネント
│   │   ├── ui/             # 基本UIコンポーネント (Button, Card, Input)
│   │   ├── prompt/         # プロンプト関連コンポーネント
│   │   ├── category/       # カテゴリ管理コンポーネント
│   │   └── template/       # テンプレートコンポーネント
│   ├── screens/            # React Nativeスクリーン
│   ├── services/           # ビジネスロジック層
│   ├── repositories/       # データアクセス層
│   ├── models/            # TypeScriptデータモデル
│   ├── storage/           # ローカルストレージ管理
│   ├── navigation/        # React Navigation設定
│   ├── hooks/             # カスタムReact hooks
│   ├── utils/             # ユーティリティ関数
│   └── types/             # TypeScript型定義
├── ios/
│   ├── PromptStocks/          # メインiOSアプリ
│   └── PromptStocksWidget/    # iOSウィジェット拡張
└── assets/                # アプリアセット (アイコン、画像など)
```

## 🚀 セットアップ手順

### 前提条件
- **Node.js** 18.0.0以上
- **npm** または **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **iOS開発環境**: Xcode 14.0以上 (ウィジェット開発用)

### インストール

1. **リポジトリをクローン**
```bash
git clone <repository-url>
cd PromptStocks/PromptStocks
```

2. **依存関係をインストール**
```bash
npm install
# または
yarn install
```

3. **ExpoGoでの起動**
```bash
# 開発サーバーを起動
npm start
# または
expo start

# QRコードが表示されたら:
# - iOSの場合: カメラアプリでQRコードをスキャン
# - Androidの場合: ExpoGoアプリでQRコードをスキャン
```

4. **シミュレータでの実行 (オプション)**
```bash
npm run ios     # iOSシミュレータ
npm run android # Androidエミュレータ
```

### 📱 ウィジェット開発

ウィジェットを開発・テストするには：

1. **Xcodeでプロジェクトを開く**
```bash
cd ios
open PromptStocks.xcworkspace
```

2. **ウィジェット拡張をビルド**
- Xcodeで「PromptStocksWidget」ターゲットを選択
- シミュレータまたは実機でビルド・実行

3. **ウィジェットをホーム画面に追加**
- iOSホーム画面を長押し
- 左上の「+」ボタンをタップ
- 「PromptStocks」を検索して追加

## 📚 使用方法

### 基本的な使い方

1. **プロンプト作成**
   - ホーム画面の「+」ボタンをタップ
   - テンプレートまたは自由記述を選択
   - タイトル、カテゴリ、タグを設定
   - 「保存」をタップ

2. **プロンプト使用**
   - ホーム画面からプロンプトを選択
   - 「実行」ボタンでクリップボードにコピー
   - 他のアプリでペーストして使用

3. **ウィジェット使用**
   - ホーム画面のウィジェットからプロンプトを選択
   - コピーアイコンをタップで即座にクリップボードにコピー

### カテゴリ管理

- **デフォルトカテゴリ**: 作業効率、文章作成、データ分析、コミュニケーション、その他
- **カスタムカテゴリ**: 独自のカテゴリを作成・管理
- **色分け**: カテゴリごとの視覚的識別

### テンプレートシステム

利用可能なテンプレート：
- **タスク分析エンジン**: プロジェクト管理用
- **ブログコンテンツ作成**: SEO最適化記事用
- **データ分析ハブ**: データサイエンス用

## 🔧 開発ガイド

### TypeScript設定
- **Strict Mode有効**: 型安全性の確保
- **Path Mapping**: `@/*`エイリアスでクリーンなインポート
- **型定義**: すべてのモデルとインターフェースを定義

### ストレージ戦略
- **階層化**: AsyncStorage + SQLite + キャッシュ
- **パフォーマンス**: インデックス最適化とクエリ効率化
- **容量管理**: 使用量監視と自動クリーンアップ

### テスト
```bash
# 単体テスト
npm test

# 型チェック
npm run type-check

# リント
npm run lint
```

## 📊 ストレージ仕様

### データモデル

#### Prompt
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
  size: number;
  lastAccessed: Date;
}
```

#### Category
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
  totalSize: number;
}
```

### ストレージ制限
- **最大容量**: 100MB
- **警告閾値**: 80%
- **自動クリーンアップ**: 90%

## 🎨 デザイン仕様

### カラーパレット
- **Primary**: `#1DB584` (Craft Teal)
- **Secondary**: `#8B5CF6` (Purple)
- **Accent**: `#3B82F6` (Blue), `#EC4899` (Pink), `#F59E0B` (Orange)
- **Neutral**: `#F8F9FA` (Background), `#374151` (Text)

### タイポグラフィ
- **システムフォント**: `-apple-system` (iOS最適化)
- **モノスペース**: `SF Mono` (コード表示用)

## 🔐 セキュリティ

### データ保護
- **ローカル暗号化**: 機密プロンプトの暗号化保存
- **App Groups**: `group.com.promptstocks.shared`
- **外部通信禁止**: ネットワークアクセス一切なし

### プライバシー
- **データ収集なし**: ユーザーデータは一切収集されません
- **外部送信なし**: すべてのデータはデバイス内で完結
- **透明性**: オープンソースによる完全な透明性

## 🚢 デプロイメント

### iOS App Store
1. **Expo Application Services (EAS) Build**
```bash
eas build --platform ios
```

2. **App Store Connect**
- Xcodeでアーカイブ作成
- App Store Connectにアップロード
- レビュー提出

### 要件
- **iOS 14.0以上**: ウィジェット機能のため
- **iPhone/iPad対応**: ユニバーサルアプリ
- **プライバシー準拠**: App Storeガイドライン準拠

## 🤝 コントリビューション

1. **Fork** このリポジトリ
2. **Feature branch** を作成: `git checkout -b feature/amazing-feature`
3. **Commit** 変更: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Pull Request** を作成

### 開発ガイドライン
- **TypeScript Strict Mode** 準拠
- **コメント**: 日本語コメント推奨
- **テスト**: 新機能には適切なテストを追加
- **ドキュメント**: READMEの更新

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- **Expo Team**: 素晴らしいReact Nativeフレームワーク
- **React Navigation**: スムーズなナビゲーション体験
- **Community**: オープンソースコミュニティのサポート

---

**Made with ❤️ for AI enthusiasts**

AIプロンプトを効率的に管理し、生産性を向上させるために開発されました。