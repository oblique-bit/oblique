# cover-migration

Tools to put the central cover (thumbnail) template into a Figma file or FigJam board and move the content
of the old cover into it. They were used to migrate the covers of the existing Oblique files and boards.

## When you need this, and when you do not

- **Change the slogan, header or layout of the cover for every file:** edit the template in the file that
  owns it (OB Library Utilities) and publish. No script is needed; the files get the change with the next
  library update.
- **Update version, date, status or purpose of one file:** change the properties of the cover instance in
  the right panel of Figma. No script is needed.
- **Move a file with an old cover to the template:** use the steps below. This is the only case for the tools.

## Requirements

- macOS, zsh, curl and node 22 or newer (the helpers use the WebSocket that is built into node).
- `figma-ds-cli` (a local clone; it only works when started from its own folder, set `CT_FIGMA_CLI_DIR` if
  it is not `~/figma-cli`).
- Figma Desktop started with the debug port: run `figma-ds-cli connect`. A normally opened Figma has no port.
- Edit rights in the target file, and access to the file that owns the template (and, for design files, to its library).

## Files

| File | Use |
|---|---|
| `cover-wizard.mjs` | **start here**: asks in the terminal, proposes the values from the old cover, changes one file |
| `propose.mjs`, `propose.test.mjs` | the rules that turn the old cover texts into proposed values; `node --test propose.test.mjs` |
| `cover-tools.zsh` | shell functions: `ct_open`, `ct_run`, `ct_enable_library`, `ct_clipboard_file`, `ct_btn` |
| `cdp.mjs` | drive one Figma tab: `eval`, `click`, `type`, `key c/v`, `shot` |
| `render.mjs`, `save-images.mjs` | fill the `__ARGS__` placeholder of a script; save returned PNGs |
| `read-cover.js` | read-only report of the cover page (frames, texts, file thumbnail) |
| `select-node.js` | select the template so it can be copied |
| `prepare-paste.js`, `read-pasted.js` | open the cover page before the paste; check the pasted node |
| `fill-cover.js` | design files: fill the pasted instance, wrap it in a 1920x1080 frame, keep the old frames as `_depr`, set the thumbnail |
| `fill-figjam.js` | FigJam boards: same, but the wrapper is a Section and the status badge is a separate instance |
| `standalone-badge.js` | FigJam: make the status badge of an existing cover a separate instance |
| `backup-old-covers.js`, `remove-old-covers.js` | export the old cover frames as PNG and text; then remove them and set the file thumbnail |
| `values.example.json` | the shape of a values file for `--values` |

## The easy way: the wizard

```
export COVER_TEMPLATE_KEY=<key of the file that owns the template>
export COVER_TEMPLATE_NODE=<node id of the cover template component>
node cover-wizard.mjs "<url of the file or board>"
```

What the wizard does, in this order:

1. Reads the old cover of the file and proposes a value for every field. Enter keeps the proposal, `-` makes
   the field empty (an empty version, date or purpose hides that row on the cover).
2. Shows a table of the values and asks `Change the file with these values? [y/N]`. Nothing is written before
   you answer `y`.
3. Copies the template, enables the library in the file (design files only), pastes the template, fills the
   fields, and saves a preview picture in `./cover-wizard-out`.
4. When old cover frames are left (they are renamed `..._depr`), asks whether to back them up as PNG and text
   and remove them. The default is no.

Options:

| Option | Meaning |
|---|---|
| `--dry-run` | read, propose, ask and show the plan; change nothing (needs no template settings) |
| `--yes` | accept all proposals and do not ask for a confirmation |
| `--values <file.json>` | take the values from a file (see `values.example.json`) instead of asking |
| `--force` | run on a file that already has the new cover (it would be added a second time) |
| `--template-key`, `--template-node` | the template; same as `COVER_TEMPLATE_KEY` and `COVER_TEMPLATE_NODE` |
| `--library <name>` | library to enable in the file (default "OB Library Utilities") |
| `--out <dir>` | folder for previews and backups |

The wizard cannot decide for you: the purpose sentence, and whether a working file is "Oblique DS" or a
numbered release. A file without an old cover gets defaults: the file name, the current month and the status
"work in progress". A file that already has the new cover is not changed (change its fields in the right
panel of Figma).

Try it first with `--dry-run`. A FigJam board works the same way; the wrapper of the cover is a Section.

## Steps for one file (what the wizard does)

```
source cover-tools.zsh
UTIL=<key of the template file>     K=<key of the file to change>

# 1. copy the template from the file that owns it
ct_open "<url of the template file>" $UTIL
ct_run $UTIL select-node.js '{"nodeId":"<template node id>"}'
node cdp.mjs $UTIL key c
ct_clipboard_file                       # must print $UTIL

# 2. read the target (read-only) and note its values: version, date, status, links
ct_open "<url of the file>" $K
ct_run $K read-cover.js '{}'

# 3. add the template library to the file (new dependency of that file); not needed in FigJam
ct_enable_library $K "OB Library Utilities"

# 4. paste: the result must be an INSTANCE with a remote main component
ct_run $K prepare-paste.js '{}'
ct_clipboard_file                       # still $UTIL?
node cdp.mjs $K key v
ct_run $K read-pasted.js '{}'           # note "id"

# 5. fill, wrap, set as thumbnail, preview (use fill-figjam.js in a FigJam board)
ct_run $K fill-cover.js '{"instanceId":"<id>","values":{"product":"Oblique 16","doc":"Library","purpose":"",
  "version":"16.0.0-F1.3","modified":"October 2026","owner":"<owner>","docs":"oblique.bit.admin.ch","status":"active"}}' > fill.json
node save-images.mjs fill.json ./preview
# the new frame takes the place of the old cover; the old frames are renamed "..._depr" and moved below it

# 6. optional: back up the old frames, then remove them
ct_run $K backup-old-covers.js '{"namePattern":"_depr$"}' > backup.json
node save-images.mjs backup.json ./backup <prefix>-
ct_run $K remove-old-covers.js '{"namePattern":"_depr$","keepName":"file_thumbnail","move":{"x":<x of the new frame>,"y":<y of the new frame>}}'
```

