# Boots Optician Partner Portal

## Overview
This project delivers a comprehensive Liferay fragment collection to recreate the Boots Optician partner portal. It provides modular, configurable, and responsive dashboard components including a header with left-sliding navigation, various dashboard widgets, training modules, performance analytics, and case management tools. The primary goal is to ensure easy content editing, deployment, and adherence to Boots' branding guidelines using Liferay's Classic theme, offering a complete solution for partner engagement.

## User Preferences
- Use simple, everyday language for communication
- Focus on practical implementation over technical details
- Ensure all fragments are properly editable via Liferay's inline editing system
- Work independently for extended periods without constant check-ins
- Document all architectural decisions and changes with dates
- **CRITICAL**: Always verify ZIP packaging correctness - check that updated code is actually included in generated ZIPs before considering deployment ready

## System Architecture

### Dual-Deployment Strategy
- **Client Extension**: Global CSS and JavaScript for site-wide functionality.
- **Fragment Collection**: Individual UI components for dashboard features.

### Key Architectural Decisions
- **Color System**: Exclusive use of Liferay Classic theme frontend tokens with Boots brand colors (Primary: `var(--brand-color-1)` - Boots blue; Secondary: `var(--brand-color-2)` - Secondary blue-gray).
- **Navigation System**: Left-sliding menu that shifts main content right while keeping header/footer fixed. Supports API-driven and fallback navigation.
- **Fragment Modularity**: Each dashboard component is an independent Liferay fragment.
- **CSS Scoping**: All styles scoped under `#wrapper` to prevent Liferay admin interface conflicts.
- **JavaScript Isolation**: Fragment-scoped event handling and initialization using `fragmentElement` variable.
- **Mobile-First Design**: Responsive breakpoints with touch-friendly interactions.
- **Content Management**: All content editable via Liferay's inline editing system using `data-lfr-editable` attributes.
- **Modal System**: Centralized system for login, search, and video modals, embedding Liferay portlets with CSS overrides. Modals feature Boots branding and professional styling.
- **FreeMarker Templates**: Uses bracket syntax (`[#if]`) and `configuration.variableName` for accessing fragment configurations.
- **Performance Optimization**: Inline SVG, CSS containment, limited animations, inline critical CSS, eager loading for hero images.
- **Accessibility**: WCAG AA standards compliant with proper alt text, ARIA labels, and keyboard navigation.
- **Z-Index Strategy**: Conservative z-index use (1050 for fragment modals, 1060 for dropdowns) to avoid conflicts with Liferay's admin interface.
- **Edit Mode Detection**: Uses multiple selectors for robust edit mode detection.

### Core Components
- **Header Fragment**: Logo, left-sliding navigation menu, user profile, search, and sign-in.
- **Dashboard Overview**: KPI cards, quick actions, performance metrics.
- **Training Module Fragment**: Training progress, upcoming courses, certifications.
- **Case Management Fragment**: Active cases, recent activity, case statistics.
- **Performance Analytics**: Charts, trends, goal tracking.
- **Announcements Fragment**: Latest updates, information broadcasts.
- **Footer Fragment**: Links, support information, company branding.
- **Hero Fragment**: Configurable hero component for login/landing pages with editable content and responsive design.

## External Dependencies
- **Liferay DXP/Portal**: Core platform for fragment rendering, theme system, and content management.
- **Liferay Classic Theme**: Provides frontend tokens and base styling.
- **Liferay Headless Delivery API**: Used for fetching navigation menu structures and content data.
- **Liferay Login Portlet** (`com_liferay_login_web_portlet_LoginPortlet`): Embedded in modal overlays.
- **Liferay Search Portlet**: Integrated into search modal functionality.
- **Browser APIs**: Intersection Observer, Fetch API, Local Storage for enhanced functionality.

## Recent Changes

### August 20, 2025
- **DROPZONE UNIQUE ID FIX**: Resolved Liferay upload error "You must define a unique ID for each drop zone" by creating separate unique dropzone IDs - `language-selector` for header functionality and `search-modal-content` for search modal content, eliminating duplicate ID conflicts and ensuring successful fragment deployment.
- **NAVIGATION TOGGLE CONFIGURATION**: Added `showNavigation` configuration option to header fragment, allowing users to show/hide the entire navigation menu system (toggle button, sliding menu, and overlay). Defaults to true for backward compatibility, follows same pattern as existing search and user profile configurations.
- **ACCOUNT SELECTOR DROPZONE**: Added configurable account selector dropzone positioned left of search button with unique ID `account-selector`, includes edit mode styling and JavaScript visibility controls via `showAccountSelector` configuration option.
- **HERO FRAGMENT DEFAULT IMAGE**: Generated and integrated professional Boots-branded hero background image as fragment resource (`hero-default-background.png`), replacing SVG placeholder with high-quality corporate imagery while maintaining Liferay editability via `data-lfr-editable` attributes.