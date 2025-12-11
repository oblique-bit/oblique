# Figma Unsupported Properties for Developers

## About This Document

**Target Audience:** Frontend developers implementing Oblique Design System  
**Purpose:** CSS properties that cannot be controlled by Figma variables  
**Context:** Product Owner decision - no tokens for properties Figma cannot consume  
**Last Updated:** December 2025

---

## Source and Methodology

This document lists properties **NOT supported** by Figma variables, based on [Figma's official documentation](https://help.figma.com/hc/en-us/articles/14506821864087).

### What Figma Variables Support
- **Color**: fills, gradients, shadows, strokes
- **Number**: dimensions, typography metrics, spacing, effects values
- **String**: font family/weight, text content, visibility
- **Boolean**: layer visibility, variant properties

### What Requires Hardcoding
Properties not in Figma's supported list must be hardcoded in both Figma and CSS.

---

## Properties Requiring Hardcoded Implementation

### Layout Properties
```css
/* Display & Box Model */
display: block | inline | flex | grid | none;
box-sizing: border-box | content-box;
overflow: visible | hidden | scroll | auto;

/* Flexbox */
flex-direction: row | column | row-reverse | column-reverse;
flex-wrap: nowrap | wrap | wrap-reverse;
justify-content: flex-start | center | flex-end | space-between;
align-items: stretch | flex-start | center | flex-end | baseline;

/* Grid */
grid-template-columns: repeat(12, 1fr);
grid-auto-flow: row | column | dense;

/* Position */
position: static | relative | absolute | fixed | sticky;
top: 0px | auto;
z-index: 1 | 10 | 100;
```

### Typography Behavior
```css
text-align: left | center | right | justify;
vertical-align: top | middle | bottom | baseline;
text-decoration: none | underline | line-through;
text-transform: none | capitalize | uppercase | lowercase;
white-space: normal | nowrap | pre | pre-wrap;
word-break: normal | break-all | break-word;
```

### Sizing Keywords
```css
width: auto | fit-content | min-content | max-content;
height: auto | fit-content | min-content | max-content;
```

### Visual Effects
```css
filter: blur(5px) | brightness(0.5) | contrast(1.2);
mix-blend-mode: normal | multiply | screen;
background-size: auto | cover | contain;
border-style: none | solid | dotted | dashed;
```

### Interaction
```css
cursor: default | pointer | text | not-allowed;
pointer-events: auto | none;
user-select: auto | none | text;
```

### Animation
```css
transform: translateX(10px) | rotate(45deg) | scale(1.2);
animation: slidein 3s ease-in-out;
transition: all 0.3s ease;
```

---

**Note:** Based on Figma variable limitations as of December 2025. May change with future Figma updates.