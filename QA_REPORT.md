# DISCOVERY v1.0.10 QA REPORT

Release gate: **PASS**

## Visual source
- `design/VISUAL_SOURCE_OF_TRUTH.png` is the approved ivory / navy / gold mockup.
- Final source comparison: `qa/SOURCE_VS_V110_FINAL.png`.
- Actual 390×844 render board: `qa/VISUAL_QA_CONTACT_SHEET_v1.0.10_FINAL.png`.

## Layout-alignment changes
- Home: greeting/scenery → two course cards → learning record → compact navigation strip.
- Grammar: exercise hierarchy is progress → prompt → sentence → inline word lookup → scenic seam → discovery hint → role/action controls.
- WORD CODE: discovery screen now uses three-step lesson tabs plus a compact spelling/sound/example summary before comparison words.
- Challenge: intro uses text → landscape → action hierarchy; actual challenge exercises use light paper cards rather than a dark game-board surface.
- No unrevealed grammar or phonics answer is exposed early.

## Browser render QA
390 × 844 Chromium renders validated:
1. Home
2. Grammar discovery with word lookup open
3. DISCOVERED
4. Practice
5. WORD CODE home
6. WORD CODE discovery
7. Sound table
8. ROLE LAB
9. Challenge intro
10. Challenge play

Primary 9-screen runtime set: page errors **0**, console errors **0**, unintended horizontal overflow **0**. Challenge play: page errors **0**, horizontal overflow **0**.

## Responsive QA
16 cases across 320 / 360 / 390 / 430 px for Home, Grammar, WORD discovery and Challenge: unintended overflow **0** and runtime errors **0**. After the final word-lookup tap-target correction, Grammar was rechecked at all four widths with undersized interactive targets **0**.

## Automated QA
All project tests PASS, including:
- 7,200 generated grammar sentences
- discovery flow / SVC + M
- adaptive practice
- POS labels
- ROLE LAB structure
- challenge bank / mixed five-question sessions
- 21-symbol unified icon system
- WORD CODE 15 stages / 85 words
- sound discovery table
- school-term vocabulary scope
- static UI contracts
- local resource / service-worker contract
- v1.0.10 release contract

## Remaining device-specific check
SpeechSynthesis voice quality and iOS/Android browser chrome/Safe Area should still be checked once on physical devices after GitHub Pages deployment.
