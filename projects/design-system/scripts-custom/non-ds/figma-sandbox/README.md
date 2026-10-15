# figma-sandbox: test library updates in "OB Legacy Sandbox"

Tool to test what a Figma library update does to instance overrides in consumer files.

The Figma file "OB Legacy Sandbox" (its key is the `sandbox` setting) is a copy of the Starter Kit (its 4 pages stay as they are) plus three pages built by these scripts:
- "Components": every library component as an instance. Per component one instance per override type it supports (`fixture/<component>/<type>`; types: text, boolean, instance-swap, nested-variant, hidden-layer, variant-after-override, resize, fill). Every instance carries at least one override.
- "Swaps": component swaps (legacy to new, end of life to current). Overrides are set first, then the instance is swapped (`swap/<from>/<to>`). `snapshots/swap-results.json` records what survived.
- "Known breaks": a table per fixture group with the expected result and the last result.

Planned: simulate a library update before the release with a test library (Test Library V1 to V2): see `UPDATE-SIMULATION.md`.

## Before and after a library update

1. Before publishing the library change: `node lib/snapshot.mjs before`
2. Publish the library. In the sandbox file accept the library update (Assets, Libraries, "Updates available", Accept).
3. `node lib/snapshot.mjs after`
4. `python3 lib/compare.py before after`

Output lists every changed instance: removed or added, main component, size, visibility, component property values, layers (text, visibility, fills, nested main component). Exit code 0 = empty, 1 = data differences, 3 = only image differences. A few nodes export slightly different pixels on every run (render noise, for example `fixture/alert-notification/text`), so image-only differences are a hint to look, not proof of a change. Then update the "last result" column on the page "Known breaks" by hand.

Test the tools: `node lib/selftest.mjs before` changes 5 fixtures on purpose (text property, boolean, hidden layer, root fill, size), checks that the compare lists exactly these 5, reverts and checks that the compare is empty again. Strokes, effects, fonts, nested variants and instance swaps are recorded by the snapshot but not exercised by the self test.

## Needs

Figma Desktop started with the CDP debug port 9222 (`figma-ds-cli connect` patches and restarts it), the sandbox file open, Node 22 or newer (global WebSocket), python3. The library file (the `library` setting) must be open only for inventory and paste runs. Scripts switch the Figma tab by themselves, so do not use Figma while they run. The Mac must not sleep (`caffeinate -i -s`).

## Settings

The Figma file keys are not written in the code. Copy `config.example.json` to `config.json` (it is not committed) and fill in:
- `library`: the file the components are copied from
- `sandbox`: the file the instances are built in
- `allowedWrite`: the only keys scripts may change (the sandbox, and a test library while changes are replayed on it)
- `neverWrite`: keys that are refused for every write, for example the real library and the original starter kit

`SANDBOX_CONFIG=<path>` points to another settings file, and `SANDBOX_KEY=<key>` lets `lib/snapshot.mjs` read another file with the same structure. `lib/cdp-eval.mjs --write` and `lib/cdp-key.mjs paste` refuse a key outside `allowedWrite` before anything is sent to Figma.

## Files

- `lib/cdp-eval.mjs`: runs a plugin-API script on the tab of one file. Checks `figma.fileKey` before running. Logs every call to `run.log` (read or WRITE).
- `lib/cdp-key.mjs`: Cmd+C and Cmd+V as CDP key events (copy only from the library, paste only into the sandbox).
- `lib/paste-single.mjs`: copies library components one at a time and pastes them as instances into the sandbox. Can run again, it skips what is already there.
- `lib/build-driver.mjs` with `scripts/build-fixtures.js`: families, override types, layout. Can run again (done items are marked).
- `lib/swaps-driver.mjs` with `scripts/build-swaps.js` and `lib/known-breaks-driver.mjs`: NOT repeatable, they add rows or swap cases again. Run once on an empty page.
- `lib/snapshot.mjs`, `lib/compare.py`, `lib/selftest.mjs`, `lib/measure-driver.mjs`: snapshot, compare, self test, override measurement.
- `scripts/`: the Figma-side scripts. `snapshots/`: inventory of the library, staging map, build results, snapshots with PNG per fixture, baseline of the Starter Kit pages.
- `checks.md`: the checks. `RESULTS.md`: the result of the build run of 2026-10-13.

## What we learned (pitfalls)

- Instance sizes set by script (fixed size on the instance root) are not kept after the file is saved and reopened: the instances come back as hug. Take the `before` snapshot from the saved state, that is after the file was reopened, and take `before` and `after` in the same session.

- Right after Figma was restarted, nested library content of instances loads lazily: a read made too early is incomplete (hundreds of nodes missing, sizes off). `lib/snapshot.mjs` therefore visits every page first (`scripts/warm.js`) and repeats the read until two reads in a row are identical. Do the same in any new script that reads the whole file. Viewing an old version in the version history (preview) also gives the plugin API partial data: never measure in the preview, duplicate the version instead.

- `importComponentByKeyAsync` and `importComponentSetByKeyAsync` hang when called over CDP (no plugin context). Instances of library components come from copy and paste: one component at a time, copied from the library, pasted into the sandbox, it arrives as an instance linked to the library. Never paste a whole component set (it becomes a LOCAL component set) and do not copy several at once (partly local components, icons not pasted at all). For a set, copy its default variant.
- `getPluginData` fails without a plugin id: use `setSharedPluginData('sandbox', ...)`.
- Only the active Figma tab has the `figma` global. `/json/activate` alone does not switch the tab reliably, `open -a Figma "<url>"` does.
- A node's `overrides` list does not show component property changes (text, boolean, instance swap, variant). Measure by comparing with a fresh instance of the same main component.
- When the process ends right after a big `console.log` into a pipe, the output is cut. The helper waits for the stdout flush.
- A variant change after an override can reset the override (16 of 95 cases in the first run, listed in `snapshots/variant-change-lost.json`). A swap can lose all overrides too. That is the behavior this sandbox is made to show.
