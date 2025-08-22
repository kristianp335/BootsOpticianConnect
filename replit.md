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
- **Header Fragment**: Logo with configurable navigation system (`navigationMenuId`), left-sliding menu (240px width), user profile dropdown, search modal, sign-in modal, and account selector dropzone. Features API-driven navigation rendering, modal system with Liferay portlet embedding, responsive mobile design, and control menu detection for proper positioning.
- **Dashboard Overview**: KPI cards, quick actions, performance metrics.
- **Training Module Fragment**: Training progress, upcoming courses, certifications.
- **Case Management Fragment**: Active cases, recent activity, case statistics.
- **Performance Analytics**: Charts, trends, goal tracking.
- **Announcements Fragment**: Latest updates, information broadcasts.
- **Footer Fragment**: Links, support information, company branding.
- **Hero Fragment**: Configurable hero component for login/landing pages with editable content, custom background images, enhanced contrast overlays, and responsive design.

## External Dependencies
- **Liferay DXP/Portal**: Core platform for fragment rendering, theme system, and content management.
- **Liferay Classic Theme**: Provides frontend tokens and base styling.
- **Liferay Headless Delivery API**: Used for fetching navigation menu structures and content data.
- **Liferay Login Portlet** (`com_liferay_login_web_portlet_LoginPortlet`): Embedded in modal overlays.
- **Liferay Search Portlet**: Integrated into search modal functionality.
- **Browser APIs**: Intersection Observer, Fetch API, Local Storage for enhanced functionality.

## Recent Changes

### August 22, 2025
- **BRAND COLOR SYSTEM UPGRADE**: Updated global CSS to use Liferay Classic theme frontend tokens (`--brand-color-1`, `--brand-color-2`, `--brand-color-3`) instead of hardcoded Boots color values. Colors now properly integrate with Liferay's theme system while maintaining Boots brand identity as fallback values. Ensures theme-level color customization capability and full Liferay compliance.
- **MOBILE ACCOUNT SELECTOR HIDDEN**: Added CSS media query to hide account selector dropzone on mobile devices (≤768px width) to optimize header space for essential navigation elements. Desktop functionality remains unchanged.
- **NAVIGATION HEIGHT OPTIMIZATION**: Removed fixed height constraints (`height: calc(100vh - 60px)`) from sliding navigation menu to allow natural content-based height. Improves flexibility across different Liferay environments and navigation content amounts.
- **CONTROL MENU DETECTION REFINED**: Simplified JavaScript logic to apply `-60px` margin-top when Liferay control menu is absent, removed forced positioning properties. Combined with CSS `!important` removal for cleaner positioning behavior.

