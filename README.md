# RULE FINDER / WORD CODE v0.2.0 two-course candidate

GitHub Pagesでそのまま公開できる、スマホ中心の中学生向け英語学習Webアプリです。

## 大きな2コース

### COURSE 01 — 文のしくみ
従来の RULE FINDER コースです。

- SV → SVC → SVO → SVOO → SVOC → M を「今までと違う」に気づいて発見
- 発見済みルールだけの5問適応練習
- 気づきノート
- S/V/O/Cに入る品詞・まとまりを整理する ROLE LAB
- 単語ヒント：日本語訳＋品詞
- 高校・大学レベル英文を使う難問チャレンジ
- 難問では文型分解・穴埋め・並び替えを扱う

### COURSE 02 — 単語の読み
新設の WORD CODE コースです。

「ABCの文字名やローマ字は読めるが、英単語になると読めず、単語を覚えにくい」学習者を主対象にしています。

学習サイクル：

1. 単語を音声で聞く
2. 複数の単語を比べる
3. 共通する綴りと音を予想する
4. 規則を開示する
5. 初見語を先に自分で読んでみる
6. 音声で確かめる
7. 発見を「音の地図」に保存する

## WORD CODE の15発見

1. 文字の「名前」と単語の中の「音」は別
2. short a /æ/
3. short i /ɪ/
4. short e /ɛ/
5. short o /ɑ/（米語基準）
6. short u /ʌ/
7. a + 子音 + e → /eɪ/（game / take など）
8. i + 子音 + e → /aɪ/
9. o + 子音 + e → /oʊ/
10. ee → /iː/
11. ea → /iː/ が多い
12. ai / ay → /eɪ/
13. oa → /oʊ/
14. sh / ch は2文字を1まとまりとして読む
15. 規則は絶対ではなく手がかり（bread / great / have / give など）

例外は失敗扱いにせず、「同じ綴りでも別の読みがある」という次の発見として扱います。

## WORD CODE の定着モード

### 5問だけ音を読む
発見済みパターンだけから出題します。最近間違えた／練習回数が少ない／久しぶりのパターンを少し多く出す適応型です。

### 5語だけ覚える
単語暗記を「綴り → 音 → 意味」の順につなぎます。

1. 単語を見て自分で読んでみる
2. 音声で確認する
3. 日本語の意味を4択から選ぶ
4. 間違えた単語は次回以降に出やすくなる

### 音の地図
発見済みのパターンだけを一覧できます。各例語はタップして音声を再確認できます。未発見の規則名は先に表示しません。

## 音声

ブラウザ標準の Web Speech API (`speechSynthesis`) を利用し、`en-US` を優先して再生します。

- 音声品質・声種は端末／ブラウザに依存します。
- カタカナ説明は補助です。実際の音声を基準にしてください。
- short o は米語の /ɑ/ を基準にしています。
- 外部音声APIを使わないためGitHub Pagesだけで動作します。

## 語彙データについて

文法コースの学期別語彙は、現時点では共通基礎語彙の試作です。
WORD CODEの発見語も、読みのパターンを見つけやすい基本語を編集して使用しています。

次のデータ拡張では、教科書／学年／学期／Unit別の語彙バンクを追加し、WORD CODEの「5語だけ覚える」で学校の現在範囲の単語を優先できる構造にします。

## ファイル構成

- `index.html` — COURSE 01 文のしくみ
- `phonics.html` — COURSE 02 単語の読み
- `styles.css` — 共通UI
- `app.js` / `core.js` — 文法コース
- `phonics.js` / `phonics-core.js` — 読みコース
- `data/wordbank.js` — 文法コース語彙
- `data/role-guide.js` — S/V/O/C学習データ
- `data/challenge-bank.js` — 難問データ
- `data/phonics-bank.js` — 読みパターン／単語データ
- `sw.js` — PWAオフラインキャッシュ

## GitHub Pages

リポジトリのルートへこのZIPの中身を置きます。

GitHub:

`Settings → Pages → Deploy from a branch → main → / (root)`

更新時：

```bash
git add .
git commit -m "Update to v0.2.0 two-course"
git push
```

## ローカル確認

`index.html` を直接開いても基本機能は動きます。PWA / Service Workerを含めて確認するときはHTTPサーバー経由で開いてください。

例：

```bash
python -m http.server 8000
```

その後 `http://localhost:8000/` を開きます。
