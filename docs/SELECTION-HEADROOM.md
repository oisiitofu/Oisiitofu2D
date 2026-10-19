# フィオルン・ホーネットの選択画像

元のエフェクトシートにある大きな肖像を格子の最終行だけで切っていたため、フィオルンの髪・ホーネットの角の上側が配信画像の段階で欠落していた。表示位置の変更だけでは復元できない。

`node repair-selection-heads.cjs` で、既存の `characters/<id>/assets/<id>-effects.png` から肖像全体を切り出す。元の絵を再生成せず、既存の連結シルエット抽出で周囲の別エフェクトを除去し、頭上に12px以上の余白を設ける。出力は各キャラの `assets/<id>-selection-complete.png`。戦闘アトラス、ポーズ48、技、当たり判定、サイズ一覧の立ち姿は変更しない。

`.tools/selection-portrait-sources.json` の選択専用ソースをこのPNGへ変更。サーバーを起動し、`ART_IDS=fiora,hornet`・`ART_PORTRAITS_ONLY=1` の環境で `node .tools/build-art.cjs` を実行すると、2体の選択肖像/サムネイル/manifestだけを更新する。選択カードはこの2体だけ `object-fit:contain` とし、画面サイズに応じた枠の縦横比の変化でも頭上を切らない。

検証：`node selection-headroom-test.cjs`。5画面サイズ、2体×5色の選択プレビュー、配信画像の透明な頭上余白、その他のキャラと戦闘アートの不変を確認する。`ART_IDS=fiora,hornet` で `node art-loading-test.cjs` も実行する。
