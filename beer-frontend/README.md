# フロントエンドについて
React, Typescriptで構築しています
# 環境構築
## インストール
依存するライブラリのバージョン管理のためにnpmを使用しています。Node.JSを[公式サイト](https://nodejs.org/en/download)を参考にしてインストールしてください。

インストールの確認を行ってください
```
npm --version
```

## 環境変数の設定（.envファイルの作成）
開発を始める前に環境変数を定義する必要があります。
beer-frontend/に.envファイルを作成して、以下の環境変数を定義してください
各環境変数の`xxxxxx`は適切な値に変更してください
```
REACT_APP_API_URL=https://xxxxxxx.cloudfront.net/Prod/api
REACT_APP_DOMAIN=http://localhost:3000
REACT_APP_FITBIT_AUTH_CLIENT_ID=XXXXXX
REACT_APP_FITBIT_AUTH_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_COGNITO_USER_POOL_DOMAIN=https://xxxxxxxxx.auth.ap-northeast-1.amazoncognito.com
REACT_APP_COGNITO_AUTH_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_COGNITO_AUTH_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 環境変数の設定（deploy.shファイルの変数を変更）
ビルドしたReactの成果物ファイルを置いておくS3バケット名はそれぞれの環境に応じて正しい名前を設定してください
```
AWS_REGION = ap-northeast-1
S3_BUCKET = xxxxxxxxx
```

## デバッグの実施
```
cd beer-frontend
npm start
```
ビルドの完了後、http://localhost:3000 にブラウザでアクセスしてください。

## 設計
最近流行りのDDDをフロントエンドに導入する感じで実装を進めました→[参考](https://qiita.com/sho-kanamaru/items/dce0d93e71e7815da8a8)

```
beer-frontend/
├── public/ htmlに記載するメタデータとか、faviconとかを入れとくところ
|
├── src/
│   ├── assets/ 静的な画像ファイルを置いとく場所　ヘッダ画像とか
│   ├── components/ UIの実装部分
│   │   │
│   │   ├── blocks/ ある程度固まった単位のコンポーネントを置いておくところ CardやTableなど
│   │   └── pages/ 一つのページを構成するコンポーネント 一つのページが一つのPath（/beerや/chatなど）に対応している
│   ├── contexts/ globalなcontextを生成する login状態はcontextを用いると実装が楽になる  
│   ├── infrastructures/ DDDでいうインフラストラクチャ層（外部リソースへの依存を具体的に実装する層）を実装している
│   ├── models/ DDDでいうドメイン(エンティティの定義)層 アプリケーション内で扱うデータ型を定義している
│   ├── repositories/ DDDでいうリポジトリ層（usecase） UIのボタン押下などから呼び出される関数は一度この層で抽象化されている
│   ├── utiles/ 全体で扱える便利関数を置いておく
│   │
│   ├── App.tsx アプリケーションのルートとなるコンポーネント
│   ├── env.ts 環境変数を読み込むファイル　環境変数に不的な値があるとここでエラーが出るようにしておく
│   ├── index.tsx アプリケーションのindex.htmlから参照される最上位のファイル
│   └── Routes.tsx ルーティングを定義している
├── .env 環境変数を定義するファイル .gitignoreされています ローカルにそれぞれ作成してください
├── build.sh Github Actions内で実行するビルドコマンドを定義しているファイル
└── deploy.sh  Github Actions内で実行するデプロイコマンドを定義しているファイル　S3バケット名を自環境に則した値で定義してください
```

