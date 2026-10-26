# 実装した固有操作

NBでステッカー付き箱を作り、再度NBで通常/バウンド/加速の性質を切り替える。下Bの爆弾は近い箱から転がせる。横Bは箱/爆弾/地形にフックを掛け、長押しで縄を縮めて離脱。上Bはゆっくり旋回する紙ロケットへ乗り、Bを離すと切り離す。

相手の対処・設計案は design.md、実装は ../sackboy-data.js と ../sackboy-vfx.js。実施した確認は validation.json。制作素材と方向は asset-map.json（ラグナは art-prompts.json/設計メモ）を参照。
