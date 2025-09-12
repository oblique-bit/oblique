# Tag Implementation Guide

## Installation & Setup

### Package Installation
```bash
npm install @oblique/oblique-design-system
```

### Import Components
```typescript
import { ObTagComponent } from '@oblique/oblique';
import { ObIconComponent } from '@oblique/oblique';
```

## Basic Implementation

### Minimal Example
```typescript
<ob-tag>Development</ob-tag>
```

### With Properties
```typescript
<ob-tag 
  size="md"
  removable="true"
  (removed)="onTagRemoved($event)">
  Frontend
</ob-tag>
```

## Component API

### ObTag Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'input_mode' \| 'filter_mode'` | `'filter_mode'` | Component mode determining interaction behavior |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant (locked inheritance for input_mode) |
| `active` | `boolean` | `false` | Shows active/selected state (filter_mode only) |
| `disabled` | `boolean` | `false` | Disables interaction and shows disabled state |

**Note**: 
- `input_mode` automatically shows remove button, size locked to parent
- `filter_mode` enables active state, size controllable by designer
- `removable` prop is deprecated in favor of mode-based behavior

### Events

| Event | Type | Mode | Description |
|-------|------|------|-------------|
| `(removed)` | `TagRemovedEvent` | `input_mode` | Emitted when tag is removed via button |
| `(toggled)` | `TagToggleEvent` | `filter_mode` | Emitted when tag selection changes |
| `(clicked)` | `TagClickedEvent` | Both | Emitted when tag body is clicked |

## Advanced Usage

### Component Modes
```typescript
// tag.input_mode - locked size inheritance
<ob-tag mode="input_mode">TypeScript</ob-tag>    // Size inherited from parent
<ob-tag mode="input_mode">React</ob-tag>         // Cannot override size
<ob-tag mode="input_mode">JavaScript</ob-tag>    // Remove button automatic

// tag.filter_mode - designer-controlled sizing  
<ob-tag mode="filter_mode" size="sm" active="false">Development</ob-tag>
<ob-tag mode="filter_mode" size="md" active="true">Design</ob-tag>         // Default md
<ob-tag mode="filter_mode" size="lg" active="false">Frontend</ob-tag>
```

### Icon Integration
```typescript
<!-- Icon-only tag -->
<ob-tag size="md" removable="true">
  <ob-icon>category</ob-icon>
</ob-tag>

<!-- Icon with text -->
<ob-tag size="md" removable="true">
  <ob-icon>code</ob-icon>
  Frontend Development
</ob-tag>

<!-- Multiple tags with consistent icon sizing -->
<ob-tag size="sm" removable="true">
  <ob-icon>language</ob-icon>
  JavaScript
</ob-tag>
<ob-tag size="sm" removable="true">
  <ob-icon>framework</ob-icon>
  React
</ob-tag>
```

### State Management
```typescript
// tag.input_mode - removal-based state (size inheritance)
export class InputModeTagComponent {
  skills: string[] = ['JavaScript', 'TypeScript', 'React'];
  
  onTagRemoved(skill: string): void {
    this.skills = this.skills.filter(s => s !== skill);
  }
}

// tag.filter_mode - selection-based state (designer size control)
export class FilterModeTagComponent {
  availableFilters = ['Development', 'Design', 'Marketing'];
  activeFilters: Set<string> = new Set(['Development']);
  filterSize: 'sm' | 'md' | 'lg' = 'md'; // Designer controlled
  
  onTagToggled(filter: string): void {
    if (this.activeFilters.has(filter)) {
      this.activeFilters.delete(filter);
    } else {
      this.activeFilters.add(filter);
    }
    this.applyFilters();
  }
  
  isFilterActive(filter: string): boolean {
    return this.activeFilters.has(filter);
  }
}
```

### Event Handling
```typescript
// tag.input_mode Template (size inherited automatically)
<ob-input-text [size]="inputSize">
  <ob-tag 
    *ngFor="let skill of skills"
    mode="input_mode"
    (removed)="removeSkill(skill)">
    {{ skill }}
  </ob-tag>
</ob-input-text>

// tag.filter_mode Template (designer controls size)
<ob-tag 
  *ngFor="let filter of availableFilters"
  mode="filter_mode"
  [size]="filterSize"
  [active]="isFilterActive(filter)"
  (toggled)="toggleFilter(filter)">
  {{ filter }}
</ob-tag>

// Component Methods
removeSkill(skill: string): void {
  const index = this.skills.indexOf(skill);
  if (index >= 0) {
    this.skills.splice(index, 1);
    // Announce removal for screen readers
    this.announceSkillRemoval(skill);
  }
}

toggleFilter(filter: string): void {
  this.activeFilters.has(filter) 
    ? this.activeFilters.delete(filter)
    : this.activeFilters.add(filter);
  this.applyFilters();
}
```

