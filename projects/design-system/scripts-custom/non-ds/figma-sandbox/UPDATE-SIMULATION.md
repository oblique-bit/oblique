# Library update simulation: Test Library V1 to V2

Process to simulate a library update before a release. Written 2026-10-14. Related: `README.md` (snapshot and compare tool), `RESULTS.md` (build of the sandbox).

Status: process agreed, NOT executed yet. A FigJam version of this process follows later (outline at the end).

## 1. Goal

Find out before a Figma release what happens to the overrides in consumer projects when the library is updated: kept or reset. A reset is a disaster and a big frustration for project teams. The simulation runs the real publish and Accept path on a test copy of the library.

## 2. Why a test library (facts)

- A consumer file keeps the old library version until someone clicks Accept. Figma has no preview of a library branch in a consumer file. So a real change can only be seen after a publish.
- Publishing the real library to test it exposes every consumer. Lost overrides do not come back when the library is restored, so a bad publish cannot be undone for the people who accepted it.
- A duplicate of a library is a NEW library with new component keys. A consumer cannot "update" from the real library to a duplicate: an update exists only between two publishes of the same file. So the test library must be ONE file that is published twice (V1, then V2).
- "Swap library" in Figma is not the same as an update. It swaps by component name with the rules of an instance swap (the plugin API says its heuristics may change). Use it at most to start a baseline, never as the test itself.
- Who can use a published library follows the file's sharing. To keep the test library away from colleagues, publish it from a private project or team of your own (community workaround, not an official guide).

