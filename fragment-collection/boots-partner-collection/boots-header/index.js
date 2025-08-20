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
        initializeMenuToggle();
        initializeSearchModal();
        initializeLoginModal();
        initializeDropzones();
        initializeNotifications();
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
        const searchBtn = fragmentElement.querySelector('#boots-search-btn');
        const searchOverlay = fragmentElement.querySelector('#boots-search-overlay');
        const searchClose = fragmentElement.querySelector('.boots-search-close');
        const searchBackdrop = fragmentElement.querySelector('.boots-search-backdrop');
        
        if (!searchBtn || !searchOverlay) return;
        
        function openSearchModal() {
            searchOverlay.style.display = 'flex';
            searchOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus on search input if available
            setTimeout(() => {
                const searchInput = searchOverlay.querySelector('input[type="search"], input[type="text"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
        }
        
        function closeSearchModal() {
            searchOverlay.style.display = 'none';
            searchOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            searchBtn.focus();
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
        
        // Backdrop click
        if (searchBackdrop) {
            searchBackdrop.addEventListener('click', function(e) {
                if (e.target === searchBackdrop) {
                    closeSearchModal();
                }
            });
        }
        
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
        const loginClose = fragmentElement.querySelector('.boots-login-close');
        const loginBackdrop = fragmentElement.querySelector('.boots-login-backdrop');
        
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
            loginBtn.focus();
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
        
        // Backdrop click
        if (loginBackdrop) {
            loginBackdrop.addEventListener('click', function(e) {
                if (e.target === loginBackdrop) {
                    closeLoginModal();
                }
            });
        }
        
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
        const languageDropzone = document.querySelector('#dropzone-language-selector');
        
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
        
        // Search dropzone synchronization
        const searchDropzone = document.querySelector('#dropzone-search-portlet');
        if (searchDropzone) {
            const searchContent = fragmentElement.querySelector('.boots-search-fallback');
            if (searchContent && searchDropzone.innerHTML.trim() !== '') {
                // Copy dropzone content to search modal if available
                searchContent.innerHTML = searchDropzone.innerHTML;
            }
        }
    }
    
    /**
     * Notifications dropdown functionality
     */
    function initializeNotifications() {
        const notificationBtn = fragmentElement.querySelector('.boots-notification-btn');
        const notificationDropdown = fragmentElement.querySelector('.boots-notifications-dropdown');
        
        if (!notificationBtn || !notificationDropdown) return;
        
        notificationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            notificationDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.classList.remove('show');
            }
        });
    }
    
    /**
     * User profile dropdown functionality
     */
    function initializeUserProfile() {
        const profileBtn = fragmentElement.querySelector('.boots-profile-btn');
        const profileDropdown = fragmentElement.querySelector('.boots-profile-dropdown');
        
        if (!profileBtn || !profileDropdown) return;
        
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
                profileBtn.setAttribute('aria-expanded', 'false');
            }
        });
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
        const actionButtons = fragmentElement.querySelectorAll('.boots-search-btn, .boots-login-btn, .boots-notification-btn, .boots-profile-btn');
        
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