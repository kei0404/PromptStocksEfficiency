# PromptStocks - ネットワーク接続設定

## 🌐 ExpoGoネットワーク接続の問題解決

### 現在の設定
- **PC IP**: 192.168.3.16
- **Metro Bundler**: http://localhost:8081
- **Tunnel接続**: 有効

### 接続方法 1: 手動URL入力

ExpoGoアプリで以下の手順を実行してください：

1. ExpoGoアプリを開く
2. 「Enter URL manually」をタップ
3. 以下のいずれかのURLを入力：

```
exp://192.168.3.16:8081
```

または

```
exp://localhost:8081
```

### 接続方法 2: QRコード問題の解決

1. **WiFi確認**: PC とモバイルが完全に同じネットワークに接続されていることを確認
2. **ファイアウォール**: macOSのファイアウォール設定でNode.jsとExpoのアクセスを許可
3. **ポート確認**: 8081ポートが他のアプリケーションに使用されていないことを確認

### 接続方法 3: トンネル接続 (推奨)

```bash
npx expo start --tunnel
```

トンネル接続は最も確実な方法です。QRコードが生成されたら：

1. ExpoGoでQRコードをスキャン
2. または、表示されたURLを手動で入力

### トラブルシューティング

#### 問題: "Network response timed out"
**解決策**:
```bash
# Metro cache をクリア
npx expo start --clear

# または完全なクリーンアップ
rm -rf node_modules/.cache
npm start
```

#### 問題: "Could not connect to development server"
**解決策**:
1. PCとモバイルの同一WiFi確認
2. ファイアウォール設定確認
3. トンネル接続使用: `npx expo start --tunnel`

#### 問題: "Bundle download failed"
**解決策**:
```bash
# TypeScript チェック
npx tsc --noEmit

# 依存関係の再インストール
npm install --cache /tmp/.npm
```

### 現在の実行コマンド

```bash
# 推奨: トンネル接続
npx expo start --tunnel

# または LAN接続
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.3.16 npx expo start --host lan
```

### デバッグ情報

- **Node.js**: 実行中
- **Metro Bundler**: ポート 8081
- **TypeScript**: エラーなし
- **依存関係**: 正常インストール済み
- **プラットフォーム**: iOS, Android (Webなし)

---

**接続に成功したら、PromptStocksアプリの美しいスプラッシュスクリーンとホーム画面が表示されます！**