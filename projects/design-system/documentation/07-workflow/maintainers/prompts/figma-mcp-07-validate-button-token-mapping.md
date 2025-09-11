Additionally, flag as a red flag if any border tokens are mapped to icon or text layers.
# Figma MCP Prompt: Button Token Mapping Validation

**Trigger:** `@MCP Figma Server`

**Instruction:**

Please inspect all variants of the selected button component in the current design system file and validate token mappings according to these rules:

Tokens must be scoped to the component token tier: `ob.h.{component}` or `ob.c.{component}` (depending on whether the component lives in `ob.c` or `ob.h`). All mapped tokens should originate from this tier. If a token is mapped from another component, flag this as a red flag.

1. **Primary** variants must only use component tokens prefixed with `ob.c.primary`.
2. **Secondary buttons** must only use component tokens prefixed with `ob.c.secondary`.
3. Variants may consume semantic tokens like `ob.s`, but primary variants must not reference secondary component tokens, and vice versa.
4. All button tokens must follow the correct naming conventions for inversity and interactive states (`enabled`, `hover`, `pressed`, `disabled`).

Report any instance where:
- A primary button layer references a secondary token (or vice versa).
- Token naming does not match the intended usage or state.

---

*This prompt can be adapted for other component types or token mapping rules as needed. For more prompt templates, see the prompts collection in this folder.*
