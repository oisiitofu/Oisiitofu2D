# ユーマ 実装記録

モノクマの直後。解刀/解鍵命中で最大3鍵。横Bは一体の死に神ちゃんを方向操作して離すと遠隔鎌、下Bは同じ相棒が戻ってから大鎌。上スマの援護も近い相棒だけ。上Bは三つの出口を選び、通過中の再入力に鍵1で一回だけ変更。

0凸右、2凸上、3凸下。4/5霊体、6..9大きい相棒を共通倍率で独立描画。相棒に含む残光は重ねない。実際の全身原画の手元/先端と身体軸をNativeStrikesへ渡し、共通近接補正を一度だけ適用。飛び道具・相棒・設置の範囲には近接補正なし。元待機/15通常技のRGBAは固定し、予備/戻りは別の全身画像。関節リグなし。

PC3解像度×5色の専用顔肩画像、左右15通常技の密着/先端、左右/真下の復帰、実つかみ投げ、各2CPU戦、3人オンライン321フレームの状態一致を確認。新3人に範囲を絞り、サイズカタログのみ全員の立ち姿を更新。

検証コマンド（ルートから）:
- `node characters/elliot/tests/trio-mechanics-test.cjs`
- `node characters/elliot/tests/trio-visual-test.cjs`
- `node characters/elliot/tests/trio-motion-test.cjs`
- `node characters/elliot/tests/trio-cpu-test.cjs`
- `node characters/elliot/tests/trio-throw-test.cjs`
- `node characters/elliot/tests/trio-selection-test.cjs`
- `node characters/elliot/tests/trio-online-test.cjs`
