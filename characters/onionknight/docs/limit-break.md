# オニオンナイトの専用リミットブレイク

発動時のジョブを出発点に、既存素材のまま剣士・忍者・賢者を切り替える。色の異なるジョブ紋が出る瞬間に衣装を切り替え、低い二刀の連撃と離れた場所からのだいまほうをつなぐ。ノクティスの武器に向かうシフトと区別し、同じ着地点から攻め方が切り替わる。

改修では三つの現行ジョブ素材を参照した。組み込みImageGenで、剣士は赤い鎧と剣で踏み込み、忍者は青い装束と二刀で飛び込み、賢者は赤白の衣装で杖を振る横長カットインを描き分けた。発動時の衣装に合う一枚を `assets/limit-cutin.webp`、`assets/limit-cutin-ninja.webp`、`assets/limit-cutin-sage.webp` から選ぶ。天文塔、ジョブ紋、剣と忍術・大魔法の攻撃素材は `assets/limit-court.webp`、`assets/limit-sigils.webp`、`assets/limit-effects.webp` に収録。切り替えと発動前の衣装への復帰は、同じフレームで紋と音を合わせる。

[作品資料](https://jp.finalfantasy.com/news/5962/)
