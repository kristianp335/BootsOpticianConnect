/**
 * Boots KPI Card Fragment JavaScript
 * Handles counter animations and interactions
 */

(function() {
    'use strict';
    
    // Initialize KPI card functionality
    function initializeKPICard() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const kpiCard = container.querySelector('.boots-kpi-card-fragment');
        
        if (!kpiCard) {
            return;
        }
        
        // Initialize counter animation
        initializeCounters();
        
        // Add hover effects
        initializeHoverEffects();
    }
    
    /**
     * Initialize counter animations for KPI values
     */
    function initializeCounters() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const counters = container.querySelectorAll('[data-counter]');
        
        counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            // Store original text format for non-numeric indicators
            const originalText = counter.textContent;
            const isNumericOnly = /^\d+$/.test(originalText.replace(/[£$%,.\s]/g, ''));
            
            if (isNumericOnly && target > 0) {
                // Animate numeric values
                const timer = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    // Format the number based on original format
                    let formattedValue = Math.floor(current).toString();
                    
                    // Add original formatting back
                    if (originalText.includes('£')) {
                        formattedValue = '£' + formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    } else if (originalText.includes('%')) {
                        formattedValue = formattedValue + '%';
                    } else if (originalText.includes(',')) {
                        formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    }
                    
                    counter.textContent = formattedValue;
                }, 16);
            }
        });
    }
    
    /**
     * Initialize hover effects for better interactivity
     */
    function initializeHoverEffects() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const card = container.querySelector('.boots-metric-card');
        
        if (!card) {
            return;
        }
        
        // Add click handler for potential future interactions
        card.addEventListener('click', function() {
            // Could be used for drilling down into details
            // Currently just adds a subtle animation
            card.style.transform = 'scale(0.98)';
            setTimeout(function() {
                card.style.transform = '';
            }, 100);
        });
        
        // Keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeKPICard);
    } else {
        initializeKPICard();
    }
    
    // Initialize with a small delay for Liferay fragment loading
    setTimeout(initializeKPICard, 100);
    
})();