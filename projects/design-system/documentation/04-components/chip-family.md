# Chip Family Components
**Version:** 1.0  
**Date:** September 24, 2025  
**Status:** Active Documentation  
**Purpose:** Define the Chip family component architecture and usage patterns

**About this document:** This document explains the Chip family concept in the Oblique Design System, which encompasses three specialized components that work together to address different interface needs while maintaining visual and functional consistency.

**Scope:** Component family relationships, usage differentiation, and implementation guidelines for Tag, Badge, and Pill components.

---

## What is the Chip Family?

The **Chip family** in the Oblique Design System consists of three specialized components that share similar visual DNA but serve distinct functional purposes. This family approach ensures consistency while providing the right tool for each specific use case.

### Family Components Overview

| Component | Primary Purpose | Key Characteristics | Main Use Cases |
|-----------|----------------|-------------------|----------------|
| **Tag** | Interactive form categorization | Removable, form-focused, interactive | Multi-value input, filtering interfaces |
| **Badge** | Status/notification indication | Non-removable, status-focused, minimal | Counts, statuses, small labels |
| **Pill** | Decorative/informational labels | Non-interactive, content-focused, descriptive | Categories, metadata, read-only labels |

---

## Component Differentiation

### 1. Tag Component (Interactive)
**Purpose**: Interactive form categorization and filtering

**Key Features:**
- **Removable functionality** with close button
- **Size variants**: sm/md/lg for different form contexts  
- **Two modes**: `input_mode` and `filter_mode`
- **Interactive states**: enabled, hover, focus, pressed, disabled
- **Form integration**: Works within input fields and form controls

**When to use:**
- Multi-value input fields (keywords, skills, categories)
- Filtering interfaces with selected/unselected states
- Any scenario where users need to add/remove items

```typescript
// Form input context
<ob-tag mode="input_mode" removable="true">JavaScript</ob-tag>

// Filtering context  
<ob-tag mode="filter_mode" size="md" selected="true">Development</ob-tag>
```

### 2. Badge Component (Status/Notification)
**Purpose**: Status and notification indication

**Key Features:**
- **Non-removable** status indicators
- **Minimal design** for subtle information display
- **Size variants**: sm/lg for different emphasis levels
- **Status colors** aligned with semantic color system
- **Notification counts** and status labels

**When to use:**
- Notification counters (unread messages, alerts)
- Status indicators (online/offline, active/inactive)  
- Small informational labels that don't require interaction
- System-generated status information

```typescript
// Notification badge
<ob-badge size="sm" variant="attention">3</ob-badge>

// Status indicator
<ob-badge size="lg" variant="success">Active</ob-badge>
```

### 3. Pill Component (Decorative/Informational)
**Purpose**: Decorative and informational content labels

**Key Features:**
- **Optionally interactive** content display
- **Descriptive labels** for categorization and metadata
- **Visual emphasis** for content organization
- **Informational display** with optional navigation/details
- **Colorful variants** for visual differentiation

**When to use:**
- Content categories (article topics, product types)
- Metadata display (tags, labels, classifications)
- Status displays that can be clicked for details or filtering
- Visual content organization with optional interaction
- Decorative elements that may provide additional context when clicked

```typescript
// Content categories (non-interactive)
<ob-pill variant="primary">Technology</ob-pill>
<ob-pill variant="secondary">Frontend</ob-pill>

// Interactive status pills (clickable for details)
<ob-pill variant="success" (click)="showTicketDetails('resolved')">Resolved</ob-pill>
<ob-pill variant="attention" (click)="filterByStatus('pending')">Pending</ob-pill>

// Metadata display
<ob-pill variant="neutral">Published</ob-pill>
```

---

## Design Principles

### Shared Visual DNA
All Chip family components share:
- **Rounded corner treatment** for friendly, approachable feel
- **Consistent typography** scaling across size variants
- **Similar padding and spacing** patterns
- **Cohesive color palette** integration

### Functional Differentiation
Each component has distinct interaction patterns:
- **Tag**: Interactive, removable, form-focused
- **Badge**: Minimal, status-focused, system-generated  
- **Pill**: Informational, optionally interactive, content-focused

### Accessibility Consistency
- **Keyboard navigation** support where appropriate
- **Screen reader compatibility** with proper ARIA labels
- **Color contrast compliance** across all variants
- **Focus management** for interactive components

---

## Usage Guidelines

### Choosing the Right Component

**Use Tag when:**
- Users need to add/remove items interactively
- Building multi-value form inputs
- Creating filtering interfaces with selected/unselected states
- Form categorization is required

