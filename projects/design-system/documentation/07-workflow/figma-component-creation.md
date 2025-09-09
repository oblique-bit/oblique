# Figma Component Creation Strategy
**Version:** 1.0  
**Date:** September 9, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Modern approach to Figma component creation using variables over variants

---

## Official Figma Definitions: Variables, Collections, and Modes

Based on Figma's official documentation, here are the key concepts that inform our component creation strategy:

### **Variables (Figma Official Definition)**
> "Variables are raw values—like color, numbers, and strings—that can change in value depending on the context of a design, such as light and dark modes, or mobile and desktop modes."

**Key characteristics:**
- Store reusable values that can be applied to design properties
- Can be published to team libraries for systematic updates
- Support aliasing (variables referencing other variables) for design tokens
- Enable efficient design system management across files

### **Variable Collections (Figma Official Definition)**
> "A collection is a set of variables and modes. Collections can be used to organize related variables together."

**Purpose:**
- Organize related variables (e.g., one collection for colors, another for spacing)
- Can contain up to 5,000 variables per collection
- Support groups within collections for further organization
- Enable systematic organization of design tokens

### **Variable Modes (Figma Official Definition)**
> "A mode is a list of values for a variable in a collection, storing one value per variable. Modes also represent the different contexts of our designs."

**Official use cases for modes:**
- **Color themes:** Light and dark modes, high contrast, accessibility themes
- **Responsive design:** Desktop, tablet, mobile device sizes
- **Localization:** Different languages to see how copy flows in designs
- **Spatial systems:** Different spacing and padding for various contexts

**How modes work:**
- Each variable can have multiple values, organized by modes
- Switch design contexts without creating multiple frames
- Objects inherit modes from parent containers (auto mode)
- Can set specific modes on objects, frames, components, or pages

### **When to Use Modes (Figma's Guidance)**
From Figma's documentation, create modes when:
- You need to **represent different contexts** of the same design
- The **identity and intent remain the same**, only the value changes
- You want to **switch contexts quickly** without rebuilding designs
- You need to **maintain systematic relationships** between related values

**Examples from Figma:**
- Size modes: `desktop/tablet/mobile` for responsive spacing
- Theme modes: `light/dark` for color schemes  
- Language modes: `en/de/fr` for localized text
- Density modes: `compact/comfortable/spacious` for spacing variations

---

## Philosophy: Variables Over Variants (2025 Approach)

Our approach aligns with **Figma's official guidance** while addressing practical limitations:

### The Evolution Beyond Variants

**Variants were revolutionary in 2017**, but Figma's introduction of variables provides a more systematic approach that aligns with modern design token workflows.

#### Strategic Use: Variables + Variants for Different Purposes

**Variables for systematic properties (our primary approach):**
- ✅ **Sizes** - Migrate to variable modes (sm/md/lg)
- ✅ **Colors** - Systematic token mapping
- ✅ **Spacing** - Consistent across components
- ✅ **Typography** - Design token alignment
- ✅ **Inspectable** - Clear token relationships visible in properties
- ✅ **Trackable** - Version controlled with design system evolution
- ✅ **Developer-aligned** - Maps directly to code implementation

**Variants for Figma-specific functions (strategic exceptions):**
- ⚠️ **Interaction states** - enabled, hover, focus, active (prototyping needs)
- ⚠️ **Prototyping flows** - Where Figma variables don't fully support interactions (2025 limitation)
- ⚠️ **Animation states** - Complex state transitions requiring variant-based prototyping

**Why this hybrid approach works:**
- Variables handle **systematic design decisions** that map to tokens
- Variants handle **Figma-specific functionality** like prototyping
- Each tool used for its strengths, not ideological purity

---

## Implementation Strategy

### Component Architecture Approach

Each Figma component uses **strategic combination** of variables and variants:

