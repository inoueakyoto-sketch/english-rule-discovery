# DISCOVERY｜英語のしくみ発見 v1.0.10

中学生向け・スマホ優先の英語学習Webアプリ。テーマは **「発見！」**。
正解を先に教えるのではなく、似た例を比べて「今までと違う」「ここが共通している」と自分で規則を見つける体験を中心にしています。

## DISCOVERY 01｜文のしくみ

- SV → SVC → SVO → SVOO → SVOC → ＋M を段階的に発見
- S / V / O / C / M と品詞の違いを学ぶ ROLE LAB
- 「単語」から日本語訳＋品詞を確認
- 発見済みの規則だけを使う5問練習
- 発見ログでいつでも振り返り
- 5文型＋Mの後に高校・大学レベルの文型分解・穴埋め・並び替えへ挑戦

## DISCOVERY 02｜WORD CODE

- 文字名と音の違い → 短母音 → silent e → vowel teams → 子音パターン → 例外
- `game / take / name / cake` から `a_e → /eɪ/` のように規則を発見
- SpeechSynthesisで実際の音を確認
- 発見済み規則だけの5問練習
- 「つづり → 音 → 意味」を結ぶ5語練習
- 音の発見表は未発見を `?` のまま残す
- 中1〜中2、学期単位の共通基礎語彙目安で出題範囲を調整

## Visual Source of Truth

`design/VISUAL_SOURCE_OF_TRUTH.png`

デザインテーマは **Quiet Discovery / 静かな発見**。

v1.0.10では、承認済みモックアップをVisual Source of Truthとして、色だけでなく画面構成そのものを再配置しました。

1. 枠・入れ子カードを削減
2. 文字階層を3段階に整理
3. UIアイコンを `assets/qd-icons.svg` の自作21シンボルへ完全統一
4. 余白を 4 / 8 / 12 / 16 / 24 / 32 / 40px のリズムで再設計し、画面を「部品の積み上げ」ではなく1画面として構成
5. 背景素材とUIをフェード・透過面でつなぎ、一枚の画面として統合
6. アイボリー・青灰・深い紺・控えめな金へ再編し、薄緑のAIテンプレート感を排除
7. ホーム・文法・WORD CODE・難問をモックアップの情報順・景色比率・操作重心へ再配置

アイコン一覧: `qa/ICON_SYSTEM_v1.0.5.png`

## 保存

学習履歴は端末の `localStorage` に保存します。サーバーへの学習データ送信はありません。

## GitHub Pages

このフォルダの中身をリポジトリ直下へ置きます。

```bash
git add .
git commit -m "Release v1.0.10 mockup layout alignment"
git push
```

## ローカル確認

```bash
python -m http.server 8080
```

- `http://localhost:8080/`
- `http://localhost:8080/phonics.html`

## QA

```bash
for f in tests/test-*.js; do node "$f"; done
```

v1.0.10では、英文生成7,200文、発見フロー、適応練習、品詞、ROLE LAB、難問、WORD CODE 15段階・85語、音の発見表、学校範囲、UI参照、PWAキャッシュ、統一アイコンシステムに加え、実ブラウザのレイアウトQAを検証します。

詳細: `QA_REPORT.md`

## Visual baseline v1.0.10
- Source: `design/VISUAL_SOURCE_OF_TRUTH.png`
- 390×844 render set: `qa/screens-v110/`
- Final comparison: `qa/SOURCE_VS_V110_FINAL.png`
- Primary render board: `qa/VISUAL_QA_CONTACT_SHEET_v1.0.10_FINAL.png`

The home screen now follows greeting → scenery → course cards → learning record → navigation. Grammar uses a paper exercise surface with inline word lookup, WORD CODE uses a lesson/tab/table structure, and challenge uses paper-first exercise surfaces instead of a dark game board.