Sources: [Figma Help: Guide to branching](https://figma-signup.helpjuice.com/branching-and-merging/guide-to-branching), [Swap style and component libraries](https://figma-signup.helpjuice.com/use-libraries/swap-style-and-component-libraries), [InstanceNode.swapComponent](https://developers.figma.com/docs/plugins/api/properties/InstanceNode-swapcomponent/), [Publish a library](https://help.figma.com/hc/en-us/articles/360025508373), [Forum: Local personal library](https://forum.figma.com/t/local-personal-library/61689).

## 3. Parts and names

| Name | What | Where |
|---|---|---|
| Published library (A) | The library as the consumers have it now. Always the file in the Figma project "Oblique - Active" (https://www.figma.com/files/1347514915276213784/folder/174809906). Read only for this process. | team project |
| Changes (B) | The latest changes that are not published yet (work in progress). | open point 1 |
| Test Library V1 | A copy of A, published as a library. One file. After the changes are applied it is renamed Test Library V2 and published again. | private test project |
| Test Library V2 | The same file with the changes B applied. | private test project |
| Test Sandbox | A new file built by script from Test Library V1 (all components as instances with overrides, swaps, known breaks). One test = one fresh Test Sandbox. | private test project |
| Snapshots | `before` (on V1) and `after` (on V2), compared by `lib/compare.py`. | `snapshots/` |

Rules: the real library (A) and the Starter Kit are never written. Scripts may write only to Test Library and Test Sandbox. A Test Sandbox is used once, because lost overrides never come back.

## 4. Who does what

| Step | Designer (Figma UI, no API exists) | Scripts |
|---|---|---|
| 1 Copy A to Test Library V1 | Duplicate the file of A, name it "Test Library V1", move it to the private test project | |
| 2 Publish V1 | Publish as library, title "V1" | |
| 3 Build Test Sandbox | Create the empty file "Test Sandbox", turn on Test Library V1 in Assets | Paste components as instances, build fixtures, swaps, known breaks (about 25 minutes) |
| 4 Snapshot before | | `node lib/snapshot.mjs before` |
| 5 Apply changes B | Check what the script cannot do and do it by hand | Dump structure of A and B, compute the difference, write and run the replay script on Test Library |
| 6 Rename and publish V2 | Rename the file "Test Library V2", publish, title "V2" | |
| 7 Accept | In Test Sandbox accept the library update | |
| 8 Snapshot after, compare | | `node lib/snapshot.mjs after` and `python3 lib/compare.py before after` |
| 9 Report | Decide go or no-go for the release | Table of changes by override type, kept or lost |
| 10 Clean up | Unpublish Test Library, archive or delete the files | Archive snapshots |

## 5. Steps in detail

0. Preconditions
   - Figma Desktop is open with the debug port 9222 (`figma-ds-cli connect`), the Mac stays awake (`caffeinate -i -s`), the tool folder is current.
   - A private project exists for the test files (see open point 3).
   - The file of A has no unpublished edits: open its Publish dialog, it must list no changes. If it lists changes, A is not clean and the copy would contain B.
1. Duplicate the file of A, name it "Test Library V1", move it to the private test project. Do not use a branch.
2. Publish Test Library V1 (title "V1"). Check that it appears in the library list of the test project only.
3. Create "Test Sandbox", turn on Test Library V1. Run the build with the key of Test Library V1 as the library and the key of Test Sandbox as the target (the scripts need these two keys as settings, see open point 4). Result: the pages "Components", "Swaps", "Known breaks" as in the current sandbox.
4. `node lib/snapshot.mjs before`. Keep the snapshot with the date.
5. Changes B onto Test Library V1:
   - Dump a structure signature of A and of B: component names, component property names and types, variant options, layer names and hierarchy, nested instances, hidden and visible flags.
   - Compute the difference. Overrides depend on structure and names, so only structural changes must be replayed: property renamed, layer renamed, moved, added or deleted, variant option renamed or added, default variant changed, nested component replaced, component renamed. Purely visual changes (colors, sizes, effects) do not decide if an override survives and are not replayed.
   - Write the replay script from the difference and run it on Test Library (V1 file) after a guard on its file key. Print a list of every applied change with the component name and the kind, this list is the key for the report.
   - Whatever the script cannot do is listed and done by hand.
6. Rename the file "Test Library V2". Publish with title "V2".
7. In Test Sandbox open Assets, Libraries, accept the update of Test Library.
8. `node lib/snapshot.mjs after`, then `python3 lib/compare.py before after`.
9. Report: join the compare output with the list of applied changes. Table: change kind by override type (text, boolean, instance-swap, nested-variant, hidden-layer, variant-after-override, resize, fill, swaps), with counts of kept and lost. Update the column "last result" on the page "Known breaks" of the real sandbox.
10. Clean up: unpublish Test Library (so nobody can enable it), keep or delete the test files, archive `snapshots/<date>/` and the report.

## 6. Reading the result

- Data differences in `compare.py` are the signal. Image-only differences are a hint (render noise exists on a few nodes, see `README.md`).
- A fixture whose override is gone after the update is a break. A break caused by a change kind that the library team did on purpose (for example a property rename) goes to the release notes with the advice for consumers. A break that was not intended is a reason to change the library change before the release.
- Known behavior to expect: Figma matches overrides by layer name and hierarchy. Renaming or removing the layer an override depends on usually resets it. Claims by Figma support, for example that renaming a variant key keeps overrides, are tested here, not assumed.

## 7. What is verified and what is open

Verified (2026-10-13 build): paste of single library components creates linked instances, the snapshot and compare tool, the self test (5 of 5), the build of all 405 components in about 25 minutes.

Open points
1. Where do the changes B live: a branch of the real library or edits in the main file? This decides how the structure of B is read (a branch file can be opened and read like any file).
2. Not verified: a duplicate of a library publishes as a separate library with its own keys and can be enabled in another file. Test once with a scratch file before the first run.
3. A private project or team for the test files: who creates it, and whether the org lets a library be limited to it.
4. The scripts have the library key and the sandbox key written in the code. They need one settings file (library key, sandbox key, allowed write keys) before the second sandbox can be built.
5. The replay script is new work. Start with the kinds of change that are most common (property and layer renames, add and delete), grow later.
6. Accept and publish cannot be scripted by API. They stay manual (about 2 minutes), driving the UI over CDP is possible but fragile.
7. One fresh Test Sandbox per test costs about 25 minutes of script time. Alternative to test later: duplicate a pristine Test Sandbox built on V1 before each experiment (30 seconds, needs checking that the duplicate keeps the old library version until Accept).

## 8. Outline for the FigJam version (later)

Lanes: Designer (Figma UI), Scripts, Figma (publish and Accept). Boxes in order: A published state, duplicate to Test Library V1, publish V1, build Test Sandbox, snapshot before, read A and B and compute the difference, apply to the test file, rename to Test Library V2 and publish, Accept in Test Sandbox, snapshot after, compare, report, go or no-go, clean up. One decision box: A clean (Publish dialog empty)? Colors for structure only (lane colors), black text, square corners, title with date, sign-off area, following the team board conventions.
