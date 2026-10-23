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

**Scope: the cover page only.** Every script that reads or changes a file works on the cover page (a page whose name
contains "cover"; in a FigJam board without one, the page that already holds the section `file_thumbnail`). Other
pages are not read and never changed. A file without a cover page gets one (`🎬 Cover`) before the paste; if that is
not possible, the script stops and says so. A pasted instance that landed on another page is not filled. The scripts
also change the file thumbnail and, in design files, enable the cover library; nothing else.

| File | Use |
|---|---|
| `cover-wizard.mjs` | **start here**: asks in the terminal, proposes the values from the old cover, changes one file |
| `last-real-change.mjs` | month of the last real change of a file from its version history (needs a token); table for review |
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
| `set-modified.js` | set the Modified month of an existing cover and show the row again; replaces only an empty value or a month named in `overwrite`, never a month a person set |
| `set-values.js` | change fields of the cover that is already in the file (only the fields you name) and show or hide the rows that depend on them |
| `snapshot-cover.js` | read-only snapshot of the cover properties and rows; take it before and after a library update and compare |
| `update-library.mjs` | accept the pending updates of the cover components in one design file (only `~figma_only/` names), never "Update all" |
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
numbered release. A file without an old cover gets defaults: the file name, no date (the row is hidden) and the status
"work in progress". A file that already has the new cover is not changed (change its fields in the right
panel of Figma).

Try it first with `--dry-run`. A FigJam board works the same way; the wrapper of the cover is a Section.

## Date from the version history

A cover must not show the month of the migration. When the old cover has no date, `last-real-change.mjs` asks
the Figma REST API for the version history and takes the newest version that is not the runner's own migration:

- versions made by the person who runs the script **from the cut-off day on** (default: today, set it with
  `--since YYYY-MM-DD`; the migration of a folder can take several days) are ignored, and so are the automatic
  saves of the system user "Figma" from that day on (Figma writes them after the script's edits; before the
  cut-off day they count);
- of the rest, the newest version by **anyone** wins, so a change by another person always stays the reference,
  and the runner's own earlier real work counts;
- the latest named version is shown next to it; nothing is written by this tool.

```
export FIGMA_TOKEN=...     # personal access token, read scopes only, kept in the terminal
node last-real-change.mjs "<url 1>" "<url 2>" --since 2026-10-21 --csv dates.csv    # a table to review
```

The wizard uses the same rule: with `FIGMA_TOKEN` set it proposes the month in the terminal and shows its
source ("last change 2026-03-12 by <person>"); you confirm or change it. With `--yes` it does this only when
`--use-history` is added. The token needs the scopes `file_versions:read` and `file_metadata:read`, and the scope
that allows `GET /v1/me`. A version history shows trivial changes too, so check the proposed months before you
trust them. Tested against the live API on 20 files: a version has `id`, `created_at`, `label`, `description`, `user` and
`thumbnail_url`; automatic saves are listed with the user "Figma"; most versions have no label.

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
  "version":"16.0.0-F1.3","modified":"Oct 2026","owner":"<owner>","docs":"oblique.bit.admin.ch","status":"active"}}' > fill.json
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

- `distribution`: `internal` (team only) or `external` (other teams, Figma Community). A file becomes external when it is
  shared outside the team; before that it is internal. The footer of the cover and the status badges depend on it:

  | | internal | external |
  |---|---|---|
  | owner | the owner by initials: "BIT / Oblique / DR" | the team ("BIT / Oblique Team") |
  | tickets, git | optional: shown when filled, tickets at most 3 | never shown |
  | docs | not shown | shown |
  | status badges | `file_status`: work_in_progress_figma_only, dev_handoff_figma_only, done_figma_only, backup_figma_only, on_hold_figma_only, experimental_figma_only, figma_only, deprecated | `lifecycle_status`: active, release_candidate, maintenance, end_of_life, deprecated |

  The external footer has no field for a person or a ticket at all. A hidden layer is still in the file and can be read
  by anyone who copies it.
- `tickets`: Jira keys, written `KEY-123`: upper case, separated by a comma and a space, the main ticket first, at most
  three, none twice (example: "ABC-123, ABC-456"). The title does not hold the ticket number: it says what the file is
  ("Property naming change test project"); the number goes to `tickets`. The file name in Figma keeps its number, so a
  search by number in the file browser still works.
- `git`: the git branch the work lives on, one name without spaces ("tokens-dev"). Optional, internal only, shown as a
  "Git" line under the purpose. `tickets` is optional too. An empty value switches the row off (`show_git`,
  `show_tickets`), so an empty row takes no space. An external cover has neither.
- `product`: "Oblique" plus the release number, without V or R (example: "Oblique 16").
- `version`: no letter V, no spaces (example: "16.0.0-F1.3"), as on the documentation site.
- `modified`: month and year, no comma, the month with three letters on every cover ("Oct 2026", "Sep 2026").
  It is the month of the last real change of the content, not the month of the migration and not today. When the old
  cover has no date and nobody knows the date, leave it empty: the row is hidden. The "Edited" time of the file
  browser cannot be used, because every script run and every library update changes it. The wizard writes the month
  with three letters and stops on a longer month name.
- `purpose`: one status-neutral sentence about what the file contains; empty hides the Purpose row.
- `owner` and `docs`: see `distribution`. An internal cover writes the owner as "BIT / Oblique /" plus the initials of the
  person ("BIT / Oblique / DR"). The wizard proposes the initials of the creator of the file (needs `FIGMA_TOKEN`);
  the creator is not always the owner, so confirm it.
- `status`: a variant of the badge set that belongs to the distribution (table above). What each badge means and when
  to use it is written next to the badges in the library (Utility Components page, section "Badge guidelines").
  The wizard stops when a status does not fit the distribution, when an external cover has tickets or no docs, and when
  tickets are not written in the form above.
- Keep one thumbnail per file.

## Updating the library in a file

A file keeps its old library version until somebody accepts the update. A file can also wait for many other updates
(old helpers, other libraries), so "Update all" is not safe. `update-library.mjs <fileKey>` opens the cover page, opens
"Manage libraries > Updates" and presses "Update" only next to `~figma_only/` components. In a FigJam board the update is the
banner "N component updates" in the tab "Stickers" of the plus menu. Take `snapshot-cover.js` before and after: the values must be
the same. A new switch (`show_tickets`, `show_git`) is off after an update, so set it again with `set-values.js` where a file has
tickets or a git branch.

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
  the page by walking up from the pasted node, so this is handled.
- **Library updates in FigJam work** (official guide "Use stickers and libraries in FigJam", and tested): click
  the plus button in the toolbar, open the tab "Stickers", and a blue banner "N component updates" with the
  button "Update" appears. After "Update" the board saw the new status variant. A FigJam board
  can also add a library itself: tab "Stickers", "Libraries", "Add your own". A published change of the
  template reaches a board only after someone clicks "Update" in that board.
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
