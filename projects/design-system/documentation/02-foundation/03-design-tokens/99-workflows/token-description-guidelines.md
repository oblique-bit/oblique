# Token Description Guidelines

How to write the `$description` of a design token — the human-readable text
that explains the token's role and surfaces in Figma and Tokens Studio.

`$description` is the only metadata field used for token documentation.
Token classification (documentation nodes, consumption labels, tiers) is
covered in [Foundation Architecture](../02-architecture.md).

---

## The `$description` field

A short string. Defines the semantic role of the token in one sentence,
written from the design system's perspective — what function does this token
serve?

Examples:

- `"Neutral foreground — contrast medium normal."`
- `"Static color for brand-relevant UI elements."`
- `"Smallest spacing step for dense layouts."`

### Consumption labels

A description may begin with **at most one** label. The label tells the
reader which environment applies the token. It lives in the description
because the description is the only field that publishes through to Figma,
where designers can read it.

| Label | Meaning |
|---|---|
| *(none)* | Normal — used in both Figma and code. |
| `[FIGMA-ONLY]` | Figma applies it automatically; developers can ignore it. |
| `[NO-FIGMA]` | Not in Figma; developers apply it in code. |
| `[NO-CODE]` | Exists only to complete a set — used by neither Figma nor code. |

The label is a prefix on the description text, e.g.
`"[NO-FIGMA] Outer page margin, applied by the layout."` Omit it when none
applies. The full classification model is in
[Foundation Architecture](../02-architecture.md).

### Group-level documentation

A token group (a family — any non-leaf node) is documented by a
`token_family_docs` node that carries the family's `$description`. Tokens
Studio does not render group-level descriptions in its UI, which is why the
family description lives in its own node. The node and its format are
defined in [Foundation Architecture](../02-architecture.md).

### Where descriptions are expected

| Tier | `$description` |
|---|---|
| Primitive (`ob.p.*`) | Not required |
| Semantic (`ob.s`, `ob.s1`, `ob.s2`) | Recommended |
| Component (`ob.c.*`) | Required |
| HTML (`ob.h.*`) | Required |
| Any token group | Required (in its `token_family_docs` node) |

---

## Writing style

- Sentence case throughout.
- One sentence or phrase per description.
- Direct and factual — no marketing language.
- Prefer "Avoid" and "Do not use" over "Never" or "Must not".
- Designer-accessible — avoid code-level jargon.

---

## Authoring constraints

Technical limits that apply before any description enters a JSON file.
Violations can break Tokens Studio parsing, Style Dictionary processing, or
the Figma pipeline.

### Allowed characters

| Character | Status | Notes |
|---|---|---|
| ASCII printable U+0020–U+007E | ✓ Allowed | Full printable ASCII set |
| Em dash `—` U+2014 | ✓ Allowed | Used in existing descriptions |
| En dash `–` U+2013 | ✓ Allowed | Used in existing dimension descriptions |
| Single quote `'` | ✓ Allowed | No JSON escaping required |
| Double quote `"` | ✓ Allowed | Must be JSON-escaped as `\"`; use a JSON serializer, never manual string concatenation |
| Newline `\n` | Avoid | Valid JSON, but renders poorly in Figma — avoid in any description that appears in Figma |
| Curly quotes `“ ” ‘ ’` | ✗ Forbidden | Visually similar to ASCII quotes; use straight quotes instead |
| Ellipsis `…` U+2026 | ✗ Forbidden | Write `...` (three full stops) instead |
| Non-breaking space U+00A0 | ✗ Forbidden | Use a regular space U+0020 |
| Any other non-ASCII besides `—` and `–` | ✗ Forbidden | No accented characters, symbols, or typographic ligatures |

### Forbidden patterns

These cause silent or hard-to-debug failures:

- **Token references** — `{ob.p.color.brand.primary}`. Tokens Studio resolves any `{...}` syntax as a token reference; a token path in a description causes a resolution error or stores the resolved value instead of the literal text.
- **HTML tags** — `<b>`, `<em>`, `<br>`. Not rendered anywhere in the pipeline; stored as literal text.
- **Markdown** — `**bold**`, `_italic_`, `# heading`. Not rendered by Tokens Studio or Figma; write plain text only.
- **Trailing whitespace** — normalize before committing.

### Length

`$description` — recommended maximum **300 characters**. Exceeding it does
not break JSON but causes truncation in Figma design panels and Tokens
Studio tooltips.

### Scripting safety

Any script that writes to token JSON files must:

1. **Parse → modify → serialize** — always use a JSON parser (`JSON.parse` / `json.loads`). Never use regex or string replacement on raw JSON.
2. **2-space indentation** — matches the existing source files.
3. **No trailing commas** — JSON strict mode; trailing commas break Style Dictionary and most parsers.
4. **Preserve `$type`** — never drop or overwrite an existing `$type` key.
5. **Do not overwrite an existing `$description`** — skip the token, or flag it for human review; never silently replace.
6. **Validate after writing** — confirm the JSON still parses and no token references broke.
