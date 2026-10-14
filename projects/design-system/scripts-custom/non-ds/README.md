# non-ds scripts

Scripts of the design system team that are not part of the design system itself. They do not build, document or ship tokens, components or documentation. Examples: test and measurement tools for Figma files, one-off migrations, helpers for team processes.

Scripts that belong to the design system pipeline stay in their own folders next to this one (for example `style-dictionary`, `figma-doc-builders`, `figma-utils`).

## Rules

- One subfolder per tool, with its own README: what it does, how to run it, what it needs.
- No secrets and no file keys, team ids or project ids in code. A tool reads them from a settings file or from environment variables outside the repository.
- No output in the repository. Snapshots, images and logs go to a folder outside the repository that the tool takes from a setting.
- This folder is public. Code, comments and READMEs do not name internal folders, tickets or internal tools.
