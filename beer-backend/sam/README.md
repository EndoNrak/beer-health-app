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


## SAMを採用したときのメリット・デメリット（個人的な意見）
IaC(Infrastructure as code)ツールにはさまざまなものが存在します。そんななか今回のプロダクトではLambdaとAPIGatewayの管理はSAMを用いている一方で、他のAWSリソースはcloudformationで管理しています。  
ネット上にはSAMの利点や欠点があまたに語られていますが、私の考えを以下に示します。
### メリット 記述が簡素化される。
[こちらの記事](https://qiita.com/wangqijiangjun/items/463a9a652e62eefa2e4d#1-%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E3%81%AE%E7%B0%A1%E7%B4%A0%E5%8C%96)を参考にしてください。SAMによるcloudformationと比較した時の記述の簡素化効果は明らかです。とくに各lambda用のRoleや、APIGatewayとの統合の際の記述の仕方は、SAMを用いることでかなり簡素化されて感動しました。それ以来はなるべくSAMを活用するようにしています。
### デメリット 無意識にいろんなものが生成されてしまう
これは便利さの裏返しですが、記述量を減らせるのと対照的に、cloudformationでは記述しなければ生成されなかったものがSAMでは自動的に生成されます。
私の経験上で意識している点は以下です。

- それぞれのfunctionに対し、リテンションが無制限のCloudWatch logs groupが自動的に生成される。これによってcloudwatchの費用が掛かってしまう。必ずlog groupをリテンションを適切に設定して自分で定義する。
- Role と Policyが自動的に生成される。基本的にRoleを共有することは考えられてない。

