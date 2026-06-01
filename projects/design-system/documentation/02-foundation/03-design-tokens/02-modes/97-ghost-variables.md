# Ghost variables & ghost collections in Figma

**Status:** reference — maintained troubleshooting doc.
**Purpose:** explain what ghost variables and ghost mode-collections are, why they recur in a Token-Studio-driven pipeline, how to find them, and how to remove them for good.
**Related:** [Mode collections & resolution chain](./98-collections-and-resolution-chain.md) · the unbinding tool [`scripts-custom/figma-utils/unbind-variables.js`](../../../../scripts-custom/figma-utils/unbind-variables.js).

> Ghost variables are among the most time-expensive defects in a Figma token pipeline. Left undiagnosed they **recur on every export**, so the same cleanup gets repeated forever. The point of this doc is to diagnose the cause once and remove it at the source, not to keep detaching symptoms.

---

## What they are

| Term | Meaning |
|---|---|
| **Ghost variable** | A variable that was deleted but still lingers, because a design element somewhere still *consumes* it. Figma keeps the reference alive as long as one binding exists. |
| **Ghost collection / ghost mode picker** | A variable **collection** (and its modes) that should not be in this file, but appears in the "Apply variable mode" / mode picker. Figma lists a collection there for as long as **any** node still consumes a variable from it. |
| **Zombie variable** | A ghost that resists every removal attempt (native actions, plugins, manual detach). The only reliable cure is rebuilding in a fresh file. |

The distinction that matters in practice: a **ghost** is curable with the tools below; a **zombie** usually means the file's version history is holding the connection and you rebuild.

In this project the symptom is almost always a **ghost collection** from an external library (e.g. a "Tokens Preview"-style library) showing up in the mode picker of files where it has no business being.

---

## Why they appear

Six root causes, in rough order of how often they bite this project:

