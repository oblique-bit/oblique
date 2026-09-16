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
Located in: `03_semantic/color/s2_emphasis/`

**Structure Pattern:**
```json
{
  "ob": {
    "s2": {
      "color": {
        "interaction": {
          "contrast_levels": {
            "fg": {
              "low": {
                "inversity_normal": {
                  "$value": "{ob.s1.color.interaction.emphasis_high.fg_base.contrast_low.inversity_normal}"  // high.json
                  // "$value": "{ob.s1.color.interaction.emphasis_low.fg_base.contrast_low.inversity_normal}" -- low.json
                }
              }
            }
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
/* High-contrast interaction color - primary button */
.button-primary {
  background-color: var(--ob-s2-color-interaction-contrast_levels-bg-high-inversity_normal);
  color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
}

/* Low-contrast interaction color - secondary button */
.button-secondary {
  background-color: var(--ob-s2-color-interaction-contrast_levels-bg-low-inversity_normal);
  color: var(--ob-s2-color-interaction-contrast_levels-fg-low-inversity_normal);
}
```

### **Text Hierarchy**
```scss
/* High-contrast interaction color - emphasized text */
.text-emphasized {
  color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
}

/* Low-contrast interaction color - supporting text */
.text-supporting {
  color: var(--ob-s2-color-interaction-contrast_levels-fg-low-inversity_normal);
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