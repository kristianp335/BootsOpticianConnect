# Boots Optician Partner Portal

## Overview
This project aims to recreate the Boots Optician partner portal using a comprehensive Liferay fragment collection. It provides modular, configurable, and responsive dashboard components, including a header with left-sliding navigation, various dashboard widgets, training modules, performance analytics, and case management tools. The core purpose is to facilitate easy content editing and deployment, adhering strictly to Boots' branding guidelines via Liferay's Classic theme, offering a complete solution for partner engagement and a frictionless experience for users and administrators.

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
- **Fragment Modularity**: Each dashboard component is an independent Liferay fragment, ensuring self-contained units with configuration options, responsive design, and edit mode styling.
- **CSS Scoping**: All styles scoped under `#wrapper` to prevent Liferay admin interface conflicts.
- **JavaScript Isolation**: Fragment-scoped event handling and initialization using `fragmentElement` variable.
- **Mobile-First Design**: Responsive breakpoints with touch-friendly interactions.
- **Content Management**: All content editable via Liferay's inline editing system using `data-lfr-editable` attributes.
- **Modal System**: Centralized system for login, search, and video modals, embedding Liferay portlets with CSS overrides, featuring Boots branding.
- **FreeMarker Templates**: Uses bracket syntax (`[#if]`) and `configuration.variableName` for accessing fragment configurations, with default values for robustness.
- **Performance Optimization**: Inline SVG, CSS containment, limited animations, inline critical CSS, eager loading for hero images.
- **Accessibility**: WCAG AA standards compliant with proper alt text, ARIA labels, and keyboard navigation.
- **Z-Index Strategy**: Conservative z-index use (1050 for fragment modals, 1060 for dropdowns) to avoid conflicts with Liferay's admin interface.
- **Edit Mode Detection**: Uses multiple selectors for robust edit mode detection.
- **Mandatory Fragment Requirements**: Every Liferay fragment with configuration options MUST include `"configurationPath": "configuration.json"` in fragment.json and have a `thumbnail.png` file.

### Core Components
- **Header Fragment**: Logo, configurable navigation, left-sliding menu, user profile dropdown, search modal, sign-in modal, account selector dropzone. Features API-driven navigation rendering, modal system, responsive mobile design, and control menu detection.
- **Hero Fragment**: Configurable component for login/landing pages with editable content, custom background images, enhanced contrast overlays, and responsive design. Uses a dual background image system with CSS fallback.
- **Dashboard Overview**: KPI cards, quick actions, performance metrics (decomposed into individual KPI Card, Chart Widget, Progress Widget, Stats Card, Data Table fragments).
- **Training Module Fragment**: Training progress, upcoming courses, certifications.
- **Case Management Fragment**: Active cases, recent activity, case statistics.
- **Performance Analytics**: Charts, trends, goal tracking.
- **Announcements Fragment**: Latest updates, information broadcasts.
- **Footer Fragment**: Links, support information, company branding.
- **Form Fragments Collection**: Includes Autocomplete Fields, Confirmation Field, Rating Components, Selection Controls (multi-select listbox, toggles, range sliders), Advanced Fields (segmented numeric, user field selectors, relationship management), Submit Controls, and Hidden Fields.

## External Dependencies
- **Liferay DXP/Portal**: Core platform for fragment rendering, theme system, and content management.
- **Liferay Classic Theme**: Provides frontend tokens and base styling.
- **Liferay Headless Delivery API**: Used for fetching navigation menu structures and content data.
- **Liferay Login Portlet** (`com_liferay_login_web_portlet_LoginPortlet`): Embedded in modal overlays.
- **Liferay Search Portlet**: Integrated into search modal functionality.
- **Browser APIs**: Intersection Observer, Fetch API, Local Storage for enhanced functionality.

## Recent Changes

### September 4, 2025
- **FORM FRAGMENTS COLLECTION INTEGRATED**: Successfully integrated comprehensive form fragments collection with 12 specialized form field components including autocomplete (object and picklist), confirmation fields, star rating, multi-select listbox, range sliders, segmented numeric inputs, toggle switches, submit buttons, user field selectors, and hidden relationship fields. All fragments include proper `configurationPath` entries and professional thumbnail images.
- **FRAGMENT THUMBNAIL GENERATION**: Created 12 professional thumbnail images for form fragments using consistent design language with clean white backgrounds, subtle shadows, and modern UI elements. All thumbnails properly installed in respective fragment directories for Liferay fragment selection interface.
- **THUMBNAIL PATH REFERENCES FIXED**: **CRITICAL FIX** - Added missing `"thumbnailPath": "thumbnail.png"` entries to all form fragment.json files. Form fragments were missing these required references that exist in Boots partner collection fragments, causing thumbnails not to display in Liferay's fragment selection interface. All 12 fragments now properly reference their thumbnail images.
- **DEPLOYMENT PACKAGE UPDATES**: Updated deployment ZIP creation to include new form fragments collection alongside existing Boots partner collection and client extension. All deployment packages now include proper file structure, complete fragment collections with thumbnails, configuration files, and correct thumbnailPath references.
- **DOCUMENTATION ENHANCEMENT**: Updated project documentation to include Form Fragments Collection section detailing autocomplete fields, rating components, selection controls, advanced fields, submit controls, and hidden fields for comprehensive form building capabilities.
- **Chart.js**: Integrated for charting functionalities.