1. **Token Studio re-export vector (the recurring one here).** Token Studio stores Figma↔token ID mappings inside `$themes.json` (`$figmaCollectionId`, `$figmaModeId`, `$figmaVariableReferences`, `$figmaStyleReferences`). Those IDs were captured against one file. On export into a *different* file (including an empty one) Token Studio tries to reconcile against them; with a library enabled, stale IDs and shared style-key hashes resolve to the **library**, dragging its collection in as a ghost. Because the mappings live in the synced `$themes.json`, the ghost travels into **every** file the tokens are exported to. See [The Token Studio re-export vector](#the-token-studio-re-export-vector) below.
2. **Variable identity crisis.** Modifying / deleting / recreating variables, modes, or collections assigns **new IDs** while old references stay attached to elements. The deleted variable's ghost remains wherever it was still applied.
3. **Library transplants.** Copy-pasting a component from another file or library imports **all** of its variable and style connections, not just the visual. Those connections bring their source collection with them.
4. **Orphaned instances.** Deleting a main component or variant does **not** detach the variables from instances that remain.
5. **Hidden-layer masking.** Figma hides the properties of hidden layers in the properties panel, so a broken connection on a hidden layer is invisible. Perfect hiding spot for a ghost.
6. **Bulk-action blindspot.** Bulk detach / reset actions **skip hidden layers**. So a "select all → detach" pass leaves ghosts on every hidden layer untouched.

---

## How to recognise them

Five tells (from the field):

1. **Phantom mode selection** — a layer's property panel offers a Variable Mode that no longer exists.
2. **Doppelgänger modes** — two modes with the *same name* appear at once (one real, one ghost).
3. **Haunted "Used Variables"** — an unexpected "Used Variables" section appears on a layer after a library import.
4. **Publishing poltergeist** — components silently refuse to publish when updating a library, with no obvious error.
5. **Ghost collection in the picker** — a foreign collection (the library) appears in the "Apply variable mode" list even though you never added it. This is the dominant symptom in this project.

---

## How to find them

Run these from cheapest to most thorough.

### A. Figma native (Quick Actions)

1. Select all elements on the page.
2. Open Quick Actions (`⌘/Ctrl + P`, or `/`).
3. Type `variables`, run **Reset variable modes in selection**.
4. Re-open Quick Actions, run **Detach deleted variables**.
5. Repeat on **every page**.
6. Close and reopen the file.

**Caveat:** native bulk actions **do not touch hidden layers** — unhide everything first, or ghosts survive.

### B. This project's scanner — `unbind-variables.js`

[`scripts-custom/figma-utils/unbind-variables.js`](../../../../scripts-custom/figma-utils/unbind-variables.js) walks the whole file, resolves every variable binding to its collection, and **reports them grouped by collection** before changing anything. Run it in `scan` mode first — it is dry-run by default. It distinguishes **remote (library)** bindings from this file's own local ones, so the report tells you exactly which ghost collection is being kept alive and by how many bindings.

It covers the cases native actions miss: it scans all pages, handles both scalar bindings (`paragraphSpacing`, sizing, …) and paint bindings (`fills`, `strokes`), and skips instance-internal nodes that would only create overrides.

### C. Token Studio Deep Inspect

1. Open Token Studio (free license is enough).
2. Select the elements, go to the **Inspect** page, enable **Deep Inspect**.
3. Scan for the variable marker (⬡) and use the actions to jump to the affected layers.

Deep Inspect reaches into nesting that the native panel flattens, so it surfaces bindings the properties panel hides.

---

## How to remove them

1. **Native first.** Reset variable modes + detach deleted variables (section A). Clears the easy majority.
2. **The scanner, in `detach` mode.** After a clean `scan` report, switch [`unbind-variables.js`](../../../../scripts-custom/figma-utils/unbind-variables.js) to `detach`. Keep `remoteOnly: true` so it only strips bindings to library variables and never nukes this file's own locals. **Clear the bindings and the ghost picker entry disappears** — the collection is listed only while something consumes it.
3. **Targeted plugins**, when a stubborn binding remains:
   - *Variables Vision* — highlights exactly where each variable is used (an "EMF detector").
   - *Select Layers* — batch-select by layer name.
   - *Instance Finder* — select all instances of a component at once.
   - *Detach Variables* — heavier detach for stubborn cases.
   - *Apply Variables* — batch re-apply the correct local variables after cleanup.
4. **Drastic measures (zombies).** If it resists everything, the connection is held by version history. Rebuild in a **new** Figma file; replace nested instances **manually** (avoid "swap instance", which carries the zombie over); do not import from the contaminated library. A fresh file is the only 100%-reliable cure.

---

## The Token Studio re-export vector

This is the cause specific to our pipeline, and the one worth fixing at the source instead of detaching forever.

**Where it lives.** `src/lib/themes/$themes.json`, in the four Figma-mapping fields on each theme entry:

- `$figmaCollectionId` / `$figmaModeId` — bind a theme to a specific Figma collection + mode.
- `$figmaVariableReferences` — map each token path to a Figma variable ID.
- `$figmaStyleReferences` — map each token path to a Figma **style** key (a global hash).

**Why it spreads.** Token Studio reads `$themes.json` from the connected Git sync, so the **same** mappings load into every connected file, empty ones included. Style keys are globally unique; if a library was published from the same origin file, those exact keys exist in the library too, so any file with that library enabled re-links to it — that is the ghost collection.

**The clean-export lever.** Emptying the four `$figma*` fields makes Token Studio **create fresh local** variables/styles on export instead of reconciling against stale IDs. The cost: it also drops the binding to the real working file, so the next export there creates new collections rather than updating in place (modern Token Studio re-matches by name, which softens this — verify for your version before relying on it).

**Prevention.**

- Keep collections **local to the file** — never reference a library collection in Oblique work; use only "Created in this file". Library imports are an infection that recurs.
- Do not paste components in from other libraries or community kits.
- Unhide all layers before any bulk detach.
- After any library import, check for a stray "Used Variables" section.
- For a guaranteed-clean export into a fresh file, export from a `$themes.json` whose `$figma*` fields are emptied.

---

## Source

- *Ghost Variables in Figma* — Sam I Am Designs: <https://samiamdesigns.substack.com/p/ghost-variables-in-figma> (root-cause taxonomy, the five signs, native + plugin removal methods).
