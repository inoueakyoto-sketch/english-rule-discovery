# DISCOVERY｜英語のしくみ発見 v1.0.0

中学生向け・スマホ優先の英語学習Webアプリです。テーマは **「発見！」**。
正解を先に教えるのではなく、似た例を比べて「今までと違う」「ここが共通している」と自分で規則を見つける体験を中心にしています。

## 2つのコース

### DISCOVERY 01｜文のしくみ
- SV → SVC → SVO → SVOO → SVOC → ＋M を段階的に発見
- S / V / O / C / M と品詞の違いを学ぶ ROLE LAB
- 「単語」から日本語訳＋品詞を確認
- 発見済みの規則だけを使う5問練習（苦手・久しぶりを優先）
- 発見ログでいつでも振り返り
- 5文型＋Mの後に、高校・大学レベルの文型分解・穴埋め・並び替えへ挑戦

### DISCOVERY 02｜WORD CODE
- 文字名と音の違い → 短母音 → silent e → vowel teams → 子音パターン → 例外
- `game / take / name / cake` から `a_e → /eɪ/` のように規則を発見
- 英語音声はブラウザの SpeechSynthesis を使用
- 発見済みの規則だけで5問練習
- 「つづり → 音 → 意味」を結ぶ5語練習
- 音の発見表は未発見を `?` のまま残し、例外は後から追記
- 中1〜中2、学期単位の共通基礎語彙目安で出題範囲を調整

> 学期範囲は特定教科書のUnit配当ではありません。学習指導要領は教科書ごとの語の導入時期を固定していないため、小学校既習語と中学校の共通基礎語彙・綴り難度から作った目安です。

## デザイン

正式な Visual Source of Truth は `design/VISUAL_SOURCE_OF_TRUTH.png` です。
デザインテーマは **Quiet Discovery / 静かな発見**。

- 普段は静かで読みやすいオフホワイト＋深い青緑
- 発見の瞬間だけ深い青緑・淡い金・光の輪で特別感を出す
- 幼児向けゲームのような派手な報酬演出は使わない
- 山・湖・霧・光の道を「探索と発見」の共通モチーフとして使用
- 背景、コース画像、PWAアイコン、S/V/O/C/Mトークン、ナビゲーションアイコン、バッジは本プロジェクト用に制作した素材

詳細は `DESIGN_SYSTEM.md` と `ASSET_MAP.md` を参照してください。

## 保存

学習履歴は端末の `localStorage` に保存します。サーバーへの学習データ送信はありません。
旧版の保存キーを読み込み、可能な範囲で進捗を引き継ぎます。

## GitHub Pages

このフォルダの中身をリポジトリ直下へ置きます。

```bash
git add .
git commit -m "Release v1.0.0"
git push
```

GitHub Pages をリポジトリの対象ブランチから配信する設定にしていれば、push後に更新されます。

## ローカル確認

```bash
python -m http.server 8080
```

- `http://localhost:8080/` 文のしくみ
- `http://localhost:8080/phonics.html` WORD CODE

ローカル専用Visual QA用URL（公開環境では動作しません）:

- `/?qa=home`
- `/?qa=grammar`
- `/?qa=discovered`
- `/?qa=practice`
- `/phonics.html?qa=home`
- `/phonics.html?qa=discover`
- `/phonics.html?qa=table`

## QA

```bash
for f in tests/test-*.js; do node "$f"; done
```

v1.0.0では、英文生成7,200文、発見フロー、適応練習、品詞、ROLE LAB、難問、WORD CODE 15段階・85語、音の発見表、学校範囲、UI参照、PWAキャッシュ契約を検証します。

最終結果は `QA_REPORT.md` を参照してください。
