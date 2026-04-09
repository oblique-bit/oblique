# Color Tokens

**About this document:** This document introduces the color system within the design token architecture of the Oblique Design System.

**Scope:** Token fundamentals, [semantic layer architecture](03-colors-semantic.md), and navigation to specialized color documentation.

**Technical Context:** This documentation reflects the current implementation state of the design token architecture. It serves as a development reference and is not intended as a standalone design guide. Token naming, structure, and relationships may undergo architectural improvements. For production implementation, always reference the most current token files and validate token resolution behavior.

---

**Navigation to Color Topics:**
- [**Primitive Colors**](01-colors-primitive.md) - Foundation color values and token architecture
- [**Primitive Color Consumption**](02-colors-primitive-consumption.md) - Which primitive colors are available for decorative usage
- [**Semantic Colors**](03-colors-semantic.md) - Layer system, token resolution, and consumption patterns
  - [**Brand Colors**](05-colors-semantic-brand.md) - Federal identity and brand implementation
  - [**Neutral Colors**](04-colors-semantic-neutral.md) - Backgrounds, text, borders, surfaces
  - [**Interaction Colors**](06-colors-semantic-interaction.md) - Hover, active, visited, disabled states  
  - [**Status Colors**](07-colors-semantic-status.md) - Success, warning, error, info states

---

## Introduction

The Oblique Design System provides a structured color system that ensures consistent visual communication across all components and applications. The color token architecture supports user preferences and accessibility requirements, while maintaining clear semantic meaning.

### Color System Benefits
- **Theme adaptation**: Automatic adaptation to light/dark preferences
- **Accessibility compliance**: Built-in WCAG 2.1 AA contrast requirements
- **Consistent relationships**: Meaningful color relationships maintained across themes
- **Component flexibility**: Individual components can control their color behavior

### Color Categories

The color system includes these main categories:

#### Brand Colors
Federal identity colors for government compliance and brand recognition:
- **Brand**: Primary federal identity color (Bundesrot)
- **Brand applications**: Consistent federal identity across components

[View Brand Colors Documentation →](05-colors-semantic-brand.md)

#### Neutral Colors
Foundational colors for backgrounds, text, borders, and surfaces:
- **Background levels**: Surface colors from highest to lowest contrast
- **Foreground levels**: Text colors from highest to lowest contrast  
- **Border levels**: Structural separator colors
- **Shadow levels**: Depth and elevation indicators

[View Neutral Colors Documentation →](04-colors-semantic-neutral.md)

#### Interaction Colors  
Colors that indicate interactive states and user feedback:
- **Hover**: Element interaction feedback
- **Active**: Currently pressed or selected elements
- **Visited**: Previously accessed links and navigational elements
- **Disabled**: Non-interactive or temporarily unavailable elements

[View Interaction Colors Documentation →](06-colors-semantic-interaction.md)

#### Status Colors
Colors that communicate state and system feedback:
- **Success**: Positive actions, completed states, confirmations
- **Warning**: Cautionary states, important notices, attention-required
- **Error**: Failed states, validation errors, critical issues
- **Info**: Neutral information, tips, additional context

[View Status Colors Documentation →](07-colors-semantic-status.md)

## Token Structure

### Semantic Naming Convention
```
ob.s3.{category}.{property}.{contrast_level}.{inversity_variation}
```

#### Structure Components
- **`category`**: Color's semantic purpose (neutral, status, interaction, brand)
- **`property`**: Visual property (bg, fg, border, shadow)
- **`contrast_level`**: Relationship to surrounding elements (contrast_highest to contrast_lowest)
- **`inversity_variation`**: Component-level theming (inversity_normal, inversity_flipped)

### Layer Architecture

The color system operates through multiple semantic layers. For detailed architectural information, see [Semantic Color Architecture](03-colors-semantic.md).

#### Key Layers Overview
- **Lightness Semantic Level (S1)**: Lightness mode adaptation (light/dark theme modes)
- **Emphasis Semantic Level (S2)**: Interaction emphasis modes (high/low emphasis variations for interactive components)
- **Semantic Compilation (S3)**: Complete semantic color compilation including static colors

