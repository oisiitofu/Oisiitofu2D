# 塊魂 / Katamari

添付 katamaridamasii.png を基準に王子と塊を追加。選択順の指定がないためおまかせ直前（画面123／旧登録130）。129形態、選択可能123、非表示6。王子は体格80を固定し、塊だけが半径28〜78へ連続して成長する。全身画像49姿勢・12エフェクト・5カラー。関節リグなし。

## 成長と被弾

- 自力の移動1pxで成長0.015、横Bの転がり中は0.07。最大100。被弾硬直、吹っ飛び、復活、崖上がり、回避、テレポートによる位置変更では増えない。移動中に小物が吸着する演出。
- 横B命中で8、NB命中で4、他の実命中で1.5を追加（1技につき一度）。ガード／無敵では増えない。
- 受けたダメージ1％で成長1.2減少、破片が落ちる。ガード／無敵は縮小しない。撃墜で最小へ戻る。
- 大きいほど塊の実判定・被弾範囲が広がり、通常攻撃と横B／上Bの威力は最大1.25倍。重さ85→105、走り6.8→6.0。王子の画像と姿勢の縮尺は固定。

## 必殺技

| 入力 | 動作 |
| --- | --- |
| NB | モノを巻き込む。14〜20Fに前方を吸引し、命中相手を内側へ軽く引く。長押し中は射程95→150。小物を3回収集、100F待ち。 |
| 横B | 転がり成長タックル。8〜31Fに滑走、10〜31F攻撃。成長で速さ6.5→11、実リーチ／威力も増す。地上では崖止め、58F待ち、空中1回。 |
| 上B | 塊ジャンプ。8Fから発射、長押しで最大24Fまでためる。発射8〜20F後に必殺を押し直すと、横入力の方向へ一度だけ跳ね直す。無入力なら反転。有限時間でしりもち。内側下からは先に側面へ抜ける。 |
| 下B | アイテム呼び込み。16/22/28Fに周囲の小物を集め計7.5成長、180F待ち。攻撃判定なし、隙あり。空中でも急降下しない。 |

上Bはためと跳ね直しで復帰の軌道を選び、横Bは塊を育てながら地上の間合いを詰める。下Bは遠距離での準備、NBは近距離の吸引。有限持続・待ち時間を設定。

## 画像と生成記録

**内蔵 image_gen** を使用。プロンプト全文は [image-prompts.json](image-prompts.json)。元参照は [katamari-reference.png](../assets/katamari-reference.png)。制作画像は [katamari-poses.png](../assets/katamari-poses.png)、[katamari-motion.png](../assets/katamari-motion.png)、[katamari-effects.png](../assets/katamari-effects.png)、[katamari-selection.png](../assets/katamari-selection.png)。配信用の結合元は [katamari-native.png](../assets/katamari-native.png)。

元のRGBAを保持して透過縁を切り抜き、`tests/assemble-art.cjs` で再パッキングできる。緑の頭・服だけ5カラーへ変更し、顔・アンテナ・脚は維持。生成済みアートは `ART_IDS=katamari node .tools/build-art.cjs` で更新。エフェクトは平行移動→左右反転→ローカル回転の順、吸引素材は右端が細いため顔の反対向きに反転して使う。

## 確認

`node characters/katamari/tests/katamari-test.cjs`（304項目）、`katamari-visual-test.cjs`（実被弾と左右／最小・中間・最大の実描画）、`katamari-cpu-test.cjs`（ヴィヴィ／アレイン各2400F）、`katamari-online-test.cjs`（独立2クライアント201F）、`ART_IDS=katamari node art-loading-test.cjs`（49姿勢・12効果・245カラー画像）。公開後は `katamari-public-test.cjs`。検証画像・測定JSONはGit管理外の `previews/`。

密着／小さい相手／先端、左右上下前後、ガード、実際の成長・縮小、上限・撃墜、横Bの崖止め、左右と内側下からの復帰を確認。CPU戦は動作確認で、対人勝率を示すものではない。
