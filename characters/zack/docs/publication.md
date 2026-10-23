# 2026-10-23 追加3キャラの制作記録

公開版: [おいしいとうふブラザーズ](https://oisiitofu-bros.oisiitofu0141.chatgpt.site) / v132

3キャラとも組み込みimagegenで制作。各77全身姿勢・16エフェクトと専用の高解像度選択画像を保存し、画像を関節で変形させる方式は使用していません。

| キャラと配置 | ゲーム用アトラス | 専用の選択画像 | 全生成プロンプト |
| --- | --- | --- | --- |
| ハチワレ：ちいかわの次 | [保存画像](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/hachiware/assets/hachiware-native.png) | [顔と肩](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/hachiware/assets/hachiware-selection.png) | [プロンプト](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/hachiware/docs/image-prompts.json) |
| プレセア：コレットの次 | [保存画像](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/presea/assets/presea-native.png) | [顔と肩](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/presea/assets/presea-selection.png) | [プロンプト](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/presea/docs/image-prompts.json) |
| ザックス：ティファの次、ティーダの前 | [保存画像](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/zack/assets/zack-native.png) | [顔と肩](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/zack/assets/zack-selection.png) | [プロンプト](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/zack/docs/image-prompts.json) |

機能確認は98/98/120項目。近接必殺は左右・密着・先端104ケース。通常/空中/スマッシュの全身姿勢、専用必殺、待機左右5色、連続映像、各CPU1戦を確認。画像読み込みはそれぞれ77姿勢・16エフェクト・385カラーの不一致0。

公開先で83ファイルのSHA256、サイズ一覧、オンライン応答を確認。詳しい配信情報は [publication.json](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/characters/zack/docs/publication.json) に保存。

既存の戦闘前紹介4秒・勝利画面への間の延長は維持。今後の品質改善案は [GAME_QUALITY_IDEAS.md](C:/Users/haro_/OneDrive/ドキュメント/Oisiitofu2D/GAME_QUALITY_IDEAS.md) にまとめています。

公開版のオンラインも各キャラ6場面240F、2クライアント間で一致しました。
