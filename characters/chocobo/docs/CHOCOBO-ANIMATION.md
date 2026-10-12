# チョコボの中間アニメーション（2026-10-12）

画面番号1番。組み込み image_gen で元のデザインから16個の透過パーツを作成し、既存43ポーズの後ろ（frames[43..58]）へ追加。頭、胴、羽、尾、左右の腿・脛・足を接続したリグで描画する。プロンプトは assets/chocobo-animation-prompts-v1.json に保存。

## 動作

- 各攻撃は予備動作・振り出し・持続・戻り。二段技の段間も補間し、メテオは術者自身の詠唱を描く。黒魔道士の帽子とケープ、滑空中の連続した羽ばたき、空中回転を分けた。
- 歩行・走行、踏切・上昇・下降・着地、しゃがみ、反転・ブレーキ、ガード・回避、被弾・ダウン・起き上がり、つかみ・投げ・崖を個別に描く。崖では近い足の爪を物理的な崖位置に固定する。
- 胴幅59pxと素材の縦横比は固定。脚は腿19px・脛22pxの逆運動学で接続し、蹴りや歩行で骨を伸縮しない。待機時の足底は床に接する。頭頂は約113px。
- 時計は攻撃の f.timer、状態の f.stateFrame のみ。描画はシミュレーションを変更せず、ヒットストップ・溜め・停止・オンラインでも絵だけ進まない。
- 技の発生・持続・硬直、威力・吹っ飛び・入力・着地隙、当たり判定と既存エフェクトは変更なし。従来43ポーズ・5カラー・選択画像のチェックサムと他112形態のmanifest項目を保持。配信済み画像から読み込み、起動時に元シート解析を戻さない。
- 共通補間・固定長脚の計算は animation-rig.js。キャラ固有の姿勢とパーツの接続は chocobo-animation.js。

## 準備後の技フレーム

| 技ID | 発生 | 持続 | 全体 |
|---|---:|---|---:|
| jab | 5F | 5〜6F | 14F |
| jab2 | 4F | 4〜6F | 14F |
| jab3 | 7F | 7〜9F | 17F |
| heavy | 8F | 8〜11F | 19F |
| up | 6F | 6〜11F | 19F |
| low | 7F | 7〜9F | 17F |
| dashAttack | 11F | 11〜14F | 23F |
| smash | 13F | 13〜16F | 31F |
| upsmash | 12F | 12〜16F | 31F |
| downsmash | 10F | 10〜12F, 18〜21F | 36F |
| air | 6F | 6〜7F, 14〜18F | 27F |
| fair | 6F | 6〜9F | 18F |
| bair | 7F | 7〜11F | 20F |
| uair | 5F | 5〜9F | 18F |
| dair | 10F | 10〜14F | 23F |
| dragon | 24F | 24〜31F, 32〜36F | 48F |
| dash | 9F | 9〜13F, 19〜24F | 36F |
| rise | 7F | 7〜12F | 68F |
| gale | 16F | 16〜21F | 35F |
| grab | 7F | 7〜8F | 16F |
| ledge | 8F | 8〜10F | 18F |
| getupAttack | 7F | 7〜9F, 12〜14F | 22F |
| pummel | 2F | 2〜2F | 11F |
| forwardThrow | 1F | 1〜1F | 19F |
| backThrow | 1F | 1〜1F | 21F |
| upThrow | 1F | 1〜1F | 22F |
| downThrow | 1F | 1〜1F | 20F |

## 検証

専用アニメーションテスト8,568項目（純粋性、段階、連続位置、骨長、胴の大きさ、左右・カラー、崖、既存アート）、既存動作89項目、2クライアントの同期104項目が成功。再現コマンド：

```powershell
node characters/chocobo/tests/chocobo-animation-test.cjs
node characters/chocobo/tests/chocobo-test.cjs
node characters/chocobo/tests/chocobo-online-test.cjs
node art-loading-test.cjs
node motion-size-test.cjs
node battle-size-test.cjs
node melee-balance-test.cjs
node .tools/motion-actionability-test.cjs
```

実ゲーム描画の連続画像と60fps動画を characters/chocobo/previews/ に保存して確認した。旧テストのCPU選択はトレモリセット時に現在の対戦相手を維持する仕様を考慮して、対戦設定の適用後にリセットする検証へ更新。

全体回帰：アート5,293ポーズ／932エフェクト／26,465カラー画像のチェックサム一致、113形態のサイズ117,261項目と戦闘サイズ21,544項目、近接判定681,451項目、操作可能フレーム16,922項目が成功。CPU113組・203,400フレームも実行エラー0。CPUの結果を人間同士の勝率とはみなさない。
