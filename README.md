# BNI Big Forests Chapter Website

BNIビッグフォレスツチャプターの公式PRサイトです。
メンバー情報の管理にLark Baseを使用し、リアルタイムな情報更新と容易な管理を実現しています。

## 🚀 プロジェクト概要

- **目的**: チャプターのPR、メンバー紹介、ビジター招待の促進
- **主な機能**:
  - メンバー一覧表示（Lark Base連携）
  - カテゴリ・キーワード検索
  - お問い合わせフォーム（Lark Form連携）
  - レスポンシブデザイン（スマホ対応）

## 🛠 技術スタック

- **Frontend**: React 19, TailwindCSS 4
- **Hosting**: Cloudflare Pages
- **Database**: Lark Base (埋め込みビュー)
- **Form**: Lark Form

## 💻 開発環境のセットアップ

1. **依存関係のインストール**
   ```bash
   pnpm install
   ```

2. **開発サーバーの起動**
   ```bash
   pnpm dev
   ```
   ブラウザで `http://localhost:3000` を開いて確認できます。

## 🌐 デプロイ (Cloudflare Pages)

このプロジェクトはCloudflare Pagesにデプロイするように構成されています。

### 設定値
Cloudflare Pagesの管理画面で以下の設定を行ってください：

- **Framework preset**: None (または Vite)
- **Build command**: `npm run build:pages`
  - ※ `npm run build` ではありません（サーバーサイドのビルドをスキップするため）
- **Build output directory**: `dist/public`

### 環境変数
現在は静的な埋め込みビューを使用しているため、必須の環境変数はありません。
将来的にAPI連携を再有効化する場合は、Lark APIのクレデンシャル設定が必要です。

## 📝 コンテンツの更新方法

### メンバー情報の更新
Webサイト上のメンバー一覧は、Lark Baseのデータを直接参照しています。
Lark Base上でメンバーを追加・編集・削除すると、Webサイトにも**即座に反映**されます。
再デプロイの必要はありません。

- **Lark Base URL**: [管理用Lark Baseへのリンク]
- **写真**: Lark Baseの「写真」列に画像をアップロードすると表示されます。

### お問い合わせフォーム
フッターの「お問い合わせ」リンクは、Lark Formに接続されています。
フォームの内容を変更したい場合は、Lark側でフォームの編集を行ってください。

## 📁 ディレクトリ構成

```
bigforests-web/
├── client/                 # フロントエンドのソースコード
│   ├── public/             # 静的アセット（画像など）
│   └── src/
│       ├── components/     # UIコンポーネント
│       ├── pages/          # ページコンポーネント
│       └── index.css       # グローバルスタイル（Tailwind設定）
├── functions/              # Cloudflare Pages Functions (API用・現在は未使用)
└── package.json            # プロジェクト設定
```
