# Token Mode System

Navigation hub for all token mode documentation.

## **Mode Types**

| Mode | Purpose | Files | Documentation |
|---|---|---|---|
| **Lightness** | User theme preference | `light.json` / `dark.json` | [01-lightness.md](./01-lightness.md) |
| **Emphasis** | Design emphasis levels | `high.json` / `low.json` | [02-emphasis.md](./02-emphasis.md) |
| **UI Scale** | Component size variations | `sm.json` / `md.json` / `lg.json` | [03-ui-scale.md](./03-ui-scale.md) |
| **Typography-Context** | Typography contexts | `interface.json` / `prose.json` | [04-typography-context.md](./04-typography-context.md) |
| **Density** | Interface density control | Compact/Comfortable/Spacious | [05-density.md](./05-density.md) |


## **How Modes Work**

**Mode Switching:** User modes (light/dark) switch at S1 layer through file selection. Components consume S3 semantic tokens, which reference different S1 files based on user preferences.

**Mode Resolution:** When multiple files define the same token, the last file loaded takes precedence ("last wins" principle).