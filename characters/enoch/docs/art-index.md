# 4キャラの画像と制作記録

内蔵imagegenで制作。各元ポーズ・全身画像・エフェクト・最終アトラスは同じキャラのassets/に保存。制作プロンプトの全文と生成元は各art-prompts.jsonに記録しています。

|キャラ|専用の顔～肩画像|プロンプト集|
|---|---|---|
|イーノック|[enoch-selection.png](../assets/enoch-selection.png)|[art-prompts.json](art-prompts.json)|
|アストロ|[astro-selection.png](../../astro/assets/astro-selection.png)|[art-prompts.json](../../astro/docs/art-prompts.json)、[最終の中割り修正](../../astro/docs/art-correction.md)|
|ラチェット|[ratchet-selection.png](../../ratchet/assets/ratchet-selection.png)|[art-prompts.json](../../ratchet/docs/art-prompts.json)|
|ジャンゴ|[django-selection.png](../../django/assets/django-selection.png)|[art-prompts.json](../../django/docs/art-prompts.json)|

配信はassets/ready/manifest.jsonとハッシュ付きの可逆圧縮画像を使用。各キャラのpreviews/に実描画、連続姿勢、動画、テスト結果を保存しています（Git管理外）。
