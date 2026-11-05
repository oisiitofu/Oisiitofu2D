# 太陽銃連射 → パイルドライバー浄化

既存の金髪、額のゴーグル、赤いマフラー、茶系の衣装とガン・デル・ソルを保持した専用4ポーズとカットインを制作。太陽銃の4連射の後、カメラを引いて棺と向かい合う反射鏡つきの浄化装置を示す。おてんこさまと太陽の力を蓄え、5回の浄化パルスから大きな光柱へつなぐ。途中9回のダメージと最後の吹っ飛びが共有時間軸で一致する。

武器と太陽の力は[コナミ公式製品説明](https://www.konami.com/games/jp/ja/products/boktai/)を確認。浄化の流れはコナミのBoktai 2説明書（[保存版PDF](https://boktai.info/img/media/manuals/manual_boktai2.pdf)の印刷2–5ページ）、装置の形は[原作ゲーム画面](https://game.watch.impress.co.jp/docs/20031022/boktai.htm)の反射鏡と緑の基部を参照した。ボスの棺と太陽光による浄化を対戦用に構成し、通常必殺技には変更を加えない。

素材は `assets/limit-{cutin,court,poses,devices,effects}.webp`。内蔵imagegenで制作し、最終プロンプト・参照・出力を `limit-break-assets.json` に記録。輪や光柱の外周が欠けた初稿は不採用とし、余白を取って再制作した。弾の芯は右、尾は左。右側装置のビームは反転して棺へ向け、左右向きは共通world変換で処理する。カットイン比率を保ち、主攻撃はart.strike、補助の溜め光はart.glow。光柱の前に本人・相手を描いて視認性を維持する。

専用音は短い高域の太陽弾と、和音・低域の衝撃を組み合わせた浄化の2音。ローカル対戦・トレモ・両向きの描画・カットイン比率・攻撃の濃さを確認。CPUは60秒1ストック設定の1戦が結果まで進行。`LIMIT_FIGHTER=django` で既存の `characters/dragoon/tests/limit-break-online-test.cjs` を実行し305フレームの途中ダメージと吹っ飛びが一致。公開検証は `docs/limit-break-rollout.md` へ追記する。
