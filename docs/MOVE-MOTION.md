# 通常攻撃のモーション区別（2026-10-19）

全135形態・通常技/スマッシュ/空中技2,024件を対象に、元画像6〜17の実画像を17枚の一覧で確認し、論理ポーズと実描画を照合した。初回の論理参照先の重複は415組。画像番号が異なっても同じ画像へ解決されるハンター/くまたん/メリアや、ティファの同一中割りトラックも別途確認した。

既存の承認済み全身画像をキャラ固有のMoveMotion.defineにまとめ、642技を別の単独姿勢/連続姿勢に変更。新しい関節リグ/パーツ変形/画像生成は使わない。チョコボとスカポンの対象技も全身画像を選択し、その他の既存アニメーションは維持する。待機・移動・変身専用画像を再生成しない。

1枚の絵の拡大率/色/発生速度だけで別技と判定しない。上強は短い振り上げ、上スマは構えからの強い振り上げ、空上は跳躍姿勢や浮いたままの突き上げという文脈で、各キャラの実画像から選ぶ。同じ技の途中で同一ポーズを使う場合はあるが、他の通常技と連続姿勢全体を共用しない。

ビビ：空前は前方へ杖を向ける跳躍ポーズの炎、空下は下へ向ける姿勢の氷。上強は短い雷、上スマは構え→杖を掲げる雷柱、空上はエーテルリング。攻撃窓は分割せず、同一窓のindex/hitID/再命中管理を保つ。発生/持続/全体/着地隙/威力/吹っ飛び/移動タイムラインは維持する。NativeStrikesは実際の動的ポーズを問い合わせ、旧固定判定の必要な先端分はMOTION_ONLY=1のbuild-attack-weapon-reach.cjsで対象技だけ測り直す。補正を累積せず、未変更技の補正は維持する。

実描画の監査は各技の持続の初め/中央/終わりを同じ座標/背景で描き、全身画像の画素パターンを比較する。色違いの全件生成や対戦勝率の総当たりは行わない。move-motion-test.cjsでは全フレームの状態/判定を確認し、画像を変えたことで同一攻撃が余分にヒットしないことも確認する。

## キャラ別に変更した技

