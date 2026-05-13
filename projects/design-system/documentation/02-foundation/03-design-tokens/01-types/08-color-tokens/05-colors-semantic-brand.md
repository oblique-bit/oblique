# Brand Colors Documentation

**About this document:** This document defines brand colors within the Oblique Design System 03_semantic color architecture.

**Scope:** Static brand identity tokens that maintain consistent federal visual identity across all themes and contexts.

---

## Brand Color Architecture

Brand colors maintain consistent visual identity across all themes and contexts. They are static values that never change, ensuring brand recognition regardless of user preferences or theme modes.

### Brand Token Structure
```
ob.s.color.brand` references `{ob.p.color.basic.bundesrot}` (Swiss federal red)
- **Static Behavior**: Never changes with light/dark themes or other variations  
- **Usage**: Brand elements, logos, primary brand touches, selected states

### Usage Examples
```json
{
  "brand": {
    "$type": "color",
    "$value": "{ob.p.color.basic.bundesrot}",
    "$description": "Static color to be used in the brand relevant UI elements."
  }
}
```

## Component Applications

### Logo Elements
- **Federal logos**: Always use brand color for consistent identity
- **Brand marks**: Key brand moments that must maintain federal visual identity
- **Government seals**: Official elements requiring consistent recognition

### Selection Indicators
```json
{
  "ob.s.color.interaction.state.bg.selected.inversity_normal": {
    "$type": "color",
    "$value": "{ob.s2.color.interaction.state.bg.selected.inversity_normal}"
  }
}
```
- **Navigation states**: Main navigation, navigation tree, tabs
- **Active selections**: Currently selected items across the interface
- **Brand emphasis**: Strategic brand color placement for recognition

### Header Branding
- **Primary brand accents**: Key brand moments in the interface
- **Federal identity elements**: Components that reinforce government context
- **Brand consistency points**: Touchpoints that maintain visual identity

## Design Rationale

The brand color system uses Swiss federal red (bundesrot) to maintain visual consistency with the federal design system while remaining distinct from interactive elements. This approach ensures:

### Brand Recognition
- **Consistent federal identity** across all applications
- **Government context** clearly established through color
- **Visual hierarchy** that prioritizes brand recognition

### Clear Distinction
- **Brand elements don't compete** with interactive or status colors
- **Semantic clarity** between brand, interaction, and status meanings
- **Cognitive efficiency** through consistent brand color usage

### Theme Independence
- **Brand remains recognizable** in both light and dark themes
- **Static behavior** ensures consistent federal identity
- **User preference independence** maintains brand integrity

## Technical Implementation

### File Location
- **Path**: `src/lib/themes/03_semantic/color/compiled/semantic.json`
- **Layer**: Semantic (ob.s) - static brand color integrated in final compilation
- **References**: `{ob.p.color.basic.bundesrot}` primitive

### Integration Pattern
```json
{
  "ob": {
    "s": {
      "color": {
        "brand": {
          "$type": "color",
          "$value": "{ob.p.color.basic.bundesrot}",
          "$description": "Static color to be used in the brand relevant UI elements."
        }
      }
    }
  }
}
```

### Usage Guidelines
1. **Use sparingly**: Brand color should accent, not dominate
2. **Maintain consistency**: Always reference the 03_semantic token, never primitive directly
3. **Respect hierarchy**: Brand color shouldn't compete with status or critical interactions
4. **Federal context**: Appropriate for government applications and federal identity

## Accessibility Considerations

### Contrast Requirements
- **Brand on neutral backgrounds**: Meets WCAG 2.1 AA contrast requirements
- **Text applications**: Ensure sufficient contrast when used for text elements
- **Icon visibility**: Brand icons maintain readability across theme modes

### Color Dependencies
- **Independent behavior**: Brand color doesn't rely on theme variations
- **Predictable appearance**: Always appears the same regardless of user settings
- **Accessibility support**: Works consistently with screen readers and accessibility tools

## Related Documentation

- Color Tokens Overview - Complete color system introduction
- Semantic Colors Architecture - Layer system and static colors
- Interaction Colors - How brand integrates with selection states
- Token Consumption Guidelines - Implementation rules

---

*Last updated: August 21, 2025 - Created dedicated brand colors documentation with federal design system integration*
