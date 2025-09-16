/**
 * Scottish Power Directory Fragment JavaScript
 * Handles employee search, filtering, and directory interactions
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') {
        console.error('SP Directory: fragmentElement not available');
        return;
    }

    window.ScottishPower = window.ScottishPower || {};
    window.ScottishPower.directory = {
        
        init: function() {
            this.setupEventListeners();
            this.initializeFilters();
            console.log('SP Directory: Initialized successfully');
        },

        setupEventListeners: function() {
            // Department filter buttons
            const deptBtns = fragmentElement.querySelectorAll('.sp-dept-btn');
            deptBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleDepartmentFilter(e.currentTarget);
                });
            });

            // Advanced search
            const searchInput = fragmentElement.querySelector('#sp-directory-search');
            const searchBtn = fragmentElement.querySelector('.sp-search-btn');
            
            if (searchInput && searchBtn) {
                searchBtn.addEventListener('click', () => {
                    this.handleSearch(searchInput.value);
                });

                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.handleSearch(searchInput.value);
                    }
                });

                // Real-time search as user types
                searchInput.addEventListener('input', (e) => {
                    this.debounceSearch(e.target.value);
                });
            }

            // Filter dropdowns
            const departmentFilter = fragmentElement.querySelector('#sp-department-filter');
            const locationFilter = fragmentElement.querySelector('#sp-location-filter');
            
            if (departmentFilter) {
                departmentFilter.addEventListener('change', (e) => {
                    this.filterByDepartment(e.target.value);
                });
            }
            
            if (locationFilter) {
                locationFilter.addEventListener('change', (e) => {
                    this.filterByLocation(e.target.value);
                });
            }

            // Employee card interactions
            const employeeCards = fragmentElement.querySelectorAll('.sp-employee-card');
            employeeCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    // Don't trigger card click if clicking on contact links
                    if (!e.target.closest('.sp-contact-link')) {
                        this.handleEmployeeCardClick(card);
                    }
                });
            });

            // Contact link tracking
            const contactLinks = fragmentElement.querySelectorAll('.sp-contact-link');
            contactLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const employeeName = e.currentTarget.closest('.sp-employee-card').querySelector('.sp-employee-name').textContent;
                    const contactType = e.currentTarget.textContent.toLowerCase();
                    this.trackContactClick(employeeName, contactType);
                });
            });
        },

        handleDepartmentFilter: function(button) {
            const deptBtns = fragmentElement.querySelectorAll('.sp-dept-btn');
            deptBtns.forEach(btn => btn.classList.remove('sp-active'));
            button.classList.add('sp-active');
            
            const department = button.getAttribute('data-dept');
            this.filterByDepartment(department);
        },

        filterByDepartment: function(department) {
            const employeeCards = fragmentElement.querySelectorAll('.sp-employee-card');
            
            employeeCards.forEach(card => {
                const cardDept = card.getAttribute('data-department');
                
                if (department === 'all' || department === '' || cardDept === department) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            this.updateResultsCount();
        },

        filterByLocation: function(location) {
            const employeeCards = fragmentElement.querySelectorAll('.sp-employee-card');
            
            employeeCards.forEach(card => {
                const locationText = card.querySelector('.sp-employee-location')?.textContent.toLowerCase() || '';
                
                if (location === '' || locationText.includes(location.toLowerCase())) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            this.updateResultsCount();
        },

        handleSearch: function(searchTerm) {
            if (!searchTerm.trim()) {
                this.showAllEmployees();
                return;
            }

            const employeeCards = fragmentElement.querySelectorAll('.sp-employee-card');
            const lowercaseSearch = searchTerm.toLowerCase();
            
            employeeCards.forEach(card => {
                const searchableText = this.getSearchableText(card);
                
                if (searchableText.includes(lowercaseSearch)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            this.updateResultsCount();
            this.trackSearch(searchTerm);
        },

        getSearchableText: function(card) {
            const name = card.querySelector('.sp-employee-name')?.textContent || '';
            const title = card.querySelector('.sp-employee-title')?.textContent || '';
            const department = card.querySelector('.sp-employee-department')?.textContent || '';
            const location = card.querySelector('.sp-employee-location')?.textContent || '';
            
            return `${name} ${title} ${department} ${location}`.toLowerCase();
        },

        debounceSearch: function(searchTerm) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.handleSearch(searchTerm);
            }, 300);
        },

        showAllEmployees: function() {
            const employeeCards = fragmentElement.querySelectorAll('.sp-employee-card');
            employeeCards.forEach(card => {
                card.style.display = 'block';
            });
            this.updateResultsCount();
        },

        updateResultsCount: function() {
            const visibleCards = fragmentElement.querySelectorAll('.sp-employee-card[style*=\"block\"], .sp-employee-card:not([style])');
            const totalCards = fragmentElement.querySelectorAll('.sp-employee-card');
            
            console.log(`SP Directory: Showing ${visibleCards.length} of ${totalCards.length} employees`);
        },

        handleEmployeeCardClick: function(card) {
            const employeeName = card.querySelector('.sp-employee-name')?.textContent || 'Employee';
            
            // Add visual feedback
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);

            this.trackEmployeeView(employeeName);
            
            // In real implementation, this would open employee profile
            console.log('SP Directory: Employee profile clicked:', employeeName);
        },

        initializeFilters: function() {
            // Initialize with all employees showing
            this.showAllEmployees();
        },

        trackSearch: function(searchTerm) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'directory_search', {
                    'search_term': searchTerm,
                    'location': 'employee_directory'
                });
            }
            console.log('SP Directory: Search performed:', searchTerm);
        },

        trackEmployeeView: function(employeeName) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'employee_profile_view', {
                    'employee_name': employeeName,
                    'location': 'employee_directory'
                });
            }
            console.log('SP Directory: Employee profile viewed:', employeeName);
        },

        trackContactClick: function(employeeName, contactType) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'employee_contact_click', {
                    'employee_name': employeeName,
                    'contact_type': contactType,
                    'location': 'employee_directory'
                });
            }
            console.log('SP Directory: Contact clicked:', employeeName, contactType);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => ScottishPower.directory.init(), 100);
        });
    } else {
        setTimeout(() => ScottishPower.directory.init(), 100);
    }

})();