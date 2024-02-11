# SAM (Serverless Application Model)

## SAMとは？
公式ドキュメントは[こちら](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/what-is-sam.html)

## 環境構築
### 基本開発戦略
ローカル環境ではテストによる動作確認までにとどめ、デプロイはなるべくgithub actionsのワークフローを使うようにしました。ローカル環境からの直接デプロイは、環境変数の設定ミスや動作未確認コードのデプロイにつながってしまい、人為的ミスの温床になると考えています。
### SAM CLIのインストール
[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/install-sam-cli.html)を参考にしてください
### SAM のインストール確認
```
sam --version
```

### パラメータの設定
template.yamlのパラメータブロック中のパラメータデフォルト値をそれぞれを環境に合わせて変更してください

### ビルド
コンテナを使ったビルド
```
sam build --use-container
```
sam buildについて、詳しくは[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/using-sam-cli-build.html)を参照してください。
### テスト
未整備。時間があればやってみたい気持ち

### 変更点の確認（デプロイはしない）
コマンド実行前にAWSクレデンシャルの設定を行って下さい。[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-envvars.html)
```
sam deploy --config-env default　--no-execute-changeset
```

### デプロイ（ローカルでは基本は使わないようにする）
コマンド実行前にAWSクレデンシャルの設定を行って下さい。[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-envvars.html)
```
sam deploy --config-env default
```

# API ドキュメンテーション

| APIパス | メソッド | 役割 |
| ---- | ---- | ---- |
| /api/chat | POST | チャットの開始とユーザー応答を投稿する |
| /api/devices/{device_id}/start | POST | {device_id}を持つデバイスの電源をオンする |
| /api/devices/{device_id}/stop | POST | {device_id}を持つデバイスの電源をオフする |
| /api/goals/{goal_id} | GET | {goal_id}のgoal詳細情報を取得する |
| /api/instructors | GET | インストラクター一覧を取得する |
| /api/users/{user_id}/goal | POST | {user_id}のユーザーの目標値を登録、更新する |
| /api/users/{user_id}/goals | GET | {user_id}のユーザーの目標一覧を取得 |
| /api/users/{user_id}/goals/latest | GET | {user_id}のユーザーの、最新の目標値を取得する|
