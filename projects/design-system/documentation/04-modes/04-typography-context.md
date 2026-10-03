# Typography-Context Mode

Typography contexts for interface vs. prose content.

## **Context Types**

Located in: `05_html/typography/context/`

- **`interface.json`** - Compact typography for UI elements  
- **`prose.json`** - Generous typography for reading content

## **Key Differences**

| Element | Interface | Prose | Use Case |
|---|---|---|---|
| H1 | `3xl` | `6xl` | UI headers vs. article titles |
| H2 | `2xl` | `5xl` | Sections vs. major headings |
| Weight | `bold` | `semiBold` | Contrast vs. readability |

## **Usage Guidelines**

**Interface Context** - Use for:
- Navigation, forms, buttons
- Dashboards, sidebars  
- UI controls and labels

**Prose Context** - Use for:
- Articles, documentation
- Marketing content
- Long-form text

## **Implementation**

Typography context is selected at **build time** by loading the appropriate token set:

```
UI Applications    → Load interface.json  
Content Sites      → Load prose.json
```

**Usage Example:**
```scss
.page-title {
  font-size: var(--ob-h-typography-context-h1-font_size);
  /* 3xl in interface context, 6xl in prose context */
}
```