# Token Metadata Guidelines

Each design token and each token group has four structured metadata fields that together document its role, intended usage, and tooling classification.

| Field | Purpose | Required |
|---|---|---|
| `$description` | Role definition — what the token or group is for | Recommended |
| `$extensions.ob.figma.semanticAssigned` | Whether the semantic role is fixed | Where applicable |
| `$extensions.ob.guidelines.recommended` | Appropriate usage contexts | Optional |
| `$extensions.ob.guidelines.not_recommended` | Contexts to avoid | Optional |

---

## Fields

### `$description`

Plain string. Defines the semantic role of the token in one sentence.

Write from the design system's perspective — what function does this token serve?

Examples:
- `"Neutral foreground — contrast medium normal."`
- `"Static color for brand-relevant UI elements."`
- `"Smallest spacing step for dense layouts."`

Tooling restrictions are prepended as a tag (omit if not applicable):
- `[FIGMA-ONLY]` — developers can ignore this token; Figma handles it automatically.
- `[NO-FIGMA]` — designers must apply manually; no automatic Figma binding.

---

### `$extensions.ob.figma.semanticAssigned`

Boolean. Indicates whether this token's semantic role is locked to a specific design intent.

- `true` — the token carries a fixed semantic meaning; the value must not be repurposed.
- `false` or absent — the token is general-purpose.

Read by tooling to determine whether the token can appear in freeform assignment UIs in Figma.

---

### `$extensions.ob.guidelines.recommended`

String array. Appropriate usage contexts in plain language.

Each entry is one short phrase or sentence.

```json
"recommended": [
  "Use for secondary labels, captions, and supporting text."
]
```

---

### `$extensions.ob.guidelines.not_recommended`

String array. Contexts where this token should not be used. State the reason concisely when helpful.

Each entry is one short phrase or sentence.

```json
"not_recommended": [
  "Avoid for primary headings — insufficient contrast for emphasis.",
  "Do not use on colored backgrounds — use the inversity_flipped variant instead."
]
```

---

## Complete Schema Example

```json
{
  "$type": "color",
  "$value": "{ob.s1.color.neutral.fg.contrast_medium.inversity_normal}",
  "$description": "Neutral foreground — contrast medium normal.",
  "$extensions": {
    "ob.figma": {
      "semanticAssigned": true
    },
    "ob.guidelines": {
      "recommended": [
        "Use for secondary labels, captions, and supporting text."
      ],
      "not_recommended": [
        "Avoid for primary headings — insufficient contrast for emphasis.",
        "Do not use on colored backgrounds — use the inversity_flipped variant instead."
      ]
    }
  }
}
```

---

## Token Groups

The same four fields also apply at the group level. A group is any non-leaf node in the token hierarchy — for example `ob.s.color.neutral.fg` or a full token set like `03_semantic/color/compiled`.

### DTCG representation

In the JSON source files, group nodes can carry `$description` and `$extensions` directly:

```json
{
  "ob": {
    "s": {
      "color": {
        "neutral": {
          "$description": "Neutral color scale — theme-aware foreground, background, and border tokens.",
          "$extensions": {
            "ob.guidelines": {
              "recommended": [
                "Use for all text, surface, and border roles in UI components."
              ],
              "not_recommended": [
                "Do not use for feedback states — use the status or interaction scale instead."
              ]
            }
          },
          "fg": { ... }
        }
      }
    }
  }
}
```

### Token Studio representation (`doc/` token set)

Token Studio does not render group-level `$description` / `$extensions` in its UI. Group metadata is therefore mirrored as dedicated documentation tokens in `src/lib/themes/doc/`, using `$type: "other"`.

The full four-field schema maps to the following doc tokens:

```json
{
  "doc": {
    "page_title": {
      "$type": "other",
      "$value": "Neutral colors"
    },
    "page_intro": {
      "$type": "other",
      "$value": "Theme-aware foreground, background, and border tokens for all neutral UI roles."
    },
    "recommended": {
      "$type": "other",
      "$value": "Use for all text, surface, and border roles in UI components."
    },
    "not_recommended": {
      "$type": "other",
      "$value": "Do not use for feedback states — use the status or interaction scale instead."
    },
    "semantic_assigned": {
      "$type": "other",
      "$value": "true"
    }
  }
}
```

`page_title` and `page_intro` are the existing fields. `recommended`, `not_recommended`, and `semantic_assigned` are the new additions that mirror the token-level `$extensions` fields.

---

## Coverage Expectations

| Level | `$description` / `page_intro` | `semanticAssigned` | `recommended` / `not_recommended` |
|---|---|---|---|
| **Token group** | Required | Where applicable | Required for color groups |
| Primitive (`ob.p.*`) token | Not required | Not applicable | Not required |
| S1 (`ob.s1.*`) token | Recommended | Not applicable | Notable tokens only |
| S2 (`ob.s2.*`) token | Recommended | Not applicable | Notable tokens only |
| Compiled (`ob.s.*`) token | Required | Required | Required for color tokens |
| Component (`ob.c.*`) token | Required | Not applicable | Optional |
| HTML (`ob.h.*`) token | Required | Not applicable | Optional |

