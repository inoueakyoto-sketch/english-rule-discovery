# DISCOVERY Design System v1.0.8

## コンセプト

**静かな発見。**
このアプリで価値があるのは「正解した」ことより、学習者自身が「あ、そういうことか」と規則に気づくこと。

## 原則

1. 先に答えを見せない。
2. 「あれ？」という違和感を消さない。
3. 通常正解と新しい発見を同じ演出にしない。
4. 褒め言葉より「何を見つけたか」を返す。
5. 発見したものはMAP / LOG / TABLEへ残す。
6. 思春期の中学生に幼く見えない。
7. スマホ片手操作を優先する。

## Visual Source of Truth

`design/VISUAL_SOURCE_OF_TRUTH.png`

主要画面はこのモックアップの情報階層・余白・色・演出を基準に実装する。Visual QAでは390×844相当の実画面をレンダリングし、雰囲気だけでなく構成・整列・余白・アイコンの統一まで比較する。

## カラー

- Canvas: `#f7f8f6`
- Ink: `#102f3c`
- Deep teal: `#0f4d5b`
- Discovery teal: `#116775`
- Mist: `#e8f0ef`
- Gold: `#c79532`（新しい発見・重要な節目に限定）

## Frame hierarchy

- Major page surface: borderless。余白と面の差で領域を作る。
- Secondary group: soft tonal fill。必要がなければ枠線を付けない。
- Interactive control: 操作性が必要な部分だけhairlineまたはcontained fillを使う。
- Selected / focus: 最も強い線・リングは選択状態へ予約する。
- Data table: 縦グリッドより横方向の区切りを優先する。

「カードの中にカード」に見えたら、装飾を足す前に枠を1つ減らす。

## Typography hierarchy

画面を3階層で読む。

1. **Display / screen title** — 画面に1つだけ主役になる明朝系見出し。
2. **Learning / task language** — 今読むべき問題・説明・操作内容。
3. **Metadata / orientation** — DISCOVERY / SOUND / FOUND / Q番号などの小さく静かな補助情報。

- Japanese display: `Noto Serif CJK JP` + platform Mincho fallbacks
- UI/body: `Noto Sans CJK JP` + platform Gothic/Sans fallbacks
- 6–9pxはmetadata専用。読ませる本文には使わない。
- 英字大文字ラベルは太さではなくtrackingと低コントラストで階層化する。

## Icon system — v1.0.5

UIアイコンは `assets/qd-icons.svg` に完全統一する。

### Geometry

- viewBox: `0 0 24 24`
- stroke: 1.55–1.8px
- linecap / linejoin: round
- 基本アイコンサイズ: 18–21px
- 44px以上のタップ領域の中に配置し、アイコン自体を大きくしすぎない

### Visual language

- 基本色は deep teal / discovery teal
- 背景はmist系の薄い面
- Goldは「発見」「節目」に限る
- 画像生成アイコン、文字記号、絵文字、複数線幅のSVGを混在させない
- 矢印・音声・チェック・戻る・ノート・難問など、同じ意味には常に同じ形を使う

現在の21シンボルは `qa/ICON_SYSTEM_v1.0.5.png` で一覧確認できる。


## Spacing rhythm — v1.0.8

画面内の余白は `4 / 8 / 12 / 16 / 24 / 32 / 40px` の段階で設計する。

- **Inside component:** 4–12px。ラベル、アイコン、同じ意味の情報をまとめる。
- **Between components:** 12–16px。同じ章の中で、操作や説明を区切る。
- **Between sections:** 24–32px。タイトル、学習内容、操作など役割が変わる場所に使う。
- **Discovery pause:** 32–40px。新しい規則や重要な転換の前後にだけ使う。

すべてを等間隔にしない。重要度が変わるところで余白も変える。
「カード → 8px → カード → 8px」の機械的な連続を避け、画面を `title / task / action` の大きなまとまりとして読む。

文法画面は `task → sentence/lookup → landscape/action dock`、WORD CODEは `hero → question → school range → choices` のリズムを基準とする。

## Motion

- 通常正解: 小さく、短く。
- DISCOVERED: 光の輪・背景変化・淡い金を使用。
- 誤答: 罰する振動・赤い点滅を使わない。
- `prefers-reduced-motion` を尊重する。

## Image language

山・湖・霧・光の道・星・開いた本を、英語の中にある規則を探索する象徴として統一的に使用する。画像は教材の説明そのものを焼き込むのではなく、UIと学びを支える背景・象徴として使う。

## Scenery + UI integration — v1.0.8

背景素材は「画像カード」として置くのではなく、画面の空気を作る層として扱う。

- 景色から白いUIへ移るときは、hard edgeではなく mist / fade を使う。
- 背景が見える面だけ半透明にし、すべてをglass UIにはしない。
- 学習内容の可読性を優先し、本文の真後ろに高コントラストな山・光を置かない。
- Homeはコース画像から下の操作群へ景色の気配が続く。
- Grammar / Practiceは `task → sentence → landscape → action dock` が一枚の画面としてつながる。
- WORD CODEはhero artworkがタイトル領域へ溶け込み、画像と本文の境界を目立たせない。
- Sound Tableは表を主役にし、景色はfooter atmosphereに限定する。
- Challengeはheroの下端をcopyへフェードさせ、「画像＋Webページ」に見せない。

景色が教材文字より強く見えたら、背景のopacityを下げる。装飾を足して解決しない。


## Tonal depth and controls — v1.0.8

- Base canvas: warm off-white paper rather than pure white.
- Teal: primary learning/navigation accent, strongest in WORD CODE.
- Navy/blue: grammar analysis and structural reading.
- Gold: discovery, next milestone, and challenge metadata only.
- Primary CTA: calm tactile pill with subtle depth; no loud game gradient.
- DISCOVERED CTA: light ceremonial pill to preserve the approved mockup hierarchy.
- Each course may vary temperature, but typography, spacing, icon geometry and surface language stay shared.

## v1.0.9 — Ivory / Navy / Gold visual source

The approved visual source was replaced with `design/VISUAL_SOURCE_OF_TRUTH.png` on 2026-09-18.

Core palette:
- warm paper / ivory for page surfaces
- deep navy for headings and primary actions
- misty blue-gray for analysis / phonics support surfaces
- restrained gold for discovery, progress, and challenge accents
- green is functional only (small success/state cues), never a broad background wash

This change explicitly removes the previous pale-mint canvas language that made the product resemble generic AI/SaaS interfaces.


## v1.0.10 — Layout Source of Truth
The approved `design/VISUAL_SOURCE_OF_TRUTH.png` now governs not only palette but screen composition.

### Composition rules
- Home: scenery is a chapter, not a card decoration. Flow = greeting → courses → record → navigation.
- Grammar: the exercise itself owns the visual center. Word lookup expands inline and must never cover the sentence.
- WORD CODE: teach with a compact lesson structure (step tabs → pattern summary → compare → guess).
- Challenge: use ivory paper and navy type; mountain imagery separates chapters rather than becoming a decorative top banner.
- Keep major actions pill-shaped and quiet; gold is reserved for discovery/hint emphasis.
- Avoid dense stacks of bordered cards, generic mint surfaces, dark game-board panels, and text-sized pseudo-icons.
