/**
 * Boots Stats Card Fragment JavaScript
 * Handles counter animations and interactions
 */

(function() {
    'use strict';
    
    // Initialize stats card functionality
    function initializeStatsCard() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const statsCard = container.querySelector('.sp-stats-card-fragment');
        
        if (!statsCard) {
            return;
        }
        
        // Initialize counter animation
        initializeCounters();
        
        // Add hover effects
        initializeHoverEffects();
    }
    
    /**
     * Initialize counter animations for stat values
     */
    function initializeCounters() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const counters = container.querySelectorAll('[data-counter]');
        
        counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            // Store original text format
            const originalText = counter.textContent;
            const hasUnit = originalText.replace(/[0-9]/g, '').trim();
            
            if (target > 0) {
                // Animate numeric values
                const timer = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    // Format the number with original unit
                    let formattedValue = Math.floor(current).toString();
                    if (hasUnit) {
                        formattedValue = formattedValue + hasUnit;
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
        const card = container.querySelector('.sp-stat-card');
        
        if (!card) {
            return;
        }
        
        // Add click handler for potential future interactions
        card.addEventListener('click', function() {
            // Could be used for drilling down into details
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
        
        // Add tabindex for keyboard navigation
        if (!card.getAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeStatsCard);
    } else {
        initializeStatsCard();
    }
    
    // Initialize with a small delay for Liferay fragment loading
    setTimeout(initializeStatsCard, 100);
    
})();