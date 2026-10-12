# キャラ別ファイル一覧

全113形態をキャラIDごとに整理しています。キャラ選択の表示順・通し番号は `../roster.js` で管理します。

```text
characters/<ID>/
  <ID>-data.js       技・固有ルール
  <ID>-art.js        元画像の切り抜き・描画設定（あるキャラのみ）
  <ID>-vfx.js        エフェクト
  assets/           元画像・モーションシート・参考素材
  tests/            専用テスト、*-config.json、*-checks.js
    helpers/        キャラ専用のテスト補助
  docs/             実装メモ（あるキャラのみ）
  previews/         検証画像（Git管理外・テストが自動作成）
```

共通エンジン・共通テスト・ステージ・音声はルートと `../assets/` に残します。配信用のハッシュ付き画像は共通キャッシュ `../assets/ready/` です。新しいキャラ専用コードは `../index.html` にパスを登録します。サーバーと公開版は登録順を共有します。

テストはプロジェクトルートから、例えば `node characters/midna/tests/midna-warp-test.cjs` を実行します。全体の読み込み検証は `node character-layout-test.cjs`、画像キャッシュの再生成はサーバー起動後 `node .tools/build-art.cjs`、画像の検証は `node art-loading-test.cjs` です。

ハナの共通ルールは [hana/hana-kit.js](hana/hana-kit.js)、進化管理は [agumon/agumon-evolution.js](agumon/agumon-evolution.js) にあります。進化・変身形態も各IDのフォルダに配置し、キャラ選択では引き続き非表示です。アレインの未登録の素材は [alain/assets/](alain/assets/) に保管してあります。

| キャラ | フォルダ |
| --- | --- |
| ララフェル | [dragoon](dragoon/) |
| ロビン | [isaac](isaac/) |
| ウルグリム | [ulgrim](ulgrim/) |
| ちいかわ | [chiikawa](chiikawa/) |
| チョコボ | [chocobo](chocobo/) |
| モノクマ | [monokuma](monokuma/) |
| リキ | [riki](riki/) |
| ロクサス | [roxas](roxas/) |
| 2B | [twob](twob/) |
| 大神 | [okami](okami/) |
| ガンダム | [gundam](gundam/) |
| ビビ | [vivi](vivi/) |
| ゼロ | [zero](zero/) |
| リン | [rin](rin/) |
| ニア | [nia](nia/) |
| ライトニング | [lightning](lightning/) |
| コレット | [colette](colette/) |
| リィン | [rean](rean/) |
| エステル | [estelle](estelle/) |
| ノクティス | [noctis](noctis/) |
| クライヴ | [clive](clive/) |
| 結城 理 | [makoto](makoto/) |
| ネク | [neku](neku/) |
| 鳴上 悠 | [narukami](narukami/) |
| 苗木 誠 | [naegi](naegi/) |
| レックス | [rex](rex/) |
| ルーク | [luke](luke/) |
| ウィル | [will](will/) |
| KOS-MOS | [kosmos](kosmos/) |
| フェイト | [fayt](fayt/) |
| エマ | [emma](emma/) |
| ライザ | [ryza](ryza/) |
| ノア | [noah](noah/) |
| ミドナ | [midna](midna/) |
| ボンバーマン | [bomberman](bomberman/) |
| サンズ | [sans](sans/) |
| ロイド | [lloyd](lloyd/) |
| シレン | [shiren](shiren/) |
| ぽこあメタモン | [pokoa](pokoa/) |
| ハンター | [hunter](hunter/) |
| アドル | [adol](adol/) |
| テリー | [terry](terry/) |
| ヴァルキリー | [valkyrie](valkyrie/) |
| アグモン | [agumon](agumon/) |
| パワプロくん | [pawapuro](pawapuro/) |
| 塾長 | [headmaster](headmaster/) |
| サクナヒメ | [sakuna](sakuna/) |
| ハセヲ | [haseo](haseo/) |
| テラリア | [terrarian](terrarian/) |
| ウマ | [horse](horse/) |
| オーバークック | [chef](chef/) |
| アキラ | [akira](akira/) |
| モーフィーズロウ | [morphie](morphie/) |
| フェイ | [fei](fei/) |
| ヒューマン | [human](human/) |
| キトゥン | [kitten](kitten/) |
| エルマ | [elma](elma/) |
| ゴエモン | [goemon](goemon/) |
| ベイリーフ | [bayleef](bayleef/) |
| メタビー | [metabee](metabee/) |
| ニーア | [nier](nier/) |
| 初音ミク | [miku](miku/) |
| 成歩堂龍一 | [naruhodo](naruhodo/) |
| ジバニャン | [jibanyan](jibanyan/) |
| レイトン教授 | [layton](layton/) |
| ダンテ | [dante](dante/) |
| レオン | [leon](leon/) |
| ティファ | [tifa](tifa/) |
| ジタン | [zidane](zidane/) |
| ユフィ | [yuffie](yuffie/) |
| ヴィンセント | [vincent](vincent/) |
| 桐生一馬 | [kiryu](kiryu/) |
| クラッシュ | [crash](crash/) |
| シャルロッテ | [charlotta](charlotta/) |
| 呂布 | [ryofu](ryofu/) |
| まめっち | [mametchi](mametchi/) |
| ピポサル | [piposaru](piposaru/) |
| ツインビー | [twinbee](twinbee/) |
| アルル | [aruru](aruru/) |
| マルク | [maruku](maruku/) |
| ディートリヒ | [dietrich](dietrich/) |
| 地球防衛軍 | [edf](edf/) |
| エーデルガルド | [edelgard](edelgard/) |
| ガイル | [guile](guile/) |
| スカポン | [sukapon](sukapon/) |
| プネウマ | [pneuma](pneuma/) |
| アルス | [arus](arus/) |
| ホロウナイト | [knight](knight/) |
| マエル | [maelle](maelle/) |
| 澄野拓海 | [sumino](sumino/) |
| ロックブーケ | [rocbouquet](rocbouquet/) |
| カエル | [frog](frog/) |
| トレサ | [tressa](tressa/) |
| イヴ | [eve](eve/) |
| オディオ | [odio](odio/) |
| ラハール | [laharl](laharl/) |
| DEEMO | [deemo](deemo/) |
| カサネ | [kasane](kasane/) |
| シャドウ | [shadow](shadow/) |
| サキ・アマミヤ | [saki](saki/) |
| エアリス | [aerith](aerith/) |
| ドシン | [doshin](doshin/) |
| モーグリ | [moogle](moogle/) |
| グレイモン | [greymon](greymon/) |
| メタルグレイモン | [metalgreymon](metalgreymon/) |
| ウォーグレイモン | [wargreymon](wargreymon/) |
| オメガモン | [omegamon](omegamon/) |
| どんちゃん | [donchan](donchan/) |
| シズナ | [shizuna](shizuna/) |
| ハナ | [hanajs](hanajs/) |
| ハナJK | [hanajk](hanajk/) |
| ハナJD | [hanajd](hanajd/) |
| 鬼助 | [kisuke](kisuke/) |
