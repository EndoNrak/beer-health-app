#!/bin/bash

# ビルドコマンドを実行
npm run build -- --production

# 直前のコマンドの終了ステータスを取得
exit_status=$?

if [ $exit_status -eq 0 ]; then
  echo "Build completed successfully."
else
  echo "Build failed with exit status $exit_status"
fi
