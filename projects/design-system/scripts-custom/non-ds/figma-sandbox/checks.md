# OB Legacy Sandbox: checks

Written before the build (phase 1), definitions sharpened during the run. Results are in `RESULTS.md`, not here.

Keys
- sandbox: the `sandbox` setting ("OB Legacy Sandbox", a copy of the Starter Kit; its 4 original pages must stay unchanged)
- library: the `library` setting ("OB Library 16.0.0 – F1.2", read only)
- original Starter Kit: listed in `neverWrite` (never touched)

New pages in the sandbox: "Components", "Swaps", "Known breaks". Fixtures are instances with plugin data namespace "sandbox", key "sbType" (shared plugin data); names are `fixture/<component>/<override type>` and `swap/<from>/<to>`.

Checks (target in brackets)
- C1 coverage: every library component (top-level component set or standalone component, names that do not start with "." or "_" because Figma does not publish those) has at least one fixture instance on the page "Components" [all]
- C2 every fixture on "Components" and "Swaps" differs from its own main component in at least one thing a person set: component property value, text, visibility, fill, size, nested instance. A fixture whose only change is a variant change counts if its main component differs from the main component of the same component's "resize" fixture. [0 fixtures without an override]
- C3 per component, one fixture per override type the component supports (text, boolean, instance-swap, nested-variant, hidden-layer, variant-after-override, resize, fill); the type is in the name. Cross-check against the component property definitions of the library: a TEXT property needs a text fixture, a BOOLEAN property a boolean fixture, an INSTANCE_SWAP property an instance-swap fixture. [no unexplained gap]
- C4 swaps: every legacy and new pair found in the library frame at node `26518:7149` has a swap instance (the three text-input, text-area, select pairs, both directions); other end-of-life to current pairs may exist. The main component of each swap instance differs from the start component. `snapshots/swap-results.json` records the state before and after the swap. [all pairs]
- C5 detached instances and local components: 0 [0]
- C6 layout: 0 sibling overlaps on the new pages measured by absoluteRenderBounds (not only absoluteBoundingBox, shadows and overflowing content reach beyond the box), 0 fixtures collapsed (height or width under 4 px apart from components that are that small by design), 0 fixtures outside their root frame [0]
- C7 two snapshots in a row give an empty difference in data (image-only differences can be render noise, see README) [empty]
- C8 self test: 5 changed fixtures (text property, boolean, hidden layer, root fill, size) are listed exactly, and after the revert the difference is empty (artifact `snapshots/selftest-result.json`) [5 of 5, then empty]
- C9 the 4 original Starter Kit pages in the sandbox are unchanged: `scripts/baseline.js` output equals `snapshots/baseline-startkit.tsv`, taken before the build [equal]
- C10 the library and every other file untouched: every WRITE line in `run.log` has the sandbox key [yes]
