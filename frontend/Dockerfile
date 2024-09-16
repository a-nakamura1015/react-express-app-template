# ベースイメージ
FROM node:18-alpine

# 作業ディレクトリの設定
WORKDIR /app

# パッケージファイルをコピーして依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# ポートを公開
EXPOSE 3000

# フロントエンドの開発サーバーを起動
CMD ["npm", "run", "dev"]
