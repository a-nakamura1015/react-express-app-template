# =========================
# 開発用ステージ (dev)
# =========================
FROM node:18-alpine AS dev
WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# ポートを公開 (Vite dev server)
EXPOSE 3000

# 開発モード起動
CMD ["npm", "run", "dev"]


# =========================
# ビルドステージ (build)
# =========================
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 本番用にビルド (env.production を参照)
RUN npm run build -- --mode production


# =========================
# 本番用ステージ (prod)
# =========================
FROM nginx:alpine AS prod

# ビルド成果物を nginx ディレクトリへ
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx で公開
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
