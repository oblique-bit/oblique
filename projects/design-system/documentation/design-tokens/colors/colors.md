# Color Tokens

**About this document:** This document introduces the color system within the design token architecture of the Oblique Design System.

**Scope:** Token fundamentals, semantic layer architecture, and navigation to specialized color documentation.

**Technical Context:** This documentation reflects the current implementation state of the design token architecture. It serves as a development reference and is not intended as a standalone design guide. Token naming, structure, and relationships may undergo architectural improvements. For production implementation, always reference the most current token files and validate token resolution behavior.

---

**Navigation to Color Topics:**
- [Semantic Color Architecture](colors-semantic.md) - Layer system, token resolution, and consumption patterns
- [Status Colors](colors-semantic-status.md) - Success, warning, error, info states
- [Interaction Colors](colors-semantic-interaction.md) - Hover, active, visited, disabled states  
- [Brand Colors](colors-semantic-brand.md) - Federal identity and brand implementation
- [Neutral Colors](colors-semantic-neutral.md) - Backgrounds, text, borders, surfaces

---

## Introduction

The Oblique Design System provides a structured color system that ensures consistent visual communication across all components and applications. The color token architecture supports user preferences, accessibility requirements, and flexible theming while maintaining clear semantic meaning.

### Color System Benefits
- **Theme adaptation**: Automatic adaptation to light/dark preferences
- **Accessibility compliance**: Built-in WCAG 2.1 AA contrast requirements
- **Consistent relationships**: Meaningful color relationships maintained across themes
- **Component flexibility**: Individual components can control their color behavior

### Color Categories

The color system includes these main categories:

#### Status Colors
Colors that communicate state and system feedback:
- **Success**: Positive actions, completed states, confirmations
- **Warning**: Cautionary states, important notices, attention-required
- **Error**: Failed states, validation errors, critical issues
- **Info**: Neutral information, tips, additional context

[View Status Colors Documentation →](colors-semantic-status.md)

#### Interaction Colors  
Colors that indicate interactive states and user feedback:
- **Hover**: Element interaction feedback
- **Active**: Currently pressed or selected elements
- **Visited**: Previously accessed links and navigational elements
- **Disabled**: Non-interactive or temporarily unavailable elements

[View Interaction Colors Documentation →](colors-semantic-interaction.md)

#### Brand Colors
Federal identity colors for government compliance and brand recognition:
- **Brand**: Primary federal identity color (Bundesrot)
- **Brand applications**: Consistent federal identity across components

[View Brand Colors Documentation →](colors-semantic-brand.md)

#### Neutral Colors
Foundational colors for backgrounds, text, borders, and surfaces:
- **Background levels**: Surface colors from highest to lowest contrast
- **Foreground levels**: Text colors from highest to lowest contrast  
- **Border levels**: Structural separator colors
- **Shadow levels**: Depth and elevation indicators

[View Neutral Colors Documentation →](colors-semantic-neutral.md)

## Token Structure

### Semantic Naming Convention
```
ob.s.color.{category}.{property}.{contrast-level}.{inversity-variation}
```

#### Structure Components
- **`category`**: Color's semantic purpose (neutral, status, interaction, brand)
- **`property`**: Visual property (bg, fg, border, shadow)
- **`contrast-level`**: Relationship to surrounding elements (contrast-highest to contrast-lowest)  
- **`inversity-variation`**: Component-level theming (inversity-normal, inversity-flipped)

### Layer Architecture

The color system operates through multiple semantic layers. For detailed architectural information, see [Semantic Color Architecture](colors-semantic.md).

#### Key Layers Overview
- **Static Layer (s0)**: Theme-independent colors that never change
- **Lightness Layer (s1)**: Theme adaptation based on user preferences  
- **Inversity Layer (s2)**: Component-level theming for design emphasis

**Note**: For complete inversity behavior documentation and technical implementation details, refer to [Semantic Color Architecture](colors-semantic.md).

## Usage Guidelines

### Token Resolution Process
1. **Select semantic category** based on the color's communicative purpose
2. **Choose appropriate property** (bg, fg, border, shadow) for the visual role
3. **Apply contrast level** that creates proper information hierarchy
4. **Specify inversity variation** for component-level theming control

For detailed token resolution examples and technical implementation, see [Semantic Color Architecture](colors-semantic.md).

### Best Practices
- **Use semantic tokens exclusively** - Never reference primitive color values directly in components
- **Respect contrast hierarchies** - Higher contrast levels for more important content
- **Maintain theme neutrality** - Let the system handle light/dark adaptation
- **Test cross-theme behavior** - Verify components work correctly in all themes

### Cross-Category Consumption

Some components may consume tokens from multiple color categories to create complete interactive experiences:

#### Complex Components
- **Form fields**: Neutral structure + interaction feedback + status validation
- **Navigation**: Neutral content + interaction states + brand accents
- **Status panels**: Status communication + neutral content + interaction controls

#### Consumption Patterns

Components consume color tokens based on their semantic role. For detailed component-specific implementation guidelines, refer to the specialized color documentation:

| Component Type | Primary Category | Documentation Reference |
|---------------|------------------|-------------------------|
| **Buttons** | interaction | [Interaction Colors](colors-semantic-interaction.md) |
| **Form inputs** | interaction | [Interaction Colors](colors-semantic-interaction.md) |
| **Typography** | neutral | [Neutral Colors](colors-semantic-neutral.md) |
| **Status indicators** | status | [Status Colors](colors-semantic-status.md) |
| **Branding elements** | brand | [Brand Colors](colors-semantic-brand.md) |

#### Design Consistency
When combining categories, maintain:
- **Visual hierarchy**: Status and interaction colors should not compete with content
- **Accessibility**: All color combinations must meet contrast requirements
- **Theme coherence**: Color relationships should feel harmonious across categories

## Architecture and Implementation

### File Organization
- `src/lib/themes/semantic/color/` - Semantic color definitions by layer
  - `s0-static.json` - Static colors (transparent, brand utilities)
  - `s1-lightness/` - Light and dark theme definitions
  - `s2-inversity/` - Inversity layer definitions
- `documentation/design-tokens/colors/` - Color system documentation
  - Specialized files for each color category and architectural topics

### Token Resolution Flow
```
Component Token → Semantic Token → Primitive Token → CSS Value
```

Each layer adds semantic meaning while maintaining flexibility for theme adaptation and component-specific requirements.

---

## Related Documentation

### Specialized Color Topics
- [Semantic Color Architecture](colors-semantic.md) - Technical architecture and layer system
- [Status Colors](colors-semantic-status.md) - Success, warning, error, info implementation
- [Interaction Colors](colors-semantic-interaction.md) - Hover, active, visited, disabled states
- [Brand Colors](colors-semantic-brand.md) - Federal identity and brand guidelines
- [Neutral Colors](colors-semantic-neutral.md) - Backgrounds, text, borders, surfaces

### Token System Documentation
- [Token Consumption Guidelines](../guidelines-token-consumption.md) - Implementation patterns
- [Guidelines for Designers](../guidelines-for-designers.md) - Design application principles

---

*Last updated: August 21, 2025 - Restructured as introduction and navigation hub with specialized file references*