## Token Integration

### Available CSS Custom Properties
```css
/* Tag sizing tokens */
--ob-c-tag-surface-min-height-sm: var(--ob-s-size-stretchy);    /* 24px */
--ob-c-tag-surface-min-height-md: var(--ob-s-size-spacious);    /* 32px */
--ob-c-tag-surface-min-height-lg: var(--ob-s-size-hefty);       /* 40px */

/* Typography scaling */
--ob-c-tag-typography-size-sm: var(--ob-s-typography-type-scale-xs-normal);
--ob-c-tag-typography-size-md: var(--ob-s-typography-type-scale-sm-normal);
--ob-c-tag-typography-size-lg: var(--ob-s-typography-type-scale-md-normal);

/* Spacing coordination */
--ob-c-tag-spacing-padding-horizontal-sm: var(--ob-s-spacing-md);
--ob-c-tag-spacing-padding-horizontal-md: var(--ob-s-spacing-lg);
--ob-c-tag-spacing-padding-horizontal-lg: var(--ob-s-spacing-2xl);

/* Focus ring management for accessibility */
--ob-c-tag-focus-ring-color-enabled: var(--ob-s3-color-interaction-focus-ring-inversity-normal);
--ob-c-tag-focus-ring-color-active: var(--ob-s3-color-interaction-focus-ring-inversity-flipped);
--ob-c-tag-focus-ring-width: var(--ob-s-border-width-focus);
--ob-c-tag-focus-ring-offset: var(--ob-s-spacing-focus-offset);

/* Remove button focus (form input variant) */
--ob-c-tag-remove-button-focus-ring-color: var(--ob-s3-color-interaction-focus-ring-inversity-normal);
--ob-c-tag-remove-button-focus-ring-width: var(--ob-s-border-width-focus);
```

### Custom Styling Override
```typescript
// Form input tag with enhanced remove button focus
@Component({
  selector: 'app-form-tags',
  template: `
    <ob-tag removable="true">Skill</ob-tag>
  `,
  styles: [`
    ob-tag {
      /* Enhanced remove button visibility */
      --ob-c-tag-remove-button-focus-ring-width: 3px;
      --ob-c-tag-remove-button-focus-ring-offset: 2px;
    }
  `]
})
export class FormTagsComponent {}

// Filtering tags with custom active state
@Component({
  selector: 'app-filter-tags',
  template: `
    <ob-tag [active]="true">Filter</ob-tag>
  `,
  styles: [`
    ob-tag {
      /* Custom active state emphasis */
      --ob-c-tag-focus-ring-color-active: var(--ob-s3-color-accent-fg-contrast-high-inversity-flipped);
    }
  `]
})
export class FilterTagsComponent {}
```

### Theme Integration
```typescript
// Responsive tag sizing
<ob-tag 
  [size]="breakpointService.isSmall ? 'sm' : 'md'"
  removable="true">
  Responsive Tag
</ob-tag>

// Theme-aware styling
<div class="tag-container" [attr.data-theme]="currentTheme">
  <ob-tag size="md" removable="true">Theme Tag</ob-tag>
</div>
```

## Accessibility Implementation

### ARIA Attributes
The component automatically includes mode-appropriate accessibility features:

**tag.input_mode**:
- `role="listitem"` for individual tags within tag containers
- `aria-label="Remove [tag name]"` for remove buttons  
- `tabindex="-1"` on tag body (non-interactive)
- `tabindex="0"` on remove button (interactive element)

**tag.filter_mode**:
- `role="button"` for interactive tag selection
- `aria-pressed="true/false"` indicating selection state
- `tabindex="0"` on entire tag surface (interactive element)
- `aria-describedby` connecting to filter instructions

