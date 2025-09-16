/**
 * Scottish Power Resources Hub Fragment JavaScript
 * Handles resource filtering, search, and category management
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') {
        console.error('SP Resources Hub: fragmentElement not available');
        return;
    }

    window.ScottishPower = window.ScottishPower || {};
    window.ScottishPower.resourcesHub = {
        
        init: function() {
            this.setupEventListeners();
            this.initializeFilters();
            console.log('SP Resources Hub: Initialized successfully');
        },

        setupEventListeners: function() {
            // Category filter buttons
            const filterBtns = fragmentElement.querySelectorAll('.sp-filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleCategoryFilter(e.currentTarget);
                });
            });

            // Search functionality
            const searchInput = fragmentElement.querySelector('#sp-resource-search');
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
            }

            // Resource link tracking
            const resourceLinks = fragmentElement.querySelectorAll('.sp-resource-links a');
            resourceLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const linkText = e.currentTarget.textContent;
                    const category = e.currentTarget.closest('.sp-resource-card').className;
                    this.trackResourceAccess(linkText, category);
                });
            });
        },

        handleCategoryFilter: function(button) {
            const filterBtns = fragmentElement.querySelectorAll('.sp-filter-btn');
            filterBtns.forEach(btn => btn.classList.remove('sp-active'));
            button.classList.add('sp-active');
            
            const category = button.getAttribute('data-category');
            this.filterByCategory(category);
        },

        filterByCategory: function(category) {
            const resourceCards = fragmentElement.querySelectorAll('.sp-resource-card');
            
            resourceCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategory = card.classList.toString();
                    if (cardCategory.includes(`sp-category-${category}`)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        },

        handleSearch: function(searchTerm) {
            if (!searchTerm.trim()) {
                this.filterByCategory('all');
                return;
            }

            const resourceCards = fragmentElement.querySelectorAll('.sp-resource-card');
            const lowercaseSearch = searchTerm.toLowerCase();
            
            resourceCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (cardText.includes(lowercaseSearch)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            this.trackSearch(searchTerm);
        },

        initializeFilters: function() {
            // Initialize with all resources showing
            this.filterByCategory('all');
        },

        trackResourceAccess: function(linkText, category) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'resource_access', {
                    'resource_name': linkText,
                    'resource_category': category,
                    'location': 'resources_hub'
                });
            }
            console.log('SP Resources Hub: Resource accessed:', linkText, category);
        },

        trackSearch: function(searchTerm) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'resource_search', {
                    'search_term': searchTerm,
                    'location': 'resources_hub'
                });
            }
            console.log('SP Resources Hub: Search performed:', searchTerm);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => ScottishPower.resourcesHub.init(), 100);
        });
    } else {
        setTimeout(() => ScottishPower.resourcesHub.init(), 100);
    }

})();