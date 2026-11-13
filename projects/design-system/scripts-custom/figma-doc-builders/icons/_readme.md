# Icons Builder

Builds the whole **🧷 Icons** page of the design system file from a source (a Figma file or a Git repo): the building blocks, the header, the two purpose boxes, one component and one label for every icon. This is Case 0 of the icon workflow ("create a new set") for the page itself. The shapes, the texts and the checks of the icons stay with `../../figma-utils/icon-workflow/` (`icons.mjs`, `write-metadata.mjs`, `export-svg.mjs`).

Same architecture as the other builders (`dimension`, `typography`): a Node orchestrator (`build-icons.js`), the Figma side as files with an `INPUT` block (`read-source.js`, `build-page.js`) and a `registry.json`. Everything that is neither an icon nor a label is a building block: the purpose box is a component of the section `_building_blocks/icons` on the page "Authoring Utilities" and the header is the existing `_building_blocks/shared/foundation_bar`. The labels are plain text layers.

## Files

```
icons/
  build-icons.js   Node orchestrator: asks for the source and the destination, reads the source, builds, checks
  read-source.js   Figma side, runs in the SOURCE file, read only
  build-page.js    Figma side, runs in the DESTINATION file, three phases: prepare, icons, finish
  registry.json    page name, grid, colours, variable names, texts of the boxes, names of the building blocks
  _readme.md       This file
```

## The source and the destination are always asked

The builder always asks where the icons come from and where the page is built. First the type of the source: `1` = a Figma file or `2` = a Git repo. Then the source (the Figma URL, or the repository and the branch) and the URL of the destination. For scripts: `--source-type figma|git`, `--source <url>`, `--git-repo`, `--git-ref`, `--git-path` and `--destination <url>`; what is not given is asked. The builder opens the Figma files itself, so they do not have to be open.

The name in a Figma URL is the name of the main file, also for a branch. The builder therefore shows the real name of each file after it opened it.

**Source type 1, a Figma file.** The source is the URL of the page with the icons. Open the page in Figma, click an empty spot so that nothing is selected and copy the URL from the address bar: its `node-id` is the page. The builder looks at the whole page, in every section and frame. A URL with the `node-id` of a section or a frame reads only that part. Without a `node-id` the builder reads the one page with "icon" in its name (any case); when there are several pages it stops and asks for the URL of the page. When the page of the URL has no icons (the address bar of a file shows the page you looked at last, often the cover), the builder says so and offers the page of the same file with "icon" in its name: with one such page Enter reads it, with several pages you choose by number. Without such a page the builder stops with a message.

The source must be readable by a script. Figma gives a script **no access** to a file that you can only view (the button says "Ask to edit"): this is the case for the live OB Library and for a branch you may not edit. The builder then stops with a message and asks for an editable copy (File menu: Duplicate to your drafts, or ask for edit access). It does not copy through the clipboard and it does not guess.

What it reads from the source: the builder finds the icons itself by their names. A component is an icon when its name starts with `icon` or `icons` (any case) followed by `/`, `\`, `_`, `-`, `.`, `:` or a space. So `icon/arrow`, `Icon/arrow`, `Icons/arrow`, `icons/arrow`, `icon_arrow`, `Icon - arrow` and `icon arrow` are all icons. The part after the prefix is the name (`arrow`). In the destination the component is called `icon/<name>`. Names such as `Iconography/arrow`, `IconButton` or `ic/arrow` are not icons. Other components on the page are counted and ignored: the builder lists a few of them so that a name it did not accept is easy to see. The builder also shows which prefixes it found (for example `icon/ x 280, Icons/ x 4`).

For every icon it reads the name, the description, the single vector layer with its path and the label text beside the icon (without a label the name is used). A component that is not 24 x 24 or has not exactly one vector is listed and skipped. Two components with the same name (any case) count once, a component set with variants is not copied.

**Source type 2, a Git repo.** The builder asks for the repository (default `oblique-bit/oblique`) and a branch, tag or commit (default `master`). It downloads the SVG files of the folder `projects/oblique/icons` (`--git-path` names another folder) with `fetch-icons.mjs` of the icon workflow and checks them with its validator (profile git). The builder stops when the files have errors (`--force` goes on anyway). The name of an icon is the name of its SVG file. The texts of an icon (usage, category, keywords, purpose type, description, old name, deprecated purpose) come from the gallery file `icons.ts` of the same commit and are written in the format of the descriptions in Figma. The label is the name. Without a gallery entry the description stays empty. The icons are made from the SVG files in the same way as `icons.mjs` makes missing icons. The download needs the network; a `GITHUB_TOKEN` raises the limit of the GitHub API.

## The destination

The branch or the copy of the design system file where the page is built, given as a URL. It needs edit rights (a file you can only view gives a script no access), the variables the page is bound to and the page "Authoring Utilities" with `_building_blocks/shared/foundation_bar`.

The page `🧷 Icons` is made in the destination when it does not exist. The building blocks are made when they are missing. The plan says so. The builder reads the source, opens the destination and shows the plan. Then it asks `Build the page ... into <destination> with the icons of <source>? [y/N]` (for a Git repo the source is shown as `owner/name@commit`) before it writes (`--yes` skips the question, `--dry-run` writes nothing). When the source and the destination are the same file, the icons stay as they are, the header and the two boxes are drawn again and missing building blocks are made.

## What it builds

| Part | Where | How |
|---|---|---|
| `_building_blocks/icons` | page "Authoring Utilities" | section for the building block, made when it is missing |
| `_building_blocks/icons/purpose_box` | in that section | component set, variants `purpose=single` and `purpose=multi` stacked with 20 px padding and gap and the dashed border of a component set: the box with the chip and the text with the link |
| page `🧷 Icons` | file | background of the registry |
| section (no name) | on the page | white, 1637 px wide, border black 10 %, as high as the rows need |
| `__foundation_bar` | in the section | instance of `_building_blocks/shared/foundation_bar`, title "Icons", the info part hidden |
| `Single-purpose icons`, `Multi-purpose icons` | in the section | instances of `purpose_box` |
| `icon/<name>` | in the section | component 24 x 24, one vector layer `vector`, fill bound to `neutral/fg/contrast_high/inversity_normal`, aspect ratio locked, description of the source |
| label | beside each icon | plain text layer, no component: Noto Sans Regular 16, line height 24 px, letter spacing 0.1 %, black; the text comes from the source label (the name when the source has none) |

Grid: 6 columns (x 44 + 272 per column), rows from y 865 with 72 px per row, the icons in the order of their names (plain code point order). The label sits 32 px to the right of the icon.

Layer order, as in the OB Library: in the layers panel the labels are one block above the block of the icons, so a label is never listed next to its icon. Each block reads a to z from the top. The two boxes and the header are the bottom layers. A new icon goes to the start of its block, so the order also holds after a rerun.

## Only the building blocks

`node build-icons.js --blocks-only` asks only for the destination and makes only the building block for icons: the section `_building_blocks/icons` with `purpose_box` on the page "Authoring Utilities". It needs no source and makes no page and no icons. When the building blocks exist already it does nothing.

It is made for a branch that is merged into the main file first. A new branch made from the main file afterwards already has the building blocks. The full run (without `--blocks-only`) in that branch finds them and builds the page and the icons. Steps in Figma: make a branch of the design system file, run `--blocks-only` with the URL of that branch, merge the branch into the main file, make a new branch from the main file and run the builder there.

## What it never does

- It never deletes or replaces an icon component that exists: the Figma component ID of an icon must never change. Icons that exist stay as they are; icons that are missing are created in the first free slot of the grid. The shape of an existing icon is changed only by `icons.mjs`.
- It never changes a building block that exists. To change a box, edit the component in Figma.
- The header and the two boxes are drawn again on every run (nodes with these names inside the section are replaced).
- It never uses `figma-ds-cli connect`: that restarts Figma. It only uses `daemon reconnect`. Every write is guarded by the file key.

## Usage

Open a terminal where you can type (the builder asks questions) and go to the folder of the builder. Keep the work folder outside the repository: the default `./icon-sync` is made in the folder you run from. Inside the repository git shows it as a new folder.

```bash
cd <repository>/projects/design-system/scripts-custom/figma-doc-builders/icons

