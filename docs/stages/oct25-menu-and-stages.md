# 2026-10-25 選択画面と追加ステージ

- 右スティックは新規設定・初期化時にスマッシュ。保存済みの強攻撃指定は維持。スマッシュホールド・中央へ戻した時の解放も確認。
- キャラ番号はカード画像の左上。コンパクト表示でも表示し、名前・右上の選択表示と重ならない位置にした。
- パラッパは紙のような輪郭と元の衣装を保ち、表情・傾き・マイクのある顔肩アップを新規制作。専用元画像は `characters/parappa/assets/parappa-selection-v2.png`（1374×1145）。戦闘用画像は変更しない。
- ギアワーク・ファクトリー（ID 11）：鋼板・歯車・炉の背景、黄色の警戒縁の足場、上下に逆位相で動く2基のリフト。周期300F・振幅80px。
- チャンピオンズ・スタジアム（ID 12）：夕空の観客席、芝とLEDを組み合わせた幅1060pxの主足場、左右の固定浮遊台。背景のフラッシュは演出のみ。
- ステージ画像は専用生成した背景と透過足場を切り分け、可逆WebPへ梱包。歩行面と左右端の座標を素材ごとに指定。BGMは既存曲を専用フォルダへ初期配置（工場 Velocity Overdrive、競技場 tanosii）。

生成モードは組み込み image_gen。5素材の最終プロンプトと生成元パスは `oct25-art-prompts.json`。元PNGは `assets/stage-v3-*` に保存。実描画・カードの検証画像はGit管理外の `previews/stage-menu-oct25/`。

プロジェクトルートで `node docs/stages/build-oct25-art.cjs` により新ステージの配信画像を再作成できる。パラッパはサーバー起動後、`ART_IDS=parappa ART_PORTRAITS_ONLY=1 GAME_URL=http://localhost:4175 node .tools/build-art.cjs`（PowerShellでは各環境変数を個別設定）で専用選択画像だけ更新する。

検証：`node menu-stage-oct25-test.cjs` 52項目、各新ステージCPU1戦、`node stage-oct25-online-test.cjs` 2端末×2ステージ各241Fの完全一致。`node pad-default-test.cjs http://localhost:4175` 31項目。`ART_IDS=parappa node art-loading-test.cjs` 77ポーズ・16エフェクト・385色別画像に差異・実行エラーなし。デスクトップ・縦長/横長の小画面で番号の配置と専用カードを確認。
