# Emphasis Mode (High/Low)

**Design context mode for managing emphasis levels in interface elements**

---

## **Overview**

Emphasis mode provides high and low emphasis variations for interface elements, enabling designers to create visual hierarchy and guide user attention effectively.

## **Implementation**

### **Mode Files**
- **`high.json`** - High emphasis for primary actions, critical information, and focal elements
- **`low.json`** - Low emphasis for secondary actions, supporting information, and background elements

### **Token Architecture**
Located in: `03_semantic/color/s2-emphasis/`

**Structure Pattern:**
```json
{
  "ob": {
    "s2": {
      "color": {
        "interactive": {
          "primary": {
            "$value": "{ob.s1.color.primary}",      // high.json - full intensity
            "$value": "{ob.s1.color.primary_muted}" // low.json - reduced intensity  
          }
        }
      }
    }
  }
}
```

### **Reference Chain**
```
Components → S2 Emphasis → S1 Lightness → Primitives
              ↑
       Emphasis selection occurs here
```

## **Usage Guidelines**

### **High Emphasis (high.json)**
**Use for:**
- Primary buttons and call-to-action elements
- Critical alerts and error messages
- Active navigation states
- Primary headings and important content
- Focus states and selected items

**Characteristics:**
- Maximum contrast and visibility
- Bold, saturated colors
- Strong visual presence
- Draws immediate attention

### **Low Emphasis (low.json)**
**Use for:**
- Secondary buttons and optional actions
- Supporting text and descriptions
- Disabled states
- Background elements
- Subtle borders and dividers

**Characteristics:**
- Reduced contrast and saturation
- Muted, subtle appearance
- Supports primary content without competing
- Maintains accessibility while being unobtrusive

## **Design Patterns**

### **Visual Hierarchy**
```
High Emphasis: Primary Actions → Critical Information → Active States
     ↓
Low Emphasis: Secondary Actions → Supporting Information → Inactive States
```

### **Context Usage**
- **Navigation**: High emphasis for active page, low emphasis for inactive links
- **Forms**: High emphasis for submit button, low emphasis for cancel/back
- **Cards**: High emphasis for primary content, low emphasis for metadata
- **Alerts**: High emphasis for warnings/errors, low emphasis for informational

## **Implementation Examples**

### **Button Hierarchy**
```scss
/* High emphasis - Primary button */
.button-primary {
  background-color: var(--ob-s2-color-interactive-primary-bg-high);
  color: var(--ob-s2-color-interactive-primary-fg-high);
}

/* Low emphasis - Secondary button */
.button-secondary {
  background-color: var(--ob-s2-color-interactive-primary-bg-low);
  color: var(--ob-s2-color-interactive-primary-fg-low);
}
```

### **Text Hierarchy**
```scss
/* High emphasis - Primary headings */
.heading-primary {
  color: var(--ob-s2-color-text-heading-high);
}

/* Low emphasis - Supporting text */
.text-supporting {
  color: var(--ob-s2-color-text-body-low);
}
```

## **Accessibility Considerations**

### **Contrast Requirements**
- **High Emphasis**: Minimum 4.5:1 contrast ratio (AA) or 7:1 (AAA)
- **Low Emphasis**: Minimum 3:1 contrast ratio for secondary content
- **Interactive Elements**: Maintain sufficient contrast for usability

### **Visual Indicators**
- Don't rely solely on color for emphasis distinction
- Use additional visual cues (size, weight, spacing)
- Ensure emphasis is perceivable by users with color vision deficiencies

## **Design Decision Guidelines**

### **When to Use High Emphasis**
- User needs immediate attention or action
- Critical information that affects user decisions
- Primary pathway through the interface
- Error states requiring user intervention

### **When to Use Low Emphasis**
- Supporting information that aids but doesn't drive decisions
- Optional or alternative actions
- Contextual metadata
- Background elements that provide structure

---

*Emphasis mode enables systematic visual hierarchy creation while maintaining accessibility and usability across all interface contexts.*