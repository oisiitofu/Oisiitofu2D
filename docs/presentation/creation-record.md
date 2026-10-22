# 制作素材と生成プロンプト

画像制作はすべて組み込みの **builtin image_gen** を使用。生成した全身画像をそのまま保持し、切り出し・透過・校正・配置を専用組立てで処理した。CLI/APIへの切り替えや関節リグは使用していない。

| 制作物 | 保存先 | 正確な生成プロンプト |
| --- | --- | --- |
| エレンの戦闘画像 | [ellen-native.png](../../characters/ellen/assets/ellen-native.png) | [8件のプロンプト](../../characters/ellen/docs/image-prompts.json) |
| エレンの専用選択画像 | [ellen-selection.png](../../characters/ellen/assets/ellen-selection.png) | 同上のSelection / SelectionFix |
| ジーニアスの戦闘画像 | [genis-native.png](../../characters/genis/assets/genis-native.png) | [9件のプロンプト](../../characters/genis/docs/image-prompts.json) |
| ジーニアスの専用選択画像 | [genis-selection.png](../../characters/genis/assets/genis-selection.png) | 同上のSelection / SelectionFix |
| 開始・勝利演出の4素材 | [cinematic-atlas.png](../../assets/presentation/cinematic-atlas.png) | [プロンプト](image-prompt.txt) |

シート原画像と参照画像もそれぞれのassetsフォルダに保存済み。戦闘画像は各62フレーム/16FX、生成済み配信画像はassets/ready/。既存156形態の配信アートは変更しない。

検証用の[開始・勝利演出の連続動画](../../previews/presentation/cinematic.webm)、[4人の開始カットイン](../../previews/presentation/intro-4-75.png)、[個人の勝利画面](../../previews/presentation/victory-solo.png)、[チームの勝利画面](../../previews/presentation/victory-teams.png)はGit管理外のpreviewsに保存。

エレンの[実装・操作](../../characters/ellen/docs/implementation.md)、ジーニアスの[実装・操作](../../characters/genis/docs/implementation.md)、[演出の構成](implementation.md)。

公開版v125で追加キャラの機能128+130、低％投げ632、地上回避1259項目に成功。公開版の通常60/必殺48/待機20と開始8/終了6/小画面を確認。11素材のSHA-256一致、固定オンライン入口HTTP200。ローカルの実サーバーでは新キャラ800F/共通ルール960Fの2ブラウザ同期が一致。
