# DISCOVERY Design System v0.2.2

## Core idea

**静かな発見。**

このアプリは正解数を競うゲームではなく、「あ、そういうことか」を自分で見つける学習体験を中心にする。

## Experience rules

1. **先に答えを見せない**
   - 未発見の規則名・文型名・音パターン名を自動表示しない。
2. **違和感を消さない**
   - 既知の問題に少量の未知を混ぜ、「あれ？」を起こす。
3. **通常時は静かにする**
   - 紙吹雪・キャラクター・派手な点滅・過剰な連続正解演出は使わない。
4. **新しい発見だけ特別にする**
   - 深い青緑の画面、ゆっくり広がる円、`DISCOVERED` 表示を使う。
5. **褒めるより、見つけた事実を返す**
   - 「すごい！」より「見つけた」「つながった」「同じしくみを見抜けた」。
6. **発見を蓄積する**
   - DISCOVERY MAP / DISCOVERY LOG / SOUND MAP に残し、いつでも戻れる。
7. **中学生に幼く見せない**
   - 研究ノート、探索ツール、少し未来的なインターフェースを基準にする。

## Visual language

- Base background: cool off-white / pale gray
- Main ink: deep navy-green `#102126`
- Discovery / exploration accent: teal `#167b80`
- Special discovery accent: quiet warm gold `#b8863c`
- Cards: almost-white with thin borders and soft shadows
- New discovery card: deep navy-green only at the moment of discovery

Role colors for S/V/O/C/M remain functional colors and are not used as decorative color everywhere.

## Motion rules

- Normal navigation: short 120–280ms transitions.
- New discovery: 500ms class entrance + a single expanding ring.
- No infinite celebratory animation.
- Respect `prefers-reduced-motion`.

## Copy tone

Prefer:
- 見つけた。
- つながった。
- 今までと少し違う。
- 同じしくみを見抜けた。
- 発見ログに保存しました。

Avoid:
- すごい！
- 天才！
- 大正解！！！
- レベルアップ！
- 派手なゲーム的報酬表現

## Course naming

- `DISCOVERY 01 · GRAMMAR CODE` — 文のしくみ
- `DISCOVERY 02 · WORD CODE` — 単語の読み

Both are different fields of the same activity: **finding hidden rules in English**.


## Sound Discovery Table
- 表は完成形を最初から見せない。未発見セルは `？`。
- 発見した行だけ、つづり・音・例・発見番号を表示する。
- 例外は別の正解表として分離せず、元の規則に「別読み」として後から追記する。
- 表から直接、その規則だけの短い練習へ戻れる。
