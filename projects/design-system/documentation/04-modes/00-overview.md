# Token Mode System

Navigation hub for all token mode documentation.

## **Mode Types**

| Mode | Purpose | Files | Documentation |
|---|---|---|---|
| **Lightness** | User mode preference | `light.json` / `dark.json` | [01-lightness.md](01-lightness.md) |
| **Emphasis** | Design emphasis levels | `high.json` / `low.json` | [02-emphasis.md](02-emphasis.md) |
| **UI Scale** | Component size variations | `sm.json` / `md.json` / `lg.json` | [03-ui-scale.md](03-ui-scale.md) |
| **Typography-Context** | Typography contexts | `interface.json` / `prose.json` | [04-typography-context.md](04-typography-context.md) |
| **Density** | Interface density control | Compact/Standard/Spacious | [05-density.md](05-density.md) |
| **Viewport** | Responsive width ranges | `xs` / `sm` / `md` / `lg` / `xl` / `2xl` | [06-viewport.md](06-viewport.md) |
| **Motion** | Animation preference | `enabled.json` / `disabled.json` | [07-motion.md](07-motion.md) |


## **How Modes Work**

**Mode Switching:** User modes (light/dark) switch at S1 layer through file selection. Components consume ob.s semantic tokens, which reference different S1 files based on user preferences.

**Mode Resolution:** When multiple files define the same token, the last file loaded takes precedence ("last wins" principle).