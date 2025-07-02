# Semantic Status Colors and Icons: Government Web Application Design System

## Introduction

This document defines and rationalizes the semantic status color and icon tokens used in the design system, with a focus on their actual usage in government web application components. The naming and mapping of these tokens have been updated to reflect the specific needs and contexts of public sector digital services. Notably, generic terms such as "error" and "success" have been replaced with more precise, context-appropriate names like "critical" and "resolved". For example, a Badge component indicating a failed process now uses the "critical" status, while a completed process uses "resolved". These changes ensure clarity, accessibility, and alignment with the expectations of government service users and stakeholders.

## Scope

- **Included:**
  - All semantic status color tokens and their associated icons.
  - Mapping of status tokens to actual component usage (Infobox, Badge, Pill).
- **Excluded:**
  - Interaction state colors (enabled, disabled, hover, focus, etc.).

## Status Token Usage Table

| Status Name | Typical Usage/Context | Example Components | Legacy Equivalents/Notes | Inspiration (Other Design Systems/Apps) | Change Status | Enforced Usage |
|-------------|----------------------|--------------------|-------------------------|-----------------------------------------|--------------|----------------|
| critical    | Errors, failed processes, blocking issues; Badge: critical updates or notifications | Infobox, Badge, Pill | error | GOV.UK, Material, USWDS | Renamed | strict |
| resolved    | Completed, successful, or resolved states | Badge, Pill | success | GOV.UK, Material, USWDS | Renamed | recommended |
| attention   | Warnings, caution, non-blocking issues | Infobox, Badge, Pill | warning | GOV.UK, Material, USWDS | Renamed | recommended |
| info        | Informational, neutral updates | Infobox, Badge, Pill | info | GOV.UK, Material, USWDS | Unchanged | recommended |
| pending     | Awaiting action, in progress | Badge, Pill | - | Jira, ServiceNow | Added | recommended |
| fatal       | Country-wide emergencies, critical alerts | Infobox | - | Stakeholder request | Added | strict |

## Component Mapping

- **Infobox:** critical, attention, info, fatal
- **Badge:** critical, resolved, attention, info, pending
- **Pill:** critical, resolved, attention, info, pending

Only the statuses actually used in each component are listed above, based on analysis of local component and theme files.

## Rationale

### Naming Changes
- "error" → "critical": Emphasizes the severity and urgency of the issue, aligning with government service terminology.
- "success" → "resolved": Focuses on the outcome (issue resolved) rather than the process, which is clearer for end users.
- "warning" → "attention": Reduces ambiguity and better communicates the need for user awareness without implying error.

### New Statuses
- **pending:** Added to support ticketing and workflow systems, reflecting items awaiting action or in progress.
- **fatal:** Introduced for rare, high-severity situations (e.g., natural catastrophes) at the request of stakeholders responsible for national emergency communications.

These changes are designed to improve clarity, accessibility, and user trust in government digital services. The mapping and naming are based strictly on actual usage in local files, ensuring the documentation remains accurate and actionable for designers and developers.