**Use Badge when:**
- Displaying system-generated status information
- Showing notification counts or alerts
- Indicating state changes (online/offline, active/inactive)
- Minimal status indicators are needed

**Use Pill when:**
- Labeling content categories or topics
- Displaying metadata or classification information
- Showing status information that users might want to explore (click for details)
- Visual content organization with optional interaction
- Status displays in ticketing systems, dashboards, or similar applications
- Decorative emphasis is the primary goal, with optional functionality

### Common Patterns

#### Multi-Component Usage
```typescript
// Article with multiple chip types
<article>
  <header>
    <h2>Design System Article</h2>
    
    <!-- Content categories (Pill) -->
    <div class="categories">
      <ob-pill variant="primary">Design Systems</ob-pill>
      <ob-pill variant="secondary">Frontend</ob-pill>
    </div>
    
    <!-- Status indicator (Badge) -->
    <ob-badge variant="success">Published</ob-badge>
  </header>
  
  <!-- User filtering interface (Tag) -->
  <div class="filters" role="group" aria-label="Content filters">
    <ob-tag mode="filter_mode" selected="true">Design</ob-tag>
    <ob-tag mode="filter_mode" selected="false">Development</ob-tag>
  </div>
</article>

// Ticketing system with interactive status pills
<div class="ticket-list">
  <div class="ticket">
    <span class="ticket-id">#12345</span>
    <span class="ticket-title">Login Issue</span>
    
    <!-- Interactive status pill - click to see details or filter -->
    <ob-pill variant="success" (click)="showTicketDetails('resolved')" 
             role="button" tabindex="0">
      Resolved
    </ob-pill>
  </div>
  
  <div class="ticket">
    <span class="ticket-id">#12346</span>
    <span class="ticket-title">Feature Request</span>
    
    <!-- Interactive status pill -->
    <ob-pill variant="attention" (click)="filterByStatus('in-progress')"
             role="button" tabindex="0">
      In Progress
    </ob-pill>
  </div>
</div>
```

#### Form Integration
```typescript
// Multi-value input with tags
<ob-input-text placeholder="Add skills...">
  <ob-tag mode="input_mode" removable="true">React</ob-tag>
  <ob-tag mode="input_mode" removable="true">TypeScript</ob-tag>
</ob-input-text>

// Status display with badge
<div class="user-profile">
  <span>John Doe</span>
  <ob-badge size="sm" variant="success">Online</ob-badge>
</div>
```

---

## Implementation Architecture

### Token Integration
Each component uses consistent token patterns:
- **Sizing tokens**: Shared scale across family (`stretchy`, `spacious`, `hefty`)
- **Color tokens**: Semantic color integration
- **Typography tokens**: Consistent text scaling
- **Spacing tokens**: Harmonious padding and margins

### Component Relationships
```
Chip Family
├── Tag Component (Interactive)
│   ├── input_mode (form integration)
│   └── filter_mode (selection interface)
├── Badge Component (Status)
│   ├── Notification variants
│   └── Status indicators
└── Pill Component (Decorative)
    ├── Content categories
    └── Metadata labels
```

---

## Migration and Compatibility

### From Generic "Chip" Usage
If migrating from generic chip implementations:

1. **Interactive chips** → Use `Tag` component
2. **Status chips** → Use `Badge` component  
3. **Label chips** → Use `Pill` component

### Component Selection Decision Tree
1. **Does it need to be removable?** → Use Tag
2. **Is it system-generated status information?** → Use Badge
3. **Is it informational/decorative (with optional interaction)?** → Use Pill

### Interaction Guidelines for Pills
When making Pills interactive:
- **Add proper ARIA roles** (`role="button"` for clickable pills)
- **Ensure keyboard accessibility** (`tabindex="0"` and keyboard event handlers)
- **Provide clear interaction feedback** (hover, focus, active states)
- **Consider the interaction purpose**:
  - **Navigation**: Click to go to related content or details
  - **Filtering**: Click to filter by that status/category
  - **Details**: Click to show more information in a modal or panel

---

## Related Documentation

- [Tag Component](./03-tag/) - Interactive form categorization
- [Badge Component](./01-badge/) - Status and notification indication  
- [Pill Component](./02-pill/) - Decorative and informational labels
- [Component Tokens](../03-design-tokens/component-tokens.md) - Token architecture
- [Semantic Colors](../03-design-tokens/colors/colors-semantic-status.md) - Color system integration

---

**Maintenance**: This documentation is maintained by the Design System team. Updates should reflect changes in component functionality or usage patterns.

**Last Updated**: September 24, 2025 by Design System Documentation