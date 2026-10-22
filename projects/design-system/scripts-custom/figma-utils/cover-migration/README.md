# cover-migration

Tools to put the central cover (thumbnail) template into a Figma file and move the content of the old
cover into it. They were used once to migrate the covers of the existing Oblique Figma files.

## When you need this, and when you do not

- **Change the slogan, header or layout of the cover for every file:** edit the template in the file that
  owns it (OB Library Utilities) and publish. No script is needed; the files get the change with the next
  library update.
- **Update version, date, status or purpose of one file:** change the properties of the cover instance in
  the right panel of Figma. No script is needed.
- **Move a file with an old cover to the template:** use the steps below. This is the only case for the tools.

## Requirements

- macOS, zsh, node, curl.
- `figma-ds-cli` (a local clone; it only works when started from its own folder, set `CT_FIGMA_CLI_DIR` if
  it is not `~/figma-cli`).
- Figma Desktop started with the debug port: run `figma-ds-cli connect`. A normally opened Figma has no port.
- Edit rights in the target file, and access to the library that owns the template.

## Files

| File | Use |
|---|---|
| `cover-tools.zsh` | shell functions: `ct_open`, `ct_run`, `ct_enable_library`, `ct_clipboard_file`, `ct_btn` |
| `cdp.mjs` | drive one Figma tab: `eval`, `click`, `type`, `key c/v`, `shot` |
| `render.mjs`, `save-images.mjs` | fill the `__ARGS__` placeholder of a script; save returned PNGs |
| `read-cover.js` | read-only report of the cover page (frames, texts, file thumbnail) |
| `select-node.js` | select the template so it can be copied |
| `prepare-paste.js`, `read-pasted.js` | open the cover page before the paste; check the pasted node |
| `fill-cover.js` | fill the pasted instance, wrap it in a 1920x1080 frame, return a preview |
| `backup-old-covers.js`, `remove-old-covers.js` | export the old cover frames as PNG and text; then remove them and set the file thumbnail |
| `files.example.json` | shape of a per-file list of values |

## Steps for one file

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

# 3. add the template library to the file (new dependency of that file)
ct_enable_library $K "OB Library Utilities"

# 4. paste: the result must be an INSTANCE with a remote main component
ct_run $K prepare-paste.js '{}'
ct_clipboard_file                       # still $UTIL?
node cdp.mjs $K key v
ct_run $K read-pasted.js '{}'           # note "id"

# 5. fill, wrap, preview (the new frame stays beside the old cover)
ct_run $K fill-cover.js '{"instanceId":"<id>","frame":{"name":"file_thumbnail","x":0,"y":2000},
  "values":{"product":"Oblique 16","doc":"Library","purpose":"","version":"16.0.0-F1.3",
  "modified":"October 2026","owner":"<owner>","docs":"oblique.bit.admin.ch","status":"active"}}' > fill.json
node save-images.mjs fill.json ./preview

# 6. back up the old cover, then replace it
ct_run $K backup-old-covers.js '{"namePattern":"^_helper / thumbnail"}' > backup.json
node save-images.mjs backup.json ./backup <prefix>-
ct_run $K remove-old-covers.js '{"namePattern":"^_helper / thumbnail","keepName":"file_thumbnail","move":{"x":0,"y":0}}'
```

Look at the preview before step 6. The removal cannot be undone from the scripts; Figma version history is
the way back, and the backup holds PNG and texts.

## Writing rules used for the values

- `product`: "Oblique" plus the release number, without V or R (example: "Oblique 16").
- `version`: no letter V, no spaces (example: "16.0.0-F1.3"), as on the documentation site.
- `modified`: month and year with the full month name, no comma (example: "October 2026").
- `purpose`: one status-neutral sentence about what the file contains; empty hides the Purpose row.
- `status`: a `lifecycle_status` variant of the template (active, maintenance, end_of_life, ...).
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
- Status of these tools: the original scripts ran on the existing Oblique files. This folder is the cleaned version of those scripts;
  it was checked for syntax and tested read-only (`read-cover.js`, `read-pasted.js`, the tab helpers).
  Run step 5 on a copy of a file first.