---

## Writing Style

- Sentence case throughout.
- One sentence or phrase per entry.
- Direct and factual — no marketing language.
- Prefer "Avoid" and "Do not use" over "Never" or "Must not".
- Designer-accessible: avoid code-level jargon in `$description`.

---

## Authoring Constraints

Technical limits that apply before any field value enters a JSON file. Violations can break Token Studio parsing, style-dictionary processing, or Figma pipeline reads.

### Allowed characters

Applies to all text fields: `$description`, `page_title`, `page_intro`, and each string entry in `recommended` / `not_recommended`.

| Character | Status | Notes |
|---|---|---|
| ASCII printable U+0020–U+007E | ✓ Allowed | Full printable ASCII set |
| Em dash `—` U+2014 | ✓ Allowed | Used in existing s3/free-color descriptions |
| En dash `–` U+2013 | ✓ Allowed | Used in existing dimension descriptions |
| Single quote `'` | ✓ Allowed | No JSON escaping required |
| Double quote `"` | ✓ Allowed | Must be JSON-escaped as `\"` in raw file; use a JSON serializer, never manual string concat |
| Newline `\n` | Avoid | Technically valid JSON; already present in a few descriptions; renders poorly in Figma — use only for multi-line descriptions that never appear in Figma |
| Curly quotes `"` `"` `'` `'` | ✗ Forbidden | Visually similar to ASCII quotes; use straight quotes instead |
| Ellipsis `…` U+2026 | ✗ Forbidden | Write `...` (three full stops) instead |
| Non-breaking space U+00A0 | ✗ Forbidden | Use regular space U+0020 |
| Any other non-ASCII besides `—` and `–` | ✗ Forbidden | No accented characters, symbols, or typographic ligatures |

### Forbidden patterns

These patterns cause silent or hard-to-debug failures:

- **Token references** `{ob.p.color.brand.primary}` — Token Studio resolves any `{...}` syntax as a token reference. Writing a token path in a description or guidelines string will cause a resolution error or produce the resolved value instead of the literal text.
- **HTML tags** `<b>`, `<em>`, `<br>` — not rendered anywhere in the pipeline; stored as literal text and may confuse tooling that parses descriptions.
- **Markdown** `**bold**`, `_italic_`, `# heading` — not rendered by Token Studio or Figma; write plain text only.
- **Trailing whitespace** — normalize before committing.
- **Empty arrays** `[]` — omit the field entirely rather than writing an empty array for `recommended` or `not_recommended`.

### Type constraints

The JSON type of each field is fixed. Mixing types (e.g. storing a boolean as a string) silently breaks tooling that reads that field.

| Field | Required JSON type | Forbidden alternatives |
|---|---|---|
| `$description` | `string` | array, `null`, number |
| `$extensions.ob.figma.semanticAssigned` | `boolean` (`true` / `false`) | `"true"` as string, `1` / `0` |
| `$extensions.ob.guidelines.recommended` | array of strings `["..."]` | plain string, `null` |
| `$extensions.ob.guidelines.not_recommended` | array of strings `["..."]` | plain string, `null` |
| `doc/*.recommended.$value` | `string` | array (Token Studio requires `$value` to be a string when `$type` is `"other"`) |
| `doc/*.not_recommended.$value` | `string` | array |
| `doc/*.semantic_assigned.$value` | string `"true"` or `"false"` | JSON boolean (`true`) — Token Studio `"other"` tokens require string values |

### Key structure in `$extensions`

`$extensions` uses **flat dot-notation string keys**, not nested objects. The full namespace is the literal key:

```json
// ✓ Correct — dot-notation as a single string key
"$extensions": {
  "ob.figma": { "semanticAssigned": true },
  "ob.guidelines": { "recommended": ["..."], "not_recommended": ["..."] }
}

// ✗ Wrong — nested under "ob"
"$extensions": {
  "ob": {
    "figma": { "semanticAssigned": true }
  }
}
```

### Length limits

Exceeding these values does not break JSON but causes truncation in Figma design panels and Token Studio tooltips.

| Field | Recommended max |
|---|---|
| `$description` | 300 characters (current max in codebase: 284) |
| `page_title` | 80 characters |
| `page_intro` | 500 characters |
| Each `recommended` / `not_recommended` entry | 200 characters |

### Scripting safety rules

Any script that writes to token JSON files must follow these rules:

1. **Parse → modify → serialize**: always use a JSON parser (`JSON.parse` / `json.loads`). Never use regex or string replacement on raw JSON.
2. **2-space indentation**: matches the existing format in all source files.
3. **No trailing commas**: JSON strict mode — trailing commas break style-dictionary and most parsers.
4. **Preserve `$type`**: never drop or overwrite an existing `$type` key.
5. **Do not overwrite existing `$description`**: if a description already exists, a script must skip that token (or flag it for human review), not silently replace it.
6. **Do not add `$extensions.ob.guidelines` to primitive tokens**: the coverage table defines where each field applies — scripts must respect it.
7. **Validate output**: after writing, run `node scripts-custom/validate-all-components.js` to confirm no references were broken.
