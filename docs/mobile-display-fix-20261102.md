# スマホの全画面・ダブルタップ修正

2026-11-02。全画面APIがない端末では何も起きず、拒否時のエラーも隠していた。標準APIとWebKit版を使い分け、実行したAPIに対応する方法で解除する。全画面の対象はdocumentElementとし、設定ダイアログも表示できるようにした。スマホの全画面中はヘッダーを隠し、戻すボタンを残す。

非対応・拒否の場合はゲーム内の表示領域を広げ、実際のブラウザ全画面とは区別した案内を表示する。iPhoneのSafariは任意要素のFullscreen APIに制限があるため、ホーム画面からWebアプリとして起動する方法を案内。manifest、Apple向けmeta、ホーム画面アイコンを追加した。オンラインで別ドメインの接続先へ移動した際の表示はブラウザに依存する。

ダブルタップはアプリ全体のtouch-action:manipulation、対戦キャンバスと操作パネルのtouch-action:noneで抑える。Safari向けtouchend処理も追加し、2回目のUIクリックは保持する。フォーム操作、メニューのスクロール、既存の複数指・長押しを維持。viewportによるページ全体の拡大禁止は追加していない。

検証：`mobile-display-test.cjs`。Chromiumの実Fullscreen API、非対応・拒否・WebKit版・standaloneの分岐を確認。実ダブルタップでvisualViewport.scale=1、補助処理の2回目のクリック維持、フォーム操作、manifestとアイコンの応答を確認。`mobile-controls-test.cjs`も成功。iPhone・Android実機は未確認。

参考：[WebKitのiOS Fullscreen API課題](https://bugs.webkit.org/show_bug.cgi?id=206854)、[Appleのホーム画面Webアプリ案内](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios)、[MDN touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)。
