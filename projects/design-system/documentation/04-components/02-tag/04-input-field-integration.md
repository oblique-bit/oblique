# Tag Component: Input Field Integration & Remove Button Behavior
**Version:** 1.0  
**Date:** September 24, 2025  
**Status:** Detailed Implementation Guide  
**Purpose:** Define Tag component behavior within input fields and remove button interaction patterns

**About this document:** This document provides comprehensive guidance on how Tag components behave when integrated within input text fields, focusing on the remove button interaction patterns, keyboard navigation, and accessibility considerations.

**Scope:** `tag.input_mode` behavior, remove button functionality, input field integration patterns, and user interaction flows.

---

## Input Field Integration Overview

The Tag component's `input_mode` is specifically designed for integration within form input fields, providing users with a visual representation of multi-value input while maintaining seamless keyboard navigation and screen reader accessibility.

### Key Behavioral Principles

1. **Non-interactive tag body**: The tag text itself is not focusable or clickable
2. **Interactive remove button**: Only the close/remove button receives focus and handles interaction
3. **Size inheritance**: Tags automatically inherit size from parent input field
4. **Keyboard flow**: Maintains natural tab order within the form context

---

## Remove Button Interaction Behavior

### Visual Design & Positioning
```typescript
// Tag structure within input field
<ob-input-text size="md" placeholder="Add keywords...">
  <!-- Tag body (non-interactive) -->
  <ob-tag mode="input_mode" tabindex="-1">
    <span class="tag-label">JavaScript</span>
    
    <!-- Remove button (interactive element) -->
    <button type="button" 
            class="tag-remove-button"
            tabindex="0"
            aria-label="Remove JavaScript keyword">
      <ob-icon size="xs">close</ob-icon>
    </button>
  </ob-tag>
  
  <ob-tag mode="input_mode" tabindex="-1">
    <span class="tag-label">React</span>
    <button type="button" 
            class="tag-remove-button"
            tabindex="0"
            aria-label="Remove React keyword">
      <ob-icon size="xs">close</ob-icon>
    </button>
  </ob-tag>
</ob-input-text>
```

### Remove Button States

| State | Visual Treatment | Interaction | Use Case |
|-------|-----------------|-------------|-----------|
| **Default** | Subtle, low contrast icon | None | Tag is present, remove button available |
| **Hover** | Increased contrast, background highlight | Mouse hover feedback | User explores remove option |
| **Focus** | Focus ring, high contrast icon | Keyboard navigation target | User navigated via Tab key |
| **Pressed** | Pressed appearance | Click/Enter/Space pressed | User confirms removal |
| **Disabled** | Reduced opacity, no interaction | N/A (rare in input context) | Tag removal temporarily disabled |

---

## Keyboard Navigation Patterns

### Tab Navigation Flow
```
Input Field Focus → Tag 1 Remove Button → Tag 2 Remove Button → Tag N Remove Button → Next Form Element
```

### Keyboard Interactions
| Key | Target | Behavior | Result |
|-----|--------|----------|--------|
| **Tab** | Remove button | Navigate to next remove button or exit tag group | Focus moves to next interactive element |
| **Shift+Tab** | Remove button | Navigate to previous remove button or input field | Focus moves to previous interactive element |
| **Enter** | Remove button | Execute remove action | Tag is removed, focus moves to next remove button or input |
| **Space** | Remove button | Execute remove action | Tag is removed, focus moves to next remove button or input |
| **Escape** | Remove button | Cancel any pending action | Focus returns to input field |
| **Backspace** | Input field (when empty) | Remove last tag | Last tag is removed, focus stays on input |

### Focus Management After Removal
```typescript
class TagRemovalBehavior {
  removeTag(tagIndex: number): void {
    // Remove the tag from data
    this.tags.splice(tagIndex, 1);
    
    // Focus management strategy
    if (this.tags.length === 0) {
      // No tags left - focus input field
      this.inputElement.focus();
    } else if (tagIndex < this.tags.length) {
      // Focus next tag's remove button
      this.focusTagRemoveButton(tagIndex);
    } else {
      // Was last tag - focus previous tag's remove button
      this.focusTagRemoveButton(tagIndex - 1);
    } else {
      // Fallback - focus input field
      this.inputElement.focus();
    }
    
    // Announce removal for screen readers
    this.announceTagRemoval(removedTag);
  }
}
```

