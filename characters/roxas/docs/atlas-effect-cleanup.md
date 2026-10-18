# 2026-10-19 焼き込み斬撃の除去

Built-in imagegen / precise-object-edit を使用。編集先: assets/roxas-atlas.png。
参照元は修正前の同ファイル。1536×1024、6列×4行、全24ポーズを維持。
生成物をPNGのままコピーし、手動のピクセル加工や別モデルへの切替はしていない。

## Prompt

Use case: precise-object-edit. Edit target: the supplied existing 1536 x 1024 PNG game sprite atlas, 6 columns x 4 rows, 24 poses of Roxas in the black hooded coat with two Keyblades. This is a surgical cleanup, NOT a redesign or a new animation sheet. Remove ALL baked-in attack visual effects: the blue, white and gold crescent slash trails, X-shaped energy streaks, circular/spinning ribbons, motion speed lines, spark particles and the surrounding light bloom. Keep the two physical solid Keyblade weapons in every pose, including their original dark/blue/gold colored metal; do not mistake the weapon itself for an effect. Restore small body/coat/weapon portions previously covered by the energy trails using the adjacent original pixels as reference. Preserve the EXACT 1536 x 1024 canvas, 6 x 4 layout, pose count, original per-pose positions, body sizes, facing, silhouette, head/face/hair, coat folds, hands, legs, weapon shapes and orientation. Especially preserve the first row's six poses and the effect-free standing/hurt/lying/victory poses unchanged. Each original pose must remain in the same pixel location and cell. Keep all characters separate; no cell borders, text or new props. Output genuine transparent background, preserving existing alpha edges. Do not add any glow, aura, ground shadow, decorative lighting or new effects. The purpose is to keep the existing sprites while rendering all attack effects separately in the game engine.

## Runtime invariants

斬撃を除くとalphaによる自動切り抜きの原点・寸法が変わるため、-art.jsのROXAS_CLEAN_CANVASESで修正前の描画キャンバスと配置を保持する。新しい切り抜きを原画像座標の差分だけ移動して同じキャンバスへ入れる。キャラ本体を引き伸ばさない。立ち姿の高さ、BattleSizeの形状補正、技の発生/持続/硬直/移動/ダメージ/判定は変更しない。

## Validation

- 修正前に記録した全技・左右・各フレームの判定/ECB 1,372件が完全一致。SHA-256は5fc816b3283437c89aa2b293f4e68275a6a1b91f99f65063dfdd8c0d6db59fb7。
- 全24元ポーズのキャンバス寸法を保持。5パレットと40表示枠を維持。
- ロクサス/2Bの上強/空上を両向きで描画し、頭上のnative stamp 1回、判定変更なしを確認。
- 全135形態・401上攻撃ケースの描画処理と未分類の64素材を確認し、2Bの曲線漏れも同じ処理へ追加。炎柱/雷/突風の螺旋/小物/衝撃などを曲線へ変更しない。
- upper-effect-test.cjsの代表7形態324項目、Roxas既存動作76項目、art-loading-test.cjsの2体80ポーズ/16素材/400カラー枠が合格。
