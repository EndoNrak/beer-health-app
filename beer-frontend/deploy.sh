#!/bin/bash

# AWS リージョンを設定
AWS_REGION="ap-northeast-1"

# S3バケット名とローカルディレクトリ
S3_BUCKET="hosting-s3-bucket"
LOCAL_DIR="./build"

# ローカルディレクトリ内のファイルをS3にアップロード
aws s3 sync $LOCAL_DIR s3://$S3_BUCKET  --region $AWS_REGION

if [ $? -eq 0 ]; then
  echo "Deployment to S3 completed successfully."
else
  echo "Deployment to S3 failed."
fi