---

## Implementation Examples

### Basic Multi-Value Input
```typescript
@Component({
  selector: 'app-skill-input',
  template: `
    <label for="skills-input">Skills</label>
    <div class="input-with-tags">
      <ob-input-text 
        #skillsInput
        id="skills-input"
        size="md" 
        [(ngModel)]="newSkill"
        placeholder="Type a skill and press Enter..."
        (keydown.enter)="addSkill()"
        (keydown.backspace)="handleBackspace($event)">
        
        <!-- Existing tags -->
        <ob-tag 
          *ngFor="let skill of skills; let i = index"
          mode="input_mode"
          [attr.data-tag-index]="i">
          
          {{ skill }}
          
          <button type="button"
                  class="tag-remove-button"
                  [attr.aria-label]="'Remove ' + skill + ' skill'"
                  (click)="removeSkill(i)"
                  (keydown.enter)="removeSkill(i)"
                  (keydown.space)="removeSkill(i, $event)">
            <ob-icon size="xs">close</ob-icon>
          </button>
        </ob-tag>
      </ob-input-text>
    </div>
    
    <!-- Screen reader announcements -->
    <div aria-live="polite" aria-atomic="false" class="sr-only">
      {{ screenReaderMessage }}
    </div>
  `,
  styles: [`
    .input-with-tags {
      position: relative;
    }
    
    .tag-remove-button {
      /* Focus ring for remove button */
      --ob-c-tag-remove-button-focus-ring-width: var(--ob-s-border-width-focus);
      --ob-c-tag-remove-button-focus-ring-offset: var(--ob-s-spacing-focus-offset);
      --ob-c-tag-remove-button-focus-ring-color: var(--ob-s3-color-interaction-focus-ring-inversity-normal);
    }
    
    .tag-remove-button:hover {
      background-color: var(--ob-s3-color-surface-hover-inversity-normal);
    }
    
    .tag-remove-button:focus {
      outline: var(--ob-c-tag-remove-button-focus-ring-width) solid var(--ob-c-tag-remove-button-focus-ring-color);
      outline-offset: var(--ob-c-tag-remove-button-focus-ring-offset);
    }
  `]
})
export class SkillInputComponent {
  skills: string[] = ['JavaScript', 'Angular', 'TypeScript'];
  newSkill: string = '';
  screenReaderMessage: string = '';
  
  @ViewChild('skillsInput', { read: ElementRef }) skillsInput!: ElementRef;
  
  addSkill(): void {
    if (this.newSkill.trim()) {
      this.skills.push(this.newSkill.trim());
      this.newSkill = '';
      this.announceAddition(this.newSkill.trim());
    }
  }
  
  removeSkill(index: number): void {
    const removedSkill = this.skills[index];
    this.skills.splice(index, 1);
    
    // Focus management
    this.manageFocusAfterRemoval(index);
    
    // Screen reader announcement
    this.announceRemoval(removedSkill);
  }
  
  handleBackspace(event: KeyboardEvent): void {
    // Remove last tag if input is empty and backspace is pressed
    if (this.newSkill === '' && this.skills.length > 0) {
      event.preventDefault();
      this.removeSkill(this.skills.length - 1);
    }
  }
  
  manageFocusAfterRemoval(removedIndex: number): void {
    setTimeout(() => {
      if (this.skills.length === 0) {
        // Focus input if no tags left
        this.skillsInput.nativeElement.focus();
      } else if (removedIndex < this.skills.length) {
        // Focus next tag's remove button
        const nextTagButton = document.querySelector(`[data-tag-index="${removedIndex}"] .tag-remove-button`) as HTMLElement;
        nextTagButton?.focus();
      } else if (removedIndex > 0) {
        // Focus previous tag's remove button
        const prevTagButton = document.querySelector(`[data-tag-index="${removedIndex - 1}"] .tag-remove-button`) as HTMLElement;
        prevTagButton?.focus();
      } else {
        // Fallback to input
        this.skillsInput.nativeElement.focus();
      }
    }, 0);
  }
  
  announceAddition(skill: string): void {
    this.screenReaderMessage = `Added skill: ${skill}`;
    this.clearMessage();
  }
  
  announceRemoval(skill: string): void {
    this.screenReaderMessage = `Removed skill: ${skill}`;
    this.clearMessage();
  }
  
  private clearMessage(): void {
    setTimeout(() => this.screenReaderMessage = '', 1000);
  }
}
```

