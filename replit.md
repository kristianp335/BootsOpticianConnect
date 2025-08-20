# Boots Optician Partner Portal

## Repository Description
A comprehensive Boots Optician partner portal built with Liferay fragments featuring dashboard analytics, training modules, and left-sliding navigation.

## Overview
This project delivers a comprehensive Liferay fragment collection to recreate Boots Optician partner portal. It provides modular, configurable, and responsive dashboard components such as header with left-sliding navigation, dashboard widgets, training modules, performance analytics, and case management tools. The goal is to ensure easy content editing, deployment, and adherence to Boots' branding guidelines using Liferay's Classic theme.

## User Preferences
- Use simple, everyday language for communication (preferred communication style)
- Focus on practical implementation over technical details
- Ensure all fragments are properly editable via Liferay's inline editing system
- Work independently for extended periods without constant check-ins
- Document all architectural decisions and changes with dates
- **CRITICAL**: Always verify ZIP packaging correctness - check that updated code is actually included in generated ZIPs before considering deployment ready

## Project Architecture

### Dual-Deployment Strategy
- **Client Extension**: Global CSS and JavaScript client extensions for site-wide functionality (globalCSS + globalJS)
- **Fragment Collection**: Individual UI components for dashboard features

### Key Architectural Decisions
- **Dual-Deployment Strategy**: Client extension for global CSS/JS and fragment collection for UI components
- **Color System**: Exclusive use of Liferay Classic theme frontend tokens with Boots brand colors
- **Navigation System**: Left-sliding menu that shifts main content right while keeping header/footer fixed
- **Fragment Modularity**: Each dashboard component is an independent Liferay fragment
- **CSS Scoping**: All styles scoped under `#wrapper` to prevent admin interface conflicts
- **JavaScript Isolation**: Fragment-scoped event handling and initialization using `fragmentElement` variable
- **Mobile-First Design**: Responsive breakpoints with touch-friendly interactions
- **Content Management**: All content (text, images, links) editable via Liferay's inline editing system using `data-lfr-editable` attributes
- **Modal System**: Centralized system for login, search, and video modals, embedding Liferay portlets with CSS overrides
- **Fragment Element Detection**: Use Liferay's injected `fragmentElement` variable instead of `document.currentScript.closest()`

