# Global Tokens and Reference Hierarchy

### **The Role of Global Tokens Across Levels**

**Context:**
We are refining the explanation of token levels within our design system, especially regarding how reference chains work. The assumption that each level strictly references the one directly below (e.g., Component -> Semantic -> Primitive) does **not fully apply** to Global tokens.

---

## **Clarification to Level Documentation**

Global tokens (`ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*`) **do not follow the strict reference hierarchy** like other levels. Instead, they can be **referenced directly by any other token level**, including:

* **Semantic tokens**
  e.g., `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index` referencing `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewportFactor`
* **Component tokens**
  e.g., `ob.c.tag.container.spacing.gap.spacing.gap referencing `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.theme_configuration.viewport`

This cross-level referencing is **intentional** and reflects the **foundational role** of global tokens — they define system-wide constants and settings that are agnostic to theming depth.

---

## **Why This is an Exception**

* Global tokens represent **layout, viewport, and environment settings** — such as breakpoints, device types, or scaling factors — which **do not belong to any specific visual level**.
* Unlike Primitive, Semantic, and Component levels (which build visual abstraction hierarchies), Global tokens are **external inputs or configuration anchors** that influence all levels.
* Therefore, the typical reference chain:

  ```
  Primitive -> Semantic -> Component
  ```

  **does not constrain** Global token usage. Globals can "jump" levels.

---

## **Rule to Document**

> Global tokens (`ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*`) can be consumed by any level (Primitive, Semantic, or Component) and are exempt from strict level-to-level reference rules. They act as system-level constants and may appear in token references where broader configuration is needed.

---

## **Visualization**

```
┌─────────────────┐
│  Global Tokens  │
│    (ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*)     │
└─────┬─────┬─────┘
      │     │     │
      ▼     │     │
┌─────────────────┐
│Primitive Tokens │
│    (ob.p.assets.logo.assets.logo.assets.assets.*)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│Semantic Tokens  │
│    (ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│Component Tokens │
│    (ob.c.tag.container.spacing.gap.spacing.gap     │
└─────────────────┘
```

The diagram above shows how Global tokens can be referenced directly from any level, whereas other token levels follow a strict hierarchy.
