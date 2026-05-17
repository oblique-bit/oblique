# Resolution order

Companion to `All states matrix.md`. Collects the rules and edge cases
behind the resolution chain — how collections actually resolve at the
boundaries.

---

## Disabled elements & focus

**Rule:** disabled controls are generally **not** focusable — they are
removed from the tab sequence.

### Native `disabled` vs `aria-disabled`

|  | `<button disabled>` | `<button aria-disabled="true">` |
|---|---|---|
| Focusable | no | yes |
| Triggers its action | no | no — must be blocked in code |
| Submitted with the form | no | yes |
| State handled by | the browser | manual code + ARIA |
| Use when | the control is fully inactive | it stays discoverable/focusable but inactive |

### WCAG

WCAG does **not** say "disabled elements must never be focusable." It
requires visible focus indicators, clear programmatic state, and predictable
behaviour. So *if* a disabled element stays focusable it must: expose
`aria-disabled="true"`, not trigger its action, show a visible focus
indicator, and stay readable.

### Design-system rule

Remove disabled controls from the tab sequence by default — use native
`disabled` for standard buttons and inputs.

**Exception:** disabled items inside composite widgets (menu, tabs, listbox,
tree) may stay focusable via `aria-disabled="true"` when discoverability
matters and the keyboard pattern expects it.

| Case | Focusable? | Approach |
|---|---|---|
| Standard button | no | native `disabled` |
| Form input | no | native `disabled` |
| Submit blocked until form is valid | usually no | native `disabled`, or keep enabled and show validation |
| Menu / tab / listbox / tree item | sometimes | `aria-disabled="true"` if discoverability is needed |
| Custom component | depends | `aria-disabled="true"` only if it should stay focusable |

### Consequence for the chain

All `button_*` types are standard controls → native `disabled` → not
focusable. So for buttons, `display = disabled` **excludes** `focus`: the
control drops out of the tab sequence and no focus ring resolves under
`disabled`. Composite-widget items that use `aria-disabled` instead keep
`focus` live.