### Keyboard Navigation
| Key | Mode | Target | Action |
|-----|------|--------|--------|
| `Tab` | `input_mode` | Remove button | Navigate to remove button |
| `Tab` | `filter_mode` | Tag body | Navigate between selectable tags |
| `Enter` | `input_mode` | Remove button | Remove tag |
| `Enter` | `filter_mode` | Tag body | Toggle active state |
| `Space` | `filter_mode` | Tag body | Toggle active state |
| `Backspace` | `input_mode` | Input field | Remove last tag when focus is on input |
| `Escape` | Both modes | Parent container | Return focus to parent |

### Screen Reader Support
```typescript
// Form Input - Focus on remove button with scannable indicators
@Component({
  template: `
    <div aria-live="polite" aria-atomic="false" class="sr-only">
      {{ announceMessage }}
    </div>
    <div role="list" aria-label="Selected skills">
      <ob-tag 
        *ngFor="let skill of skills"
        removable="true"
        role="listitem"
        tabindex="-1"
        [attr.aria-label]="skill + ' skill'">
        
        {{ skill }}
        
        <!-- Remove button is the focusable element -->
        <button 
          type="button"
          class="tag-remove-button"
          [attr.aria-label]="'Remove ' + skill"
          (click)="announceRemoval(skill)">
          <ob-icon>close</ob-icon>
        </button>
      </ob-tag>
    </div>
  `
})
export class AccessibleFormTagComponent {
  announceMessage: string = '';
  
  announceRemoval(skill: string): void {
    this.announceMessage = `Removed skill: ${skill}`;
    setTimeout(() => this.announceMessage = '', 1000);
  }
}

// Filtering - Entire tag is interactive with pressed state
@Component({
  template: `
    <div aria-live="polite" class="sr-only">{{ filterAnnouncement }}</div>
    <div role="group" aria-label="Content filters">
      <ob-tag 
        *ngFor="let filter of filters"
        role="button"
        tabindex="0"
        [active]="isActive(filter)"
        [attr.aria-pressed]="isActive(filter)"
        [attr.aria-label]="getFilterLabel(filter)"
        (toggled)="announceToggle(filter)"
        (keydown.enter)="toggleFilter(filter)"
        (keydown.space)="toggleFilter(filter)">
        {{ filter }}
      </ob-tag>
    </div>
  `
})
export class AccessibleFilterTagComponent {
  filterAnnouncement: string = '';
  
  getFilterLabel(filter: string): string {
    const state = this.isActive(filter) ? 'selected' : 'not selected';
    return `${filter} filter, ${state}`;
  }
  
  announceToggle(filter: string): void {
    const state = this.isActive(filter) ? 'activated' : 'deactivated';
    this.filterAnnouncement = `Filter ${filter} ${state}`;
    setTimeout(() => this.filterAnnouncement = '', 1000);
  }
}
```

## Integration Patterns

### With Input Components
```typescript
// Tag input field integration
<ob-input-text 
  placeholder="Add skills..."
  (keydown.enter)="addTag($event)">
  
  <!-- Existing tags -->
  <ob-tag 
    *ngFor="let tag of skills" 
    size="sm"
    removable="true"
    (removed)="removeSkill(tag)">
    {{ tag }}
  </ob-tag>
</ob-input-text>
```

### With Filtering Interfaces
```typescript
// Filter tag container
<div class="filter-tags" role="group" aria-label="Active filters">
  <ob-tag 
    *ngFor="let filter of activeFilters"
    size="md"
    removable="true"
    [active]="true"
    (removed)="removeFilter(filter)">
    {{ filter.label }}
  </ob-tag>
</div>
```

### Parent Size Context
```typescript
// Automatic size inheritance from parent
<ob-input-text size="sm">
  <!-- Tags automatically inherit 'sm' size -->
  <ob-tag removable="true">Auto-sized</ob-tag>
</ob-input-text>

<ob-filter-container size="lg">
  <!-- Tags automatically inherit 'lg' size -->
  <ob-tag removable="true">Large Tag</ob-tag>
</ob-filter-container>
```

## Performance Considerations

### Bundle Size
- Component size: ~3KB minified + gzipped
- Dependencies: ObIconComponent (inherited from icon_holder)
- Tree-shaking: Full support for unused size variants

### improvement Tips
- **Batch tag operations**: Use trackBy functions for tag lists to improve change detection
- **Virtual scrolling**: For large tag collections (>100 tags), implement virtual scrolling
- **Debounce inputs**: Debounce tag addition/removal in high-frequency scenarios
- **Lazy loading**: Load tag options asynchronously for autocomplete scenarios