**Note**: Inversity (normal/flipped) is a **flat property** available on most tokens, not a separate layer or mode. Components simply choose between `inversity_normal` and `inversity_flipped` variants as needed. For complete documentation, refer to [Semantic Color Architecture](03-colors-semantic.md).

## Cross-Category Consumption

Some components may consume tokens from multiple color categories to create complete interactive experiences:

#### Complex Components
- **Form fields**: Neutral structure + interaction feedback + status validation
- **Navigation**: Neutral content + interaction states + brand accents
- **Status panels**: Status communication + neutral content + interaction controls

#### Consumption Patterns

Components consume color tokens based on their semantic role. For detailed component-specific implementation guidelines, refer to the specialized color documentation:

| Component Type | Primary Category | Documentation Reference |
|---------------|------------------|-------------------------|
| **Branding elements** | brand | [Brand Colors](05-colors-semantic-brand.md) |
| **Typography** | neutral | [Neutral Colors](04-colors-semantic-neutral.md) |
| **Buttons** | interaction | [Interaction Colors](06-colors-semantic-interaction.md) |
| **Form inputs** | interaction + status | [Interaction Colors](06-colors-semantic-interaction.md) + [Status Colors](07-colors-semantic-status.md) |
| **Status indicators** | status | [Status Colors](07-colors-semantic-status.md) |

#### Design Consistency
When combining categories, maintain:
- **Visual hierarchy**: Status and interaction colors should not compete with content
- **Accessibility**: All color combinations must meet contrast requirements


## Architecture and Implementation

### File Organization
- `src/lib/themes/03_semantic/color/` - Semantic color definitions by layer
  - `s1-lightness/` - Light and dark theme definitions
  - `s2-emphasis/` - High and low emphasis variations
  - `s3-semantic/` - Complete semantic color compilation
- `documentation/design-tokens/colors/` - Color system documentation
  - Specialized files for each color category and architectural topics

### Token Resolution Flow
```
Component Token → Semantic Token → Primitive Token → CSS Value
```

Each layer adds semantic meaning while maintaining flexibility for theme adaptation and component-specific requirements.

---

## Advanced Usage Guidelines

**Target Audience**: This section is specifically intended for:
- **System Designers** creating new components for the design system
- **Product Designers** who have thoroughly explored and exhausted all possibilities in existing semantic colors and components

**Prerequisites**: Before using these guidelines, ensure you have:
1. Reviewed all existing components for suitable color solutions
2. Explored all relevant semantic color categories (neutral, status, interaction, brand)
3. Confirmed that no existing color tokens meet your requirements

### Token Selection Process
1. **Select 03_semantic category** based on the color's communicative purpose
2. **Choose appropriate property** (bg, fg, border, shadow) for the semantic role
3. **Apply contrast level** that creates proper information hierarchy
4. **Specify inversity variation** for component-level theming control

For detailed token selection examples and technical implementation, see [Semantic Color Architecture](03-colors-semantic.md).

### Standard Practices
- **Use 03_semantic tokens exclusively** - Never reference 02_primitive color values directly in components
- **Respect contrast hierarchies** - Higher contrast levels for more important content
- **Maintain theme neutrality** - Let the system handle light/dark adaptation
- **Test cross-theme behavior** - Verify components work correctly in all themes

### Decorative vs Semantic Color Usage

**Design System Philosophy**: The Oblique Design System **primarily emphasizes semantic color usage** to ensure clear communication and accessibility. However, we do not exclude decorative color usage when it serves to provide additional context or enhance understanding.

**⚠️ Primitive Color Selection Warning**: Picking colors directly from primitive tokens is a **high-risk approach** that should only be done with extreme caution and strict adherence to the established color usage rules. Most color needs are already addressed through semantic tokens and components - always exhaust these options first.

**Validation Required**: Before using any primitive colors, consult the [Primitive Color Consumption Table](colors-primitive-consumption.md) to verify which colors are available for decorative usage and which are reserved for semantic roles.

