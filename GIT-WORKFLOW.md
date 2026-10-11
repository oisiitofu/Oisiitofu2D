# GitHubでの管理

公開リポジトリ: https://github.com/oisiitofu/Oisiitofu2D

ゲームのコード、テスト、元素材、音声を保存します。画像・音声はGit LFSで管理します。`node_modules/`、検証用スクリーンショット、ログ、再生成できる`assets/ready/`は保存対象外です。

## 別のPCへ取得する

Git、Git LFS、Node.js、Microsoft Edgeをインストールした状態で実行します。

```powershell
git lfs install
git clone https://github.com/oisiitofu/Oisiitofu2D.git
cd Oisiitofu2D
git lfs pull
npm ci
npm install --no-save --package-lock=false playwright sharp
npm start
```

サーバーを起動したまま、別のターミナルでキャラ選択用アートを生成します。

```powershell
node .tools/build-art.cjs
node art-loading-test.cjs
```

`assets/ready/`のmanifestと画像は一緒に生成されます。公開・配布するときは、このフォルダも一緒に配置してください。通常の起動時に元シートを再解析する処理は追加していません。

## 変更を保存する

```powershell
git status
git add .
git commit -m "変更内容"
git push
```

別のPCで変更した内容を取り込むときは、作業中の変更を保存してから`git pull --ff-only`を実行します。今後キャラの並び順を変える場合は、`roster.js`の`selectionOrder`を編集します。
