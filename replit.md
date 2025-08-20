# Boots Optician Partner Portal

## Repository Description
A comprehensive Boots Optician partner portal built with Liferay fragments featuring dashboard analytics, training modules, and left-sliding navigation.

## Overview
This project delivers a comprehensive Liferay fragment collection to recreate Boots Optician partner portal. It provides modular, configurable, and responsive dashboard components such as header with left-sliding navigation, dashboard widgets, training modules, performance analytics, and case management tools. The goal is to ensure easy content editing, deployment, and adherence to Boots' branding guidelines using Liferay's Classic theme.

## User Preferences
- Use simple, everyday language for communication
- Focus on practical implementation over technical details
- Ensure all fragments are properly editable via Liferay's inline editing system

## Project Architecture

### Dual-Deployment Strategy
- **Client Extension**: Global CSS and JavaScript for site-wide functionality
- **Fragment Collection**: Individual UI components for dashboard features

### Key Architectural Decisions
- **Color System**: Exclusive use of Liferay Classic theme frontend tokens with Boots brand colors
- **Navigation System**: Left-sliding menu that shifts main content right while keeping header/footer fixed
- **Fragment Modularity**: Each dashboard component is an independent Liferay fragment
- **CSS Scoping**: All styles scoped under `#wrapper` to prevent admin interface conflicts
- **JavaScript Isolation**: Fragment-scoped event handling and initialization
- **Mobile-First Design**: Responsive breakpoints with touch-friendly interactions

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

## Recent Changes
- Project initialization (August 20, 2025)
- Analyzed screenshots and requirements for Boots portal design
- Confirmed Liferay Classic theme token usage for brand consistency
- Planned dual client extension + fragment collection architecture