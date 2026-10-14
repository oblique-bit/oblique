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
| Published library (A) | The library as the consumers have it now: the main file in the Figma project "Oblique - Active" (https://www.figma.com/files/1347514915276213784/folder/174809906), as of its last library publish (the checkpoint with the library icon in its version history). Read only for this process. | team project |
| Changes (B) | The latest changes that are not published yet: the branch file before the merge, the current main file after the merge. | see 3a |
| Test Library V1 | A copy of A, published as a library. One file. After the changes are applied it is renamed Test Library V2 and published again. | private test project |
| Test Library V2 | The same file with the changes B applied. | private test project |
| Test Sandbox | A new file built by script from Test Library V1 (all components as instances with overrides, swaps, known breaks). One test = one fresh Test Sandbox. | private test project |
| Snapshots | `before` (on V1) and `after` (on V2), compared by `lib/compare.py`. | `snapshots/` |

Rules: the real library (A) and the Starter Kit are never written. Scripts may write only to Test Library and Test Sandbox. A Test Sandbox is used once, because lost overrides never come back.

## 3a. When to run it and where A and B come from (verified 2026-10-14)

Checked against the Figma Help Center and developer docs, each important claim by two independent checks (sources at the end of this section). Merging a branch is not publishing the library.

What Figma does by itself
- Merge applies the branch to the main file and archives and locks the branch. A merged branch cannot be restored. It does not disappear: it stays in the Archived tab and can still be opened with its pages and full version history.
- The main file's version history gets checkpoints automatically: when a branch is created, an extra checkpoint just before the merge ("Before merge"), one for the merge itself ("Branch merged", its name and description can be edited), and one at every library publish (library icon, with the description typed in the Publish dialog). Checkpoints cannot be removed. On the Organization plan the whole history stays. Plain autosaves run about every 30 minutes.
- Publish is a separate step, only from the main file. Until then consumers keep A. Consumers get a notice and can accept or ignore the update. A published library has no documented undo, and Figma writes no checkpoint in a consumer file before it accepts an update.
- Duplicate on any version in version history creates a new file from that version (no comments, no history). A branch can also be duplicated as a new file; that copy cannot be merged back.

So nothing has to be named by hand. A hand-made name such as "pre-merge <branch>" is redundant: every branch is pre-merge, and Figma writes its own restore points. A name would only make a checkpoint easier to find.

A and B
- A (what consumers have) is the main file at the LAST LIBRARY PUBLISH: the checkpoint with the library icon. It is not the state at merge time. The "Before merge" checkpoint equals A only if nothing unpublished reached the main file since the last publish (no direct edit, no other unpublished merge).
- B (the changes) is the branch file before the merge, and after the merge (before the publish) the current main file or the "Branch merged" checkpoint.

| Moment | A | B | Test possible? |
|---|---|---|---|
| Before the merge | Duplicate of the last publish checkpoint | The branch file (or its Duplicate as new file) | Yes. Cheapest to undo: a break means the branch is changed before the merge. |
| After the merge, before the publish | Same checkpoint | The current main file, exactly what a publish would send | Yes. Final gate before the publish. |
| After the publish | The previous publish checkpoint is still in the history | | Technically possible, but no longer a gate: consumers are notified and can accept. |

Good habits (optional, not needed to recover A)
- Write a meaningful description in every Publish dialog: it becomes the label of the checkpoint and is shown to consumers.
- Use "Edit merge description" after a merge.
- Never use "Delete Version Info" on publish or merge entries (it removes the name and description, the checkpoint stays but is harder to find).
- Library changes in branches rather than direct edits in the main file: Figma suggests it, but it is not enforced; direct edits make the "Before merge" checkpoint differ from A.
- Several open branches: test each alone, and together if they will be merged together.
- After the real publish, run the real before and after snapshots in the sandbox built on the real library and compare them with the prediction. Do this for the first releases to see how reliable the simulation is.

Not documented or not yet tested: see open points 1 to 4 in section 7.

Sources (Figma Help Center and developer docs): [Guide to branching](https://help.figma.com/hc/en-us/articles/360063144053-Guide-to-branching), [Merge a branch into the main file](https://help.figma.com/hc/en-us/articles/5691189138839-Merge-branch-into-main-file), [Request a branch review](https://help.figma.com/hc/en-us/articles/5691414603543-Request-a-branch-review), [View and manage branches](https://help.figma.com/hc/en-us/articles/5668839659415-View-and-manage-branches), [Incomplete merges or updates](https://help.figma.com/hc/en-us/articles/5691750511383-Incomplete-merges-or-updates), [Share libraries in an organization](https://help.figma.com/hc/en-us/articles/360040529593-Share-libraries-in-an-organization), [View a file's version history](https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history), [Duplicate or copy files](https://help.figma.com/hc/en-us/articles/360038511533-Duplicate-or-copy-files), [Publish a library](https://help.figma.com/hc/en-us/articles/360025508373-Publish-a-library), [Review and accept library updates](https://help.figma.com/hc/en-us/articles/360039234193-Review-and-accept-library-updates), [Swap libraries](https://help.figma.com/hc/en-us/articles/4404856784663-Swap-libraries), [REST API: version history](https://developers.figma.com/docs/rest-api/version-history-endpoints/), [REST API: webhook events](https://developers.figma.com/docs/rest-api/webhooks-events/).

## 4. Who does what

| Step | Designer (Figma UI, no API exists) | Scripts |
|---|---|---|
| 1 Copy A to Test Library V1 | In the main file open version history, pick the last library publish checkpoint, Duplicate, name the copy "Test Library V1", move it to the private test project | |
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
   - The main file of the library has at least one library publish checkpoint in its version history (it has, if it was ever published).
1. Make the copy of A: open the version history of the main file, pick the checkpoint of the last library publish (library icon), use Duplicate, name the copy "Test Library V1", move it to the private test project. If the Publish button of the main file is disabled (nothing to publish), the current main file equals A and can be duplicated directly. Do not use a branch. Check once that the copy is a separate, unpublished file (see open point 2).
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

Verified against the Figma documentation (2026-10-14): merge is not publish, the automatic checkpoints (branch created, "Before merge", "Branch merged", every publish), archive of a merged branch, Duplicate on any version, A as the last publish checkpoint, publish only from the main file, Swap libraries is not an update, no consumer checkpoint before Accept.

Tried on our own sandbox file (2026-10-14, nothing in the real library touched):
- Path in the UI: file name menu, Show version history, select an entry, "More options for version", Duplicate. The menu has: Name this version, Restore this version, Duplicate, Delete version info, Copy link. Only Duplicate is used.
- Duplicate makes "<file name> (Copy)" in the same project within seconds. It does not open it by itself.
- The copy equals the chosen version: a copy of an earlier version has exactly the pages and the 2,167 instances of that time (byte-identical to the stored baseline of those pages), node ids are kept, library links of the instances are kept, no local components appear. A copy has no version history of the original (documented).
- The original was not changed by it: a snapshot taken before and after is identical (0 differences).
- Reading pitfalls found on the way: right after a Figma restart nested library content loads lazily, so an early read is incomplete (hundreds of nodes missing); viewing a version in the history panel also gives the plugin API partial data. The snapshot tool therefore visits all pages first and repeats the read until two reads in a row are identical. Never measure inside the version preview, duplicate the version and read the copy.
- Layout sizing set by script on instance roots (fixed size) is not kept when the file is saved and reopened: those instances come back as hug. Take the before snapshot from the saved state (reopen the file first).
- A named version cannot be saved from a script over CDP (`figma.saveVersionHistoryAsync` never returns); use the history panel (Add to version history, type a title, Save).
- Duplicate can be done over CDP (`lib/cdp-ui.mjs`): open the menu, click the exact menu item, check the item text under the pointer before clicking.

Open points
1. Duplicate of a version of the REAL library file: works for an ordinary file (tried, see above), not yet tried for the library file. Some users report Duplicate missing or failing on some files (also after branches), and Figma documents a memory limit of about 2 GB per tab. This is the first thing to try, and it is also step 1 of every run.
2. A duplicate is a separate library with new component keys, unpublished and not linked to the original. Official Help is silent for Duplicate. Tried on an ordinary file (2026-10-14): a probe component, a named version, Duplicate of that version: the node id is the same (11803:8288) but the component key is different (9e305469... in the original, c76803cf... in the duplicate), both unpublished. So a duplicate cannot share a key with its original. Still not tried: publishing a duplicated LIBRARY, and Duplicate of the real library file.
3. A private project or team for the test files: who creates it, and whether the org lets a library be limited to it. A library must not stay in Drafts to be published.
4. Not documented: what a publish checkpoint contains (the whole file or only the published assets, also for a partial publish), its title text, and whether the REST versions list returns it. One throwaway publish plus a Duplicate of that checkpoint would show it.
5. B cannot be moved into the same test file by any Figma feature: a duplicate is a separate file, a duplicated branch cannot be merged back, and Swap libraries replaces by name, which is not the update path. So B is re-applied by a replay script or by hand (the replay script is new work, start with property and layer renames, add and delete, grow later).
6. The scripts have the library key and the sandbox key written in the code. They need one settings file (library key, sandbox key, allowed write keys) before the second sandbox can be built.
7. Accept and publish cannot be scripted by API. They stay manual (about 2 minutes), driving the UI over CDP is possible but fragile.
8. One fresh Test Sandbox per test costs about 25 minutes of script time. Alternative to test later: duplicate a pristine Test Sandbox built on V1 before each experiment (30 seconds, needs checking that the duplicate keeps the old library version until Accept).
9. Optional: with a token (file_versions:read, file_content:read) the REST API lists versions and returns the file as of a version as read-only JSON, so A and B could be read without duplicating. A webhook on library publish carries the description and the changed assets, but no version id.

## 8. Outline for the FigJam version (later)

Lanes: Designer (Figma UI), Scripts, Figma (publish and Accept). Boxes in order: A published state, duplicate to Test Library V1, publish V1, build Test Sandbox, snapshot before, read A and B and compute the difference, apply to the test file, rename to Test Library V2 and publish, Accept in Test Sandbox, snapshot after, compare, report, go or no-go, clean up. One decision box: pending changes in the main file (Publish button active)? Either way A is the last publish checkpoint. Colors for structure only (lane colors), black text, square corners, title with date, sign-off area, following the team board conventions.
