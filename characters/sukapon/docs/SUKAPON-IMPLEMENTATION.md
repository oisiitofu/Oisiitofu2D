# スカポン追加（2026-10-10）

ジョイメカファイトのスカポンを、プレイヤー・CPU・オンライン対戦へ追加。実人数85、選択画面の表示番号86。添付 `C:/Users/haro_/Downloads/sukapon.png` をデザイン・モーションの基準に、専用素材を内蔵 image_gen で新規生成した。

- 通常必殺「トンデケー」：頭の直線弾。40Fまで溜めると速度・威力・大きさが変わる。射撃後の戻りは10F。
- 横必殺「コンナンイラヘン」：頭を飛ばし、18F後に本人へ戻る往復攻撃。発動時の上下入力で初期の角度を調整。再入力で早期回収。往路・復路で別々に命中し、頭が飛んでいる間も本人は移動できる。同時に頭を増やせない。空中の再使用制限中でも回収入力は使える。
- 上必殺「ローリングスカ」：パーツを丸めて回転し、方向入力で軌道を調整。壁・相手への接触時は一度だけ反動で跳ね、回転時間を少し延長。通常32Fの回転後は攻撃判定を消して落下。ステージ下からは壁の外へ抜けて復帰する。単純な固定上昇・横突進とは操作と用途が異なる。
- 下必殺「スカポンナゲ」：両手でつかみ、相手を回す。再入力または一定時間で投げ、方向入力で前・後・上・下へ投げ分ける。ガードをつかめるが、無敵・回避・つかみ耐性には当たらない。空振り、脱出、KO、リセット後に拘束を残さない。

通常攻撃・空中攻撃・投げ・ガード・回避・崖つかまり・歩き・走り・勝利を含む48戦闘ポーズと専用選択画像、8エフェクト、5カラー。浮いた頭・拳・足を元の寸法・画素・透過のまま切り出し、隣接するポーズを混ぜずに保存。選択画像は他のキャラと同様に顔から肩付近の構図。

画像生成のモードは **built-in imagegen**。最終プロンプトは [.tools/sukapon-prompts-final.json](.tools/sukapon-prompts-final.json)。採用画像の保存先：

- `characters/sukapon/assets/sukapon-atlas-a.png`
- `characters/sukapon/assets/sukapon-atlas-b.png`
- `characters/sukapon/assets/sukapon-locomotion.png`
- `characters/sukapon/assets/sukapon-arsenal.png`
- `characters/sukapon/assets/sukapon-effects.png`
- `characters/sukapon/assets/sukapon-selection.png`

統合画像は `characters/sukapon/assets/sukapon-native.png`。サーバー起動中に `ART_IDS=sukapon node .tools/build-art.cjs` で全カラー・選択サムネイルを可逆圧縮して `assets/ready/` へ生成。manifestとハッシュ付き画像を一緒に配信し、起動時に元シートの解析・全カラー生成を行わない。

エフェクトの元の向きはFX0/1が右、FX4が上、FX2が周回。平行移動→左右反転→ローカル回転の順で拳・足・弾の判定に合わせた。回転姿は足元ではなくボールの中心を軸に回す。前・後・上・下を左右両向きで確認。確認画像は `characters/sukapon/previews/sukapon-direction-preview.png`、選択画面は `characters/sukapon/previews/sukapon-roster-preview.png`。

検証：固有214項目、オンライン115項目（101時点で2クライアントの位置・ダメージ・技・姿勢・頭の往復・回転・つかみ状態が一致）、2ステージの左右場外・ステージ下から手動／CPU復帰16条件。既存ガイル148項目、エーデルガルド186項目、必殺技後隙189シナリオ6954項目に合格。全85キャラの3893ポーズ・708エフェクト・19465色違い画像の透過と画素が一致し、425選択画像は可逆。9画面サイズの選択レイアウト、設定・音量保存も確認。

選択画面のレイアウトテストに残っていた固定66人の期待値は、実際のロスター人数に追従するよう修正した。

公開URLは従来の1個を維持し、HTML・ゲームバンドル・manifestのHTTP200とスカポン登録を確認。

結果詳細：`.tools/sukapon-mechanics-results.json`、`.tools/sukapon-online-results.json`、`.tools/sukapon-visual-directions.json`、`.tools/special-recovery-results.json`、`.tools/roster-size-results.json`。
