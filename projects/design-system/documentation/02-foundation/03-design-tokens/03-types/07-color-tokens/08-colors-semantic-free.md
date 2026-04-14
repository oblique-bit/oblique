# Free Colors

The `ob.s.color.free.*` group contains colors that carry no fixed semantic meaning. The name communicates governance intent: these colors are free for any project-specific purpose — categorization, tagging, data visualization, priority levels, swimlane colors, etc.

It may seem unusual that tokens in a semantic color group carry no semantic meaning. This is intentional. Free colors provide the palette range and the contrast-level scaffolding of the semantic system, while leaving the actual meaning to the design system consumer. Projects attach meaning at their own S-level by creating tokens that reference `free.*` — the design system itself makes no claim about what these colors communicate.

A second reason these colors are not left at the primitive level: primitives are easy to overlook, and more importantly, the design system needs to prepare a complete reference chain up to the compiled semantic level (S3). Only by existing at the semantic level can free colors properly resolve on mode switch — light, dark, and inversity variations all depend on the semantic layer's mode-aware token resolution. Consuming a raw primitive would bypass this chain and produce static, non-adaptive values.

## Two usage patterns

### Pattern 1 — Decorative or categorical use (no renaming needed)

If the color is used purely for visual differentiation and does not carry a named status meaning, consume `free.*` tokens directly. No project-level token override is required.

Example: a "Documents" category badge that uses yellow purely to distinguish it from other categories — not to communicate a workflow state.

```css
/* Direct consumption — no semantic meaning attached */
background: var(--ob-s-color-free-yellow-bg-contrast-medium-inversity-normal);
color: var(--ob-s-color-free-yellow-fg-contrast-high-inversity-normal);
```

This is valid. The token path makes no claim about what the yellow means in this context.

### Pattern 2 — Status extension (rename at S-level)

If the project assigns a named workflow status to one of the free colors, the project should create its own S-level token that references the `free.*` token. This gives the color a proper semantic name in the project's token namespace.

Example: a project adds a "Pending" status and decides yellow is the right color for it.

```json
// Project-level semantic token (in project token override layer)
"ob": {
  "s3": {
    "color": {
      "status": {
        "pending": {
          "fg": {
            "contrast_high": {
              "$value": "{ob.s.color.free.yellow.fg.contrast_high.inversity_normal}"
            }
          }
        }
      }
    }
  }
}
```

Now `status.pending` is a named concept in the project's token namespace and components reference `status.pending.*` — not raw `free.yellow.*`. If the project later decides to change the color, they update the mapping in one place.

## When to use which pattern

| Situation | Pattern |
|-----------|---------|
| Color used for visual grouping only, no workflow meaning | Consume `free.*` directly |
| Color assigned to a named status or workflow state | Create project S-level token mapping to `free.*` |
| Color needs to appear in a status component (badge, pill) with a label | Create project S-level token mapping |
| Data visualization, charts, arbitrary categorical color | Consume `free.*` directly |

## Potential use cases by color

These are non-binding examples. Each project assigns its own meaning.

| Color | Example status labels | Inspiration |
|-------|-----------------------|-------------|
| **yellow** | Pending, Waiting, Awaiting reply, Awaiting approval, Draft, Overdue, Flagged | Spectrum (notice: pending, draft) |
| **teal** | Confirmed, Active, Open, Approved, Started, Published, Resolved | Spectrum (informative: active, published; positive: approved), Atlassian (success: resolved) |
| **indigo** | Progress, In review, Audit, To do, Processing, Modified | Atlassian (inprogress: open, modified; default: to do), Spectrum (notice: processing) |
| **pink** | Scheduled, Planned, Upcoming, Recurring | Spectrum (notice: scheduled) |
| **purple** | On hold, Blocked, Queued, Deferred | Atlassian (moved: blocked) |


---

*For related documentation, see [Status Colors](./07-colors-semantic-status.md), [Neutral Colors](./colors-03_semantic-neutral.md) and [Interaction Colors](./colors-03_semantic-interaction.md)*
