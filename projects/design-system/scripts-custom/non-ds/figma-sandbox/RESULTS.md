# Results of the build run, 2026-10-13

File "OB Legacy Sandbox" (`EEb38qX1Gxzq8XUCAvivge`). Built and checked on 2026-10-13. Definitions of the checks: `checks.md`. How to use: `README.md`.

## Summary

All 405 published components of the legacy library "OB Library 16.0.0 F1.2" are in the sandbox as instances linked to the library, each with overrides, plus 16 component swaps and a snapshot and compare tool that passed its self test. The 4 Starter Kit pages are unchanged. One independent review found real problems, they were fixed, a second review is listed below.

## Numbers (own measurements, after the fixes)

| Check | Result |
|---|---|
| C1 coverage | 405 of 405 components have a fixture (99 sets via the default variant, 306 standalone of which 284 icons). 6 components with a name starting "." or "_" are excluded, Figma does not publish them. |
| C2 every fixture has an override | 1,244 of 1,244 (1,228 on Components, 16 on Swaps) differ from a fresh instance of their own main component. 16 variant-after-override fixtures and 6 swaps lost their override at the variant change or swap, so they carry a resize added after it. |
| C3 override types | resize 405, fill 404, hidden-layer 118, variant-after-override 95, text 94, nested-variant 57, boolean 39, instance-swap 16. Types only where the component has them. Icons have no hidden-layer (one vector each). Radio and checkbox have no variant-after-override fixture. |
| C4 swaps | 16 swaps: text-input, text-area, select legacy to new and back (6, the pairs of frame 26518:7149) and 10 end-of-life to current. Results in `snapshots/swap-results.json`. |
| C5 detached and local | 0 detached, 0 local components. |
| C6 overlaps | 0 by bounding box and 0 by render bounds on all 3 new pages (1,920 containers), 0 fixtures collapsed, 0 outside their root frame. |
| C7 two snapshots in a row | 0 differences in data. 1 of 1,244 images differs (`fixture/alert-notification/text`, anti-aliasing noise in the last pixel row, it differs on every export). |
| C8 self test | 5 of 5 changes found exactly (text property, boolean, hidden layer, root fill, size), then empty after the revert. |
| C9 Starter Kit pages | identical to the baseline taken before the build (byte for byte). |
| C10 other files untouched | every WRITE line in `run.log` has the sandbox key. Reads on the library only. Note: selecting nodes in the library changed its view state (current page, selection), not its content. |

## What the sandbox already showed (build time, not a library update)

- A variant change after an override reset the override in 16 of 95 cases (`snapshots/variant-change-lost.json`), for example datepicker, stepper, master-layout / desktop.
- Swaps: legacy to new keeps the text override for text-input and text-area (property values equal 14 of 16 and 16 of 18, the rest are new properties). End-of-life to current lost the text override in 8 of 10 cases, and in 6 cases every override.
- Rows marked BREAK on the page "Known breaks".

## Problems found by the independent review, and what was done

1. 73 fixtures collapsed to 1 px height in their cells (components set to fill their parent): sizing set to fixed with the size of the main component. Fixed.
2. 5 thumbnail-community fixtures wider than their row: rows widened. Fixed.
3. Overlaps by render bounds (82): spacing, padding for overflowing content, label gap. Fixed, 0 now.
4. Compare tool blind spots (fixture root, strokes, effects, opacity, text style): recorded now, self test extended to the root fill and size. Fixed. Still not recorded: position inside the cell, fills after the third, nodes outside the fixtures (labels, frames, the page "Known breaks").
5. "Known breaks" had no break: 22 rows marked BREAK and a summary line added.
6. README and RESULTS missing: written.
7. Names: "variant-after-override" fixtures where the override was reset are variant plus a resize afterwards; this is stated in the BREAK rows.

## Not done, limits

- Nothing here tests a library change that is not published yet. First real use: the next library publish (snapshot, Accept, compare).
- One fixture per component and override type, not per component property (39 boolean fixtures for 125 boolean properties). Fixtures start from the default variant.
- More end-of-life swaps possible (prefix, suffix, scrollbar). Radio and checkbox: no variant-after-override fixture.
- The compare tool treats image-only differences as a hint (render noise on a few nodes).
- "Last result" on Known breaks is filled by hand after the first real run.

## Second review (round 2)

The same reviewer measured again with its own scripts and passed all items: 0 collapsed fixtures (before 48), 0 fixtures outside their root frame, 0 sibling overlaps by bounding box and by render bounds (before 82), 1,244 of 1,244 fixtures with an override, two new snapshots 0 data differences (1 noise image), the root fill change is now a data difference, the 22 BREAK rows and the summary line are on the page, the Starter Kit pages equal the baseline, all 138 WRITE lines carry the sandbox key. The screenshots of the formerly broken families, "group / End of life" and Known breaks are readable.

Left over from round 2:
- The family card "end of life footer / link" had white text on a white card: card made dark (fixed).
- `checks.md` (C6 by render bounds, C8 with 5 changes) and README (5 changes) were out of date: fixed.
- `fixture/badge/resize` grows 12 px instead of 24 px (the component limits its width). It still differs from its main. Not changed.
- 548 of 1,228 fixtures carry a width or height override on the root (all 405 resize fixtures and 143 others). A library change to the size of such a main is not visible in the fixture's own size, only in the layers inside.
- Blind spots of the compare tool that remain: position and layer order beyond the sequence, layout settings other than root sizing (padding, spacing, mode, alignment, clipping), paints after the third and details of gradients and images, effect colour, offset and spread, per-side strokes, text alignment and range styles, vector shapes (only the image shows them), anything outside the fixtures (labels, frames, Known breaks), lazily loaded nested content in the end-of-life table (layer counts can vary).
