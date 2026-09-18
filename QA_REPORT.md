# DISCOVERY v1.0.0 QA REPORT

Release gate: **PASS**

## Automated QA

All release tests passed on 2026-09-18.

- 7,200 generated grammar sentences validated
- discovery flow and SVC + M transition validated
- adaptive practice weighting / mastery labels validated
- POS labels validated on 11,795 generated sentence parts
- pattern / UNKNOWN pre-answer hints absent
- S / V / O / C / M ROLE LAB structure validated
- challenge bank, vocabulary support, unique answers, mixed 5-question sessions validated
- WORD CODE: 15 discovery stages / 85 practice words validated
- sound-discovery table: 15 slots, exceptions, focused 5-question practice validated
- school-term vocabulary scope: all 85 practice words mapped; available pool grows 32 → 68 → 81 → 85
- HTML / JS UI id contract validated
- all local HTML and service-worker resources exist
- PWA v1.0.0 cache contract and critical visual assets validated
- CSS brace structure validated
- interactive UI smoke: grammar assignment → feedback, phonics discovery → reveal, sound table, school-scope controls validated

Run again with:

```bash
for f in tests/test-*.js; do node "$f"; done
```

## Visual QA

Viewport: **390 × 844** (smartphone-first)

Rendered screens are stored in `qa/screens/` and summarized in `qa/VISUAL_QA_CONTACT_SHEET.png`.

Checked screens:

1. Home
2. Grammar discovery
3. DISCOVERED moment
4. 5-question practice
5. WORD CODE home
6. WORD CODE discovery (`game / take / name / cake`)
7. Sound discovery table
8. S/V/O/C/M ROLE LAB
9. Challenge intro

### Source-of-truth comparison

Reference: `design/VISUAL_SOURCE_OF_TRUTH.png`

- **Home:** course-card hierarchy, white canvas, navy/teal typography, scenic cards, restrained gold, action rows: PASS.
- **Grammar discovery:** progress → question → sentence → word lookup → role dock hierarchy: PASS.
- **DISCOVERED:** full-screen dark teal special moment with concentric rings and gold accent: PASS.
- **Practice:** compact 5-step progress, insight card, sentence task, role dock: PASS.
- **WORD CODE:** compare words → audio → common pattern guess: PASS.
- **Sound table:** discovered rows + unrevealed `?` rows + focused-practice route: PASS.
- **Challenge / ROLE LAB:** added after the original 6-screen mockup and rendered in the same design system: PASS.

### Intentional product-correctness differences from mockup

The mockup is the visual source of truth, but two details are intentionally not copied literally because they would reveal answers too early:

- The grammar role dock shows only roles the learner has already discovered; undiscovered roles remain `?` instead of showing all S/V/O/C/M immediately.
- Course-card artwork does not contain undiscovered grammar letters or phonics patterns. It uses symbolic path/sound imagery instead.

These exceptions follow the higher-priority learning rule: **do not show the answer before the learner discovers it.**

## Accessibility / interaction checks

- mobile tap targets and bottom role dock sized for touch
- `prefers-reduced-motion` respected
- no punitive vibration on errors
- word lookup shows Japanese meaning + part of speech and includes audio access
- PWA icons and portrait orientation configured
- localStorage failures are caught so the UI can still start in restricted contexts

## Remaining environment note

Actual iOS / Android SpeechSynthesis voice quality depends on the voices installed on the device. The app uses English (`en-US` preferred) browser speech and does not require an external audio service.