**Primary Approach: Semantic/Interactive Usage**

Always prioritize semantic and interactive color usage, which communicates meaning and enables functionality:

- **Content Structure**: Background colors on cards, banners, sections that help users understand content grouping and information architecture - *Use existing Semantic/Neutral background tokens*
- **Status Communication**: Error states, success messages, warning indicators
- **Interaction States**: Hover, focus, active, disabled states
- **System Feedback**: Progress indicators, loading states, validation feedback
- **Functional Elements**: Links, buttons, form controls with interactive meaning

**Secondary Approach: Decorative Usage (Use Sparingly)**

**What is Decoration?** Decoration refers to visual elements that support user understanding and context **without carrying semantic meaning or triggering interactions**. Decorative elements enhance aesthetics, create visual hierarchy, and improve user comprehension but do not communicate system states, statuses, or interactive capabilities.

**Key Principle**: Semantic colors are essential for proper system comprehension and interaction, while decorative colors should be **visually supportive but functionally neutral** - users should be able to understand and use the interface effectively even if all decorative colors were removed.

**Decorative Usage Examples (When Semantic Options Are Exhausted):**
- **Aesthetic Enhancement**: Color accents in photography, illustrations, and icons that enhance visual appeal without implying functionality - *Note: Order shows increasing criticality based on UI proximity similarity - the simpler the element (fewer colors), the closer it resembles UI semantic elements, making color choice more critical. **Icons**: Only multipurpose icons can be freely colored; single-purpose icons are not available for decorative use as they have reserved semantic meanings*
- **Brand Expression**: Visual elements that reinforce brand identity without functional meaning - *Should only be used within photography*

**Hierarchical Decoration Approach:**

**1st Priority - Non-Color Elements**: 
- **Photography**: Strongly recommended for visual interest and decoration
- **Icon Set**: Use existing design system icons (multipurpose icons) for visual enhancement
- **Typography**: Leverage type hierarchy and weight variations

**2nd Priority - Controlled Color Usage**:
- **Illustrations and Infographics**: Proceed with extreme caution - this is where semantic conflicts most commonly occur
- **Large Colored Surfaces**: Avoid using design system colors for large decorative surfaces. If it is required for content grouping, this does not belong to to the decorative category and must use semantic/neutral colors instead.
- **Decorative Color Elements**: If color decoration is absolutely necessary, use [Stage 4 colors](colors-primitive.md#color-usage-classification-4-stages) (teal, pink) only.

**General Principle**: Avoid using any design system colors outside their defined semantic roles. Color decoration should be minimal and use only non-semantic scales to prevent user confusion and maintain accessibility standards.

**Important**: **Isolated color usage** should **not be used as a primary visual element** for decoration. When a single color is used without the context of other colors (unlike photography with multiple hues), it becomes visually prominent and competes with semantic color roles. Since color is already extensively used throughout the UI for semantic communication (status, interaction states, focus indicators), adding isolated decorative color creates visual noise and reduces the effectiveness of semantic color communication. This is why we strongly recommend non-color visual elements (photography, icons, typography) as the primary means of decoration.

---

## Related Documentation

### Specialized Color Topics
- [Semantic Color Architecture](colors-03_semantic.md) - Technical architecture and layer system
- [Brand Colors](colors-03_semantic-brand.md) - Federal identity and brand guidelines
- [Neutral Colors](colors-03_semantic-neutral.md) - Backgrounds, text, borders, surfaces
- [Interaction Colors](colors-03_semantic-interaction.md) - Hover, active, visited, disabled states
- [Status Colors](colors-03_semantic-status.md) - Success, warning, error, info implementation

### Token System Documentation
- [Token Consumption Guidelines](../guidelines-token-consumption.md) - Implementation patterns
- [Guidelines for Designers](../guidelines-for-designers.md) - Design application principles

---

*Last updated: August 21, 2025 - Restructured as introduction and navigation hub with specialized file references*