**Variables for systematic properties:**
```
Component: ob-tag
├── Size Property: {size-variable} → maps to ob.c.tag.size.sm/md/lg (VARIABLE MODE)
├── Mode Property: {mode-variable} → maps to ob.c.tag.input_mode/filter_mode (VARIABLE MODE)
├── Color Properties: {color-variables} → maps to ob.c.tag.color.*.inversity_normal/flipped (VARIABLE)
└── Text Property: {text-variable} (VARIABLE)
```

**Variants for Figma-specific functions:**
```
Component: ob-tag
└── Interaction States: enabled/hover/focus/active (VARIANTS for prototyping)
```

### When to Create Variable Modes

**Create modes when a property is "modable":**
- **The identity and intent remain the same**
- **Only the attribute/value changes**
- **The property serves the same functional purpose**

**Examples of modable properties (aligned with Figma's official use cases):**
- **Size modes:** `sm/md/lg` - Same button, different dimensions (responsive design)
- **Context modes:** `input_mode/filter_mode` - Same tag, different usage context (contextual design)
- **Theme modes:** `light/dark` - Same component, different color scheme (Figma's primary example)
- **Density modes:** `compact/comfortable/spacious` - Same layout, different spacing (spatial systems)

**Note:** Inversity is **not** a variable mode. Inversity lives flat in the color tokens themselves:
- `ob.c.tag.color.bg.enabled.inversity_normal`
- `ob.c.tag.color.bg.enabled.inversity_flipped`

This approach follows **Figma's principle** that modes represent "different contexts" where the identity remains the same but values change systematically.

### Variable Mapping to Tokens

**Variables connect to design tokens for systematic properties:**

| Figma Variable | Design Token | Implementation | Purpose |
|---|---|---|---|
| `tag-size` (mode: sm) | `ob.c.tag.size.sm` | Variable Mode | Small tag sizing |
| `tag-size` (mode: md) | `ob.c.tag.size.md` | Variable Mode | Medium tag sizing |
| `tag-size` (mode: lg) | `ob.c.tag.size.lg` | Variable Mode | Large tag sizing |
| `tag-context` (mode: input) | `ob.c.tag.input_mode.*` | Variable Mode | Form input context |
| `tag-context` (mode: filter) | `ob.c.tag.filter_mode.*` | Variable Mode | Filtering context |
| `tag-color-bg` | `ob.c.tag.color.bg.enabled.inversity_normal` | Variable | Background color normal inversity |
| `tag-color-bg-flipped` | `ob.c.tag.color.bg.enabled.inversity_flipped` | Variable | Background color flipped inversity |

**Variants handle Figma-specific needs:**

| Figma Variant | Purpose | Reason for Variant |
|---|---|---|
| `state=enabled` | Default interaction state | Prototyping support |
| `state=hover` | Hover interaction | Figma variables incomplete for prototyping (2025) |
| `state=focus` | Focus interaction | Animation and transition support |
| `state=active` | Active/pressed state | Complex interaction flows |

---

## Benefits of Hybrid Variables+Variants Approach

### 1. **Token Traceability (Variables)**
- Component properties trace back to design tokens
- Changes propagate systematically across all instances
- Clear audit trail for design decisions

### 2. **Prototyping Support (Variants)**
- Interaction states work seamlessly in Figma prototypes
- Complex animations and transitions supported
- Covers Figma functionality gaps in variables (2025)

### 3. **Developer Alignment (Variables)**
- Figma variables map 1:1 with code token implementation
- Eliminates translation layer for systematic properties
- Supports automated design-to-code workflows

### 4. **System Scalability (Variables)**
- New component variants created by adding variable modes
- Token updates automatically affect all component instances
- Supports design system evolution without component recreation

### 5. **Inspection and Debugging (Variables)**
- Designers can see which tokens are applied to any component
- Easy identification of token usage across designs
- Supports design system governance and compliance

---

## Practical Workflow

### Creating New Components

1. **Define token architecture first**
   ```
   ob.c.{component}.{property}.{variant}
   ```

2. **Identify modable vs interaction properties**
   - **Modable:** size, context, theme, density → Variable Modes
   - **Interaction:** enabled, hover, focus, active → Variants

3. **Create corresponding Figma variables for systematic properties**
   ```
   {component}-{property} with modes: {variant1/variant2/variant3}
   ```

4. **Create variants for interaction states**
   ```
   state=enabled/hover/focus/active
   ```

5. **Build component using hybrid approach**
   - Variable modes for systematic properties
   - Variants for interaction states
   - Every systematic property connected to a variable
   - Variables map to design tokens

6. **Test all combinations**
   - Ensure all variable mode combinations work
   - Validate interaction state variants in prototypes
   - Document supported combinations

### Component Updates

1. **Update design tokens**
2. **Figma variables automatically sync**
3. **All component instances update systematically**
4. **No manual component variant recreation needed**

---

## Migration from Legacy Variants

### For Existing Components

1. **Audit current variant usage**
2. **Map variants to token structure**
3. **Create variables for each token**
4. **Rebuild component using variables**
5. **Deprecate old variant-based component**
6. **Update all instances to variable-based component**

### Timeline and Strategy

- **Phase 1:** New components use variables-only approach
- **Phase 2:** High-priority components migrated to variables
- **Phase 3:** Complete migration from variants to variables
- **Phase 4:** Variant-based components deprecated

---

## Implementation Examples

### Tag Component Example

**Legacy Variant Approach (2017):**
```
tag/size=sm,state=enabled
tag/size=sm,state=hover
tag/size=sm,state=focus
tag/size=md,state=enabled
... (exponential variant combinations)
```

**Modern Hybrid Approach (2025):**
```
Base Component: ob-tag

Variable Modes (systematic properties):
├── size: {tag-size} modes: sm/md/lg
├── context: {tag-context} modes: input_mode/filter_mode  
└── colors: {tag-color-*} → maps to tokens with inversity_normal/flipped

Variants (interaction states):
└── state: enabled/hover/focus/active (for prototyping)
```

### Button Remove Example

**Hybrid Structure:**
```
Base Component: button-remove

Variable Modes:
└── size: {button-remove-size} modes: sm/lg → ob.c.button.remove.size.*

Variables (colors with inversity):
├── color-bg: → ob.c.button.remove.color.bg.enabled.inversity_normal
├── color-bg-flipped: → ob.c.button.remove.color.bg.enabled.inversity_flipped
├── color-fg: → ob.c.button.remove.color.fg.enabled.inversity_normal
└── color-fg-flipped: → ob.c.button.remove.color.fg.enabled.inversity_flipped

Variants (for prototyping):
└── state: enabled/hover/focus/active/disabled
```

**Benefits:**
- **Size changes** via variable modes (systematic, token-mapped)
- **Inversity handled** via separate color variables (not modes)
- **Interaction states** via variants (prototyping support)
- **Best of both worlds** without compromising functionality

---

## Quality Assurance

### Variable Mode Validation Checklist

- [ ] Every systematic property uses a variable mode
- [ ] Variable modes map to design tokens
- [ ] Variable names follow token naming convention
- [ ] All variable mode combinations are tested
- [ ] Modal properties correctly identified (same intent, different attribute)

### Variant Validation Checklist

- [ ] Interaction states use variants for prototyping support
- [ ] Variants work correctly in Figma prototypes
- [ ] Complex animations and transitions function properly
- [ ] Variant naming follows interaction state conventions

### Hybrid System Integration Validation

- [ ] Variables sync with token updates
- [ ] Variants support required prototyping functionality
- [ ] Component instances update automatically (variables)
- [ ] Interaction flows work in prototypes (variants)
- [ ] Developer handoff includes both variable and variant mapping
- [ ] Design system governance tools recognize hybrid usage

---

## Related Documentation

- **Design Tokens:** `../../03-design-tokens/` - Token architecture and naming
- **Component Documentation:** `../../04-components/` - Individual component specs
- **Guidelines:** `../../06-guidelines/` - Variable naming and usage standards
- **Maintainer Workflows:** `../maintainers/` - Token management processes
