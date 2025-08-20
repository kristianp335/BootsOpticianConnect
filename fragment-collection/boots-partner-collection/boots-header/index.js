/**
 * Boots Header Fragment JavaScript
 * Handles left-sliding menu, notifications, and user profile dropdown
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') return;
    
    let isMenuOpen = false;
    
    /**
     * Initialize header functionality
     */
    function init() {
        initializeMenuToggle();
        initializeNotifications();
        initializeUserProfile();
        initializeKeyboardNavigation();
        bindOutsideClickEvents();
    }
    
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
        
        function toggleMenu() {
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        function openMenu() {
            slidingMenu.classList.add('show');
            overlay.classList.add('show');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            slidingMenu.setAttribute('aria-hidden', 'false');
            
            // Shift main content
            if (mainContent) {
                mainContent.classList.add('menu-open');
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            isMenuOpen = true;
            
            // Focus management
            const firstFocusableElement = slidingMenu.querySelector('.boots-menu-close');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        }
        
        function closeMenu() {
            slidingMenu.classList.remove('show');
            overlay.classList.remove('show');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            slidingMenu.setAttribute('aria-hidden', 'true');
            
            // Restore main content
            if (mainContent) {
                mainContent.classList.remove('menu-open');
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            isMenuOpen = false;
            
            // Return focus to toggle button
            menuToggle.focus();
        }
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        });
    }
    
    /**
     * Notifications dropdown functionality
     */
    function initializeNotifications() {
        const notificationBtn = fragmentElement.querySelector('.boots-notification-btn');
        const notifications = fragmentElement.querySelector('.boots-notifications');
        
        if (!notificationBtn || !notifications) return;
        
        notificationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            closeAllDropdowns();
            
            // Toggle notifications
            notifications.classList.toggle('show');
            
            const isExpanded = notifications.classList.contains('show');
            notificationBtn.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    /**
     * User profile dropdown functionality
     */
    function initializeUserProfile() {
        const profileBtn = fragmentElement.querySelector('.boots-profile-btn');
        const userProfile = fragmentElement.querySelector('.boots-user-profile');
        
        if (!profileBtn || !userProfile) return;
        
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            closeAllDropdowns();
            
            // Toggle profile dropdown
            userProfile.classList.toggle('show');
            
            const isExpanded = userProfile.classList.contains('show');
            profileBtn.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    /**
     * Keyboard navigation support
     */
    function initializeKeyboardNavigation() {
        // Menu navigation
        const menuLinks = fragmentElement.querySelectorAll('.boots-menu-link');
        menuLinks.forEach(function(link, index) {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % menuLinks.length;
                    menuLinks[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + menuLinks.length) % menuLinks.length;
                    menuLinks[prevIndex].focus();
                }
            });
        });
        
        // Dropdown navigation
        const dropdownLinks = fragmentElement.querySelectorAll('.boots-profile-link');
        dropdownLinks.forEach(function(link, index) {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % dropdownLinks.length;
                    dropdownLinks[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + dropdownLinks.length) % dropdownLinks.length;
                    dropdownLinks[prevIndex].focus();
                }
            });
        });
    }
    
    /**
     * Close all open dropdowns
     */
    function closeAllDropdowns() {
        const dropdowns = fragmentElement.querySelectorAll('.boots-notifications, .boots-user-profile');
        dropdowns.forEach(function(dropdown) {
            dropdown.classList.remove('show');
            
            const button = dropdown.querySelector('button[aria-expanded]');
            if (button) {
                button.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    /**
     * Handle outside clicks to close dropdowns
     */
    function bindOutsideClickEvents() {
        document.addEventListener('click', function(e) {
            if (!fragmentElement.contains(e.target) || isMenuOpen) {
                closeAllDropdowns();
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
    
})();
