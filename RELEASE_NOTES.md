## v1.0.10 — Mockup Layout Alignment

- Promoted the approved ivory/navy/gold mockup from color reference to full layout source of truth.
- Rebuilt Home hierarchy around greeting/scenery, two course cards, learning record and compact navigation.
- Reworked Grammar into a paper-first exercise with inline word lookup and non-overlapping discovery hint.
- Reworked WORD CODE discovery into lesson tabs + spelling/sound/example summary + comparison words.
- Repositioned Challenge scenery and converted the challenge exercise board from dark game UI to paper-based cards.
- Fixed undersized word-lookup controls and verified no unintended horizontal overflow in key responsive widths.
- Updated cache/version to v1.0.10 and regenerated visual QA boards.

# v1.0.8 Release Notes — Visual Refinement Step 6

## Tonal depth, tactile controls, screen identity

- established a restrained product palette: warm paper / mist / navy / teal / limited gold
- replaced generic web-button gradients with a consistent tactile pill system
- disabled primary actions now look intentionally inactive rather than faded/cheap
- Home uses calm translucent neutral surfaces and more refined action rows
- Grammar uses cooler analytical surfaces and quieter role controls
- ROLE LAB reads more like an editorial learning page than a component library
- WORD CODE receives the strongest teal identity, while gold is reserved for discovery progress
- Challenge receives a warmer editorial accent and no longer looks like a duplicate WORD CODE palette
- Sound Discovery Table uses quieter data rows and a clearer active filter state
- DISCOVERED keeps the light ceremonial CTA from the approved mockup

## QA

- 9 core screens rendered at 390×844
- 28 responsive cases across 320 / 360 / 390 / 430px widths
- page errors 0 / console errors 0 / unintended horizontal overflow 0 / undersized named controls 0
- all automated learning / release / icon tests pass

Artifacts:

- `qa/VISUAL_QA_CONTACT_SHEET_v1.0.8.png`
- `qa/COLOR_CONTROL_BEFORE_AFTER_v1.0.8.png`
- `qa/RUNTIME_VISUAL_QA_v1.0.8.json`
- `qa/RUNTIME_MATRIX_v1.0.8.json`

## v1.0.9 — Ivory / Navy / Gold redesign
- Replaced the visual source of truth with the newly approved non-mint mockup.
- Removed broad pale-green / mint background washes.
- Rebased the app on warm ivory, blue-gray, deep navy, and restrained gold.
- Reworked the home hero into a full-width scenic chapter and added a clear `学習コース` section label.
- Shifted grammar selection, practice progress, WORD CODE controls, sound table states, and challenge actions from teal toward navy / blue-gray.
- Kept green only for small functional status cues.
- Updated PWA theme/background colors and cache/version to v1.0.9.
