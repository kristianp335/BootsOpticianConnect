/* Johnson Matthey Header Fragment JavaScript */
(function() {
    'use strict';
    
    // Use the fragmentElement provided by Liferay instead of document.currentScript
    // Liferay injects: const fragmentElement = document.querySelector('#fragment-xyz');
    if (!fragmentElement) {
        return;
    }
    
    // Initialize on DOM ready and SPA navigation events
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }
    
    // Initial load
    ready(initializeHeader);
    
    // Single initialization only - no looping event listeners
    
    function initializeHeader() {
        // Johnson Matthey Header Fragment initializing
        
        // Get configuration values
        const config = getFragmentConfiguration();
        
        // Check if we're in edit mode - more specific detection
        const editMode = isInEditMode();
        
        if (editMode) {

            // Apply configuration settings even in edit mode
            applyConfiguration(config);
            // Simplified initialization for edit mode
            const sampleNav = getSampleNavigation();
            renderNavigation(sampleNav);
            // Initialize mobile menu and modals for edit mode
            initializeMobileMenu();
            initializeModals();
            // Initialize mega menu content for edit mode - single call
            initializeMegaMenuContent();
            setupMegaMenuObserver();
            // Skip edit mode display initialization to prevent flashing

            return;
        }
        
        // Full initialization for live mode - ensure modals are hidden
        ensureModalsHidden();
        
        // Apply configuration settings
        applyConfiguration(config);
        
        // Initialize navigation
        initializeNavigation();
        
        // Initialize logo home link
        initializeLogoLink();
        
        // Initialize mobile menu
        initializeMobileMenu();
        
        // Initialize modals
        initializeModals();
        
        // Initialize dropdowns immediately - no delay needed
        initializeDropdowns();
        
        // Sticky header removed for performance
        
        // Johnson Matthey Header Fragment initialized
    }
    
    function isInEditMode() {
        // Simplified edit mode detection - check for key indicators
        const body = document.body;
        
        // Check for specific Liferay edit mode indicators
        const hasEditModeMenu = body.classList.contains('has-edit-mode-menu');
        const isEditMode = body.classList.contains('is-edit-mode');
        const hasControlMenu = document.querySelector('.control-menu');
        const hasPageEditor = document.querySelector('.page-editor__sidebar, .page-editor-sidebar, [data-qa-id="pageEditor"]');
        const hasFragmentEntryProcessorEditable = document.querySelector('.fragment-entry-processor-editable');
        const hasEditableElements = document.querySelector('[contenteditable="true"], .lfr-editable-field');
        
        // Must have both control menu AND active page editor OR actively editable elements
        // This prevents false positives on live sites that might have control menu but no editing
        const inEditMode = (hasEditModeMenu || isEditMode) && (hasPageEditor || hasEditableElements);
        
        // Add/remove body class to help with mega menu dropzone visibility
        if (inEditMode) {
            body.classList.add('has-edit-mode-menu');
            fragmentElement.classList.add('jm-edit-mode');
        } else {
            body.classList.remove('has-edit-mode-menu');
            fragmentElement.classList.remove('jm-edit-mode');
        }
        
        return inEditMode;
    }
    
    function ensureModalsHidden() {
        // Ensure modals are hidden in live mode
        const searchOverlay = document.querySelector('#jm-search-overlay');
        const loginOverlay = document.querySelector('#jm-login-overlay');
        const languageDropzone = fragmentElement.querySelector('.jm-language-selector-dropzone');
        
        if (searchOverlay) {
            searchOverlay.classList.remove('jm-edit-mode');
            searchOverlay.style.display = 'none';
        }
        
        if (loginOverlay) {
            loginOverlay.classList.remove('jm-edit-mode');
            loginOverlay.style.display = 'none';
        }
        
        if (languageDropzone) {
            languageDropzone.classList.remove('jm-edit-mode');
        }
    }
    
    function initializeNavigation() {
        loadNavigationMenu();
    }
    
    /**
     * Get fragment configuration values
     */
    function getFragmentConfiguration() {

        let config;
        
        // Try to get configuration from Liferay's fragment configuration system
        if (typeof configuration !== 'undefined') {

            config = {
                showSearch: configuration.showSearch !== undefined ? configuration.showSearch : true,
                showUserMenu: configuration.showUserMenu !== undefined ? configuration.showUserMenu : true,
                navigationMenuId: configuration.navigationMenuId || 'primary-menu',
                sitePrefix: configuration.sitePrefix || '',
                headerStyle: configuration.headerStyle || 'white'
            };

        } else {

            // Fallback default values if configuration is not available
            config = {
                showSearch: true,
                showUserMenu: true,
                navigationMenuId: 'primary-menu',
                sitePrefix: '',
                headerStyle: 'white'
            };
        }
        
        return config;
    }
    
    /**
     * Apply configuration settings to the header
     */
    function applyConfiguration(config) {
        const header = fragmentElement.querySelector('.jm-header');
        const searchBtn = fragmentElement.querySelector('.jm-search-btn');
        const userProfileWidget = fragmentElement.querySelector('.jm-user-profile-widget');
        const loginBtn = fragmentElement.querySelector('.jm-login-btn');

        // Sticky header functionality removed for performance
        
        // Apply header style
        if (header) {
            header.setAttribute('data-style', config.headerStyle);
        }
        
        // Show/hide search button
        if (searchBtn) {
            searchBtn.style.display = config.showSearch ? 'flex' : 'none';
        }
        
        // Show/hide user menu components
        if (userProfileWidget) {
            userProfileWidget.style.display = config.showUserMenu ? 'block' : 'none';
        }
        if (loginBtn) {
            loginBtn.style.display = config.showUserMenu ? 'flex' : 'none';
        }

    }

    /**
     * Load navigation menu from Liferay API
     */
    function loadNavigationMenu() {
        const config = getFragmentConfiguration();
        const menuId = config.navigationMenuId;
        
        // Skip API call if no valid menu ID is provided
        if (!menuId || menuId === 'primary-menu' || menuId === 'undefined' || menuId === undefined || typeof menuId !== 'string') {
            loadFallbackNavigation();
            return;
        }
        
        // Check if authentication token is available
        if (typeof Liferay === 'undefined' || !Liferay.authToken) {
            loadFallbackNavigation();
            return;
        }
        
        const apiUrl = `/o/headless-delivery/v1.0/navigation-menus/${menuId}?nestedFields=true&p_auth=${Liferay.authToken}`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                renderNavigationFromAPI(data.navigationMenuItems || []);
            })
            .catch(error => {
                // Error loading navigation menu
                loadFallbackNavigation();
            });
    }

    /**
     * Load fallback navigation when API is unavailable
     */
    function loadFallbackNavigation() {
        const fallbackNav = [
            {
                name: 'About',
                url: '/about',
                children: [
                    { name: 'Our History', url: '/about/history' },
                    { name: 'Leadership', url: '/about/leadership' },
                    { name: 'Locations', url: '/about/locations' }
                ]
            },
            {
                name: 'Markets',
                url: '/markets',
                children: [
                    { name: 'Automotive', url: '/markets/automotive' },
                    { name: 'Chemical Processing', url: '/markets/chemical-processing' },
                    { name: 'Oil & Gas', url: '/markets/oil-gas' }
                ]
            },
            {
                name: 'Products',
                url: '/products',
                children: [
                    { name: 'Catalysts', url: '/products/catalysts' },
                    { name: 'Precious Metals', url: '/products/precious-metals' },
                    { name: 'Chemicals', url: '/products/chemicals' }
                ]
            },
            {
                name: 'Innovation',
                url: '/innovation'
            },
            {
                name: 'Sustainability',
                url: '/sustainability'
            },
            {
                name: 'Investors',
                url: '/investors'
            },
            {
                name: 'Careers',
                url: '/careers'
            },
            {
                name: 'News & Insights',
                url: '/news'
            }
        ];
        
        renderNavigationFromAPI(fallbackNav);
    }

    /**
     * Get the site base path from configuration or fallback to ThemeDisplay
     */
    function getSiteBasePath() {
        const config = getFragmentConfiguration();
        
        // Use configured site prefix if available
        if (config.sitePrefix && config.sitePrefix.trim()) {
            const prefix = config.sitePrefix.trim();
            // Ensure it starts with / and ends with /
            return prefix.startsWith('/') ? 
                (prefix.endsWith('/') ? prefix : prefix + '/') : 
                ('/' + (prefix.endsWith('/') ? prefix : prefix + '/'));
        }
        
        // Fallback to ThemeDisplay method (deprecated but still functional)
        try {
            const relativeURL = Liferay.ThemeDisplay.getRelativeURL();
            // Extract everything up to the last slash: /web/johnson-matthey/home -> /web/johnson-matthey/
            const lastSlashIndex = relativeURL.lastIndexOf('/');
            return relativeURL.substring(0, lastSlashIndex + 1);
        } catch (error) {
            return '/web/guest/'; // Final fallback for guest site
        }
    }

    /**
     * Build complete page URL with site context
     */
    function buildPageURL(pagePath) {
        if (!pagePath || pagePath === '#') return '#';
        
        // If it's already a complete URL, return as-is
        if (pagePath.startsWith('/web/') || pagePath.startsWith('http')) {
            return pagePath;
        }
        
        // Remove leading slash if present, we'll add it with site base path
        const cleanPath = pagePath.startsWith('/') ? pagePath.substring(1) : pagePath;
        const siteBasePath = getSiteBasePath();
        
        return `${siteBasePath}${cleanPath}`;
    }

    // Track mega menu index for dropzone mapping
    let currentMegaIndex = 1;

    /**
     * Render navigation menu in both desktop and mobile containers using API data
     */
    function renderNavigationFromAPI(menuItems) {
        const desktopNav = fragmentElement.querySelector('#jm-main-nav');
        const mobileNav = fragmentElement.querySelector('.jm-mobile-nav-list');
        
        if (!desktopNav || !mobileNav) {
            return;
        }
        
        // Reset mega menu index
        currentMegaIndex = 1;
        
        // Clear existing content
        desktopNav.innerHTML = '';
        mobileNav.innerHTML = '';
        
        // Render desktop navigation
        menuItems.forEach(item => {
            const navItem = createNavItemFromAPI(item, false);
            desktopNav.appendChild(navItem);
        });
        
        // Render mobile navigation
        menuItems.forEach(item => {
            const mobileItem = createNavItemFromAPI(item, true);
            mobileNav.appendChild(mobileItem);
        });
        
        // Initialize dropdowns and mega menu content after rendering
        setTimeout(() => {
            initializeDropdowns();
            initializeMegaMenuContent();
            setupMegaMenuObserver();
        }, 100);
    }

    /**
     * Create navigation item element from API data
     */
    function createNavItemFromAPI(item, isMobile) {
        // Check for navigationMenuItems (API response) or children (fallback)
        const children = item.navigationMenuItems || item.children || [];
        const hasChildren = children.length > 0;
        
        const listItem = document.createElement('li');
        listItem.className = isMobile ? 'jm-mobile-nav-item' : 'jm-nav-item';
        
        if (hasChildren) {
            listItem.classList.add('has-dropdown');
            if (!isMobile) {
                listItem.classList.add('jm-has-dropdown');
            }
        }
        
        // Create main link
        const link = document.createElement('a');
        const originalUrl = item.link || item.url || '#';
        const builtUrl = buildPageURL(originalUrl);

        link.href = builtUrl;
        link.textContent = item.name || item.title;
        link.className = isMobile ? 'jm-mobile-nav-link' : 'jm-nav-link';
        
        if (item.external) {
            link.target = '_blank';
            link.rel = 'noopener';
        }
        
        // Add dropdown arrow for desktop items with children
        if (hasChildren && !isMobile) {
            link.setAttribute('aria-expanded', 'false');
            link.setAttribute('aria-haspopup', 'true');
            
            const arrow = document.createElement('span');
            arrow.className = 'jm-nav-arrow';
            arrow.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>';
            link.appendChild(arrow);
        }
        
        listItem.appendChild(link);
        
        // Add dropdown menu for desktop or submenu for mobile
        if (hasChildren) {
            if (isMobile) {
                const dropdown = document.createElement('div');
                dropdown.className = 'jm-mobile-dropdown-menu';
                
                children.forEach(child => {
                    const childLink = document.createElement('a');
                    childLink.href = buildPageURL(child.link || child.url || '#');
                    childLink.textContent = child.name || child.title;
                    childLink.className = 'jm-mobile-dropdown-item';
                    
                    if (child.external) {
                        childLink.target = '_blank';
                        childLink.rel = 'noopener';
                    }
                    
                    dropdown.appendChild(childLink);
                });
                
                listItem.appendChild(dropdown);
            } else {
                // Desktop mega menu
                const dropdown = document.createElement('div');
                dropdown.className = 'jm-dropdown-menu';
                
                // Add mega content area
                const megaContent = document.createElement('div');
                megaContent.className = 'jm-mega-content';
                megaContent.setAttribute('data-mega-index', currentMegaIndex.toString());
                megaContent.setAttribute('data-mega-menu-id', `mega-${currentMegaIndex}`);
                // Mega content area created
                dropdown.appendChild(megaContent);
                
                // Add navigation links section
                const linksSection = document.createElement('div');
                linksSection.className = 'jm-dropdown-links';
                
                const linksList = document.createElement('ul');
                children.forEach(child => {
                    const childItem = document.createElement('li');
                    const childLink = document.createElement('a');
                    childLink.href = buildPageURL(child.link || child.url || '#');
                    childLink.textContent = child.name || child.title;
                    childLink.className = 'jm-dropdown-item';
                    
                    if (child.external) {
                        childLink.target = '_blank';
                        childLink.rel = 'noopener';
                    }
                    
                    childItem.appendChild(childLink);
                    linksList.appendChild(childItem);
                });
                
                linksSection.appendChild(linksList);
                dropdown.appendChild(linksSection);
                
                listItem.appendChild(dropdown);
                currentMegaIndex++;
            }
        }
        
        return listItem;
    }

    /**
     * Initialize logo home link with proper site URL
     */
    function initializeLogoLink() {
        const logoLink = fragmentElement.querySelector('#jm-logo-home-link');
        if (logoLink) {
            logoLink.href = buildPageURL('/home');
        }
    }
    
    function getSampleNavigation() {
        return [
            {
                name: 'About Us',
                url: '/about-us',
                navigationMenuItems: [
                    { name: 'Our Purpose', url: '/about-us/purpose' },
                    { name: 'History', url: '/about-us/history' },
                    { name: 'Leadership', url: '/about-us/leadership' },
                    { name: 'Locations', url: '/about-us/locations' }
                ]
            },
            {
                name: 'Our Business',
                url: '/business',
                navigationMenuItems: [
                    { name: 'Catalyst Technologies', url: '/business/catalyst' },
                    { name: 'Precious Metal Services', url: '/business/precious-metals' },
                    { name: 'Hydrogen Technologies', url: '/business/hydrogen' }
                ]
            },
            {
                name: 'Sustainability',
                url: '/sustainability',
                navigationMenuItems: [
                    { name: 'Net Zero Transition', url: '/sustainability/net-zero' },
                    { name: 'Circular Economy', url: '/sustainability/circular-economy' },
                    { name: 'ESG Report', url: '/sustainability/esg-report' }
                ]
            },
            {
                name: 'Investors',
                url: '/investors',
                navigationMenuItems: [
                    { name: 'Financial Results', url: '/investors/results' },
                    { name: 'Share Price', url: '/investors/share-price' },
                    { name: 'Annual Reports', url: '/investors/reports' },
                    { name: 'Presentations', url: '/investors/presentations' }
                ]
            },
            {
                name: 'Media',
                url: '/media',
                navigationMenuItems: [
                    { name: 'News & Press', url: '/media/news' },
                    { name: 'PGM Market Report', url: '/media/pgm-report' },
                    { name: 'Events', url: '/media/events' }
                ]
            },
            {
                name: 'Careers',
                url: '/careers'
            }
        ];
    }
    
    function renderNavigation(items) {
        const mainNav = fragmentElement.querySelector('#jm-main-nav');
        const mobileNav = fragmentElement.querySelector('.jm-mobile-nav-list');
        
        if (!mainNav || !mobileNav) return;
        
        // Clear existing navigation
        mainNav.innerHTML = '';
        mobileNav.innerHTML = '';
        
        items.forEach(item => {
            // Create main navigation item
            const navItem = createNavItem(item, false);
            mainNav.appendChild(navItem);
            
            // Create mobile navigation item
            const mobileNavItem = createNavItem(item, true);
            mobileNav.appendChild(mobileNavItem);
        });
    }
    
    function createNavItem(item, isMobile) {
        const li = document.createElement('li');
        li.className = isMobile ? 'jm-mobile-nav-item' : 'jm-nav-item';
        
        const hasChildren = item.navigationMenuItems && item.navigationMenuItems.length > 0;
        if (hasChildren) {
            li.classList.add('has-dropdown');
        }
        
        const link = document.createElement('a');
        link.href = item.link || item.url || '#';
        link.textContent = item.name || item.title;
        link.className = isMobile ? 'jm-mobile-nav-link' : 'jm-nav-link';
        
        if (hasChildren && !isMobile) {
            link.setAttribute('aria-expanded', 'false');
            link.setAttribute('aria-haspopup', 'true');
            
            // Add dropdown arrow
            const arrow = document.createElement('span');
            arrow.className = 'jm-nav-arrow';
            arrow.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>';
            link.appendChild(arrow);
        }
        
        li.appendChild(link);
        
        // Create dropdown menu if has children
        if (hasChildren) {
            const dropdown = document.createElement('ul');
            dropdown.className = isMobile ? 'jm-mobile-dropdown-menu' : 'jm-dropdown-menu';
            
            item.navigationMenuItems.forEach(childItem => {
                const childLi = document.createElement('li');
                const childLink = document.createElement('a');
                childLink.href = childItem.link || childItem.url || '#';
                childLink.textContent = childItem.name || childItem.title;
                childLink.className = isMobile ? 'jm-mobile-dropdown-item' : 'jm-dropdown-item';
                
                childLi.appendChild(childLink);
                dropdown.appendChild(childLi);
            });
            
            li.appendChild(dropdown);
        }
        
        return li;
    }
    
    function initializeDropdowns() {
        const dropdownTriggers = fragmentElement.querySelectorAll('.jm-nav-item.has-dropdown > .jm-nav-link');

        dropdownTriggers.forEach(trigger => {
            const parentItem = trigger.parentElement;
            const dropdownMenu = parentItem.querySelector('.jm-dropdown-menu');
            
            if (!dropdownMenu) return;
            
            // Hover events
            parentItem.addEventListener('mouseenter', () => {
                showDropdown(trigger, dropdownMenu);
            });
            
            parentItem.addEventListener('mouseleave', () => {
                hideDropdown(trigger, dropdownMenu);
            });
            
            // Click events
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                toggleDropdown(trigger, dropdownMenu);
            });
            
            // Keyboard events
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown(trigger, dropdownMenu);
                } else if (e.key === 'Escape') {
                    hideDropdown(trigger, dropdownMenu);
                    trigger.focus();
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.jm-header-fragment')) return;
            
            if (!e.target.closest('.jm-nav-item.has-dropdown')) {
                fragmentElement.querySelectorAll('.jm-dropdown-menu.show').forEach(menu => {
                    const trigger = menu.parentElement.querySelector('.jm-nav-link');
                    hideDropdown(trigger, menu);
                });
            }
        });
    }
    
    function showDropdown(trigger, menu) {
        // Close other dropdowns first
        fragmentElement.querySelectorAll('.jm-dropdown-menu.show').forEach(otherMenu => {
            if (otherMenu !== menu) {
                const otherTrigger = otherMenu.parentElement.querySelector('.jm-nav-link');
                hideDropdown(otherTrigger, otherMenu);
            }
        });
        
        menu.classList.add('show');
        trigger.setAttribute('aria-expanded', 'true');
        trigger.parentElement.classList.add('active');
    }
    
    function hideDropdown(trigger, menu) {
        menu.classList.remove('show');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.parentElement.classList.remove('active');
    }
    
    function toggleDropdown(trigger, menu) {
        if (menu.classList.contains('show')) {
            hideDropdown(trigger, menu);
        } else {
            showDropdown(trigger, menu);
        }
    }
    
    function initializeMobileMenu() {
        const mobileToggle = fragmentElement.querySelector('.jm-mobile-menu-toggle');
        const mobileNav = fragmentElement.querySelector('.jm-mobile-nav');

        if (!mobileToggle || !mobileNav) return;
        
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = mobileNav.classList.contains('show');

            if (isOpen) {
                mobileNav.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';

            } else {
                mobileNav.classList.add('show');
                mobileToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';

            }

        });
        
        // Mobile dropdown functionality - now just for navigation to child pages
        const mobileDropdownTriggers = fragmentElement.querySelectorAll('.jm-mobile-nav-item.has-dropdown > .jm-mobile-nav-link');
        
        mobileDropdownTriggers.forEach(trigger => {
            // For mobile, we show all dropdowns by default via CSS
            // The trigger can still be used for navigation if needed
            trigger.addEventListener('click', (e) => {
                // Allow navigation to the parent page
                // No need to prevent default or manage dropdown visibility
                // Mobile navigation click handled
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.jm-header-fragment') && mobileNav.classList.contains('show')) {
                mobileNav.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when viewport expands beyond mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileNav.classList.contains('show')) {
                mobileNav.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
    /**
     * Initialize mega menu content by copying content container to dropdown areas
     */
    function initializeMegaMenuContent() {
        // Initialize mega menu content synchronization
        
        for (let i = 1; i <= 5; i++) {
            const megaContent = fragmentElement.querySelector(`.jm-dropdown-menu .jm-mega-content[data-mega-index="${i}"]`);
            const dropzoneContainer = document.querySelector(`#dropzone-mega-menu-${i}`);
            
            // Check mega menu content presence
            
            if (megaContent && dropzoneContainer) {
                // Get the container's content (which includes rendered widgets)
                const containerContent = dropzoneContainer.innerHTML;
                // Check container content
                
                // Check for actual rendered content
                const hasRealContent = containerContent.trim() && 
                                     containerContent.length > 50 && // More than just the empty dropzone
                                     (containerContent.includes('portlet') || 
                                      containerContent.includes('widget') ||
                                      containerContent.includes('class=') ||
                                      containerContent.includes('<div') ||
                                      containerContent.includes('<p') ||
                                      containerContent.includes('<a'));
                
                // Mega menu has content, apply styling
                
                if (hasRealContent) {
                    // Copy the container content to mega content area
                    megaContent.innerHTML = containerContent;
                    megaContent.classList.add('has-content');
                    
                    // Add class to parent dropdown for styling
                    const dropdown = megaContent.closest('.jm-dropdown-menu');
                    if (dropdown) {
                        dropdown.classList.add('has-mega-content');
                    }
                    
                    // Content successfully added to mega menu
                } else {
                    megaContent.classList.remove('has-content');
                    megaContent.innerHTML = '';
                    
                    // Remove class from parent dropdown
                    const dropdown = megaContent.closest('.jm-dropdown-menu');
                    if (dropdown) {
                        dropdown.classList.remove('has-mega-content');
                    }
                    
                    // No content found for this mega menu
                }
            }
        }
    }
    
    /**
     * Set up mutation observer to watch for dropzone content changes
     */
    function setupMegaMenuObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach((mutation) => {
                // Check if any mega menu dropzones were modified
                if (mutation.type === 'childList') {
                    const target = mutation.target;
                    if (target.getAttribute && target.getAttribute('data-lfr-drop-zone-id') && 
                        target.getAttribute('data-lfr-drop-zone-id').startsWith('mega-menu-')) {
                        shouldUpdate = true;
                        // Direct dropzone change detected
                    } else if (target.closest && target.closest('[data-lfr-drop-zone-id^="mega-menu-"]')) {
                        shouldUpdate = true;
                        // Nested dropzone change detected
                    }
                }
            });
            
            if (shouldUpdate) {
                // Dropzone content changed, update mega menus
                setTimeout(() => initializeMegaMenuContent(), 200);
            }
        });
        
        // Observe the entire fragment for changes
        observer.observe(fragmentElement, {
            childList: true,
            subtree: true,
            attributes: false
        });
        
        // Mega menu observer active
        
        // Use efficient one-time content sync with debounced updates only
        
        // Watch for changes in all container divs
        for (let i = 1; i <= 5; i++) {
            const container = document.querySelector(`#dropzone-mega-menu-${i}`);
            if (container) {
                observer.observe(container, {
                    childList: true,
                    subtree: true,
                    attributes: false
                });
            }
        }
        

    }
    
    function initializeModals() {

        // Initialize modal functionality
        
        initializeSearchModal();
        initializeLoginModal();
    }
    
    function initializeSearchModal() {
        const searchBtn = fragmentElement.querySelector('.jm-search-btn');
        const searchOverlay = fragmentElement.querySelector('#jm-search-overlay');
        const closeSearch = fragmentElement.querySelector('#jm-close-search');
        
        if (!searchBtn || !searchOverlay) {

            return;
        }

        // Open search modal
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            openSearchModal();
        });
        
        // Close search modal
        if (closeSearch) {
            closeSearch.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeSearchModal();
            });
        }
        
        // Close on overlay click
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearchModal();
            }
        });
        
        // Escape key handling (single listener)
        const escapeHandler = function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('show')) {
                closeSearchModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    function initializeLoginModal() {
        const loginBtn = fragmentElement.querySelector('.jm-login-btn');
        const mobileLoginBtn = fragmentElement.querySelector('.jm-mobile-login-btn');
        const loginOverlay = fragmentElement.querySelector('#jm-login-overlay');
        const closeLogin = fragmentElement.querySelector('#jm-close-login');
        
        if (!loginOverlay) {

            return;
        }

        // Open login modal
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                openLoginModal();
            });
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Close mobile menu first
                const mobileNav = fragmentElement.querySelector('.jm-mobile-nav');
                const mobileToggle = fragmentElement.querySelector('.jm-mobile-menu-toggle');
                if (mobileNav) {
                    mobileNav.classList.remove('show');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
                
                openLoginModal();
            });
        }
        
        // Close login modal
        if (closeLogin) {
            closeLogin.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeLoginModal();
            });
        }
        
        // Close on overlay click
        loginOverlay.addEventListener('click', function(e) {
            if (e.target === loginOverlay) {
                closeLoginModal();
            }
        });
        
        // Escape key handling (single listener)
        const escapeHandler = function(e) {
            if (e.key === 'Escape' && loginOverlay.classList.contains('show')) {
                closeLoginModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    function openSearchModal() {
        const searchOverlay = fragmentElement.querySelector('#jm-search-overlay');
        if (searchOverlay) {
            searchOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus on search input immediately - no setTimeout delay
            const searchInput = searchOverlay.querySelector('input[type="search"], input[type="text"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
    
    function closeSearchModal() {
        const searchOverlay = fragmentElement.querySelector('#jm-search-overlay');
        if (searchOverlay) {
            searchOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    function openLoginModal() {
        const loginOverlay = fragmentElement.querySelector('#jm-login-overlay');
        if (loginOverlay) {
            loginOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeLoginModal() {
        const loginOverlay = fragmentElement.querySelector('#jm-login-overlay');
        if (loginOverlay) {
            loginOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    function initializeEditModeDisplay() {
        // Add edit mode classes to modals for visual indication ONLY in actual edit mode
        // Use even stricter detection to prevent false positives
        const hasActivePageEditor = document.querySelector('.page-editor__sidebar, .page-editor-sidebar, [data-qa-id="pageEditor"]');
        const hasEditableElements = document.querySelector('[contenteditable="true"], .lfr-editable-field');
        const isActuallyEditing = hasActivePageEditor || hasEditableElements;
        
        if (!isInEditMode() || !isActuallyEditing) {

            return;
        }
        
        const searchOverlay = document.querySelector('#jm-search-overlay');
        const loginOverlay = document.querySelector('#jm-login-overlay');
        const languageDropzone = fragmentElement.querySelector('.jm-language-selector-dropzone');
        
        if (searchOverlay) {
            searchOverlay.classList.add('jm-edit-mode');
        }
        
        if (loginOverlay) {
            loginOverlay.classList.add('jm-edit-mode');
        }
        
        if (languageDropzone) {
            languageDropzone.classList.add('jm-edit-mode');
        }
    }
    
    // Sticky header functionality removed entirely for performance optimization
    
})();
