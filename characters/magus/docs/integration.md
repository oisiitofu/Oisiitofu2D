# 魔王 実装記録

カエルの直後。下Bの闇の核へNBを吸収して強化、再下Bで起爆。横Bの影は遠隔操作して離すと攻撃、核のそばで再入力すると本人と位置交換。上Bは有限上昇から核への転移を選ぶ。MPと壊せる設置を使い、ジャンプ保持の浮遊は75F。

0凸右、2凸上（元絵の2だけ上下正規化）、3凸下。4雷柱/5氷柱。掌/鎌/外套/闇回転を分ける。実際の全身原画の手元/先端と身体軸をNativeStrikesへ渡し、共通近接補正を一度だけ適用。飛び道具・相棒・設置の範囲には近接補正なし。元待機/15通常技のRGBAは固定し、予備/戻りは別の全身画像。関節リグなし。

PC3解像度×5色の専用顔肩画像、左右15通常技の密着/先端、左右/真下の復帰、実つかみ投げ、各2CPU戦、3人オンライン321フレームの状態一致を確認。新3人に範囲を絞り、サイズカタログのみ全員の立ち姿を更新。

検証コマンド（ルートから）:
- `node characters/elliot/tests/trio-mechanics-test.cjs`
- `node characters/elliot/tests/trio-visual-test.cjs`
- `node characters/elliot/tests/trio-motion-test.cjs`
- `node characters/elliot/tests/trio-cpu-test.cjs`
- `node characters/elliot/tests/trio-throw-test.cjs`
- `node characters/elliot/tests/trio-selection-test.cjs`
- `node characters/elliot/tests/trio-online-test.cjs`
