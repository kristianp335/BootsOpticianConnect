/**
 * Boots Hero Fragment JavaScript
 * Enhanced functionality for hero section
 */

(function() {
    'use strict';
    
    // Initialize hero functionality when DOM is ready
    function initializeHero() {
        // Use fragmentElement if available (in Liferay), otherwise use document
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const heroSection = container.querySelector('.boots-hero');

        
        if (!heroSection) {
            console.log('Boots Hero: Hero section not found');
            return;
        }
        

        
        // Parallax effect for hero background (optional enhancement)
        const heroBackground = container.querySelector('.boots-hero-background');
        if (heroBackground && window.innerWidth > 768) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const heroRect = heroSection.getBoundingClientRect();
                const heroTop = heroRect.top + scrolled;
                const heroHeight = heroRect.height;
                
                // Only apply parallax when hero is visible
                if (scrolled < heroTop + heroHeight) {
                    const parallaxSpeed = 0.5;
                    const yPos = scrolled * parallaxSpeed;
                    heroBackground.style.transform = `translateY(${yPos}px)`;
                }
            });
        }
        

        
        // Keyboard accessibility for buttons
        const heroButtons = container.querySelectorAll('.boots-hero-btn');
        heroButtons.forEach(function(button) {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
        

        
        console.log('Boots Hero: Fragment initialized successfully');
    }
    
    // Initialize with a small delay to ensure DOM elements exist
    setTimeout(function() {
        try {
            initializeHero();
        } catch (error) {
            console.error('Boots Hero: Initialization error', error);
        }
    }, 100);
    
})();