# 2026-10-25 検証

- `node characters/jehuty/tests/jehuty-test.cjs`：113項目。15通常/スマッシュ/空中技の左右・密着・先端、NBのロック・有限誘導・多発・EN、ゼロシフトの無攻撃転移/追加入力（方向入りの通常/強/スマッシュ入力も受付）/対象前後/距離制限/地形検査、固定キャノンの溜め・単発命中・低EN制限・0%の境界直接到達なし（無復帰の下への落下死と区別）、左右場外と島の下からの復帰、浮遊の有限性。
- `node characters/jehuty/tests/visual-test.cjs`：PC 1440×900の専用頭部選択画像、通常技・連続姿勢・左右・5カラーの75場面。
- `CHARACTER_ID=jehuty node characters/jehuty/tests/specials-visual.cjs`：必殺20場面。キャノンは18/42/65/76Fでも同じ全身姿勢42と武器画像10。上昇とゼロシフトの残像、斬撃の前後上下の向きを実描画で確認。
- `node characters/jehuty/tests/cannon-visual-test.cjs`：3つの回転位相/溜め状態を左右から拡大描画。砲口外の砲身画素変化0、内部の変化は右1408/左1407画素。砲身の形・寸法・位置は固定。厳密な画素比較ではCanvasのGPU/ソフト描画切替の丸め差を避け、ソフト描画を指定。
- `node characters/jehuty/tests/cpu-test.cjs`：2ステージ各2400F。ホーミング/キャノンを使い、命中あり、非有限値・実行エラーなし。
- `node characters/jehuty/tests/online-test.cjs`：2クライアント331FのNBロック、ゼロシフト追加入力、キャノン、ブースト解放斬りを比較。
- `ART_IDS=jehuty node .tools/build-art.cjs`、`ART_IDS=jehuty node art-loading-test.cjs`：77ポーズ・16効果・385カラー画像の透過/色チェック一致。元シートを起動時に読まない配信経路を確認。
- `node build-size-catalog.cjs`：191形態の一覧を更新。人型段階外の細身の巨大ロボ128px、元の縦横比・全身姿勢・足元を維持。

画像と実行結果JSONはGit管理外の `characters/jehuty/previews/`。原画7点は組み込みimage_gen、全プロンプトは `art-prompts.json`。
