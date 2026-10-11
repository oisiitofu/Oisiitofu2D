# PCを停止しても遊べる公開版

[公開URL](https://oisiitofu-bros.oisiitofu0141.chatgpt.site)

CPU戦、トレモ、団体戦などのローカルモードを静的ファイルだけで動かします。タイトルのオンラインボタンは `public-site.json` の `onlineUrl` に移動します。そのサーバーが停止していれば、移動先で接続エラーになる仕様です。

通常の `npm start` で動くオンライン版のコード・対戦処理には変更を加えません。公開用の書き出し時だけ、オンライン機能をリンクに置き換え、BGM一覧をJSONファイルにします。

## 更新

`assets/ready/` を生成済みの状態で実行します。

```powershell
node public-export.cjs
node public-site-test.cjs
```

検証にはPlaywrightとMicrosoft Edgeが必要です。既存アートをコピーするだけなので、書き出しによる画像・音声の再圧縮はありません。1ファイル25MiBを超えるBGMは16MiBずつのバイナリに分割し、ブラウザで元の音声データに連結します。大きいBGMの初回読み込み時は、その曲のダウンロード完了後に再生を開始します。

素材は `.tools/local-public-site/payload/`、配信用Workerは `dist/server/index.js` に生成します。Sitesのアーカイブ上限は512MiBのため、素材はR2へ個別に保存し、配信用Workerで同じURLから読み込みます。R2への保存時にSHA-256を検証し、同じ素材は再アップロードしません。ゲームの計算やCPU操作を配信サーバーで実行することはありません。

`asset-inputs.json` に各入力素材のSHA-256を保存し、Siteソース側の `node build.cjs <元ゲームのパス>` と `node worker-build.cjs` でも再構築できます。Siteの `.openai/hosting.json` のIDと `r2: "BUCKET"` を保持し、Sitesのソース同期・保存・公開手順で同じSiteを更新してください。

素材アップロード時だけ、Sitesの秘密環境変数 `ASSET_UPLOAD_TOKEN` を発行し、`node public-upload.cjs` の非表示stdinに `{ "token": "一時トークン", "url": "公開URL" }` を渡します。完了後は秘密環境変数を削除して同じ保存済みバージョンを再公開し、アップロード口を無効にします。トークンをファイルやシェルの引数に保存しないでください。アップロードはビルドの許可リストにある素材と一致するSHA-256だけを受け付けます。

書き出しだけでは公開中のバージョンは変わりません。新しいWorkerを公開する際は、そのWorkerが参照する素材のアップロードも完了させてください。

オンライン用トンネルURLが変わった場合は `public-site.json` の `onlineUrl` を更新して再公開します。Site IDは変更しません。認証情報はファイルに保存しません。
