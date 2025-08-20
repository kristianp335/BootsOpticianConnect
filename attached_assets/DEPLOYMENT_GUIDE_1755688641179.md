# Johnson Matthey Liferay Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Johnson Matthey Liferay implementation, including client extensions and fragment collections.

## Deployment Files Created

### 📦 Fragment Collection ZIP
- **File**: `johnson-matthey-collection.zip` (48.6 KB)
- **Contents**: Complete fragment collection with all 6 fragments
- **Structure**: Proper Liferay collection format with root directory

### 📁 Individual Fragment ZIPs
Located in `fragment-zips/` directory:
- `jm-header.zip` (7.2 KB) - Header with navigation and modals
- `jm-hero.zip` (6.6 KB) - Hero section with video functionality
- `jm-news-carousel.zip` (7.6 KB) - News carousel component
- `jm-share-price.zip` (7.3 KB) - Share price widget with charts
- `jm-company-overview.zip` (8.4 KB) - Company statistics section
- `jm-footer.zip` (9.4 KB) - Footer with social links and newsletter

### 🎨 Client Extension
Located in `jm-frontend-client-extension/` directory:
- Global CSS and JavaScript for site-wide functionality
- Johnson Matthey branding using Liferay Classic theme tokens

## Deployment Steps

### Step 1: Deploy Client Extensions
1. Navigate to Liferay's **Client Extensions** area in the admin interface
2. Upload or deploy the `jm-frontend-client-extension/` folder
3. Ensure both CSS and JavaScript client extensions are activated
4. Client extensions will use Liferay's default scoping behavior (no explicit scope configuration required)

### Step 2: Deploy Fragment Collection (Option A - Complete Collection)
1. Go to **Site Builder** > **Page Fragments**
2. Click **Import** or **Add Collection**
3. Upload `johnson-matthey-collection.zip`
4. Verify all 6 fragments are imported successfully
5. Check that collection appears in fragment library

### Step 2: Deploy Individual Fragments (Option B - Selective Import)
1. Go to **Site Builder** > **Page Fragments**
2. Create a new collection or select existing collection
3. Import individual ZIP files from `fragment-zips/` as needed
4. Import only the fragments required for your site

### Step 3: Verify Deployment
1. **Check Fragment Library**: All fragments should appear with thumbnails
2. **Test Fragment Configuration**: Each fragment should have editable configuration options
3. **Verify Client Extension Loading**: Global CSS and JS should be active site-wide

## Fragment Usage

### Building Pages with Fragments
1. **Create New Page** or edit existing page in Liferay
2. **Add Fragments** from the Johnson Matthey collection
3. **Configure Each Fragment** using the configuration panels
4. **Edit Content** using Liferay's inline editing system

### Recommended Page Structure
```
├── JM Header (navigation and branding)
├── JM Hero (homepage hero section)
├── JM Company Overview (statistics and focus areas)
├── JM News Carousel (latest news and updates)
├── JM Share Price (financial information)
└── JM Footer (contact and social links)
```

## Fragment Configuration Options

### JM Header
- Navigation style and layout options
- Mobile menu configuration
- Login/search modal settings
- Dropzone locations for additional content

### JM Hero
- Video URL configuration
- Call-to-action button settings
- Background and layout options
- Hero text and imagery

### JM News Carousel
- Number of news items to display
- Auto-play and transition settings
- Touch/swipe navigation options
- Accessibility features

### JM Share Price
- Stock symbol configuration
- Chart display options
- Update frequency settings
- Market data sources

### JM Company Overview
- Statistics display options
- Animation settings
- Focus area configuration
- Layout variations

### JM Footer
- Social media links
- Newsletter signup configuration
- Back-to-top button settings
- Legal links and contact information

## Technical Requirements

### Liferay Version Compatibility
- **Minimum**: Liferay DXP 7.4+ or Liferay Portal CE 7.4+
- **Recommended**: Latest stable version
- **Theme**: Liferay Classic theme (for frontend token support)

### Browser Support
- Modern browsers with CSS Grid and Flexbox support
- Mobile browsers with touch event support
- Accessibility-compliant screen readers

### Performance Considerations
- Fragments optimized for Google Lighthouse scores
- Minimal JavaScript footprint with lazy loading
- CSS scoped to prevent admin interface conflicts
- SVG graphics for scalable, lightweight icons

## Content Management

### Editable Content
All fragments include editable content areas for:
- **Text Content**: Headlines, descriptions, button labels
- **Images**: Company logos, hero images, news thumbnails
- **Links**: Navigation items, call-to-action buttons, social media
- **Configuration**: Display options, layout settings, feature toggles

### Content Editor Guidelines
1. **Use Liferay's Inline Editing**: Click on editable areas to modify content
2. **Configure Fragment Settings**: Use fragment configuration panels for layout options
3. **Image Management**: Upload images through Liferay's document library
4. **Link Management**: Use Liferay's link picker for internal and external links

## Troubleshooting

### Common Issues

**Fragments Not Appearing in Library**
- Verify ZIP file structure matches Liferay requirements
- Check that all required files are present (fragment.json, thumbnail.png)
- Ensure proper file naming convention (index.html, index.css, index.js)

**Styling Issues**
- Confirm client extensions are deployed and active
- Check that CSS is scoped to `#wrapper` to prevent conflicts
- Verify Liferay Classic theme is active

**JavaScript Functionality Not Working**
- Ensure global JavaScript client extension is loaded
- Check browser console for JavaScript errors
- Verify fragment JavaScript is scoped to fragment elements only

**Configuration Options Not Available**
- Check configuration.json files for proper syntax
- Verify fragment.json includes configurationPath reference
- Ensure fragment is properly imported with all files

## Support and Maintenance

### Updates and Modifications
- Fragment source code is available in the project repository
- Modify fragments as needed and re-create ZIP files using the provided Python script
- Deploy updated fragments to replace existing versions

### Performance Monitoring
- Monitor Google Lighthouse scores for performance optimization
- Check Core Web Vitals for user experience metrics
- Optimize images and content as needed

### Security Considerations
- Keep Liferay platform updated to latest stable version
- Monitor for security advisories related to client extensions
- Regularly review and update fragment content and links