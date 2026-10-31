# エリオット 実装記録

オディオの直後。一体のフェイが光の矢、支点、復帰を担当。下B地図は最大2、敵が壊せる。NBは最新目印へ妖精が飛んで狙い、横Bは到着後に離して再入力して本人が支点へ剣移動。上Bは遠くの妖精を呼び戻してから有限42F運ぶ。

0凸右、2凸上、3凸下、10矢右。16の剣は振り上げの終点が左上なので源画像/接触点へ合わせた斜め円弧。盾/足払いは打撃。4..9フェイ6全身は同じ倍率。実際の全身原画の手元/先端と身体軸をNativeStrikesへ渡し、共通近接補正を一度だけ適用。飛び道具・相棒・設置の範囲には近接補正なし。元待機/15通常技のRGBAは固定し、予備/戻りは別の全身画像。関節リグなし。

PC3解像度×5色の専用顔肩画像、左右15通常技の密着/先端、左右/真下の復帰、実つかみ投げ、各2CPU戦、3人オンライン321フレームの状態一致を確認。新3人に範囲を絞り、サイズカタログのみ全員の立ち姿を更新。

検証コマンド（ルートから）:
- `node characters/elliot/tests/trio-mechanics-test.cjs`
- `node characters/elliot/tests/trio-visual-test.cjs`
- `node characters/elliot/tests/trio-motion-test.cjs`
- `node characters/elliot/tests/trio-cpu-test.cjs`
- `node characters/elliot/tests/trio-throw-test.cjs`
- `node characters/elliot/tests/trio-selection-test.cjs`
- `node characters/elliot/tests/trio-online-test.cjs`
