# Icons Builder

Builds the whole **🧷 Icons** page of the design system file from a source: the building blocks, the header, the two purpose boxes, one component and one label for every icon. This is Case 0 of the icon workflow ("create a new set") for the page itself. The shapes, the texts and the checks of the icons stay with `../../figma-utils/icon-workflow/` (`icons.mjs`, `write-metadata.mjs`, `export-svg.mjs`).

Same architecture as the other builders (`dimension`, `typography`): a Node orchestrator (`build-icons.js`), the Figma side as files with an `INPUT` block (`read-source.js`, `build-page.js`) and a `registry.json`. Everything that is not an icon is a component of the section `_building_blocks/icons` on the page "Authoring Utilities".

## Files

```
icons/
  build-icons.js   Node orchestrator: asks for the source, reads it, builds, checks
  read-source.js   Figma side, runs in the SOURCE file, read only
  build-page.js    Figma side, runs in the DESTINATION file, three phases: prepare, icons, finish
  registry.json    page name, grid, colours, variable names, texts of the boxes, names of the building blocks
  _readme.md       This file
```

## The source is always asked

The builder always asks for the Figma URL of the source: a file or a branch that holds the icons. Add the `node-id` of the section or frame with the icons when the file has more than one icon page (the URL of the Icons section works). `--source <url>` puts the URL on the command line for scripts; without it the builder asks.

The source must be readable by a script. Figma gives a script **no access** to a file that you can only view (the button says "Ask to edit"): this is the case for the live OB Library and for a branch you may not edit. The builder then stops with a message and asks for an editable copy (File menu: Duplicate to your drafts, or ask for edit access). It does not copy through the clipboard and it does not guess.

What it reads from the source: every component named `icon/...` or `Icon/...` under the node (name, description, the single vector layer with its path, the label text beside the icon). A component that is not 24 x 24 or has not exactly one vector is listed and skipped.

## The destination

The file that is open and active in Figma Desktop. It must be a branch or a copy of the design system file: it needs the variables the page is bound to and the page "Authoring Utilities" with `_building_blocks/shared/foundation_bar`. The builder shows the file name and asks before it writes (`--yes` skips the question, `--dry-run` writes nothing).

## What it builds

| Part | Where | How |
|---|---|---|
| `_building_blocks/icons` | page "Authoring Utilities" | section for the two building blocks, made when it is missing |
| `_building_blocks/icons/label` | in that section | component with the text property `name`; the label of an icon is an instance of it |
| `_building_blocks/icons/purpose_box` | in that section | component set, variants `purpose=single` and `purpose=multi` stacked with 20 px padding and gap and the dashed border of a component set: the box with the chip and the text with the link |
| page `🧷 Icons` | file | background of the registry |
| section (no name) | on the page | white, 1637 px wide, border black 10 %, as high as the rows need |
| `__foundation_bar` | in the section | instance of `_building_blocks/shared/foundation_bar`, title "Icons", the info part hidden |
| `Single-purpose icons`, `Multi-purpose icons` | in the section | instances of `purpose_box` |
| `icon/<name>` | in the section | component 24 x 24, one vector layer `vector`, fill bound to `neutral/fg/contrast_high/inversity_normal`, aspect ratio locked, description of the source |
| label | beside each icon | instance of `label`, text from the source label (the name when the source has none) |

Grid: 6 columns (x 44 + 272 per column), rows from y 865 with 72 px per row, the icons in the order of their names (plain code point order). The label sits 32 px to the right of the icon.

## What it never does

- It never deletes or replaces an icon component that exists: the Figma component ID of an icon must never change. Icons that exist stay as they are; icons that are missing are created in the first free slot of the grid. The shape of an existing icon is changed only by `icons.mjs`.
- It never changes a building block that exists. To change a box, edit the component in Figma.
- The header and the two boxes are drawn again on every run (nodes with these names inside the section are replaced).
- It never uses `figma-ds-cli connect`: that restarts Figma. It only uses `daemon reconnect`, and every write is guarded by the file key.

## Usage

```bash
# asks for the source URL, shows the plan, asks, builds
node build-icons.js

# reads the source and shows the plan, writes nothing
node build-icons.js --dry-run

# for scripts
node build-icons.js --source "<url>" --yes --work ./icon-sync
```

Options: `--registry <file>`, `--work <folder>` (default `./icon-sync`), `--batch <n>` (icons per Figma call, default 40).

Phases in the destination: `prepare` saves the restore point "Before icons builder" in the version history, makes the building blocks, the page, the section, the header and the boxes. `icons` creates one batch of icons with their labels. `finish` sizes the section and checks the whole page (size, one vector, bound fill, locked aspect ratio, label text, header, boxes, number of icons, variants of the box component that overlap).

## Prerequisites

1. Figma Desktop running with the destination file open and active.
2. `figma-ds-cli` installed (`FIG_CLI_DIR` is the folder to run it from, default `~/figma-cli`).
3. The source open to you with edit rights.

## After the build

Compare the page with Git and write the texts of the icons with the workflow commands in `figma-utils/icon-workflow/`: `icons.mjs` (compare and sync the shapes, the checks), `write-metadata.mjs` (the lines Purpose type, Description, Old name, Deprecated purpose) and `export-svg.mjs` (the SVG files). The export and the import script find a label beside an icon as a text or as a label instance.

## Notes

- The labels are instances because everything that is not an icon is a building block. `export-icon-set.js` and `import-icons.js` find the label by its position beside the icon, so they work on pages with text labels (the legacy library) and on pages built by this builder.
- The text of a purpose box with its link belongs to the component, not to the instance: instances of a component cannot keep a link inside an overridden text.
- The chip of the old page held a hidden calendar icon. The building block leaves it out.
- The page background, the grey of the box and the black of the labels are raw colours, as on the page that existed before the builder. Bound variables for them are a later decision.
- A label of the source that differs from the icon name is copied as it is and reported (the old page has `graduation` for `graduation-cap`).
