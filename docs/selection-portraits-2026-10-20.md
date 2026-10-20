# 選択画面の専用上半身画像

制作方式は built-in image_gen。参照シートの顔・髪・衣装を基準に、1536×1024の透過画像を制作。実際のキャラ選択カードで既存キャラと比較して使用。

| キャラ | 保存画像 | 正確なプロンプト |
| --- | --- | --- |
| リース | [riesz-selection-closeup.png](../characters/riesz/assets/riesz-selection-closeup.png) | [JSON](../characters/riesz/docs/selection-closeup-prompts.json) |
| イデア | [edea-selection-closeup.png](../characters/edea/assets/edea-selection-closeup.png) | [JSON](../characters/edea/docs/selection-closeup-prompts.json) |
| ナチュレ | [viridi-selection-closeup.png](../characters/viridi/assets/viridi-selection-closeup.png) | [JSON](../characters/viridi/docs/selection-closeup-prompts.json) |
| タコガール | [octoling-selection-closeup.png](../characters/octoling/assets/octoling-selection-closeup.png) | [JSON](../characters/octoling/docs/selection-closeup-prompts.json) |
| ちびロボ | [chibirobo-selection-closeup.png](../characters/chibirobo/assets/chibirobo-selection-closeup.png) | [JSON](../characters/chibirobo/docs/selection-closeup-prompts.json) |

フィオルンは既存の専用画像 `characters/fiora/assets/fiora-selection-complete.png` を使用。切出し `[110,0,448,320]` とcover表示で寄りをそろえ、中央へ位置調整（追加指定で140→110）。

追加修正：ホーネットの専用画像は `characters/hornet/assets/hornet-selection-closeup.png`、builtin image_genの正確なプロンプトは `characters/hornet/docs/selection-closeup-prompt.json`。角を残し、マントがカード下端まで伸びる構図。個別のcontain縮小を廃止。バトルメイジは既存専用画像の `[350,0,770,550]`、C4-621は `[265,5,650,465]` へ寄せ、頭と上半身を大きく表示。

元の全身素材・戦闘用アトラス・姿勢・判定は維持。設定は `.tools/selection-portrait-sources.json`、配信用は `assets/ready/manifest.json` とハッシュ付き画像。
