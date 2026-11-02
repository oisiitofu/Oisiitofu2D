# iPhone / Safariのズームと画面復帰

スマホ操作中のSafari独自のgestureイベントと複数指のネイティブ操作を抑止する。戦闘操作は既存のPointer Eventsを維持し、メニューの1本指スクロール・入力欄・通常クリックを残した。

VisualViewportのresize/scroll、表示復帰、pageshow、focus、回転、全画面変更時に可視領域を測り直す。復帰通知後100/350/800msにも再測定し、Safariの遅いサイズ更新に追従する。ネイティブ全画面が消灯で解除されても、スマホの拡張レイアウトを保持する。ユーザーによる解除は通常どおり反映する。自動でブラウザの全画面APIへ再入場せず、再読み込みやオンライン切断を行わない。

ブラウザのpinch scaleは読み取り専用のため書き換えない。拡大が残った場合はルートとトップレイヤーのdialogへ逆倍率を掛け、可視領域内にゲーム全体とボタンを収める。キャンバスの内部解像度は元の論理サイズを保つ。スマホの高さ/幅は可視領域のCSS変数を使い、100dvhの古い値だけに依存しない。PCでは補正を適用せず、スマホモードを切ると変数も解除する。

検証：`mobile-viewport-test.cjs`でSafari gestureのキャンセル、メニュースクロール、CDPの実ページ倍率2倍からの見た目復元、3指同時入力、dialog、非表示→全画面喪失→遅れて横向きサイズが届く復帰を確認した。キャンバスは844×390 CSS px / 1266×585内部pxを保持。ポーズ状態・対戦状態は再生成しない。既存`mobile-display-test.cjs`のnative/unsupported/rejected/webkit/standaloneとダブルタップ、`mobile-controls-test.cjs`の入力/縦横5サイズ、`mobile-controls-online-test.cjs`の2クライアント111フレーム一致も通過。PC3サイズの配置・全画素一致を`mobile-layout-test.cjs`で確認。iPhone実機での消灯復帰はこの環境では未確認。

参照：[VisualViewport / MDN](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)、[Safari Handling Events / Apple](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html)。

公開結果：GitHub実装 `0bfc805`、Sites v198、配信ソース `f88317c126adcd253cce112d6f9e0443e27f2e8a`。最終デプロイ `appgdep_6ae89b2032ac819199a062c9a7c455c5` は2026-11-02 23:16:14 JSTに成功。公開版のviewport検証6項目も通過し、変更配信物2件のSHA-256一致、オンライン入口200、一時アップロードキー削除を確認した。公開済み音声は変更していない。
