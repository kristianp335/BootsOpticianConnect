/**
 * Boots Progress Widget Fragment JavaScript
 * Handles progress bar animations and interactions
 */

(function() {
    'use strict';
    
    // Initialize progress widget functionality
    function initializeProgressWidget() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const progressWidget = container.querySelector('.sp-progress-widget-fragment');
        
        if (!progressWidget) {
            return;
        }
        
        // Initialize progress bar animation
        initializeProgressBars();
        
        // Initialize counter animations
        initializeCounters();
    }
    
    /**
     * Initialize progress bar animations
     */
    function initializeProgressBars() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const progressBars = container.querySelectorAll('.sp-progress-fill');
        
        progressBars.forEach(function(bar) {
            const targetWidth = bar.style.width;
            
            // Start from 0 and animate to target
            bar.style.width = '0%';
            
            // Use Intersection Observer to animate when visible
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            setTimeout(function() {
                                bar.style.width = targetWidth;
                            }, 300);
                            observer.unobserve(bar);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(bar);
            } else {
                // Fallback for browsers without Intersection Observer
                setTimeout(function() {
                    bar.style.width = targetWidth;
                }, 500);
            }
        });
    }
    
    /**
     * Initialize counter animations
     */
    function initializeCounters() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const counters = container.querySelectorAll('[data-counter]');
        
        counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            // Store original text format
            const originalText = counter.textContent;
            const hasPercent = originalText.includes('%');
            
            if (target > 0) {
                const timer = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    let formattedValue = Math.floor(current).toString();
                    if (hasPercent) {
                        formattedValue += '%';
                    }
                    
                    counter.textContent = formattedValue;
                }, 16);
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProgressWidget);
    } else {
        initializeProgressWidget();
    }
    
    // Initialize with delay for Liferay fragment loading
    setTimeout(initializeProgressWidget, 100);
    
})();