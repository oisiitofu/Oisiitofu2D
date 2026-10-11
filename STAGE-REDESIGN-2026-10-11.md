# 追加9ステージの素材・デザイン改修

ユーザーの「ステージ1みたいにちゃんと素材から作る」という指定に従い、追加9面の図形による背景・足場を画像素材へ置換。ステージ1の背景 `assets/astral-sanctum.png` と足場 `assets/sanctum-platform.png` を確認し、密度のある建築、奥行き、光、素材の質感、独立した足場という構成を基準に制作した。

内蔵 **imagegen** を使用。背景9枚、3テーマずつの透過足場アトラス3枚を制作し、各面の主床・空中台の計18スプライトをロスレスでパック。サイバー背景は機械的な構造を強めるため一度追加制作し、後の出力を採用した。正確な全13プロンプト、生成ファイル、採用した保存先は [.tools/stage-v2-generation-record.json](.tools/stage-v2-generation-record.json)。

## 保存した素材

次のファイルはすべて `assets/` に保存。背景・足場ともゲームで使用する実素材。元のアトラスも `stage-v2-platforms-a-source.png`、`stage-v2-platforms-b-source.png`、`stage-v2-platforms-c-source.png` として保存した。

| ステージ | 背景 | 主床 | 空中台 |
| --- | --- | --- | --- |
| 蒼天の飛翔艇 | stage-v2-sky-background.png | stage-v2-sky-main.png | stage-v2-sky-small.png |
| 風渡る冒険遺跡 | stage-v2-adventure-background.png | stage-v2-adventure-main.png | stage-v2-adventure-small.png |
| 星灯りの舞踏宮 | stage-v2-waltz-background.png | stage-v2-waltz-main.png | stage-v2-waltz-small.png |
| ミッドナイト・セッション | stage-v2-jazz-background.png | stage-v2-jazz-main.png | stage-v2-jazz-small.png |
| 紅蓮の天守 | stage-v2-japan-background.png | stage-v2-japan-main.png | stage-v2-japan-small.png |
| ネオン・オーバードライブ | stage-v2-cyber-background.png | stage-v2-cyber-main.png | stage-v2-cyber-small.png |
| 灼熱の決戦炉 | stage-v2-fire-background.png | stage-v2-fire-main.png | stage-v2-fire-small.png |
| フェスティバル・パレード | stage-v2-festival-background.png | stage-v2-festival-main.png | stage-v2-festival-small.png |
| 水鏡の花園 | stage-v2-beauty-background.png | stage-v2-beauty-main.png | stage-v2-beauty-small.png |

飛翔艇の船体と結晶エンジン、蔦の絡んだ遺跡の石組み、舞踏宮の大理石と金細工、ジャズの木材と真鍮、和風の瓦と朱塗り、サイバーの機械とスラスター、火山の鉄骨と溶岩、祭りの布飾り、花園の蓮と花をそれぞれ足場にも描いた。

## 配信と当たり判定

`.tools/build-stage-art.cjs` で native PNG と `assets/ready/` のハッシュ付き可逆WebPを生成。背景の元解像度、足場の透過と可視RGBAを保持する。生成済み素材のURL・寸法・接地ライン・両端は `stage-art-data.js` と `.tools/stage-art-manifest.json` に保存。ブラウザ起動時にシートを解析しない。

実際に立てる高さと崖の両端を画像の接地ラインへ対応させる。装飾と岩・機械の下面は視覚表現。空中台は上下方向の表示を浅めにして下にいるキャラを隠しすぎないようにした。背景はゲーム開始前に読み込みを完了し、選択画面の小さなプレビューも新背景を使用する。

冒険遺跡の主床を940→1040、サイバーを920→1020、祭りを960→1060へ拡張。中心は720のまま、主床の左右へ50ずつ広げた。冒険と祭りは左右の空中台も少し外側へ移し、崖位置は主床から再計算する。既存2面の配置は変更していない。

## 検証

- `node .tools/stage-art-test.cjs`: 195項目。27画像の可逆圧縮・透過、全足場の接地ラインと両端、広げた主床、配信・読み込みを確認。9面の実対戦スクリーンショットを保存。
- `node .tools/new-recovery-test.cjs`: 556項目。全11面の左右・主床下からの新キャラのCPU復帰など。
- `node squad-stage-test.cjs`: 47項目。動く台への追従、交差する台、団体戦交代など。
- `node .tools/oct11-online-test.cjs`: 582項目。2ブラウザの同期、足場の移動、交代など。
- `node art-loading-test.cjs`: 既存5,216ポーズ・924エフェクト・26,080カラーポーズの透過／色に不一致なし。選択画像497ms、全アート準備4,502ms（ローカル検証時）。ステージ選択、9画面サイズでのキャラ選択、公開URLの表示、311スクリプトの構文も確認済み。

9面の実表示一覧: [stage-redesign-preview.png](stage-redesign-preview.png)。