### Advanced Tag Input with Validation
```typescript
@Component({
  selector: 'app-advanced-tag-input',
  template: `
    <div class="form-field">
      <label for="categories">Product Categories (max 5)</label>
      
      <div class="tag-input-container" 
           [class.error]="hasError"
           [class.disabled]="disabled">
           
        <ob-input-text 
          id="categories"
          size="lg"
          [(ngModel)]="currentInput"
          [placeholder]="getPlaceholder()"
          [disabled]="disabled || isAtLimit"
          (keydown.enter)="addTag()"
          (keydown.backspace)="handleBackspace($event)"
          (keydown.arrowleft)="navigateToLastTag($event)"
          (blur)="handleInputBlur()">
          
          <ob-tag 
            *ngFor="let category of categories; let i = index"
            mode="input_mode"
            [attr.data-tag-index]="i"
            [class.error]="isInvalid(category)">
            
            {{ category }}
            
            <button type="button"
                    class="tag-remove-button"
                    [attr.aria-label]="getRemoveLabel(category)"
                    [disabled]="disabled"
                    (click)="removeTag(i)"
                    (keydown.enter)="removeTag(i)"
                    (keydown.space)="removeTag(i, $event)">
              <ob-icon size="xs">close</ob-icon>
            </button>
          </ob-tag>
        </ob-input-text>
      </div>
      
      <!-- Validation messages -->
      <div class="form-help" *ngIf="hasError">
        {{ errorMessage }}
      </div>
      
      <!-- Progress indicator -->
      <div class="form-help" *ngIf="!hasError">
        {{ categories.length }} of 5 categories selected
      </div>
    </div>
  `,
  styles: [`
    .tag-input-container.error {
      --ob-c-tag-border-color: var(--ob-s3-color-status-danger-border-inversity-normal);
    }
    
    .tag-input-container.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    ob-tag.error {
      --ob-c-tag-border-color: var(--ob-s3-color-status-danger-border-inversity-normal);
      --ob-c-tag-background-color: var(--ob-s3-color-status-danger-surface-inversity-normal);
    }
    
    .form-help {
      margin-top: var(--ob-s-spacing-sm);
      font-size: var(--ob-s-typography-type-scale-xs-normal-font-size);
      color: var(--ob-s3-color-text-subtle-inversity-normal);
    }
    
    .form-field .error .form-help {
      color: var(--ob-s3-color-status-danger-text-inversity-normal);
    }
  `]
})
export class AdvancedTagInputComponent {
  categories: string[] = [];
  currentInput: string = '';
  disabled: boolean = false;
  maxCategories: number = 5;
  
  get isAtLimit(): boolean {
    return this.categories.length >= this.maxCategories;
  }
  
  get hasError(): boolean {
    return this.categories.some(cat => this.isInvalid(cat)) || this.isAtLimit && this.currentInput.trim();
  }
  
  get errorMessage(): string {
    if (this.isAtLimit && this.currentInput.trim()) {
      return `Maximum ${this.maxCategories} categories allowed`;
    }
    const invalidCategories = this.categories.filter(cat => this.isInvalid(cat));
    if (invalidCategories.length > 0) {
      return `Invalid categories: ${invalidCategories.join(', ')}`;
    }
    return '';
  }
  
  getPlaceholder(): string {
    if (this.isAtLimit) return 'Maximum categories reached';
    if (this.categories.length === 0) return 'Enter product categories...';
    return 'Add another category...';
  }
  
  getRemoveLabel(category: string): string {
    const status = this.isInvalid(category) ? ' (invalid)' : '';
    return `Remove ${category} category${status}`;
  }
  
  isInvalid(category: string): boolean {
    // Example validation: no special characters
    return !/^[a-zA-Z0-9\s]+$/.test(category);
  }
  
  addTag(): void {
    const trimmed = this.currentInput.trim();
    if (trimmed && !this.categories.includes(trimmed) && !this.isAtLimit) {
      this.categories.push(trimmed);
      this.currentInput = '';
    }
  }
  
  removeTag(index: number): void {
    this.categories.splice(index, 1);
    // Focus management logic similar to previous example
  }
  
  handleBackspace(event: KeyboardEvent): void {
    if (this.currentInput === '' && this.categories.length > 0) {
      event.preventDefault();
      this.removeTag(this.categories.length - 1);
    }
  }
  
  navigateToLastTag(event: KeyboardEvent): void {
    if (this.currentInput === '' && this.categories.length > 0) {
      event.preventDefault();
      const lastTagButton = document.querySelector(`[data-tag-index="${this.categories.length - 1}"] .tag-remove-button`) as HTMLElement;
      lastTagButton?.focus();
    }
  }
  
  handleInputBlur(): void {
    // Auto-add current input if valid
    if (this.currentInput.trim() && !this.isAtLimit) {
      this.addTag();
    }
  }
}
```

