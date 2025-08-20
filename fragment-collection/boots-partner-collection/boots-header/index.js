/**
 * Boots Header Fragment JavaScript
 * Handles left-sliding menu, search modal, login modal, dropzones, notifications, and user profile
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') {
        console.warn('Boots Header: fragmentElement not available');
        return;
    }
    
    let isMenuOpen = false;
    
    /**
     * Initialize all header functionality with delay to ensure DOM is ready
     */
    setTimeout(function() {
        initializeNavigation();
        initializeMenuToggle();
        initializeSearchModal();
        initializeLoginModal();
        initializeDropzones();
        initializeUserProfile();
        initializeKeyboardNavigation();
    }, 100);
    
    /**
     * Left sliding menu functionality
     */
    function initializeMenuToggle() {
        const menuToggle = fragmentElement.querySelector('.boots-menu-toggle');
        const menuClose = fragmentElement.querySelector('.boots-menu-close');
        const slidingMenu = fragmentElement.querySelector('.boots-sliding-menu');
        const overlay = fragmentElement.querySelector('.boots-overlay');
        const mainContent = document.querySelector('#wrapper .boots-main-content') || 
                           document.querySelector('#wrapper');
        
        if (!menuToggle || !slidingMenu) return;
        
        function toggleMenu() {
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        function openMenu() {
            isMenuOpen = true;
            slidingMenu.classList.add('active');
            slidingMenu.setAttribute('aria-hidden', 'false');
            menuToggle.setAttribute('aria-expanded', 'true');
            
            if (mainContent) {
                mainContent.classList.add('menu-open');
            }
            
            // Focus management
            setTimeout(() => {
                const firstFocusableElement = slidingMenu.querySelector('a, button');
                if (firstFocusableElement) {
                    firstFocusableElement.focus();
                }
            }, 300);
        }
        
        function closeMenu() {
            isMenuOpen = false;
            slidingMenu.classList.remove('active');
            slidingMenu.setAttribute('aria-hidden', 'true');
            menuToggle.setAttribute('aria-expanded', 'false');
            
            if (mainContent) {
                mainContent.classList.remove('menu-open');
            }
            
            // Return focus to toggle button
            menuToggle.focus();
        }
        
        // Menu toggle click
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Menu close click
        if (menuClose) {
            menuClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        }
        
        // Overlay click
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeMenu();
            });
        }
        
        // Menu link clicks
        const menuLinks = fragmentElement.querySelectorAll('.boots-menu-link');
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Update active state
                menuLinks.forEach(function(l) { l.classList.remove('active'); });
                this.classList.add('active');
                
                // Close menu on mobile after navigation
                if (window.innerWidth <= 768) {
                    setTimeout(function() {
                        closeMenu();
                    }, 300);
                }
            });
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!slidingMenu.contains(e.target) && 
                !menuToggle.contains(e.target) && 
                isMenuOpen) {
                closeMenu();
            }
        });
    }
    
    /**
     * Search modal functionality
     */
    function initializeSearchModal() {
        const searchBtn = fragmentElement.querySelector('.boots-search-btn');
        const searchOverlay = fragmentElement.querySelector('#boots-search-overlay');
        const searchClose = fragmentElement.querySelector('#boots-close-search');
        
        if (!searchBtn || !searchOverlay) return;
        
        function openSearchModal() {
            searchOverlay.classList.add('active');
            searchOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus on first input if available
            setTimeout(() => {
                const firstInput = searchOverlay.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
        }
        
        function closeSearchModal() {
            searchOverlay.classList.remove('active');
            searchOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (searchBtn) searchBtn.focus();
        }
        
        // Search button click
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSearchModal();
        });
        
        // Close button click
        if (searchClose) {
            searchClose.addEventListener('click', function(e) {
                e.preventDefault();
                closeSearchModal();
            });
        }
        
        // Click outside modal to close
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearchModal();
            }
        });
        
        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearchModal();
            }
        });
        
        // Show modal in edit mode for dropzone access
        if (isInEditMode()) {
            searchOverlay.classList.add('edit-mode-visible');
        }
    }
    
    /**
     * Login modal functionality
     */
    function initializeLoginModal() {
        const loginBtn = fragmentElement.querySelector('#boots-login-btn');
        const loginOverlay = fragmentElement.querySelector('#boots-login-overlay');
        const loginClose = fragmentElement.querySelector('#boots-close-login');
        
        if (!loginBtn || !loginOverlay) return;
        
        function openLoginModal() {
            loginOverlay.style.display = 'flex';
            loginOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus on username input if available
            setTimeout(() => {
                const usernameInput = loginOverlay.querySelector('input[name="_58_login"], input[name="login"]');
                if (usernameInput) {
                    usernameInput.focus();
                }
            }, 100);
        }
        
        function closeLoginModal() {
            loginOverlay.style.display = 'none';
            loginOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (loginBtn) loginBtn.focus();
        }
        
        // Login button click
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openLoginModal();
        });
        
        // Close button click
        if (loginClose) {
            loginClose.addEventListener('click', function(e) {
                e.preventDefault();
                closeLoginModal();
            });
        }
        
        // Click outside modal to close
        loginOverlay.addEventListener('click', function(e) {
            if (e.target === loginOverlay) {
                closeLoginModal();
            }
        });
        
        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginOverlay.style.display === 'flex') {
                closeLoginModal();
            }
        });
    }
    
    /**
     * Dropzone content synchronization
     */
    function initializeDropzones() {
        // Language selector dropzone
        const languageDropzone = fragmentElement.querySelector('[data-lfr-drop-zone-id="language-selector"]');
        
        if (languageDropzone) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        const hasContent = languageDropzone.children.length > 0;
                        const parentContainer = languageDropzone.closest('.boots-language-selector-dropzone');
                        
                        if (parentContainer) {
                            if (hasContent) {
                                parentContainer.classList.add('has-content');
                            } else {
                                parentContainer.classList.remove('has-content');
                            }
                        }
                    }
                });
            });
            
            observer.observe(languageDropzone, { 
                childList: true, 
                subtree: true 
            });
            
            // Initial content check
            const hasContent = languageDropzone.children.length > 0;
            const parentContainer = languageDropzone.closest('.boots-language-selector-dropzone');
            
            if (parentContainer) {
                if (hasContent) {
                    parentContainer.classList.add('has-content');
                } else {
                    parentContainer.classList.remove('has-content');
                }
            }
        }
        
        // Search dropzone - just ensure it's visible in edit mode
        const searchDropzone = fragmentElement.querySelector('[data-lfr-drop-zone-id="search"]');
        if (searchDropzone) {
            // No synchronization needed - Liferay handles dropzone content
        }
    }
    
    /**
     * Get fragment configuration safely
     */
    function getFragmentConfiguration() {
        try {
            return (typeof configuration !== 'undefined') ? configuration : {};
        } catch (error) {
            return {};
        }
    }
    
    /**
     * Check if we're in edit mode - more specific detection
     */
    function isInEditMode() {
        return document.querySelector('[data-editor-enabled="true"]') ||
               document.querySelector('.is-edit-mode') ||
               document.querySelector('body.has-edit-mode-menu') ||
               (typeof Liferay !== 'undefined' && Liferay.Layout && 
                typeof Liferay.Layout.layoutInfo !== 'undefined' && 
                Liferay.Layout.layoutInfo.freeformMode);
    }
    
    /**
     * Initialize navigation from Liferay API or fallback
     */
    function initializeNavigation() {
        if (isInEditMode()) {
            // Show sample navigation in edit mode
            const sampleNav = getSampleNavigation();
            renderNavigationFromAPI(sampleNav);
        } else {
            // Load from API in live mode
            loadNavigationMenu();
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
                name: 'Dashboard',
                url: '/dashboard',
                children: [
                    { name: 'Overview', url: '/dashboard/overview' },
                    { name: 'Analytics', url: '/dashboard/analytics' },
                    { name: 'Reports', url: '/dashboard/reports' }
                ]
            },
            {
                name: 'Training',
                url: '/training',
                children: [
                    { name: 'Available Courses', url: '/training/courses' },
                    { name: 'My Progress', url: '/training/progress' },
                    { name: 'Certifications', url: '/training/certifications' }
                ]
            },
            {
                name: 'Case Management',
                url: '/cases',
                children: [
                    { name: 'Active Cases', url: '/cases/active' },
                    { name: 'Case History', url: '/cases/history' },
                    { name: 'Create New', url: '/cases/new' }
                ]
            },
            {
                name: 'Resources',
                url: '/resources'
            },
            {
                name: 'Support',
                url: '/support'
            }
        ];
        
        renderNavigationFromAPI(fallbackNav);
    }
    
    /**
     * Get sample navigation for edit mode
     */
    function getSampleNavigation() {
        return [
            { name: 'Dashboard', url: '/dashboard' },
            { name: 'Training', url: '/training' },
            { name: 'Case Management', url: '/cases' },
            { name: 'Resources', url: '/resources' },
            { name: 'Support', url: '/support' }
        ];
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
            // Extract everything up to the last slash: /web/boots-partners/home -> /web/boots-partners/
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
    
    /**
     * Render navigation menu in sliding menu using API data
     */
    function renderNavigationFromAPI(menuItems) {
        const slidingMenuList = fragmentElement.querySelector('.boots-menu-list');
        const mobileNav = fragmentElement.querySelector('.boots-mobile-nav-list');
        
        if (!slidingMenuList) {
            return;
        }
        
        // Clear existing navigation items (keep static content)
        const existingNavItems = slidingMenuList.querySelectorAll('.boots-menu-item');
        existingNavItems.forEach(item => item.remove());
        
        // Render sliding menu navigation
        menuItems.forEach(item => {
            const menuItem = createSlidingMenuItemFromAPI(item);
            slidingMenuList.appendChild(menuItem);
        });
        
        // Render mobile navigation if container exists
        if (mobileNav) {
            mobileNav.innerHTML = '';
            menuItems.forEach(item => {
                const mobileItem = createNavItemFromAPI(item, true);
                mobileNav.appendChild(mobileItem);
            });
        }
        
        // Initialize sliding menu interactions
        setTimeout(() => {
            initializeSlidingMenuItems();
        }, 100);
    }
    
    /**
     * Create sliding menu item from API data
     */
    function createSlidingMenuItemFromAPI(item) {
        const children = item.navigationMenuItems || item.children || [];
        const hasChildren = children.length > 0;
        
        const listItem = document.createElement('li');
        listItem.className = 'boots-menu-item';
        
        if (hasChildren) {
            listItem.classList.add('has-submenu');
        }
        
        // Create main link with icon
        const link = document.createElement('a');
        const originalUrl = item.link || item.url || '#';
        const builtUrl = buildPageURL(originalUrl);

        link.href = builtUrl;
        link.className = 'boots-menu-link';
        
        // Add appropriate icon based on name
        const iconSvg = getMenuIcon(item.name || item.title);
        link.innerHTML = `${iconSvg} ${item.name || item.title}`;
        
        if (item.external) {
            link.target = '_blank';
            link.rel = 'noopener';
        }
        
        listItem.appendChild(link);
        
        // Add submenu if has children
        if (hasChildren) {
            const submenu = document.createElement('ul');
            submenu.className = 'boots-submenu';
            
            children.forEach(child => {
                const childItem = document.createElement('li');
                childItem.className = 'boots-submenu-item';
                
                const childLink = document.createElement('a');
                childLink.href = buildPageURL(child.link || child.url || '#');
                childLink.textContent = child.name || child.title;
                childLink.className = 'boots-submenu-link';
                
                if (child.external) {
                    childLink.target = '_blank';
                    childLink.rel = 'noopener';
                }
                
                childItem.appendChild(childLink);
                submenu.appendChild(childItem);
            });
            
            listItem.appendChild(submenu);
        }
        
        return listItem;
    }
    
    /**
     * Get appropriate icon for menu item
     */
    function getMenuIcon(itemName) {
        const name = (itemName || '').toLowerCase();
        
        if (name.includes('dashboard')) {
            return '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10C2 10 5 4 10 4S18 10 18 10S15 16 10 16S2 10 2 10Z" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/></svg>';
        } else if (name.includes('training')) {
            return '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 3H6C7.1 3 8.1 3.4 8.8 4.1L10 5.3C10.7 6 11.7 6.4 12.8 6.4H18V15C18 16.1 17.1 17 16 17H4C2.9 17 2 16.1 2 15V3Z" stroke="currentColor" stroke-width="2"/></svg>';
        } else if (name.includes('case')) {
            return '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 7V5C8 3.9 8.9 3 10 3S12 3.9 12 5V7" stroke="currentColor" stroke-width="2"/></svg>';
        } else if (name.includes('resource')) {
            return '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V4C16 2.9 15.1 2 14 2Z" stroke="currentColor" stroke-width="2"/><path d="M7 6H13M7 10H13M7 14H10" stroke="currentColor" stroke-width="2"/></svg>';
        } else if (name.includes('support')) {
            return '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/><path d="M10 6V10L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
        } else {
            return '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/><path d="M10 1V4M10 16V19M4.22 4.22L6.34 6.34M13.66 13.66L15.78 15.78M1 10H4M16 10H19M4.22 15.78L6.34 13.66M13.66 6.34L15.78 4.22" stroke="currentColor" stroke-width="2"/></svg>';
        }
    }
    
    /**
     * Initialize sliding menu item interactions
     */
    function initializeSlidingMenuItems() {
        const menuItems = fragmentElement.querySelectorAll('.boots-menu-item.has-submenu');
        
        menuItems.forEach(item => {
            const link = item.querySelector('.boots-menu-link');
            const submenu = item.querySelector('.boots-submenu');
            
            if (!link || !submenu) return;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Toggle submenu
                const isOpen = item.classList.contains('open');
                
                // Close all other submenus
                menuItems.forEach(otherItem => {
                    otherItem.classList.remove('open');
                });
                
                // Toggle current submenu
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
        
        // Close submenu when clicking submenu link
        const submenuLinks = fragmentElement.querySelectorAll('.boots-submenu-link');
        submenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu on mobile after navigation
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        const slidingMenu = fragmentElement.querySelector('.boots-sliding-menu');
                        if (slidingMenu) slidingMenu.classList.remove('active');
                    }, 300);
                }
            });
        });
    }
    
    /**
     * Create navigation item element from API data
     */
    function createNavItemFromAPI(item, isMobile) {
        // Check for navigationMenuItems (API response) or children (fallback)
        const children = item.navigationMenuItems || item.children || [];
        const hasChildren = children.length > 0;
        
        const listItem = document.createElement('li');
        listItem.className = isMobile ? 'boots-mobile-nav-item' : 'boots-nav-item';
        
        if (hasChildren) {
            listItem.classList.add('has-dropdown');
            if (!isMobile) {
                listItem.classList.add('boots-has-dropdown');
            }
        }
        
        // Create main link
        const link = document.createElement('a');
        const originalUrl = item.link || item.url || '#';
        const builtUrl = buildPageURL(originalUrl);

        link.href = builtUrl;
        link.textContent = item.name || item.title;
        link.className = isMobile ? 'boots-mobile-nav-link' : 'boots-nav-link';
        
        if (item.external) {
            link.target = '_blank';
            link.rel = 'noopener';
        }
        
        // Add dropdown arrow for desktop items with children
        if (hasChildren && !isMobile) {
            link.setAttribute('aria-expanded', 'false');
            link.setAttribute('aria-haspopup', 'true');
            
            const arrow = document.createElement('span');
            arrow.className = 'boots-nav-arrow';
            arrow.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>';
            link.appendChild(arrow);
        }
        
        listItem.appendChild(link);
        
        // Add dropdown menu for desktop or submenu for mobile
        if (hasChildren) {
            if (isMobile) {
                const dropdown = document.createElement('div');
                dropdown.className = 'boots-mobile-dropdown-menu';
                
                children.forEach(child => {
                    const childLink = document.createElement('a');
                    childLink.href = buildPageURL(child.link || child.url || '#');
                    childLink.textContent = child.name || child.title;
                    childLink.className = 'boots-mobile-dropdown-item';
                    
                    if (child.external) {
                        childLink.target = '_blank';
                        childLink.rel = 'noopener';
                    }
                    
                    dropdown.appendChild(childLink);
                });
                
                listItem.appendChild(dropdown);
            } else {
                // Desktop dropdown
                const dropdown = document.createElement('div');
                dropdown.className = 'boots-dropdown-menu';
                
                children.forEach(child => {
                    const childLink = document.createElement('a');
                    childLink.href = buildPageURL(child.link || child.url || '#');
                    childLink.textContent = child.name || child.title;
                    childLink.className = 'boots-dropdown-item';
                    
                    if (child.external) {
                        childLink.target = '_blank';
                        childLink.rel = 'noopener';
                    }
                    
                    dropdown.appendChild(childLink);
                });
                
                listItem.appendChild(dropdown);
            }
        }
        
        return listItem;
    }
    
    /**
     * Initialize dropdown functionality for navigation menus
     */
    function initializeDropdowns() {
        const dropdownItems = fragmentElement.querySelectorAll('.boots-nav-item.has-dropdown');
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('.boots-nav-link');
            const dropdown = item.querySelector('.boots-dropdown-menu');
            
            if (!link || !dropdown) return;
            
            // Hover to show
            item.addEventListener('mouseenter', () => {
                dropdown.style.display = 'block';
                link.setAttribute('aria-expanded', 'true');
            });
            
            // Hover to hide
            item.addEventListener('mouseleave', () => {
                dropdown.style.display = 'none';
                link.setAttribute('aria-expanded', 'false');
            });
            
            // Click to toggle
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const isVisible = dropdown.style.display === 'block';
                dropdown.style.display = isVisible ? 'none' : 'block';
                link.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
            });
            
            // Keyboard navigation
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    dropdown.style.display = 'block';
                    link.setAttribute('aria-expanded', 'true');
                    const firstItem = dropdown.querySelector('.boots-dropdown-item');
                    if (firstItem) firstItem.focus();
                }
            });
        });
    }
    
    /**
     * User profile - using Liferay user personal bar
     */
    function initializeUserProfile() {
        // User personal bar is handled by Liferay - no custom JavaScript needed
        // [@liferay.user_personal_bar /] handles all user profile functionality
    }
    
    /**
     * Keyboard navigation support
     */
    function initializeKeyboardNavigation() {
        // Add keyboard navigation for menu items
        const menuLinks = fragmentElement.querySelectorAll('.boots-menu-link');
        
        menuLinks.forEach(function(link) {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Add keyboard navigation for action buttons
        const actionButtons = fragmentElement.querySelectorAll('.boots-search-btn, .boots-login-btn');
        
        actionButtons.forEach(function(button) {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
})();