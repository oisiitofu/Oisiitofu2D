# ユーマ画像実装メモ

- Built-in `image_gen` 使用。正確なプロンプト、生成元パス、保存先、SHA256 は `art-source-records.json`。10枚の生成元PNGをそのまま `assets/` に保存。加工前の原本を変更しない。
- `yuma-native.png`: 全身106枚 + 専用高解像度肖像106番、独立FX16枚。ユーマ本体には死に神ちゃんを焼き込まない。死に神ちゃんはFX4/5の小さい霊体、FX6..9の大きな姿。全身と大鎌を含み、独立位置で描画可能。
- 本体0..15 basic、16..30通常15技、31..45必殺、46guard、47前転、48後転、49その場回避、50空中回避、51被弾、52tumble、53down、54getup、55ledgehang、56climb、57grab、58pummel、59前投げ、60後投げ、61上投げ、62下投げ、63..65taunt、66..68victory、69空中差分、70land、71walk、72run、73idle、74弱い単発の崖攻撃（右キック）、75turn、76..90予備動作、91..105戻り。
- 初回中割り生成前に待機と通常15技を `assets/locked/` へ固定。空上29のみ、刃が真上を向く全身を別途完成してから固定した。固定画像はネイティブアトラス内でもRGBA画素が完全一致。関節リグなし。各シートの先頭の共通待機からシート全体へ同一倍率を使う。空上修正の単独絵は帽子幅136/365=.373で全身を等倍縮小し、ポーズ高さへ合わせない。
- `tests/body-axis-evidence.json`: 本体106枚の実際のベルト/骨盤を元絵座標でマークし、切り出し内の水平軸を正規化。マントや武器の外接矩形中心を身体軸にしない。55の上げた実際の手は `(0.6447368421,0.0563380282)`、アンカーとの差と足からの相対位置は `YumaArtRects.grip`。
- `tests/native-points.json`: 通常15技の実際の持ち手と刃先、必殺15枚の手元を切り出し画像の左上基準0..1で記録。元絵座標も残した。ゲーム描画倍率/接地補正を一度だけ適用して使う。空後28は左、空上29は上、空下30は下を向く。
- FX0と15は凸側が右、2は上、3は下。実際に透過画像とプレビューで確認。右向きへ正規化済みのため、元向きの追加反転は不要。左右反転と回転は描画側で向きを決めてから適用する。FX6..9の相棒自身に大鎌の残光も含むため、同じ残光を重複描画しない。
- 選択画像は1199x1312の専用の顔・肩絵。帽子全体が収まる。全身画像の拡大ではない。アトラス内では600px幅へ縮小し肖像106番として保持。
- `previews/yuma/constant-native-*.png` は同倍率の全身一覧、`transitions-*.png` は固定待機→新しい予備→固定攻撃→新しい戻り、`effects.png`、`native-weapon-points.png`、`ledge-grip.png`、`selection-card.png` で確認。全てGit管理外。
- 検証: `node characters/yuma/tests/verify-art.cjs`。Nodeの `NODE_PATH=C:/Users/haro_/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules` を使用。107+16、106枚の全身が重複なし、固定16枚が画素一致、生成元10枚のバイト一致、alpha、身体軸、刃先/手元を確認する。原本を再生成せず `node characters/yuma/tests/assemble-art.cjs` で再構築できる。
