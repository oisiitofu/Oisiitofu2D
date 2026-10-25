# 2026-10-25 検証

- `node characters/nightraven/tests/nightraven-test.cjs`：97項目。15通常/スマッシュ/空中技の左右・密着・先端、NB近距離/遠距離、横Bの3投下/制動、TLSの確定・予告・回避・消滅、左右場外と島の下からの復帰、空中再発動制限、浮遊90Fと被弾中無効。
- `node characters/nightraven/tests/visual-test.cjs`：PC 1440×900の専用選択画像、75場面の通常技・連続姿勢・左右・5カラー。
- `CHARACTER_ID=nightraven node characters/nightraven/tests/specials-visual.cjs`：必殺16場面。実描画と元画像を比較。レーザー/ミサイル右、爆弾下、上昇噴射下、旋回弧の凸側右。実際の左右反転も確認。
- `node characters/nightraven/tests/cpu-test.cjs`：2ステージ各2400F。固有4オブジェクトを使用、命中あり、非有限値なし。
- `node characters/nightraven/tests/online-test.cjs`：2クライアント331F一致。NB・航過爆撃・TLS・垂直離脱/滑空。
- `ART_IDS=nightraven node .tools/build-art.cjs`、`ART_IDS=nightraven node art-loading-test.cjs`：77ポーズ・16効果・385カラー画像のアルファ/色チェック一致。起動時の元シート要求なし。
- `node build-size-catalog.cjs`：190形態の一覧更新。非人型68px基準と元の縦横比を維持。
- `node victory-texture-test.cjs`：勝利画面の左余白に青い隣接セルの画素がないことを確認。金色セルの共通境界12%を読み取り対象から外し、元の拡大率と位置を保つ。

検証画像と実行結果JSONはGit管理外の `characters/nightraven/previews/`、勝利画面は `previews/presentation/`。

公開v156でも97項目と選択画像を確認。公開オンラインも331F一致。勝利余白の青い混入は修正前の対照描画6画素、修正後0画素。配信29ファイルのSHA256とサイズ一覧HTML正規化が一致。
