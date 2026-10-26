# 実装した固有操作

NBを押す長さでフレイル/ギア/フェイズランス。下Bで宝箱/爆弾/回復入り箱を順番に掘り出す。横Bは箱/ギアを引き寄せる反動で移動し、箱なしでは短い掘り進み。上Bはショベル先が地面/箱/相手へ触れると一度だけポゴ反跳。

相手の対処・設計案は design.md、実装は ../shovelknight-data.js と ../shovelknight-vfx.js。実施した確認は validation.json。制作素材と方向は asset-map.json（ラグナは art-prompts.json/設計メモ）を参照。