### August 20, 2025
- **LIFERAY CSS OVERRIDE SYSTEM**: Applied maximum CSS specificity overrides using `html body #wrapper` selectors with `!important` declarations on all navigation properties. Increased z-index to 99999-100003 range and added `transform: none !important` to combat Liferay Classic theme conflicts. Navigation DOM elements created successfully with API data but required strongest possible CSS force-rendering approach.
- **NAVIGATION DISPLAY ISSUE RESOLVED**: Fixed CSS visibility problem where DOM elements were created successfully but not displaying. Added explicit `display: flex !important`, `visibility: visible !important`, and `opacity: 1 !important` to menu links, plus proper display properties for menu list and items. Navigation menu now renders authentic API data visibly.
- **NAVIGATION SYSTEM FULLY OPERATIONAL**: Successfully resolved DOM manipulation persistence issue by switching from appendChild to direct innerHTML approach. Navigation now displays authentic API data from configured Liferay navigation menu via `navigationMenuId` configuration field. System includes comprehensive debugging, proper error handling, and automatic scaling as navigation grows.
- **DOM MANIPULATION STRATEGY OPTIMIZATION**: Changed navigation rendering from DOM element creation with appendChild to direct HTML string building with innerHTML assignment, resolving timing and persistence issues in Liferay fragment environment. Enhanced logging confirms successful DOM updates and menu functionality.
- **SENNAJS COMPATIBILITY CONFIRMED**: Fragment JavaScript includes built-in SennaJS support with proper initialization on DOM ready events and SPA navigation compatibility. Client extension assets updated August 20, 2025 with latest functionality.
- **MODAL PADDING FIXES**: Fixed login modal content padding to exactly 20px and search modal content padding to 60px, including responsive mobile overrides (15px and 30px respectively) to ensure proper spacing on all devices.
- **LIFERAY ADMIN INTERFACE COMPATIBILITY**: Fixed navigation positioning to account for Liferay's control menu by adjusting top position to 60px and height to calc(100vh - 60px). Eliminates white space conflict with admin interface while maintaining full navigation functionality.
- **WHITE SPACE LAYOUT FIX**: Eliminated white space issue in navigation menu by reducing width from 320px to 240px, disabling content transform shifting, and optimizing overlay positioning. Navigation now slides cleanly over content without layout disruption.
- **MENU CONTENT SHIFTING OPTIMIZATION**: Reduced excessive content shifting when sliding menu opens from 320px to 240px (desktop) and 280px to 220px (mobile), added overflow hidden to prevent unwanted scrollbars during menu transitions.
- **HERO BACKGROUND IMAGE UPGRADE**: Generated and integrated professional optician shop display image as hero fragment default background, replacing previous corporate imagery with more relevant eyeglasses retail environment while maintaining Liferay editability.
- **CSS SELECTOR MODAL PADDING FIX**: Corrected modal padding CSS selectors from `.boots-search-content` to `.search-content` and `.boots-login-content` to `.login-content` to match actual live HTML structure, ensuring proper modal spacing on deployment.
- **RESOURCES FOLDER STRUCTURE**: Created proper `/fragment-collection/boots-partner-collection/resources/` folder structure following Liferay fragment collection standards. Moved hero background image from individual fragment to shared resources, updated hero fragment to use `[resources:hero-default-background.png]` syntax for proper resource referencing across all fragments.
- **DROPZONE UNIQUE ID FIX**: Resolved Liferay upload error "You must define a unique ID for each drop zone" by creating separate unique dropzone IDs - `language-selector` for header functionality and `search-modal-content` for search modal content, eliminating duplicate ID conflicts and ensuring successful fragment deployment.
- **NAVIGATION TOGGLE CONFIGURATION**: Added `showNavigation` configuration option to header fragment, allowing users to show/hide the entire navigation menu system (toggle button, sliding menu, and overlay). Defaults to true for backward compatibility, follows same pattern as existing search and user profile configurations.
- **ACCOUNT SELECTOR DROPZONE**: Added configurable account selector dropzone positioned left of search button with unique ID `account-selector`, includes edit mode styling and JavaScript visibility controls via `showAccountSelector` configuration option.
- **HERO BACKGROUND IMAGE FALLBACK SYSTEM**: Implemented dual background image system for hero fragment with CSS background fallback and JavaScript error handling. Ensures hero image displays even if Liferay resources syntax fails, providing robust image loading with automatic fallback to CSS background when HTML image element fails.
- **HERO TEXT CONTRAST ENHANCEMENT**: Fixed poor text readability on bright backgrounds by strengthening overlay opacity (light: 0.5, medium: 0.7, dark: 0.85), adding enhanced multi-layer text shadows, implementing semi-transparent content backdrop with blur effect, and improving button contrast. Ensures excellent text visibility against custom optician shop imagery.
- **HEADER FRAGMENT CLEANUP**: Removed all console logging statements from header fragment JavaScript for production readiness. Added control menu detection to adjust navigation positioning (-50px top margin when Liferay control menu absent). Documented complete header fragment functionality including API-driven navigation, modal system, and responsive design.
- **FRAGMENT DECOMPOSITION COMPLETE**: Created 5 individual component fragments from large dashboard/training/case-management fragments: KPI Card (configurable metrics with icons and animations), Chart Widget (Chart.js integration with multiple chart types), Progress Widget (animated progress bars with multiple color schemes), Stats Card (statistics display with horizontal/vertical layouts), and Data Table (configurable data tables with search/pagination). Each fragment is fully self-contained with configuration options, responsive design, and edit mode styling.
- **FREEMARKER SYNTAX FIXES**: Resolved all FreeMarker template errors by adding default values to all configuration variables using the ! operator. Fixed `.globals.randomNamespace` error in chart widget with default value "chart". All 11 fragments now import successfully into Liferay without syntax warnings or errors.