| キャラID | 技 |
|---|---|
| dragoon | smash, upsmash, downsmash, fair, bair, uair |
| isaac | jab3, smash, upsmash, downsmash, fair, bair, uair |
| ulgrim | jab3, smash, upsmash, downsmash, fair, bair, uair |
| chiikawa | jab3, smash, upsmash, fair, bair, uair |
| chocobo | jab2, jab3, smash, upsmash, bair, uair |
| monokuma | jab3, smash, upsmash, downsmash, fair, bair, uair |
| riki | jab3, smash, upsmash, downsmash, fair, bair, uair |
| roxas | jab3, smash, upsmash, downsmash, fair, bair, uair |
| twob | jab3, smash, upsmash, downsmash, fair, bair, uair |
| okami | jab3, smash, upsmash, downsmash, fair, bair, uair |
| gundam | jab3, smash, upsmash, downsmash, fair, bair, uair |
| vivi | jab3, smash, upsmash, downsmash, fair, bair, uair |
| zero | jab3, smash, upsmash, downsmash, fair, bair, uair |
| rin | jab3, smash, upsmash, downsmash, fair, bair, uair |
| nia | jab3, smash, upsmash, downsmash, fair, bair, uair |
| lightning | smash, upsmash, downsmash, fair, bair, uair |
| colette | jab3, upsmash, downsmash, bair, uair |
| rean | jab3, smash, downsmash, bair, uair |
| estelle | jab3, smash, downsmash, fair, bair, uair |
| noctis | jab3, smash, upsmash, downsmash, fair, bair, uair |
| clive | jab2, jab3, smash, upsmash, downsmash, fair, uair |
| makoto | jab2, jab3, smash, downsmash, fair, uair |
| neku | jab3, smash, upsmash, downsmash, fair, bair, uair |
| narukami | jab2, jab3, smash, upsmash, downsmash, fair, uair |
| naegi | jab2, jab3, upsmash, downsmash, bair, uair |
| rex | jab2, jab3, smash, upsmash, downsmash, fair, uair |
| luke | jab2, jab3, upsmash, downsmash, fair |
| will | jab2, jab3, smash, upsmash, downsmash, fair, uair |
| kosmos | jab2, heavy, upsmash, downsmash, fair, uair |
| fayt | jab2, jab3, heavy, dashAttack, upsmash, fair, uair |
| emma | jab2, jab3, heavy, dashAttack, upsmash, downsmash, fair, uair |
| ryza | jab2, jab3, heavy, dashAttack, smash, upsmash, uair |
| noah | jab2, jab3, dashAttack, smash, upsmash, fair, uair |
| midna | jab2, jab3, heavy, dashAttack, upsmash, downsmash, fair, uair |
| bomberman | jab2, jab3, dashAttack, smash, upsmash, fair, uair |
| sans | jab2, jab3, heavy, dashAttack, smash, upsmash, uair |
| lloyd | jab2, jab3, heavy, uair |
| shiren | jab2, jab3, heavy, smash, upsmash, uair |
| pokoa | jab2, jab3, smash, upsmash, fair, uair |
| hunter | jab2, jab3, heavy, smash, upsmash, fair, uair |
| adol | jab2, jab3, heavy, upsmash, fair |
| terry | jab2, smash, upsmash, downsmash, fair, uair |
| valkyrie | jab2, jab3, heavy, downsmash, fair |
| agumon | jab2, jab3, heavy, dashAttack, upsmash, uair |
| pawapuro | jab2, jab3, heavy, upsmash, fair, uair |
| headmaster | jab2, jab3, heavy, smash, upsmash, fair, uair |
| sakuna | jab2, jab3, heavy, upsmash, fair, uair |
| haseo | jab2, jab3, heavy, upsmash, fair, uair |
| terrarian | jab2, jab3, heavy, upsmash, fair, uair |
| horse | jab2, jab3, smash, upsmash, fair, uair |
| chef | jab2, jab3, smash, upsmash, fair, uair |
| akira | jab2, jab3, heavy, upsmash, fair, uair |
| morphie | jab2, jab3, heavy, upsmash, fair, uair |
| fei | jab2, jab3, upsmash, fair, bair, uair |
| human | jab2, jab3, heavy, upsmash, uair |
| kitten | jab2, jab3, smash, upsmash, fair, uair |
| elma | jab2, smash, upsmash, fair, bair, uair |
| goemon | jab2, jab3, heavy, smash, upsmash, downsmash, uair |
| bayleef | jab2, jab3, heavy, upsmash, fair, uair |
| metabee | jab2, jab3, upsmash, fair, uair |
| nier | jab2, jab3, upsmash, downsmash, air, fair, uair |
| miku | jab2, jab3, heavy, smash, upsmash, uair |
| naruhodo | jab2, jab3, heavy, uair |
| jibanyan | jab2, jab3, heavy, fair, uair |
| layton | jab2, jab3, smash, upsmash, fair |
| dante | jab3, smash, upsmash |
| leon | jab3, uair |
| tifa | jab2, heavy, smash, upsmash, air, uair |
| zidane | jab2, smash |
| yuffie | heavy, dashAttack, smash, upsmash |
| vincent | heavy, smash, upsmash |
| kiryu | heavy, smash, upsmash |
| crash | heavy, smash, upsmash |
| charlotta | jab2, jab3, smash, upsmash |
| ryofu | jab3, smash, upsmash |
| mametchi | smash, uair |
| piposaru | heavy, uair |
| twinbee | smash, upsmash |
| aruru | uair |
| maruku | jab2 |
| dietrich | jab3, smash, upsmash |
| edf | jab3, upsmash |
| edelgard | smash, upsmash |
| guile | upsmash |
| sukapon | jab2, uair |
| pneuma | jab2, jab3, smash, uair |
| arus | jab3, smash, uair |
| knight | jab3, heavy, smash, uair |
| maelle | jab2, jab3, smash, upsmash, uair |
| sumino | jab2, jab3, smash, upsmash, uair |
| rocbouquet | jab2, jab3, smash, upsmash, uair |
| frog | jab2, jab3, smash, upsmash, uair |
| tressa | jab3, heavy, smash, uair |
| eve | dashAttack, smash, uair |
| odio | dashAttack, smash, upsmash, uair |
| laharl | dashAttack, smash, upsmash |
| deemo | jab3, dashAttack, smash, upsmash |
| kasane | jab3, dashAttack, smash, upsmash |
| shadow | jab2, jab3, upsmash |
| saki | jab2, jab3, smash, upsmash |
| aerith | jab2, jab3, dashAttack, upsmash, fair |
| doshin | jab2, jab3, smash, upsmash, fair |
| moogle | jab2, jab3, smash, upsmash, fair |
| greymon | jab2, jab3, smash, upsmash |
| metalgreymon | jab2, jab3, smash, upsmash |
| wargreymon | jab2, jab3, smash, upsmash |
| omegamon | jab2, jab3, smash, upsmash |
| donchan | jab2, jab3, smash, upsmash |
| shizuna | jab3, smash, upsmash |
| hanajs | jab2, jab3, smash, upsmash |
| hanajk | jab2, jab3, smash, upsmash |
| hanajd | jab2, jab3, smash, upsmash |
| kisuke | jab3, smash, upsmash, fair |
| ray | smash, downsmash, fair |
| alain | jab3, downsmash, fair |
| hinako | jab3, heavy, smash, fair |
| cojicoji | jab3, fair |
| megamanexe | smash, fair, uair |
| melia | jab3, heavy, fair, uair |
| fiora | jab2, jab3, heavy, dashAttack, fair |
| krystal | jab3, heavy, dashAttack, fair |
| yuri | jab2, jab3, heavy, smash, upsmash, air |
| hornet | dashAttack, air, fair |
| toro | jab3, smash, air |
| c4621 | smash, upsmash, fair |
| malenia | jab3, fair |
| hayabusa | jab3, heavy, dashAttack, fair |
| klonoa | air, fair |
| katamari | air, fair |
| kingbonby | air, fair |
| alucard | heavy, upsmash |
| kurabe | jab3, upsmash, fair |
| battlemage | heavy, smash, upsmash |
| karateka | heavy, smash, upsmash |
| aiai | jab3, smash, upsmash |