### Memory Management
```typescript
// Efficient tag list management
@Component({
  template: `
    <ob-tag 
      *ngFor="let tag of tags; trackBy: trackByTag"
      (removed)="removeTag(tag.id)">
      {{ tag.label }}
    </ob-tag>
  `
})
export class OptimizedTagComponent {
  trackByTag(index: number, tag: TagItem): string {
    return tag.id; // Prevent unnecessary re-renders
  }
}
```

## Testing

### Unit Test Example
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObTagComponent } from '@oblique/oblique';

describe('ObTagComponent', () => {
  let component: ObTagComponent;
  let fixture: ComponentFixture<ObTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ObTagComponent]
    });
    
    fixture = TestBed.createComponent(ObTagComponent);
    component = fixture.componentInstance;
  });

  it('should emit removed event when remove button is clicked', () => {
    component.removable = true;
    spyOn(component.removed, 'emit');
    
    fixture.detectChanges();
    
    const removeButton = fixture.debugElement.query(By.css('[data-testid="tag-remove"]'));
    removeButton.nativeElement.click();
    
    expect(component.removed.emit).toHaveBeenCalled();
  });

  it('should apply correct size class based on size prop', () => {
    component.size = 'lg';
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement).toHaveClass('ob-tag--lg');
  });
});
```

### Integration Test Example
```typescript
describe('Tag Input Integration', () => {
  it('should add and remove tags correctly', async () => {
    const { input, tags } = await setup(`
      <ob-input-text (tagAdded)="onTagAdded($event)">
        <ob-tag 
          *ngFor="let tag of tags" 
          (removed)="removeTag(tag)">
          {{ tag }}
        </ob-tag>
      </ob-input-text>
    `);

    // Add tag
    await user.type(input, 'New Tag{enter}');
    expect(tags).toHaveLength(1);
    expect(screen.getByText('New Tag')).toBeInTheDocument();

    // Remove tag  
    await user.click(screen.getByLabelText('Remove New Tag'));
    expect(tags).toHaveLength(0);
    expect(screen.queryByText('New Tag')).not.toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

**Tags not inheriting parent size**
- **Problem:** Tags display at default size despite parent component size setting
- **Solution:** Ensure parent component implements size context provider or explicitly set tag size

**Remove button accessibility issues**
- **Problem:** Screen readers not announcing tag removal actions
- **Solution:** Implement aria-live region for removal announcements (see accessibility examples above)

**Icon sizing inconsistency**
- **Problem:** Icons appear too large or small relative to tag size
- **Solution:** Verify icon_holder tokens are properly inherited and ob.c.tag.icon.size.* tokens are correctly defined

**Performance issues with many tags**
- **Problem:** Slow rendering with large tag collections
- **Solution:** Implement virtual scrolling and trackBy functions for change detection improvement

### Debugging Tips

```typescript
// Enable tag debug mode in development
@Component({
  template: `
    <ob-tag 
      [debug]="isDevelopment"
      [size]="tagSize">
      Debug Tag
    </ob-tag>
  `
})
export class DebugTagComponent {
  isDevelopment = !environment.production;
  
  // Log token values for debugging
  ngOnInit() {
    if (this.isDevelopment) {
      console.log('Tag tokens:', {
        minHeight: getComputedStyle(document.documentElement)
          .getPropertyValue('--ob-c-tag-surface-min-height-md'),
        typography: getComputedStyle(document.documentElement)
          .getPropertyValue('--ob-c-tag-typography-size-md')
      });
    }
  }
}
```

---

**Related Documentation:**
- [Tag Component Overview](01-overview.md) - Component introduction and use cases
- [Tag Architecture](02-architecture.md) - Technical design and token structure  
- [Tag Guidelines](04-guidelines.md) - Usage patterns and standard practices
- [Icon Holder Component](../01-icon_holder/) - Foundation component for icon integration
- **Problem:** {PROBLEM_DESCRIPTION_2}  
- **Solution:** {SOLUTION_2}

### Debug Mode
```{CODE_LANGUAGE}
{DEBUG_MODE_EXAMPLE}
```

---

**Architecture Details**: See [Utag Architecture](02-architecture.md)  
**Usage Guidelines**: See [Utag Guidelines](04-guidelines.md)  
**Examples Repository**: [Utag Examples]({EXAMPLES_LINK})
