/**
 * Boots Case Management Fragment JavaScript
 * Handles case filtering, view switching, and interactive elements
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') return;
    
    let currentFilter = 'all';
    let currentView = 'list';
    
    /**
     * Initialize case management functionality
     */
    function init() {
        initializeCounters();
        initializeFilters();
        initializeViewSwitcher();
        initializeCaseActions();
        initializeSearch();
        bindInteractionEvents();
        
        // Set initial filter from configuration
        const defaultFilter = getConfigurationValue('defaultFilter', 'active');
        const defaultView = getConfigurationValue('caseView', 'list');
        
        setActiveFilter(defaultFilter);
        setActiveView(defaultView);
    }
    
    /**
     * Get configuration value from fragment
     */
    function getConfigurationValue(key, defaultValue) {
        const element = fragmentElement.querySelector(`[data-${key}]`);
        return element ? element.dataset[key] : defaultValue;
    }
    
    /**
     * Initialize animated counters
     */
    function initializeCounters() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target) || 0;
                    animateCounter(counter, 0, target);
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);
        
        const counters = fragmentElement.querySelectorAll('[data-counter]');
        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    }
    
    /**
     * Animate counter with easing
     */
    function animateCounter(element, start, end, duration = 2000) {
        let current = start;
        const increment = (end - start) / (duration / 16);
        const timer = setInterval(function() {
            current += increment;
            if (current >= end) {
                element.textContent = formatCounterValue(end, element.textContent);
                clearInterval(timer);
            } else {
                element.textContent = formatCounterValue(Math.floor(current), element.textContent);
            }
        }, 16);
    }
    
    /**
     * Format counter values
     */
    function formatCounterValue(value, originalText) {
        // Preserve original suffix (like 'm' for minutes)
        if (originalText && originalText.includes('m') && !originalText.includes('month')) {
            return value + 'm';
        }
        return value.toString();
    }
    
    /**
     * Initialize case filtering
     */
    function initializeFilters() {
        const filterButtons = fragmentElement.querySelectorAll('.sp-filter-btn');
        
        filterButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const filter = this.dataset.filter;
                setActiveFilter(filter);
                filterCases(filter);
            });
        });
    }
    
    /**
     * Set active filter button
     */
    function setActiveFilter(filter) {
        currentFilter = filter;
        
        const filterButtons = fragmentElement.querySelectorAll('.sp-filter-btn');
        filterButtons.forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
    }
    
    /**
     * Filter cases based on status
     */
    function filterCases(filter) {
        const caseItems = fragmentElement.querySelectorAll('.sp-case-item');
        let visibleCount = 0;
        
        caseItems.forEach(function(caseItem, index) {
            const caseStatus = caseItem.dataset.status || '';
            const shouldShow = filter === 'all' || caseStatus.includes(filter);
            
            if (shouldShow) {
                visibleCount++;
                caseItem.classList.remove('hidden');
                caseItem.style.display = 'block';
                
                // Staggered animation
                setTimeout(function() {
                    caseItem.style.opacity = '1';
                    caseItem.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                caseItem.classList.add('hidden');
                caseItem.style.opacity = '0';
                caseItem.style.transform = 'translateY(-20px)';
                
                setTimeout(function() {
                    caseItem.style.display = 'none';
                }, 300);
            }
        });
        
        // Show empty state if no cases match filter
        toggleEmptyState(visibleCount === 0);
    }
    
    /**
     * Toggle empty state display
     */
    function toggleEmptyState(show) {
        let emptyState = fragmentElement.querySelector('.sp-cases-empty');
        
        if (show && !emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'sp-cases-empty';
            emptyState.innerHTML = `
                <h3>No cases found</h3>
                <p>There are no cases matching the current filter. Try adjusting your search criteria or create a new case.</p>
                <a href="/cases/new" class="sp-btn sp-btn-primary">Create New Case</a>
            `;
            
            const container = fragmentElement.querySelector('.sp-cases-container');
            container.appendChild(emptyState);
        } else if (!show && emptyState) {
            emptyState.remove();
        }
    }
    
    /**
     * Initialize view switcher
     */
    function initializeViewSwitcher() {
        const viewButtons = fragmentElement.querySelectorAll('.sp-view-btn');
        
        viewButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const view = this.dataset.view;
                setActiveView(view);
                switchView(view);
            });
        });
    }
    
    /**
     * Set active view button
     */
    function setActiveView(view) {
        currentView = view;
        
        const viewButtons = fragmentElement.querySelectorAll('.sp-view-btn');
        viewButtons.forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });
    }
    
    /**
     * Switch case view layout
     */
    function switchView(view) {
        const casesSection = fragmentElement.querySelector('.sp-cases-section');
        if (casesSection) {
            casesSection.dataset.view = view;
            
            // Add transition effect
            casesSection.style.opacity = '0.7';
            setTimeout(function() {
                casesSection.style.opacity = '1';
            }, 200);
        }
    }
    
    /**
     * Initialize case actions
     */
    function initializeCaseActions() {
        // Update Status buttons
        const updateButtons = fragmentElement.querySelectorAll('[data-case-action="update"]');
        updateButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handleUpdateStatus(this);
            });
        });
        
        // Add Notes buttons
        const noteButtons = fragmentElement.querySelectorAll('[data-case-action="notes"]');
        noteButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handleAddNotes(this);
            });
        });
        
        // Schedule Appointment buttons
        const scheduleButtons = fragmentElement.querySelectorAll('[data-case-action="schedule"]');
        scheduleButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handleScheduleAppointment(this);
            });
        });
        
        // Archive buttons
        const archiveButtons = fragmentElement.querySelectorAll('[data-case-action="archive"]');
        archiveButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handleArchiveCase(this);
            });
        });
    }
    
    /**
     * Handle status update
     */
    function handleUpdateStatus(button) {
        const caseItem = button.closest('.sp-case-item');
        const statusElement = caseItem.querySelector('.sp-status');
        
        if (statusElement) {
            // Cycle through statuses
            const currentStatus = statusElement.textContent.trim();
            let newStatus, newClass;
            
            switch (currentStatus) {
                case 'Active':
                    newStatus = 'Pending';
                    newClass = 'sp-status-info';
                    break;
                case 'Pending':
                    newStatus = 'Completed';
                    newClass = 'sp-status-success';
                    break;
                case 'Completed':
                    newStatus = 'Active';
                    newClass = 'sp-status-warning';
                    break;
                default:
                    newStatus = 'Active';
                    newClass = 'sp-status-warning';
            }
            
            // Update status with animation
            statusElement.style.transform = 'scale(0.8)';
            setTimeout(function() {
                statusElement.textContent = newStatus;
                statusElement.className = 'sp-status ' + newClass;
                statusElement.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Visual feedback
        button.innerHTML = 'Updated!';
        button.disabled = true;
        setTimeout(function() {
            button.innerHTML = 'Update Status';
            button.disabled = false;
        }, 2000);
    }
    
    /**
     * Handle add notes
     */
    function handleAddNotes(button) {
        // Visual feedback
        button.innerHTML = 'Notes Added';
        button.classList.add('sp-btn-outline');
        button.disabled = true;
        
        setTimeout(function() {
            button.innerHTML = 'Add Notes';
            button.classList.remove('sp-btn-outline');
            button.disabled = false;
        }, 2000);
    }
    
    /**
     * Handle schedule appointment
     */
    function handleScheduleAppointment(button) {
        button.innerHTML = 'Scheduled!';
        button.classList.remove('sp-btn-outline');
        button.classList.add('sp-btn-primary');
        button.disabled = true;
    }
    
    /**
     * Handle archive case
     */
    function handleArchiveCase(button) {
        const caseItem = button.closest('.sp-case-item');
        
        // Fade out animation
        caseItem.style.opacity = '0.5';
        caseItem.style.transform = 'scale(0.95)';
        
        button.innerHTML = 'Archived';
        button.disabled = true;
        
        setTimeout(function() {
            caseItem.style.display = 'none';
        }, 1000);
    }
    
    /**
     * Initialize search functionality
     */
    function initializeSearch() {
        const searchButton = fragmentElement.querySelector('#sp-case-search');
        
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create simple search overlay (placeholder)
                const overlay = document.createElement('div');
                overlay.className = 'sp-search-overlay';
                overlay.innerHTML = `
                    <div class="sp-search-modal">
                        <div class="sp-search-header">
                            <h3>Search Cases</h3>
                            <button class="sp-search-close">&times;</button>
                        </div>
                        <div class="sp-search-content">
                            <input type="text" class="sp-search-input" placeholder="Search by case ID, customer name, or description...">
                            <div class="sp-search-filters">
                                <select class="sp-search-category">
                                    <option value="">All Categories</option>
                                    <option value="prescription">Prescription</option>
                                    <option value="frame">Frame Fitting</option>
                                    <option value="contact">Contact Lens</option>
                                    <option value="warranty">Warranty</option>
                                </select>
                                <select class="sp-search-priority">
                                    <option value="">All Priorities</option>
                                    <option value="high">High Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="low">Low Priority</option>
                                </select>
                            </div>
                            <div class="sp-search-actions">
                                <button class="sp-btn sp-btn-primary">Search</button>
                                <button class="sp-btn sp-btn-outline">Clear</button>
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(overlay);
                
                // Close search
                const closeBtn = overlay.querySelector('.sp-search-close');
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(overlay);
                });
                
                // Close on outside click
                overlay.addEventListener('click', function(e) {
                    if (e.target === overlay) {
                        document.body.removeChild(overlay);
                    }
                });
                
                // Focus search input
                const searchInput = overlay.querySelector('.sp-search-input');
                searchInput.focus();
            });
        }
    }
    
    /**
     * Bind interaction events
     */
    function bindInteractionEvents() {
        // Case item hover effects
        const caseItems = fragmentElement.querySelectorAll('.sp-case-item');
        caseItems.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                if (!this.classList.contains('hidden')) {
                    this.style.transform = 'translateY(-2px)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (!this.classList.contains('hidden')) {
                    this.style.transform = 'translateY(0)';
                }
            });
        });
        
        // Stat card interactions
        const statCards = fragmentElement.querySelectorAll('.sp-stat-card');
        statCards.forEach(function(card) {
            card.addEventListener('click', function() {
                const cardType = this.querySelector('.sp-stat-label').textContent.toLowerCase();
                
                // Filter cases based on stat card clicked
                if (cardType.includes('active')) {
                    setActiveFilter('active');
                    filterCases('active');
                } else if (cardType.includes('pending')) {
                    setActiveFilter('pending');
                    filterCases('pending');
                } else if (cardType.includes('resolved') || cardType.includes('completed')) {
                    setActiveFilter('completed');
                    filterCases('completed');
                }
            });
        });
        
        // Category bar animations
        const categoryFills = fragmentElement.querySelectorAll('.sp-category-fill');
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const targetWidth = fill.style.width || '0%';
                    
                    fill.style.width = '0%';
                    setTimeout(function() {
                        fill.style.width = targetWidth;
                    }, 200);
                    
                    observer.unobserve(fill);
                }
            });
        }, { threshold: 0.5 });
        
        categoryFills.forEach(function(fill) {
            observer.observe(fill);
        });
    }
    
    /**
     * Handle window resize
     */
    function handleResize() {
        // Adjust view for mobile
        if (window.innerWidth <= 768) {
            if (currentView === 'table') {
                setActiveView('list');
                switchView('list');
            }
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
})();
