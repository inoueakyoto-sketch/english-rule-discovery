# Visual QA v1.0.10

**Visual Source of Truth:** `design/VISUAL_SOURCE_OF_TRUTH.png`

The approved direction is warm ivory / misty blue-gray / deep navy / restrained gold, with broad pale-green canvases prohibited. v1.0.10 goes beyond palette matching and aligns the major screen composition to the approved mockup.

## Files
- Actual 390×844 renders: `qa/screens-v110/`
- 10-screen board: `qa/VISUAL_QA_CONTACT_SHEET_v1.0.10_FINAL.png`
- Source comparison: `qa/SOURCE_VS_V110_FINAL.png`
- Runtime report: `qa/RUNTIME_VISUAL_QA_v1.0.10.json`
- Responsive report: `qa/RESPONSIVE_QA_v1.0.10.json`

## Gate results
- Primary 390×844 runtime screens: PASS
- Challenge play interaction render: PASS
- Page errors: 0
- Console errors: 0
- Unintended horizontal overflow: 0
- 320 / 360 / 390 / 430 px key-screen matrix: PASS
- Undersized interactive controls after final correction: 0 on checked key screens

## Intentional differences from the mockup
The mockup remains a visual source, while the validated learning logic has priority. The production grammar screen retains the S/V/O/C/M role-selection control because it is core to the discovery flow. WORD CODE keeps stage-specific patterns instead of hard-coding the mockup's `ea` example. Challenge remains a mixed five-question transfer area rather than a single fixed writing exercise.
