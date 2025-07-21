# react-express-app-template
このリポジトリは、Docker Compose でローカル実行しつつ、AWS ECS へデプロイできるサンプルアプリです。  
フロントエンド（React / Vite）とバックエンド（Node.js / Express）、MySQL を含みます。

## 🚀 最初にやること（名前の衝突防止）

このプロジェクトをコピーして新しいアプリを作る場合、**ECR / ECS で使う名前を変更**してください。  
同じ AWS アカウントで複数のプロジェクトが同じ名前を使うと、ECR や ECS で競合します。
### ✅ 変更箇所

`cdk-education/lib/cdk-education-stack.ts` を開き、`new Ecr` の第3引数をユニークな名前に変えます。

例:
```typescript
// 元の記述
const ecrBackend = new Ecr(this, "EcrBackend", "backend");
const ecrFrontend = new Ecr(this, "EcrFrontend", "frontend");

// 修正後（例: userA が担当するアプリ）
const ecrBackend = new Ecr(this, "EcrBackend", "backend-userA");
const ecrFrontend = new Ecr(this, "EcrFrontend", "frontend-userA");
```

> 💡 目安: backend-<自分の名前> / frontend-<自分の名前> などにするとよいです。

## 🛠 必要なツール
ローカルで動かす場合も AWS へデプロイする場合も、以下のツールを事前にインストールしてください。

- Rancher Desktop
- Node.js（v18 以上）
- AWS CLI
  - インストール後 aws configure でアクセスキーを設定（後述します）
- AWS CDK
    ```
    npm install -g aws-cdk
    ```

## 💻 ローカルで動かす手順
1. リポジトリをクローン
    ```
    git clone <このリポジトリのURL>
    cd <ディレクトリ>
    ```
2. フロントエンドの環境変数を設定
    frontend ディレクトリの直下に `.env.development`を作成して以下の環境変数を記載する。
    ```
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
3. Docker Compose で起動
    ```
    docker compose up --build
    ```
4. ブラウザで起動した Web アプリにアクセス
    ```
    http://localhost:3000
    ```

> 💡 初回起動時のデータを編集したい場合は db/init.sql を編集してください。

## ☁️ AWS 環境で動かす事前準備

1. 事前準備：AWS アカウント情報の取得

    まず、AWS マネジメントコンソールにログインしてください。  
    （管理者から招待されたアカウントでログインすることを想定しています。）   
    ①画面右上のユーザー名（またはアカウント名）をクリック   
    ②「セキュリティ認証情報」を開く.   
    ③「アクセスキーの作成」をクリックして、新しいアクセスキーを発行してください。

    👉 発行時に表示される内容をメモしてください

    - アクセスキー ID（例：AKIA... で始まる文字列）
    - シークレットアクセスキー（一度しか表示されません！）

2. AWS CLI をインストール
   Mac の場合は `brew install awscli` でインストールできます。

3. aws configure コマンドを実行
   ターミナルで以下を入力してください。  
   ```
   aws configure
   ```
   実行すると、順番に以下を聞かれますので、取得した情報を入力します。

    | 質問                    | 入力する内容             | 補足               |
    | --------------------- | ------------------ | ---------------- |
    | AWS Access Key ID     | 取得した「アクセスキー ID」    | 例：`AKIA...`      |
    | AWS Secret Access Key | 取得した「シークレットアクセスキー」 | ※ 一度しか見れないので注意   |
    | Default region name   | `ap-northeast-1`   | 東京リージョンを指定します    |
    | Default output format | `json`             | （Enter を押せばOKです） |

4. 正しく設定されているかを確認
    ```
    aws sts get-caller-identity
    ```
    上記コマンドを実行して、以下のように表示されれば成功です！
    ```json
    {
        "UserId": "XXXXXXXXXXXXX",
        "Account": "123456789012",
        "Arn": "arn:aws:iam::123456789012:user/your-user-name"
    }
    ```

## ☁️ AWS 環境で動かす手順
1. フロントエンドの環境変数を設定
    frontend ディレクトリの直下に `.env.production`を作成して以下の環境変数を記載する。
    初回デプロイ時はまだ ALB の DNS が決まっていないので、仮の値で OK です。  
    後で ALB ができたら更新します。
    ```
    VITE_API_BASE_URL=http://<後で書き換え>/
    ```

2. ECR にイメージをプッシュ
    フロントエンド・バックエンドのコンテナイメージをそれぞれビルドしてプッシュします。  

    フロントエンドの手順は以下の通りです。    
    `<フロントECR名>` と `<AWSアカウントID>` は置き換える必要があります。

    ```
    cd frontend
    docker build -t <フロントECR名>:latest .
    aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com
    docker tag <フロントECR名>:latest <AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com/<フロントECR名>:latest
    docker push <AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com/<フロントECR名>:latest
    ```

    バックエンドの手順は以下の通りです。   
    `<バックECR名>` と `<AWSアカウントID>` は置き換える必要があります。

    ```
    cd backend
    docker build -t <バックECR名>:latest .
    aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com
    docker tag <バックECR名>:latest <AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com/<バックECR名>:latest
    docker push <AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com/<バックECR名>:latest
    ```

3. CDK で初回デプロイ
    ```
    cd cdk-education
    npm install
    cdk deploy
    ```
    `Do you wish to deploy these changes (y/n)?` と聞かれたら `y` と入力してください。
    デプロイ後、ALB の DNS 名が出力されるため、コピーして控えてください。

4. .env.production を ALB DNS に更新
    初回デプロイ後、frontend/.env.production の `VITE_API_BASE_URL` を ALB の DNS に合わせて修正します。
    ```
    VITE_API_BASE_URL=http://<ALB-DNS>:8080/api
    ```
    `<ALB-DNS>` は 3. でコピーした ALB の DNS 名に置き換えてください。

5. .env.production 更新後に再デプロイ
    .env.production を変更しただけでは反映されないので、フロントエンドを再ビルド・プッシュし、CDK で再デプロイします。   
      `<フロントECR名>` と `<AWSアカウントID>` は置き換える必要があります。
    ```
    # フロントエンドを再ビルド＆プッシュ
    cd frontend
    docker build -t <フロントECR名>:latest .
    aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com
    docker push <AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com/<フロントECR名>:latest

    # CDKで再デプロイ
    cd ../cdk-education
    cdk deploy
    ```
