# ハイデリン・ナミネの追加

ローカル実装と検証は完了。ハイデリンはララフェルの次、ナミネはロクサスの次。

- ハイデリン：結晶の設置と光線強化、再入力して目印へ飛ぶ横B、破壊可能な光の輪に乗る上B、有限90Fの浮遊。
- ナミネ：3種類の絵の実体化、記憶の印と糸、本人を残した幻影の遠隔操作、出口を狙う回廊ワープ。
- 両者とも106枚の全身画像、専用の高解像度選択画像、16種のエフェクト、5色。関節リグは使用しない。

## 制作物

| キャラ | ゲーム画像 | 専用選択画像 | 正確な生成プロンプト・元ファイル | 検証記録 |
| --- | --- | --- | --- | --- |
| ハイデリン | characters/hydaelyn/assets/hydaelyn-native.png | characters/hydaelyn/assets/hydaelyn-selection.png | characters/hydaelyn/docs/art-generation.json | characters/hydaelyn/docs/verification-2026-10-31.json |
| ナミネ | characters/namine/assets/namine-native.png | characters/namine/assets/namine-selection.png | characters/namine/docs/art-generation.json | characters/namine/docs/verification-2026-10-31.json |

画像生成方式はbuilt-in image_gen。元PNGと固定待機画像を保持し、透過・色の読み込みを照合した。選択画像は小さい全身画像の拡大ではない。

## 確認済み

近接の両向きの密着・先端、設置・再入力・破壊・有限の浮遊・左右および真下からの復帰など171項目。通常つかみの実解放・投げの方向と撃墜役割・攻撃上がり54項目。CPU各2戦。実入力で全9種の固有オブジェクトを動かし、オンライン321フレームが一致。配信画像214ポーズ・32エフェクト・1070カラー画像の照合で不一致なし。PC3解像度・5色と実カードを確認し、207体の等倍サイズ一覧を更新した。

動画と実描画比較はGit管理外のpreviews/hydaelyn/、previews/namine/、previews/duo/に保存。

## 公開結果

2026-10-31、ユーザーが既存公開サイト・GitHubへの反映と今後の確認省略を明示的に承認。公開サイトv181へ反映済み。GitHub実装コミットは77fc2ee61f98ba0687bc1f744b65dca1b0e02e24、Sitesソースは5121717130d5b4d57ecbe204c88efe698c21ac6d。最終デプロイappgdep_6ae57c4598a881918a73c317dbe48a2f、環境リビジョン357が成功。アップロード用の一時秘密は削除した。

新規配信57ファイルを確認（56ファイルのSHA-256一致、HTML1件はCloudflare注入スクリプトを除いて一致）。公開版でも実際のキャラIDがhydaelyn/namineであることを確認し、全9種の固有オブジェクトを動かすオンライン321フレームが一致。オンライン入口200。無関係な未完成の音楽変更は含めず、既存公開音声の全ハッシュを維持した。部屋・参加者・対戦0を確認して固定オンラインサーバーを更新した。

カイリは中割り画像生成が拒否されたため、ユーザー指定に従って追加作業を停止した。再試行・代替処理・ゲーム登録・公開をしていない。拒否IDは5073b1a8-22ab-468e-bbc4-f3d3477d2b79。下書きは別フォルダーに保持する。
