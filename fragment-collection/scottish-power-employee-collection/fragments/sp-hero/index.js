/**
 * Scottish Power Hero Fragment JavaScript
 * Handles animations, statistics counter, and interactive elements
 */

(function() {
    'use strict';
    
    // Ensure fragmentElement is available
    if (typeof fragmentElement === 'undefined') {
        console.error('SP Hero: fragmentElement not available');
        return;
    }

    // Create ScottishPower namespace if it doesn't exist
    window.ScottishPower = window.ScottishPower || {};
    window.ScottishPower.hero = window.ScottishPower.hero || {};

    // Hero functionality
    ScottishPower.hero = {
        
        /**
         * Initialize hero functionality
         */
        init: function() {
            this.setupAnimations();
            this.initializeCounters();
            this.setupEventListeners();
            this.checkVisibility();
            
            console.log('SP Hero: Initialized successfully');
        },

        /**
         * Setup animations based on configuration
         */
        setupAnimations: function() {
            const config = typeof configuration !== 'undefined' ? configuration : {};
            
            if (config.enableAnimation !== false) {
                const heroFragment = fragmentElement;
                if (heroFragment) {
                    heroFragment.setAttribute('data-enable-animation', 'true');
                }
            }
        },

        /**
         * Initialize animated counters for statistics
         */
        initializeCounters: function() {
            const statNumbers = fragmentElement.querySelectorAll('.sp-stat-number[data-count]');
            
            statNumbers.forEach(element => {
                const target = parseFloat(element.getAttribute('data-count'));
                if (!isNaN(target)) {
                    this.animateCounter(element, target);
                }
            });
        },

        /**
         * Animate number counter
         * @param {HTMLElement} element - Element to animate
         * @param {number} target - Target number
         * @param {number} duration - Animation duration in ms
         */
        animateCounter: function(element, target, duration = 2000) {
            if (!element) return;
            
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format number based on target value
                if (target >= 1000) {
                    element.textContent = Math.floor(current / 1000) + 'K';
                } else if (target >= 100) {
                    element.textContent = Math.floor(current);
                } else {
                    element.textContent = current.toFixed(1);
                }
                
                // Handle specific formatting for different stats
                if (target === 99.8) {
                    element.textContent = current.toFixed(1);
                } else if (target === 2.1) {
                    element.textContent = current.toFixed(1);
                } else if (target >= 7500) {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        },

        /**
         * Setup event listeners for interactive elements
         */
        setupEventListeners: function() {
            const heroFragment = fragmentElement;
            if (!heroFragment) return;

            // Quick link tracking
            const quickLinks = heroFragment.querySelectorAll('.sp-quick-link');
            quickLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const linkText = e.currentTarget.querySelector('span:last-child')?.textContent || 'Unknown';
                    this.trackQuickLinkClick(linkText);
                });
            });

            // CTA button tracking
            const ctaButton = heroFragment.querySelector('.sp-hero-cta');
            if (ctaButton) {
                ctaButton.addEventListener('click', (e) => {
                    this.trackCTAClick();
                });
            }

            // Background animation controls
            const heroSection = heroFragment.querySelector('.sp-hero-section');
            if (heroSection) {
                heroSection.addEventListener('mouseenter', () => {
                    this.pauseBackgroundAnimation();
                });
                
                heroSection.addEventListener('mouseleave', () => {
                    this.resumeBackgroundAnimation();
                });
            }
        },

        /**
         * Check if hero is visible and trigger animations
         */
        checkVisibility: function() {
            if (!window.IntersectionObserver) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerVisibilityAnimations();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3
            });

            observer.observe(fragmentElement);
        },

        /**
         * Trigger animations when hero becomes visible
         */
        triggerVisibilityAnimations: function() {
            // Trigger counter animations with slight delay
            setTimeout(() => {
                this.initializeCounters();
            }, 500);

            // Add visible class for CSS animations
            const heroSection = fragmentElement.querySelector('.sp-hero-section');
            if (heroSection) {
                heroSection.classList.add('sp-visible');
            }
        },

        /**
         * Pause background animation on hover for better readability
         */
        pauseBackgroundAnimation: function() {
            const infrastructure = fragmentElement.querySelector('.sp-infrastructure');
            if (infrastructure) {
                infrastructure.style.animationPlayState = 'paused';
            }
        },

        /**
         * Resume background animation
         */
        resumeBackgroundAnimation: function() {
            const infrastructure = fragmentElement.querySelector('.sp-infrastructure');
            if (infrastructure) {
                infrastructure.style.animationPlayState = 'running';
            }
        },

        /**
         * Track quick link clicks for analytics
         */
        trackQuickLinkClick: function(linkText) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'quick_link_click', {
                    'link_text': linkText,
                    'location': 'hero_section'
                });
            }
            
            console.log('SP Hero: Quick link clicked:', linkText);
        },

        /**
         * Track CTA button clicks
         */
        trackCTAClick: function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'button_text': 'hero_primary_cta',
                    'location': 'hero_section'
                });
            }
            
            console.log('SP Hero: CTA button clicked');
        },

        /**
         * Update hero content based on current context
         */
        updateContent: function() {
            const user = window.ScottishPower.auth ? 
                window.ScottishPower.auth.getCurrentUser() : null;
            
            if (user) {
                this.personalizeContent(user);
            }
        },

        /**
         * Personalize hero content for current user
         */
        personalizeContent: function(user) {
            // This would be implemented to show personalized content
            // based on user role, department, recent activities, etc.
            console.log('SP Hero: Personalizing content for user:', user.id);
        },

        /**
         * Get current hero style from configuration
         */
        getCurrentStyle: function() {
            const config = typeof configuration !== 'undefined' ? configuration : {};
            return config.heroStyle || 'announcement';
        },

        /**
         * Handle responsive behavior
         */
        handleResize: function() {
            const isMobile = window.innerWidth <= 768;
            const heroStats = fragmentElement.querySelector('.sp-hero-stats');
            
            if (heroStats) {
                if (isMobile) {
                    heroStats.classList.add('sp-mobile-layout');
                } else {
                    heroStats.classList.remove('sp-mobile-layout');
                }
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => ScottishPower.hero.init(), 100);
        });
    } else {
        setTimeout(() => ScottishPower.hero.init(), 100);
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        ScottishPower.hero.handleResize();
    });

})();