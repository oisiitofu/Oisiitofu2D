# シオン・ビューティフルジョー・アーサー・真宮寺さくらの制作記録

画像はすべて組み込み `image_gen` で制作。最終画像は各キャラの `assets/` 内へ保存し、配信用アートへ加工した。正確なプロンプトと参照内容は下記JSON。原画像の生成ツール既定保存先への依存はない。

| キャラ | 保存した最終アトラス | 専用の顔・肩選択画像 | プロンプト一式 |
| --- | --- | --- | --- |
| シオン | [全身・VFX](../characters/shionne/assets/shionne-native.png) | [選択画像](../characters/shionne/assets/shionne-selection.png) | [制作プロンプト](../characters/shionne/docs/image-prompts-complete.json) |
| ビューティフルジョー | [全身・VFX](../characters/viewtifuljoe/assets/viewtifuljoe-native.png) | [選択画像](../characters/viewtifuljoe/assets/viewtifuljoe-selection.png) | [制作プロンプト](../characters/viewtifuljoe/docs/image-prompts-complete.json) |
| アーサー | [全身・VFX](../characters/arthur/assets/arthur-native.png) | [選択画像](../characters/arthur/assets/arthur-selection.png) | [制作プロンプト](../characters/arthur/docs/image-prompts-complete.json) |
| 真宮寺さくら | [全身・VFX](../characters/sakura/assets/sakura-native.png) | [選択画像](../characters/sakura/assets/sakura-selection.png) | [制作プロンプト](../characters/sakura/docs/image-prompts-complete.json) |

各キャラの `tests/assemble-art.cjs` が全身連結成分の抽出、ロックした待機画像の保持、明示したVFX領域の抽出を行う。アーサーの短剣だけは槍の修正前に承認済みの `arthur-effects-first.png` から抽出し、編集時に消えた短剣を復元する。鎧なしは専用全身画像、黄金は金属マスクの描画着色。

空Nの実描画は、銃の回転、方向が変わる3姿勢の蹴り、頭上へ開く花びらの扇、盾を前にひねる2姿勢で比較。攻撃窓とヒットIDを維持し、全員同じ輪へ統一しない。

公開版の機能498項目、通常120・特殊96・待機40場面、2ブラウザの全必殺16場面1600F同期、配信14ファイルのSHA一致を確認。検証画像・動画は各キャラの `previews/`（Git管理外）に保存。