# asks for the source type, the source and the destination URL, reads the source, shows the plan, asks, builds
node build-icons.js --work ~/icon-sync

# the same, but writes nothing
node build-icons.js --dry-run --work ~/icon-sync

# only the building blocks: asks only for the destination, no source, no page, no icons
node build-icons.js --blocks-only --work ~/icon-sync

# for scripts (no questions): a Figma file as the source
node build-icons.js --source-type figma --source "<url>" --destination "<url>" --yes --work ~/icon-sync

# for scripts: a Git repo as the source
node build-icons.js --source-type git --git-repo oblique-bit/oblique --git-ref master --destination "<url>" --yes --work ~/icon-sync
```

Options: `--source-type figma|git`, `--source <url>`, `--git-repo <owner/name>`, `--git-ref <branch|tag|sha>`, `--git-path <folder>`, `--force`, `--destination <url>`, `--blocks-only`, `--registry <file>`, `--work <folder>` (default `./icon-sync` in the folder you run from), `--batch <n>` (icons per Figma call, default 40).

Phases in the destination: `prepare` saves the restore point "Before icons builder" in the version history, makes the building blocks, the page, the section, the header and the boxes. `icons` creates one batch of icons with their labels. `finish` sizes the section and checks the whole page (size, one vector, bound fill, locked aspect ratio, label text, header, boxes, number of icons, variants of the box component that overlap).

## Prerequisites

1. Figma Desktop running and connected to `figma-ds-cli`. If the builder says that nothing answers on port 9222, run `figma-ds-cli connect` once before the builder (it restarts Figma). Never run it while the builder works.
2. `figma-ds-cli` installed (`FIG_CLI_DIR` is the folder to run it from, default `~/figma-cli`).
3. Edit rights in the destination and in a Figma source. A file that was opened in Figma before you got edit access has to be reloaded (Cmd+R) once, otherwise it still gives scripts no access.
4. Leave Figma alone while the builder runs: it opens the source and then the destination by itself.

## After the build

Compare the page with Git and write the texts of the icons with the workflow commands in `figma-utils/icon-workflow/`: `icons.mjs` (compare and sync the shapes, the checks), `write-metadata.mjs` (the lines Purpose type, Description, Old name, Deprecated purpose) and `export-svg.mjs` (the SVG files). The export and the import script find a label beside an icon as a text or as a label instance.

## Notes

- The labels are plain text layers, no component (decided 2026-11-13: a label needs no building block. The OB Library has text labels too). An earlier version of the builder made the labels as instances of a `label` building block; a page built then keeps them. The `label` component in `_building_blocks/icons` is no longer used. `export-icon-set.js` and `import-icons.js` find the label by its position beside the icon, as a text or as an instance, so they work on the legacy library, on pages built by this version and on pages built by the earlier one.
- The text of a purpose box with its link belongs to the component, not to the instance: instances of a component cannot keep a link inside an overridden text.
- The chip of the old page held a hidden calendar icon. The building block leaves it out.
- The page background, the grey of the box and the black of the labels are raw colours, as on the page that existed before the builder. Bound variables for them are a later decision.
- A label of the source that differs from the icon name is copied as it is and reported (the old page has `graduation` for `graduation-cap`).