### Brand Colors (Liferay Tokens)
- Primary: `var(--brand-color-1)` (#1E22AA) - Boots blue
- Secondary: `var(--brand-color-2)` (#454769) - Secondary blue-gray
- Additional colors from Liferay Classic theme tokens

### Dashboard Components Planned
1. **Header Fragment**: Logo, left-sliding navigation menu, user profile, notifications
2. **Dashboard Overview**: KPI cards, quick actions, performance metrics
3. **Training Module Fragment**: Training progress, upcoming courses, certifications
4. **Case Management Fragment**: Active cases, recent activity, case statistics
5. **Performance Analytics**: Charts, trends, goal tracking
6. **Announcements Fragment**: Latest updates, information broadcasts
7. **Footer Fragment**: Links, support information, company branding

### Left-Sliding Navigation Requirements
- Menu button in header triggers left slide-out navigation
- Main content area shifts right when menu is open
- Header and footer remain fixed in position
- Smooth CSS transitions for open/close animations
- Mobile-responsive behavior with appropriate breakpoints
- Click outside or close button closes the menu

## Critical Liferay Implementation Guidelines (From Project Documentation)

### Fragment Structure Requirements
- **Johnson Matthey Pattern**: Use separate fragment.json (metadata) and configuration.json (schema) files
- **Required Files**: fragment.json, configuration.json, index.html, index.css, index.js, thumbnail.png
- **Fragment Entry Keys**: Use consistent naming like "boots-header", "boots-dashboard"
- **Configuration Schema**: Use "label" and "value" structure for validValues in select fields

### CSS Scoping Rules (CRITICAL)
- **ALL CSS must be scoped under `#wrapper`** to prevent Liferay admin interface conflicts
- **Global CSS**: Every selector in client extension must use `#wrapper` prefix
- **Fragment CSS**: Every selector in fragment CSS files must use `#wrapper` prefix
- **Pattern**: Before: `.brand-btn { ... }` → After: `#wrapper .brand-btn { ... }`

### JavaScript Scoping Rules (CRITICAL)
- **Use `fragmentElement` variable** provided by Liferay - NEVER use `document.querySelector`
- **Fragment-only scope**: All DOM queries must use `fragmentElement.querySelector()`
- **Event listeners**: Scope all events to elements within the fragment
- **Timing**: Use setTimeout delays to ensure DOM elements exist before initialization

### Fragment Image Editing Requirements
- **All images must be editable** using Liferay's inline editing system
- **Required attributes**:
  ```html
  <img src="placeholder.jpg" alt="Description" 
       data-lfr-editable-id="img1" 
       data-lfr-editable-type="image">
  ```

### Modal Implementation Requirements
- **Embedded Portlets**: Use FreeMarker `[@liferay_portlet["runtime"] portletName="PORTLET_NAME" /]`
- **Login Status Check**: Use `themeDisplay.isSignedIn()` for conditional content
- **CSS Overrides**: Use `!important` declarations to override Liferay portlet styles
- **Background Scroll**: Prevent body scrolling when modal is open

### Navigation API Handling
- **Support Both Structures**: Handle `navigationMenuItems` (API) and `children` (fallback)
- **Property Mapping**: Support both `item.link || item.url` and `item.name || item.title`
- **Dropdown Behavior**: Hover to show, click to toggle, keyboard navigation

### Edit Mode Detection
- **Multiple Selectors**: Use all three methods for maximum compatibility
  ```css
  [data-editor-enabled="true"],
  .is-edit-mode .element,
  body.has-edit-mode-menu .element
  ```

### Performance Optimization Rules
- **Inline SVG**: Use inline SVG instead of external files for zero network requests
- **CSS Containment**: Apply `contain: layout style paint` for render isolation
- **Animation Limits**: Only simple fade-in animations, avoid complex transforms
- **LCP Optimization**: Inline critical CSS, use eager loading for hero images

### Z-Index Conservative Approach
- **Fragment modals**: Use z-index 1050 (Bootstrap standard)
- **Dropdown suggestions**: Use z-index 1060
- **Never override** Liferay's admin interface z-index hierarchy

### FreeMarker Template Syntax
- **Brackets**: Use `[#` instead of `<#` for conditionals
- **Configuration Access**: Use `configuration.variableName` syntax
- **Conditionals**: `[#if condition]content[/#if]` structure
- **Fragment Configuration**: Uses `typeOptions.validValues` for select fields

### External Dependencies & Integration
- **Liferay DXP/Portal**: Core platform for fragment rendering, theme system, and content management
- **Liferay Classic Theme**: Provides frontend tokens and base styling
- **Liferay Headless Delivery API**: Used for navigation menu structure and content data
- **Login Portlet** (`com_liferay_login_web_portlet_LoginPortlet`): Embedded in modal overlays
- **Search Portlet**: Integrated into search modal functionality
- **Browser APIs**: Intersection Observer, Fetch API, Local Storage for enhanced functionality

### Advanced Fragment Features
- **Context-Aware Styling**: Components automatically adapt to different contexts (mega menus vs page content)
- **SPA Navigation Support**: Compatible with Liferay's SennaJS for seamless page transitions
- **Animation System**: Scroll-triggered animations using CSS transitions and Intersection Observers
- **Performance Optimized**: Lazy loading, error handling, hardware acceleration with `transform: translateZ(0)`
- **Accessibility Compliant**: WCAG AA standards with proper alt text, ARIA labels, keyboard navigation

## Recent Changes
- Project initialization (August 20, 2025)
- Analyzed screenshots and requirements for Boots portal design
- Confirmed Liferay Classic theme token usage for brand consistency
- Planned dual client extension + fragment collection architecture
- Changed client extension from themeCSS to globalCSS type per user request (August 20, 2025)
- Updated fragment structure to match Johnson Matthey pattern with separate configuration.json files (August 20, 2025)
- **CRITICAL**: Integrated comprehensive Liferay implementation guidelines from uploaded documentation to prevent structural mistakes (August 20, 2025)
- Fixed client extension YAML format to match documentation standards (August 20, 2025)
- Added scriptElementAttributes to global JS for SPA navigation persistence and high priority loading (August 20, 2025)
- Generated proper visual thumbnails for all 5 fragments using AI image generation (August 20, 2025)
- Created complete deployment package with individual fragment ZIPs and collection ZIP following Liferay structure requirements (August 20, 2025)
- **CRITICAL FIX**: Resolved ALL FreeMarker syntax errors in fragments by correcting ALL configuration variable references to use `configuration.variableName` syntax and adding proper default values (August 20, 2025)
- **COMPREHENSIVE SYNTAX FIX**: Fixed remaining variables: showProgressChart, showCaseFilters, showNewsletterSignup, showTrainingProgress, showPerformanceCharts, showActionItems, showBackToTop, defaultFilter, caseView, trainingLayout - all now use proper FreeMarker syntax (August 20, 2025)
- **CRITICAL CORRECTION**: Fixed header implementation to exactly match Johnson Matthey header pattern from uploaded zip file - replaced custom profile dropdown with `[@liferay.user_personal_bar /]`, fixed language selector to use proper `<lfr-drop-zone data-lfr-drop-zone-id="language-selector">`, simplified search modal to just be a dropzone, updated all JavaScript selectors (August 20, 2025)
- **JM HEADER COMPLIANCE**: Now follows exact structure from actual JM header: proper user personal bar for authenticated users, correct dropzone syntax, simplified modal structures matching reference implementation (August 20, 2025)
- **JAVASCRIPT UPDATES**: Updated all modal controls, selectors, and removed custom profile dropdown functionality to match corrected HTML structure following JM patterns (August 20, 2025)
- **NAVIGATION API INTEGRATION**: Implemented full navigation API functionality from JM header pattern - fetches navigation from Liferay API, renders desktop and mobile navigation, handles dropdowns, includes fallback navigation for Boots portal content (August 20, 2025)
- **REMOVED CONFIGURATIONS**: Removed company name and notifications configurations and functionality per user request - header now focuses on core navigation and user authentication (August 20, 2025)
- **BOOTS NAVIGATION STRUCTURE**: Updated navigation to use proper desktop nav and mobile nav containers populated by JavaScript from API, with Boots-specific fallback navigation (Dashboard, Training, Case Management, Resources, Support) (August 20, 2025)
- **ZIP PACKAGING VERIFICATION**: Added mandatory ZIP content verification process to ensure all code updates are correctly packaged in deployment files - prevents deployment issues from outdated ZIP contents (August 20, 2025)