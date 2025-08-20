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
            searchOverlay.style.display = 'flex';
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
            searchOverlay.style.display = 'none';
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
            if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
                closeSearchModal();
            }
        });
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
     * Render navigation menu in both desktop and mobile containers using API data
     */
    function renderNavigationFromAPI(menuItems) {
        const desktopNav = fragmentElement.querySelector('#boots-main-nav');
        const mobileNav = fragmentElement.querySelector('.boots-mobile-nav-list');
        
        if (!desktopNav || !mobileNav) {
            return;
        }
        
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
        
        // Initialize dropdowns after rendering
        setTimeout(() => {
            initializeDropdowns();
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