---

## Accessibility Requirements

### Screen Reader Support
- **ARIA labels**: Each remove button must have descriptive `aria-label`
- **Live announcements**: Tag additions/removals announced via `aria-live="polite"`
- **Role definitions**: Tags use `role="listitem"`, containers use `role="list"`
- **State communication**: Invalid tags communicated through ARIA attributes

### Keyboard Accessibility
- **Tab order**: Remove buttons in logical sequence
- **Focus management**: Proper focus handling after tag removal
- **Keyboard shortcuts**: Enter, Space, Backspace, Escape support
- **Focus indicators**: Visible focus rings on all interactive elements

### Visual Accessibility
- **Color contrast**: WCAG AA compliant contrast ratios
- **Focus indicators**: Clear focus rings on remove buttons
- **Error states**: Visual and textual error communication
- **Size targets**: Minimum 44px touch targets for remove buttons

---

## Token Integration

### Remove Button Styling Tokens
```css
/* Remove button dimensions */
--ob-c-tag-remove-button-size-sm: var(--ob-s-size-compact);     /* 16px */
--ob-c-tag-remove-button-size-md: var(--ob-s-size-cozy);        /* 20px */  
--ob-c-tag-remove-button-size-lg: var(--ob-s-size-snug);        /* 24px */

/* Remove button focus ring */
--ob-c-tag-remove-button-focus-ring-width: var(--ob-s-border-width-focus);
--ob-c-tag-remove-button-focus-ring-offset: var(--ob-s-spacing-focus-offset);
--ob-c-tag-remove-button-focus-ring-color: var(--ob-s3-color-interaction-focus-ring-inversity-normal);

/* Remove button colors */
--ob-c-tag-remove-button-color-default: var(--ob-s3-color-text-subtle-inversity-normal);
--ob-c-tag-remove-button-color-hover: var(--ob-s3-color-text-default-inversity-normal);
--ob-c-tag-remove-button-color-focus: var(--ob-s3-color-text-emphasis-inversity-normal);

/* Remove button background */
--ob-c-tag-remove-button-background-hover: var(--ob-s3-color-surface-hover-inversity-normal);
--ob-c-tag-remove-button-background-pressed: var(--ob-s3-color-surface-pressed-inversity-normal);
```

---

## Related Documentation

- [Tag Component Overview](./01-overview.md) - General tag usage and variants
- [Tag Component Architecture](./02-architecture.md) - Technical component structure  
- [Form Controls Integration](../../05-patterns/forms/) - Form patterns and best practices
- [Accessibility Guidelines](../../../accessibility/) - General accessibility requirements
- [Token System](../../../03-design-tokens/) - Design token architecture

---

**Maintenance**: This documentation should be updated when tag input behaviors change or new interaction patterns are introduced.

**Last Updated**: September 24, 2025 by Design System Documentation