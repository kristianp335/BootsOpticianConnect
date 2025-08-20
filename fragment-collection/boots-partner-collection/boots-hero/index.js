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
        const scrollIndicator = container.querySelector('.boots-hero-scroll-indicator');
        
        if (!heroSection) {
            console.log('Boots Hero: Hero section not found');
            return;
        }
        
        // Smooth scroll functionality for scroll indicator
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                const nextSection = heroSection.nextElementSibling;
                if (nextSection) {
                    nextSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
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
        
        // Intersection Observer for scroll indicator visibility
        if (scrollIndicator && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            scrollIndicator.style.opacity = '0.8';
                        } else {
                            scrollIndicator.style.opacity = '0.4';
                        }
                    });
                },
                { threshold: 0.5 }
            );
            
            observer.observe(heroSection);
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