# PromptStocks - 起動手順

## 🚀 ExpoGoでの起動方法

### 1. 前提条件
- **Node.js** (18.0.0以上)
- **Expo CLI**: `npm install -g expo-cli` または `npm install -g @expo/cli`
- **ExpoGoアプリ**: スマートフォンにExpoGoアプリをインストール
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. プロジェクトセットアップ
```bash
# プロジェクトディレクトリに移動
cd PromptStocks/PromptStocks

# 依存関係をインストール
npm install
```

### 3. 開発サーバー起動
```bash
# 開発サーバーを起動
npm start
# または
expo start
```

### 4. アプリを実行
開発サーバーが起動すると、ターミナルまたはブラウザでQRコードが表示されます。

**iOSの場合:**
- iPhoneのカメラアプリでQRコードをスキャン
- 「Expo Goで開く」をタップ

**Androidの場合:**
- ExpoGoアプリを開く
- 「Scan QR Code」でQRコードをスキャン

## 🐛 トラブルシューティング

### よくある問題と解決方法

1. **QRコードが読み取れない**
   ```bash
   expo start --tunnel
   ```

2. **依存関係のエラー**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **TypeScriptエラー**
   - tsconfig.jsonは既に緩い設定になっています
   - エラーが出る場合は一時的に無視して動作確認してください

4. **Metro bundlerエラー**
   ```bash
   expo start --clear
   ```

## 📱 機能確認

アプリが起動したら以下の機能をテストしてください：

1. **スプラッシュスクリーン** - 美しいアニメーション付きスタートアップ
2. **ホーム画面** - ストレージ統計とプロンプトカード表示
3. **ナビゲーション** - 下部タブとスクリーン遷移
4. **データ保存** - プロンプトとカテゴリの作成・保存（AsyncStorage使用）

## 🎯 開発のヒント

- **ホットリロード**: ファイルを保存すると自動的に再読み込み
- **デバッガー**: Expo DevToolsでログとエラーを確認
- **リロード**: アプリ内でスマートフォンを振ってリロードメニューを表示

## 📞 サポート

問題が発生した場合：
1. [Expo Documentation](https://docs.expo.dev/)を確認
2. [React Navigation Documentation](https://reactnavigation.org/)を確認
3. プロジェクトのREADME.mdを参照

---

**開発を楽しんでください！🎉**