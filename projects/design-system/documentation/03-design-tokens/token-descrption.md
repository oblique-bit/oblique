Here’s a starter set of guidelines in Markdown you can drop into your repo or Confluence:

```markdown
# Token Description Guidelines

Every design token should include a clear and structured `description` field.  
The goal is to help both designers and developers understand **what the token is for**,  
**why its value was chosen**, and whether there are **tooling restrictions**.

---

## Structure

```

\[TOOLING] (only if restricted)
Usage: one short sentence describing what the token is for
Why: one short sentence explaining why this value was chosen

````

---

## Elements

### 1. Tooling
- Used **only if there is a limitation** in a tool such as Figma.
- Examples:
  - `[FIGMA-ONLY]` → developers can ignore this token.
  - `[NO-FIGMA]` → designers must apply manually in Figma.
- If no restrictions: omit this field.

### 2. Usage
- **What the token is for in design terms**.
- Write it so a practitioner can decide when to use it.
- Keep it **short and action-oriented**.
- Examples:
  - `Usage: Primary interactive text and icons.`
  - `Usage: Smallest spacing step for dense layouts.`
  - `Usage: Line-height for body text.`

### 3. Why
- **Why the specific value was chosen**.
- Capture decision-making, accessibility, or alignment rules.
- One short sentence.
- Examples:
  - `Why: Meets AA 4.5:1 contrast ratio against default background.`
  - `Why: Keeps rhythm with 8px baseline grid.`
  - `Why: Ensures WCAG 1.5 line-height ratio.`

---

## Examples

### Color Token
```json
{
  "$value": "#0f62fe",
  "$type": "color",
  "$description": "Usage: Primary interactive text and icons.  
Why: Meets AA 4.5:1 contrast ratio against default background."
}
````

### Spacing Token

```json
{
  "$value": "8px",
  "$type": "spacing",
  "$description": "Usage: Smallest spacing step for dense layouts.  
Why: Keeps rhythm with 8px baseline grid."
}
```

### Token with Tooling Restriction

```json
{
  "$value": "1.5",
  "$type": "line-height",
  "$description": "[NO-FIGMA]  
Usage: Line-height for body text.  
Why: Ensures WCAG 1.5 line-height ratio; must be applied manually in Figma."
}
```

---

## Writing Style

* Be **concise** (1 sentence per Usage and Why).
* Avoid technical jargon unless necessary.
* Use **sentence case**, not Title Case.
* Keep the **audience in mind**:

  * Designers → understand usage.
  * Developers → understand rationale and restrictions.

```

---

Do you want me to also add a **do/don’t section** (good vs bad examples) to make it easier for teammates to follow?
```
