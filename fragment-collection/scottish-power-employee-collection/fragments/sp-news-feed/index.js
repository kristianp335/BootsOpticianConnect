/**
 * Scottish Power News Feed Fragment JavaScript
 * Handles news filtering, search, and interactions
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') {
        console.error('SP News Feed: fragmentElement not available');
        return;
    }

    window.ScottishPower = window.ScottishPower || {};
    window.ScottishPower.newsFeed = {
        
        init: function() {
            this.setupEventListeners();
            this.initializeFilters();
            console.log('SP News Feed: Initialized successfully');
        },

        setupEventListeners: function() {
            const filterBtns = fragmentElement.querySelectorAll('.sp-filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleFilter(e.currentTarget);
                });
            });
        },

        handleFilter: function(button) {
            const filterBtns = fragmentElement.querySelectorAll('.sp-filter-btn');
            filterBtns.forEach(btn => btn.classList.remove('sp-active'));
            button.classList.add('sp-active');
            
            const filterValue = button.getAttribute('data-filter');
            this.filterNews(filterValue);
        },

        filterNews: function(category) {
            const newsItems = fragmentElement.querySelectorAll('.sp-news-item');
            newsItems.forEach(item => {
                if (category === 'all') {
                    item.style.display = 'block';
                } else {
                    const itemCategory = item.querySelector('.sp-news-category').textContent.toLowerCase();
                    item.style.display = itemCategory.includes(category) ? 'block' : 'none';
                }
            });
        },

        initializeFilters: function() {
            // Initialize with all news showing
            this.filterNews('all');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => ScottishPower.newsFeed.init(), 100);
        });
    } else {
        setTimeout(() => ScottishPower.newsFeed.init(), 100);
    }

})();