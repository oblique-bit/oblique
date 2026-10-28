# Token Mode System

Navigation hub for all token mode documentation.

## **Mode Types**

| Mode | Purpose | Files | Documentation |
|---|---|---|---|
| **Color scheme** | User mode preference | `light.json` / `dark.json` | [01-color-scheme.md](01-color-scheme.md) |
| **Emphasis** | Design emphasis levels | `high.json` / `low.json` | [02-emphasis.md](02-emphasis.md) |
| **Scale** | Component size variations | `sm.json` / `md.json` / `lg.json` | [03-scale.md](03-scale.md) |
| **Typography-Context** | Typography contexts | `interface.json` / `prose.json` | [04-typography-context.md](04-typography-context.md) |
| **Density** | Interface density control | Compact/Standard/Spacious | [05-density.md](05-density.md) |
| **Viewport** | Responsive width ranges | `xs` / `sm` / `md` / `lg` / `xl` / `2xl` | [06-viewport.md](06-viewport.md) |
| **Motion** | Animation preference | `on.json` / `off.json` | [07-motion.md](07-motion.md) |
| **Elevation** | Surface level | `level_minus_1.json` / `level_0.json` / `level_1.json` / `level_2.json` | [08-elevation.md](08-elevation.md) |


## **How Modes Work**

**Mode Switching:** User modes (light/dark) switch at S1 layer through file selection. Components consume ob.s semantic tokens, which reference different S1 files based on user preferences.

**Mode Resolution:** When multiple files define the same token, the last file loaded takes precedence ("last wins" principle).