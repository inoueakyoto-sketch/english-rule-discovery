# Asset Map v1.0.8

すべて `assets/` 配下。外部ストック素材は使用せず、本アプリ用に制作した素材だけを使用する。

| 用途 | ファイル |
|---|---|
| PWA / ホームアイコン | `app-icon-192.png`, `app-icon-512.png`, `app-icon-1024.png` |
| 共通UIアイコン | `qd-icons.svg` — ナビゲーション、ノート、発見、音声、ヒント、チェック、難問など21シンボル |
| ホーム / Discovery Map | `home-hero.webp`, `discovery-map.webp` |
| 文法コース | `course-grammar.webp`, `grammar-map.webp` |
| WORD CODE | `course-phonics.webp`, `phonics-map.webp` |
| 難問チャレンジ | `challenge.webp` |
| 5問練習背景 | `practice-bg.webp` |
| 発見ログ | `discovery-log.webp` |
| 導入 / スプラッシュ | `splash-bg.webp` |
| 完了・節目 | `completion.webp` |
| DISCOVERED | `discovered-bg.webp` |
| バッジ / 節目装飾 | `badge-first.webp` ... `badge-summit.webp` |
| 共通フッター背景 | `footer-landscape.webp` |

## Icon Source of Truth

`assets/qd-icons.svg` を唯一のUIアイコンソースとする。

- 24×24 viewBox
- stroke 1.55–1.8px
- round linecap / round join
- 基本色は navy–teal、金色は発見の節目に限定
- Unicode記号（◇ / △ / ♪ / ▶ など）をUIアイコン代わりに使わない
- 旧PNGナビアイコン、旧単体SVGアイコンはv1.0.5で削除
- S/V/O/C/Mは「アイコン」ではなく学習上の役割記号としてHTML/CSSで表示

画像内に学習上の正解を固定で焼き込まず、答えや進捗は原則HTML/CSS/JSで表示する。
