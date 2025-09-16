/**
 * Scottish Power Header Fragment JavaScript
 * Handles navigation, search, profile menu, and energy status updates
 */

(function() {
    'use strict';
    
    // Ensure fragmentElement is available
    if (typeof fragmentElement === 'undefined') {
        console.error('SP Header: fragmentElement not available');
        return;
    }

    // Create ScottishPower namespace if it doesn't exist
    window.ScottishPower = window.ScottishPower || {};
    window.ScottishPower.header = window.ScottishPower.header || {};

    // Header functionality
    ScottishPower.header = {
        
        /**
         * Initialize header functionality
         */
        init: function() {
            this.setupEventListeners();
            this.loadEnergyStatus();
            this.updateEmployeeProfile();
            this.loadNavigationMenu();
            this.checkEmergencyAlerts();
            
            console.log('SP Header: Initialized successfully');
        },

        /**
         * Set up event listeners for header interactions
         */
        setupEventListeners: function() {
            const header = fragmentElement;
            if (!header) return;

            // Profile menu click handler
            const profileBtn = header.querySelector('.sp-profile-btn');
            if (profileBtn) {
                profileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleProfileMenu();
                });
            }

            // Mobile menu toggle
            const mobileToggle = header.querySelector('.sp-mobile-menu-toggle');
            if (mobileToggle) {
                mobileToggle.addEventListener('click', () => {
                    this.toggleMobileMenu();
                });
            }

            // Search button
            const searchBtn = header.querySelector('.sp-search-btn');
            if (searchBtn) {
                searchBtn.addEventListener('click', () => {
                    this.openSearchModal();
                });
            }

            // Quick action buttons
            const quickActions = header.querySelectorAll('.sp-quick-action');
            quickActions.forEach(action => {
                action.addEventListener('click', (e) => {
                    const actionType = e.currentTarget.getAttribute('data-action');
                    this.handleQuickAction(actionType);
                });
            });

            // Close profile menu when clicking outside
            document.addEventListener('click', (e) => {
                const profileContainer = header.querySelector('.sp-employee-profile');
                if (profileContainer && !profileContainer.contains(e.target)) {
                    this.closeProfileMenu();
                }
            });

            // Escape key handler for modals
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeSearchModal();
                    this.closeProfileMenu();
                }
            });
        },

        /**
         * Load navigation menu from Liferay API
         */
        loadNavigationMenu: function() {
            // Get configuration
            const config = typeof configuration !== 'undefined' ? configuration : {};
            const menuId = config.navigationMenuId;
            
            if (!menuId) {
                console.log('SP Header: No navigation menu ID configured, using fallback');
                return;
            }

            // Build API URL with authentication
            const apiUrl = `/o/headless-delivery/v1.0/navigation-menus/${menuId}?nestedFields=true&p_auth=${window.Liferay?.authToken || ''}`;
            
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Navigation API returned ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.renderNavigation(data);
                })
                .catch(error => {
                    console.warn('SP Header: Failed to load navigation menu:', error);
                    // Fallback navigation is already in HTML
                });
        },

        /**
         * Render navigation menu from API data
         */
        renderNavigation: function(menuData) {
            const navList = fragmentElement.querySelector('#sp-main-nav');
            if (!navList || !menuData.navigationMenuItems) return;

            const config = typeof configuration !== 'undefined' ? configuration : {};
            const sitePrefix = config.sitePrefix || '';

            // Clear existing nav items except mobile menu
            navList.innerHTML = '';

            menuData.navigationMenuItems.forEach(item => {
                const navItem = this.createNavItem(item, sitePrefix);
                navList.appendChild(navItem);
            });
        },

        /**
         * Create navigation item element
         */
        createNavItem: function(item, sitePrefix) {
            const li = document.createElement('li');
            li.className = 'sp-nav-item';

            const link = document.createElement('a');
            link.href = sitePrefix + (item.link || item.url || '#');
            link.className = 'sp-nav-link';
            link.textContent = item.name || item.title || 'Menu Item';

            // Handle dropdown items
            const children = item.navigationMenuItems || item.children || [];
            if (children.length > 0) {
                li.classList.add('sp-nav-dropdown');
                
                const arrow = document.createElement('span');
                arrow.className = 'sp-dropdown-arrow';
                arrow.textContent = '▼';
                link.appendChild(arrow);

                const dropdown = document.createElement('ul');
                dropdown.className = 'sp-dropdown-menu';

                children.forEach(child => {
                    const childLi = document.createElement('li');
                    const childLink = document.createElement('a');
                    childLink.href = sitePrefix + (child.link || child.url || '#');
                    childLink.textContent = child.name || child.title || 'Submenu Item';
                    childLi.appendChild(childLink);
                    dropdown.appendChild(childLi);
                });

                li.appendChild(dropdown);
            }

            li.appendChild(link);
            return li;
        },

        /**
         * Toggle profile dropdown menu
         */
        toggleProfileMenu: function() {
            const profileContainer = fragmentElement.querySelector('.sp-employee-profile');
            const profileMenu = fragmentElement.querySelector('#sp-profile-menu');
            
            if (!profileContainer || !profileMenu) return;

            const isOpen = profileMenu.style.display === 'block';
            
            if (isOpen) {
                profileMenu.style.display = 'none';
                profileContainer.classList.remove('open');
            } else {
                profileMenu.style.display = 'block';
                profileContainer.classList.add('open');
            }
        },

        /**
         * Close profile menu
         */
        closeProfileMenu: function() {
            const profileContainer = fragmentElement.querySelector('.sp-employee-profile');
            const profileMenu = fragmentElement.querySelector('#sp-profile-menu');
            
            if (profileMenu) {
                profileMenu.style.display = 'none';
            }
            if (profileContainer) {
                profileContainer.classList.remove('open');
            }
        },

        /**
         * Toggle mobile navigation menu
         */
        toggleMobileMenu: function() {
            const mobileNav = fragmentElement.querySelector('#sp-mobile-nav');
            if (!mobileNav) return;

            mobileNav.classList.toggle('show');
        },

        /**
         * Open search modal
         */
        openSearchModal: function() {
            const searchOverlay = fragmentElement.querySelector('#sp-search-overlay');
            if (!searchOverlay) return;

            searchOverlay.style.display = 'flex';
            
            // Focus search input
            const searchInput = fragmentElement.querySelector('#sp-search-input');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        },

        /**
         * Close search modal
         */
        closeSearchModal: function() {
            const searchOverlay = fragmentElement.querySelector('#sp-search-overlay');
            if (!searchOverlay) return;

            searchOverlay.style.display = 'none';
            
            // Restore body scroll
            document.body.style.overflow = '';
        },

        /**
         * Handle quick action buttons
         */
        handleQuickAction: function(actionType) {
            switch (actionType) {
                case 'report-issue':
                    this.reportIssue();
                    break;
                case 'emergency':
                    this.showEmergencyContacts();
                    break;
                default:
                    console.log('SP Header: Unknown quick action:', actionType);
            }
        },

        /**
         * Report issue functionality
         */
        reportIssue: function() {
            // In real implementation, this would open a form or redirect to reporting system
            alert('Issue reporting system would open here.\n\nFor immediate assistance, call the emergency line.');
        },

        /**
         * Show emergency contacts
         */
        showEmergencyContacts: function() {
            // In real implementation, this would show a proper modal with contacts
            const contacts = `Emergency Contacts:
            
Network Control: 0800 123 456
Safety Hotline: 0800 789 012
Site Emergency: 0800 345 678

For immediate emergencies, call 999`;
            
            alert(contacts);
        },

        /**
         * Load and update energy status
         */
        loadEnergyStatus: function() {
            const statusElement = fragmentElement.querySelector('#sp-energy-status');
            if (!statusElement) return;

            // Simulate real-time status updates
            this.updateEnergyStatus();
            
            // Update every 30 seconds
            setInterval(() => {
                this.updateEnergyStatus();
            }, 30000);
        },

        /**
         * Update energy status display
         */
        updateEnergyStatus: function() {
            const statusElement = fragmentElement.querySelector('#sp-energy-status');
            if (!statusElement) return;

            // Get current grid status (in real app, this would be from API)
            const gridStatus = window.ScottishPower.grid ? 
                window.ScottishPower.grid.getGridStatus() : 
                { status: 'operational', load: 85 };

            const statusText = statusElement.querySelector('.sp-status-text');
            const statusDetails = statusElement.querySelector('.sp-status-details');

            if (statusText && statusDetails) {
                // Update status classes
                statusElement.className = `sp-energy-status ${gridStatus.status}`;
                
                // Update text content
                const statusLabels = {
                    operational: 'Grid Operational',
                    maintenance: 'Maintenance Mode',
                    alert: 'System Alert'
                };
                
                statusText.textContent = statusLabels[gridStatus.status] || 'Unknown Status';
                statusDetails.textContent = `${gridStatus.load}% Load`;
            }
        },

        /**
         * Update employee profile information
         */
        updateEmployeeProfile: function() {
            const user = window.ScottishPower.auth ? 
                window.ScottishPower.auth.getCurrentUser() : null;
            
            if (!user) return;

            // Update profile avatar initials
            const avatars = fragmentElement.querySelectorAll('.sp-profile-avatar, .sp-profile-avatar-large');
            const initials = user.firstName && user.lastName ? 
                user.firstName[0] + user.lastName[0] : 'EM';
            
            avatars.forEach(avatar => {
                const initialsElement = avatar.querySelector('.sp-avatar-initials') || avatar;
                if (initialsElement.textContent !== initials) {
                    initialsElement.textContent = initials;
                }
            });

            // Update profile name and department
            const profileName = fragmentElement.querySelector('.sp-profile-name');
            if (profileName) {
                profileName.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Employee';
            }

            const profileDept = fragmentElement.querySelector('.sp-profile-dept');
            if (profileDept) {
                profileDept.textContent = user.department || 'General';
            }

            // Update profile menu details
            const menuName = fragmentElement.querySelector('.sp-profile-details h4');
            if (menuName) {
                menuName.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Employee';
            }

            const menuDept = fragmentElement.querySelector('.sp-profile-details p');
            if (menuDept) {
                menuDept.textContent = user.department || 'General';
            }

            const employeeId = fragmentElement.querySelector('.sp-employee-id');
            if (employeeId) {
                employeeId.textContent = user.id || 'SP00000';
            }
        },

        /**
         * Check for emergency alerts
         */
        checkEmergencyAlerts: function() {
            // In real implementation, this would check for active alerts from API
            const shouldShowAlert = Math.random() < 0.3; // 30% chance for demo
            
            if (shouldShowAlert) {
                const alertContainer = fragmentElement.querySelector('#sp-emergency-alerts');
                if (alertContainer) {
                    alertContainer.style.display = 'block';
                }
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => ScottishPower.header.init(), 100);
        });
    } else {
        setTimeout(() => ScottishPower.header.init(), 100);
    }

})();