Look at the preview before step 6. The removal cannot be undone from the scripts; Figma version history is
the way back, and the backup holds PNG and texts. The x and y of the new frame are in the `children` list of
the answer of step 5 (for example `FRAME file_thumbnail @0,742`).

## Writing rules used for the values

- `product`: "Oblique" plus the release number, without V or R (example: "Oblique 16").
- `version`: no letter V, no spaces (example: "16.0.0-F1.3"), as on the documentation site.
- `modified`: month and year with the full month name, no comma (example: "October 2026").
- `purpose`: one status-neutral sentence about what the file contains; empty hides the Purpose row.
- `owner`: the owning team; `docs`: the documentation address as written in the old cover.
- `status`: a `lifecycle_status` variant of the template: active, release_candidate, maintenance, end_of_life,
  work_in_progress_figma_only, on_hold_figma_only, experimental_figma_only, figma_only, dev_handoff_figma_only.
- Keep one thumbnail per file.

## Notes

- `ct_run` retries when `figma-ds-cli` loses the answer of a script. Read-only scripts are safe to repeat.
  `fill-cover.js` is safe to repeat too (it wraps only once); check the file with `read-cover.js` before
  repeating a removal.
- Every script stops when the open file is not the one named by `key` (answer `{"wrongFile": ...}`).
- Scripts are sent without full-line comments, because `figma-ds-cli eval -f` returns nothing for files
  that contain them. `render.mjs` removes them.
- Only the active Figma tab has the `figma` object. `ct_open` switches to the file first.
- Paste is Cmd+C / Cmd+V sent to the tab. Check the clipboard before each paste: another device can replace it.
- The library step drives the Figma menus by their text. When Figma changes the menus, take a screenshot
  (`node cdp.mjs <key> shot out.png`) and adjust the labels in `ct_enable_library`.
- In FigJam a paste can land inside a section that is under the middle of the screen. `fill-figjam.js` finds
  the page by walking up from the pasted node, so this is handled. FigJam cannot enable a library; the
  pasted cover is a linked instance and its fields can be changed, but it is not verified that it receives
  later changes of the template. Check this after the next publish of the template.
- **Changing the status in FigJam.** The badge is a separate instance in the section. Click it once, click the
  small toolbar above it (diamond icon with an arrow) and pick the status in the panel "Variants". Nothing
  else on the cover has to be touched. (The badge nested in the cover is hard to reach: a double click
  enters its text; after that Esc and Shift+Enter select the whole badge.) If the badge changes its width
  with the new status, move it back to the right edge by hand.
- **FigJam kit for people without the tools.** In OB Library Utilities, on the page "Utility Components", the
  section "Covers / FigJam kit" sits next to the cover template. It holds the frame "cover_for_figjam" (the
  cover template as a linked instance with placeholder texts, and a separate status badge), every status as a
  badge of its own, and a short text that explains what the kit is for and why the badge is separate. A person
  copies the frame, pastes it into a FigJam board, edits the texts by double click, changes the status in the
  panel "Variants" and sets the frame as the thumbnail (right-click menu: "Set as thumbnail"). Pasting the
  frame into a FigJam board was tested: it arrives as a frame with the linked cover instance and the badge.
- Figma refreshes the thumbnail in the file browser after some time, and it is more reliable when the file is
  closed. If the old picture stays, use "Restore default thumbnail" and then "Set as thumbnail" once more.
- Status of these tools: the original scripts changed the covers of about 20 Oblique files and boards. The
  proposal rules have unit tests. The wizard ran its whole write path (copy, paste, fill) on 11 files and
  boards, 2 design files and 9 FigJam boards; removal of the old frames was done with the two removal scripts.
  Run the wizard with `--dry-run` first on a new kind of file.

## Problems

| Message or symptom | Cause and fix |
|---|---|
| `no debug port on 9222` | Figma was not started with the port. Run `figma-ds-cli connect`. |
| `Could not find Figma execution context` | The tab of the file is not the active one. `ct_open` opens and switches to it. |
| An empty answer from a script | The script file has full-line `//` comments (use `render.mjs`), or `figma-ds-cli` was started outside its folder (set `CT_FIGMA_CLI_DIR`). |
| `{"wrongFile": ...}` | Another file is active. Open the right one with `ct_open`. |
| `The clipboard does not hold the template` | Copy the template again; another device may have replaced the clipboard. |
| `library not enabled` | The Figma menus changed or the library name is wrong. Take a screenshot with `cdp.mjs <key> shot out.png`. |
