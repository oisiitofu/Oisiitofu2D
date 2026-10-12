# アルス（Dragon Quest VII）

87体目・選択番号88。添付 `C:/Users/haro_/Downloads/arausu.png` をデザインと技の参照に使用。

## 操作と挙動

- 通常必殺「ギガスラッシュ」：長押し45Fまで溜め、前方へ雷の斬撃を射出。溜めで速度・大きさ・威力・射程が変わる。射出後10Fで行動可能。
- 横必殺「剣の舞」：各斬撃終了後9Fの間に必殺を押し直すと、最大4段まで連係。押しっぱなしでは連係しない。各段に別の当たり判定を持つ。踏み込みは短く、追加入力しなければ終了する。空中では着地まで1回。
- 上必殺「マエルストロムライド」：渦の周囲を回りながら上昇。左右入力で渦の位置を少し調整し、頂点で入力方向に飛び出す。ステージ下では外壁を回り込む。攻撃を伴う離脱後は落下し、着地硬直18F。単純な直線上昇や長時間の滑空とは異なる。
- 下必殺「ディスラプティヴウェーブ」：前後へ浄化の波を放ち、相手の移動する飛び道具を消す。動かない設置物は消さない。射出後10Fで行動可能。

## アート

画像はbuilt-in imagegenで新規生成。動作48ポーズ・選択用肩までの肖像・専用エフェクト8点・5カラー。生成元と出力をプロジェクト内に保存。

- `characters/arus/assets/arus-atlas.png`
- `characters/arus/assets/arus-locomotion.png`
- `characters/arus/assets/arus-arsenal.png`
- `characters/arus/assets/arus-effects.png`
- `characters/arus/assets/arus-selection.png`
- 配信用 `characters/arus/assets/arus-native.png` と `assets/ready/` のハッシュ付きアトラス・manifest
- 最終プロンプト全文：`.tools/arus-prompts-final.json`、縁の修正：`.tools/arus-locomotion-cleanup-prompt.json`

通常・前・後・上・下の剣の位置から判定を作成。素材の先端方向を右・上で確認し、描画は座標移動→左右反転→ローカル回転の順。両向きの視覚確認は `characters/arus/previews/arus-direction-preview.png`。

## 検証

- `node characters/arus/tests/arus-test.cjs`：196項目成功。通常15技の両向き判定、溜め、盾・無敵・カウンター、4段連係、空中使用制限、左右の崖つかまり、CPUを含む2ステージ16復帰ケース、飛び道具の浄化、エフェクト方向。
- `node characters/arus/tests/arus-online-test.cjs`：116項目成功。実サーバーで2クライアントの101スナップショット一致、全連係段・渦上昇と離脱・着地復帰・波・KO時の消去。
- `node special-recovery-test.cjs`：207ケース・7652項目成功。技後の不自然な立ち絵待ちを検証。
- キャラ名2349件、キャラ寸法7654項目、9画面サイズの選択画面を確認。

キャラデータ：`characters/arus/arus-data.js`。描画：`characters/arus/arus-vfx.js`。CPUは連係と渦の復帰を専用ルールで選ぶ。オンラインは通常の入力同期で同一の分岐・軌道・飛び道具を再現する。

`node art-loading-test.cjs`：3991ポーズ・724エフェクト・19955カラーの透過と色が一致、エラーなし。
