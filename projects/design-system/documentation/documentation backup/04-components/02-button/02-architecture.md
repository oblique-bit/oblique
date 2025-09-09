# Button Component Architecture
## Component Structure and Design Decisions

### Component Overview

The Button component provides interactive elements for user actions across the oblique design system. It consists of three specialized subcomponents designed for different use cases and interaction patterns.

### Component Structure

```
Button
├── button.text_icons    # Standard button with text and optional icons
├── button.icon_only     # Icon-only button (circular constraint)
└── button.remove        # Removal action button (square constraint)
```

### Subcomponent Specifications

#### button.text_icons
**Purpose**: Primary button for most user interactions  
**Content**: Text label with optional leading/trailing icons  
**Sizing**: Height-driven with flexible width  
**Use Cases**: Form submission, navigation, primary actions

#### button.icon_only  
**Purpose**: Icon-based actions where space is constrained  
**Content**: Single icon with tooltip support  
**Sizing**: Circular constraint (width = height)  
**Use Cases**: Toolbar actions, navigation, secondary controls

#### button.remove
**Purpose**: Specialized removal/deletion actions  
**Content**: Close/X icon with removal semantics  
**Sizing**: Square constraint (width = height)  
**Use Cases**: Tag removal, dismissible elements, delete actions

### Design Decisions

#### Why Separate Remove Subcomponent?

Remove buttons require specialized characteristics that differentiate them from generic icon buttons:

**Semantic Specialization**:
- Destructive action semantics
- Specialized ARIA roles and accessibility patterns
- Context-aware keyboard support (Delete/Backspace keys)

**Visual Requirements**:
- **Square proportions** for visual balance within parent components
- Consistent positioning at trailing edge of dismissible elements
- Specialized hover/focus states for destructive actions

**Integration Patterns**:
- Size inheritance from parent components (tags, chips, cards)
- Context-aware token application through three-dimensional architecture
- Seamless composition within dismissible component patterns

*Research validation: Industry analysis of 8 major design systems confirms remove functionality as specialized subcomponents rather than generic icon buttons.*

#### Why Square vs Circular Constraints?

**`button.remove` - Square Constraint**:
- **Visual Balance**: Square proportions provide better integration within rectangular parent components (tags, chips)
- **Industry Standard**: Universal pattern across Material-UI, Ant Design, Adobe Spectrum, and Apple HIG
- **Touch Target Consistency**: Maintains accessibility standards while fitting component boundaries

**`button.icon_only` - Circular Constraint**:  
- **Action Neutrality**: Circular shape signals general-purpose interactive element
- **Spatial Efficiency**: Circular buttons pack efficiently in toolbars and navigation areas
- **Visual Hierarchy**: Distinguishes general actions from specialized removal actions

#### Token Architecture Integration

The button component leverages oblique's three-dimensional token architecture:

**Dimensional Structure**:
- **Viewport Dimension**: Touch-friendly size forcing for accessibility
- **Size Dimension**: sm/md/lg variants for different contexts  
- **Component Dimension**: Specialized tokens for each subcomponent

**Size Inheritance Example**:
```
// Parent component determines context
ob.c.tag.size.md → triggers button.remove size context

// Three-dimensional token resolution
ob.c.tag.size.md.button.remove.width: 20px
ob.c.tag.size.md.button.remove.height: 20px (square constraint)
```

**Component Boundary Management**:
- Size context flows from parent components (tag, chip, card)
- Subcomponent tokens respect parent size semantics
- Proportional constraints maintained across all size variants

### Implementation Principles

#### Composition Over Configuration
```jsx
// Preferred: Clear component composition
<Tag size="md" removable>
  <Tag.Content>Sample Tag</Tag.Content>
  <Tag.Remove onRemove={handleRemove} />
</Tag>

// Avoided: Configuration-heavy single component  
<Button variant="remove" size="md" parent="tag" />
```

#### Context-Aware Sizing
- Subcomponents inherit size context from parent components
- No manual size coordination required between parent and child
- Three-dimensional tokens ensure consistent relationships

#### Accessibility-First Design
- Specialized ARIA roles for different subcomponent purposes
- Keyboard interaction patterns appropriate to action type
- Focus management that respects component composition

### Size Variants and Constraints

#### Standard Sizing (button.text_icons)
- **Height-driven** sizing with flexible width
- Padding-based size variants (sm: 32px, md: 40px, lg: 48px height)
- Icon and text scale proportionally with size

#### Proportional Constraints (button.icon_only, button.remove)
- **Square proportions** maintained across all size variants
- Height = Width for consistent geometric relationships
- Touch target accessibility preserved in all sizes

### Token Organization

#### Hierarchical Token Structure
```
ob.c.button.{subcomponent}.{property}.{size}

Examples:
ob.c.button.text_icons.padding.horizontal.md: 24px
ob.c.button.icon_only.dimension.md: 40px  
ob.c.button.remove.dimension.sm: 32px
```

#### Context Integration
```
// Parent component context
ob.c.tag.size.md → 40px height context

// Child component adaptation  
ob.c.tag.size.md.button.remove.dimension: 32px (proportional scaling)
```

---

**Implementation Details**: See [Button Implementation Guide](02-implementation.md)  
**Usage Guidelines**: See [Button Usage Guidelines](04-guidelines.md)  
**Research Evidence**: See [Remove Button Research](_research/competitive-analysis/2025-09-09_remove-button-industry-analysis.md)
