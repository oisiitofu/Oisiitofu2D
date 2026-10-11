# サーバー不要の公開版

CPU戦、トレモ、団体戦などのローカルモードを静的ファイルだけで動かします。タイトルのオンラインボタンは `public-site.json` の `onlineUrl` に移動します。そのサーバーが停止していれば、移動先で接続エラーになる仕様です。

通常の `npm start` で動くオンライン版のコード・対戦処理には変更を加えません。公開用の書き出し時だけ、オンライン機能をリンクに置き換え、BGM一覧をJSONファイルにします。

## 更新

`assets/ready/` を生成済みの状態で実行します。

```powershell
node public-export.cjs
node public-site-test.cjs
```

検証にはPlaywrightとMicrosoft Edgeが必要です。既存アートをコピーするだけなので、書き出しによる画像・音声の再圧縮はありません。1ファイル25MiBを超えるBGMは16MiBずつのバイナリに分割し、ブラウザで元の音声データに連結します。大きいBGMの初回読み込み時は、その曲のダウンロード完了後に再生を開始します。

出力先は `.tools/local-public-site/dist/`、Sites用ソースはその親フォルダです。`asset-inputs.json` に各入力素材のSHA-256を保存し、Siteソース側の `node build.cjs <元ゲームのパス>` でも同じバイト列から再構築できます。Siteの `.openai/hosting.json` のIDを保持し、Sitesのソース同期・保存・公開手順で同じSiteを更新してください。書き出しだけでは公開中のバージョンは変わりません。

オンライン用トンネルURLが変わった場合は `public-site.json` の `onlineUrl` を更新して再公開します。Site IDは変更しません。認証情報はファイルに保存しません。
