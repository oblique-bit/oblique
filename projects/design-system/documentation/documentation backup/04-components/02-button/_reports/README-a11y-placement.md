# Accessibility (A11y) Reports Placement Guide

## 🎯 Where A11y Reports Go:

### **02-tokenization/a11y-**
**Token-level accessibility validation:**
- Color contrast ratio tokens validation
- Focus indicator token coverage  
- Typography accessibility tokens (size, spacing, weight)
- Motion/animation preference tokens
- High contrast mode token support

**Report naming:** `YYYYMMDD_HHMM-component-tokenization-a11y-[focus-area]-report.md`

### **03-compliance/a11y-**
**Standards and legal compliance:**
- WCAG 2.1 AA compliance validation
- Section 508 compliance reports
- ADA compliance assessment
- Platform accessibility standards (VoiceOver, TalkBack, etc.)
- Accessibility audit reports

**Report naming:** `YYYYMMDD_HHMM-component-compliance-a11y-[standard]-report.md`

### **04-quality/a11y-**
**Design and user experience accessibility:**
- Visual accessibility design review
- Cognitive load assessment
- Motor accessibility considerations
- Screen reader experience quality
- Keyboard navigation design patterns
- Focus management design review

**Report naming:** `YYYYMMDD_HHMM-component-quality-a11y-[experience-area]-report.md`

## 📋 A11y Validation Matrix:

| A11y Aspect | Report Folder | Focus |
|-------------|---------------|-------|
| **Color Contrast** | 02-tokenization | Token values |
| **Color Contrast** | 03-compliance | WCAG standards |
| **Focus Indicators** | 02-tokenization | Token coverage |
| **Focus Indicators** | 04-quality | Visual design |
| **Screen Reader** | 03-compliance | Technical compliance |
| **Screen Reader** | 04-quality | User experience |
| **Keyboard Navigation** | 01-technical | Implementation |
| **Keyboard Navigation** | 04-quality | Design patterns |

## 🔄 Cross-Folder A11y References:
A11y reports often reference each other:
- Tokenization reports → Compliance validation
- Compliance reports → Quality implementation  
- Quality reports → Technical requirements
