# Accessibility Standards
**Version:** 1.1  
**Date:** September 5, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Accessibility requirements and implementation guidelines for federal applications

> **Reference:** This document aligns with [Oblique Accessibility Guidelines](https://oblique.bit.admin.ch/guidelines/accessibility)

---

## **Federal Accessibility Requirements**

Digital information and services must be accessible to enable communication with public sector bodies for people with disabilities. This allows social involvement and political participation for all.

### Legal Framework

The Federal Administration is under obligation to design digital services to be accessible:

- **[Article 9 of the UN Convention on the Rights of Persons with Disabilities (UN CRPD)](https://social.desa.un.org/issues/disability/crpd/article-9-accessibility)**: Guarantees equal access to information and services for the public
- **[Article 8 paragraph 2 of the Federal Constitution](https://www.fedlex.admin.ch/eli/cc/1999/404/en#art_8)**: States that no person may be discriminated against because of a physical, mental or psychological disability  
- **[Disability Discrimination Act (DDA)](https://www.fedlex.admin.ch/eli/cc/2003/667/en)**: Requires measures to prevent, reduce or eliminate discrimination
- **[Ordinance on the Elimination of Discrimination against People with Disabilities (EPDO)](https://www.fedlex.admin.ch/eli/cc/2003/668/de)**: Contains provisions on requirements to accommodate people with disabilities
- **[Article 3 Federal Act on the Use of Electronic Means for the Fulfillment of Official Tasks (EMBAG) paragraph 4](https://www.fedlex.admin.ch/eli/cc/2023/682/de#art_3)**: Forces Federal Offices to ensure their services are accessible to the entire population

### Standards

The federal administration adopts **[eCH-0059 Accessibility Standard Version 3](https://www.ech.ch/de/ech/ech-0059/3.0)**, which calls for compliance with the criteria of **WCAG 2.1 at conformance level AA**.

---

## **Accessibility Statement Requirements**

Websites and mobile applications must feature an easily findable statement on accessibility that is regularly updated and in a machine-readable format.

### Required Information (per eCH-0059 Standard)

Application owners must provide the following compliance information:

- **Application Name (mandatory)**: Must match the application title as displayed in the header
- **Exceptions (mandatory, if applicable)**: All exceptions to WCAG 2.1 Level AA compliance must be listed
- **Creation Date (mandatory)**: Date the accessibility statement was first published (should coincide with application launch)
- **Review Date (optional)**: Date the accessibility statement was last reviewed
- **Application Operator (mandatory)**: Name and address of the federal office or entity operating the application
- **Contact (mandatory)**: Contact information for the project (at least one email address or phone number)

### Implementation

Oblique provides:
- **Integrated accessibility declaration web page** in four languages
- **Figma template** in [OB Project Starter Kit](https://www.figma.com/design/EYujtBkyWir9Skacd2hRg0/OB-Project-Starter-Kit-13.0.0-%E2%80%93-F1.0?node-id=6802-126)
- **Technical documentation** for implementation: [ObIAccessibilityStatement API](https://oblique.bit.admin.ch/helpers/provide-oblique-configuration/api#ObIAccessibilityStatement)

---

## **Component Accessibility**

Oblique is developing a design system library that supports accessibility aspects. The aim is for Oblique to provide fully accessible components and templates, including:

- ARIA patterns implementation
- Keyboard navigation support  
- Screen reader compatibility
- Tested colors in the design library

### Design System Progress

**Current Status**: Oblique already supports certain accessibility aspects and is working toward full accessibility compliance across all components.

---

## **Testing Tools and Resources**

### Browser Plugins
- **[axe](https://www.deque.com/axe/)**: Evaluates web content for accessibility issues
- **[WAVE](https://wave.webaim.org/extension/)**: Web accessibility evaluation extension

### Testing Tools
- **[HinderlingVolkart bookmarklet](https://hinderlingvolkart.github.io/h123/)**: Assists in checking heading structure
- **[NVDA](https://www.nvaccess.org/download/)**: Screen reader for testing
- **[WebAIM contrast checker](https://webaim.org/resources/contrastchecker/)**: Contrast ratio validation
- **[Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/)**: Accessibility-focused testing
- **[axe-core](https://github.com/dequelabs/axe-core)**: Accessibility engine for automated testing

### Reference Resources
- **[Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)**: complete accessibility recommendations
- **[Web Accessibility Initiative (WAI) by W3C](https://www.w3.org/WAI/)**: Strategies, standards, and supporting resources
- **[Accessibility in Angular](https://angular.io/guide/accessibility)**: standard practices for Angular applications
- **[Accessibility Developer Guide (ADG)](https://www.accessibility-developer-guide.com/)**: Hands-on introduction for developers
- **[ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)**: Examples for accessible semantics and keyboard recommendations

---

## **Support**

For support or more information about accessibility:
- **Email**: [oblique@bit.admin.ch](mailto:oblique@bit.admin.ch)
- **Guidelines**: [Oblique Accessibility Guidelines](https://oblique.bit.admin.ch/guidelines/accessibility)

---

**Document Maintainers:** Design System Team, Accessibility Team  
**Review Schedule:** Quarterly  
**Next Review:** December 2025  
**Reference Documentation:** [Oblique Accessibility Guidelines](https://oblique.bit.admin.ch/guidelines/accessibility)
