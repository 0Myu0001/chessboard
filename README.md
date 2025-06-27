# chessboard

# Audio Segments Player

React + Vite + Tailwind 製。音声ファイルを ffmpeg で分割し、各クリップをボタン再生するシンプル DEMO。

## セットアップ
```bash
pnpm create vite
# または npm create vite@latest
cd audio-segments-player
npm install
```

## ローカル開発
```bash
npm run dev
```

## GitHub Pages デプロイ
* `vite.config.js` の `base` を `/REPO_NAME/` に置換
* GitHub にリポジトリを作成し push
```bash
npm run deploy   # gh-pages ブランチへ自動 push
```

### GitHub Actions で自動化したい場合
`.github/workflows/pages.yml` を参照。

## 音声の分割
```bash
bash segment.sh 普通.m4a
```
