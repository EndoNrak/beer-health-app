# Cloudformation

## Cloudformationとは？
公式ドキュメントは[こちら](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/Welcome.html)

## 環境構築
### 基本開発戦略
ローカル環境ではテストによる動作確認までにとどめ、デプロイはなるべくgithub actionsのワークフローを使うようにしました。ローカル環境からの直接デプロイは、環境変数の設定ミスや動作未確認コードのデプロイにつながってしまい、人為的ミスの温床になると考えています。
### AWS CLIのインストール
[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)を参考にしてください
### AWS CLI のインストール確認
```
aws --version
```
### スタックの作成
1. コマンド実行前にAWSクレデンシャルの設定を行って下さい。[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-envvars.html)
2. template.yml内のparameterブロック内の値を自分のお好みの値に書き換える
3. コマンドを実行する。
```
cd beer-backend/cloudformation
make create
```

### シークレットマネージャに適切な値を設定する
上記のスタック作成がうまくいっていると、AWS Secrets Managerにシークレットが生成されているはずです。コンソールから直接正しい値に変更しましょう。（秘密情報でリポジトリに保存するのは不適切であると考え、この手順を踏んでいます。）
| シークレット名 | シークレットキー| 値の取得方法|
| ---- | ---- | ----|
| FitbitSecretsManager | FitbitOidcClientID | Fitbit APIにアプリケーションを登録し、OAuth2.0 Client IDを参照→[参考](https://dev.fitbit.com/build/reference/web-api/developer-guide/getting-started/) |
| FitbitSecretsManager | FitbitOidcClientSecret | Fitbit APIにアプリケーションを登録し、Client Secretを参照→[参考](https://dev.fitbit.com/build/reference/web-api/developer-guide/getting-started/)  |
| GoogleSecretsManager | GoogleOidcClientID | Googleにアプリケーションを登録し、OAuth2.0 Client IDを参照→[参考](https://developers.google.com/identity/openid-connect/openid-connect?hl=ja) |
| GoogleSecretsManager | GoogleOidcClientSecret | Googleにアプリケーションを登録し、Client Secretを参照→[参考](https://developers.google.com/identity/openid-connect/openid-connect?hl=ja)  |
| OpenAISecretsManager | APIKey | 事務局に配布されたOpenAI API Keyを設定 |

### スタックの更新
コマンド実行前にAWSクレデンシャルの設定を行って下さい。[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-envvars.html)
```
cd beer-backend/cloudformation
make update
```
