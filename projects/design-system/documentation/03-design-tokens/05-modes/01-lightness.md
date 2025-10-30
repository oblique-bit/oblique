# Lightness Mode (Light/Dark)

**User preference mode switching between light and dark themes**

---

## **Overview**

Lightness mode enables users to switch between light and dark interface themes based on their personal preferences, environmental conditions, or accessibility needs.

## **Implementation**

### **Mode Files**
- **`light.json`** - Standard light theme with bright backgrounds and dark text
- **`dark.json`** - Dark theme with dark backgrounds and light text  

### **Token Architecture**
Located in: `03_semantic/color/s1-lightness/`

**Structure Pattern:**
```json
{
  "ob": {
    "s1": {
      "color": {
        "primary": {
          "$value": "{ob.p.color.blue.500}",  // light.json
          "$value": "{ob.p.color.blue.300}"   // dark.json
        }
      }
    }
  }
}
```

### **Reference Chain**
```
Components → S3 Semantic → S1 Lightness → Primitives
                            ↑
                     Mode switching occurs here
```

## **Usage Guidelines**

### **For Designers**
- Design both light and dark versions of components
- Ensure proper contrast ratios in both modes (WCAG AA compliance)
- Test readability and usability in both contexts
- Consider environmental usage (bright daylight vs. dim environments)

### **For Developers**
- Use CSS media query `prefers-color-scheme` for automatic detection
- Provide manual toggle option for user control
- Ensure smooth transitions between modes
- Test functionality in both modes

### **Mode Detection**
```scss
/* Automatic detection */
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}

@media (prefers-color-scheme: light) {
  /* Light mode styles */
}
```

## **Design Considerations**

### **Contrast Requirements**
- **Light Mode**: Dark text on light backgrounds (minimum 4.5:1 ratio)
- **Dark Mode**: Light text on dark backgrounds (minimum 4.5:1 ratio)
- **Interactive Elements**: Maintain contrast in both modes

### **Color Adaptations**
- **Brand Colors**: May require different shades for optimal visibility
- **Status Colors**: Adjust intensity for both contexts
- **Neutral Colors**: Ensure proper hierarchy in both modes

### **Visual Comfort**
- **Light Mode**: Suitable for well-lit environments, office use
- **Dark Mode**: Reduces eye strain in low-light conditions, saves battery on OLED

## **Implementation Pattern**

### **Token Selection**
The S1 lightness layer provides the foundation for all color mode switching. All other semantic layers (S2, S3) reference S1 tokens, ensuring consistent mode switching throughout the system.

### **Build Configuration**
Mode files are selected during build process based on:
1. User system preference detection
2. Manual user selection (toggle)
3. Application default setting
4. Context-specific overrides

---

*Lightness mode forms the foundation of the color mode system, enabling accessible and user-preference-driven theme switching.*