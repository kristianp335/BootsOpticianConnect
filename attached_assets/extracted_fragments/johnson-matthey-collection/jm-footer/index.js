/* Johnson Matthey Footer Fragment JavaScript */
(function() {
    'use strict';
    
    // Use the fragmentElement provided by Liferay instead of document.currentScript
    // Liferay injects: const fragmentElement = document.querySelector('#fragment-xyz');
    if (!fragmentElement) {
        return;
    }
    
    // Initialize on DOM ready and SPA navigation events
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }
    
    // Initial load
    ready(initializeFooter);
    
    // Listen for Liferay SPA navigation events
    if (window.Liferay) {
        Liferay.on('allPortletsReady', function(event) {

            setTimeout(initializeFooter, 100);
        });
    }
    
    // Listen for standard navigation events
    document.addEventListener('navigate', function(event) {
        setTimeout(initializeFooter, 100);
    });
    
    function initializeFooter() {
        // Johnson Matthey Footer Fragment initializing
        
        // Get and apply configuration
        const config = getFragmentConfiguration();
        applyConfiguration(config);
        
        // Initialize back to top functionality
        initializeBackToTop();
        
        // Initialize newsletter functionality
        initializeNewsletter();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        // Initialize social media tracking (if needed)
        initializeSocialTracking();
        
        // Johnson Matthey Footer Fragment initialized
    }
    
    /**
     * Get fragment configuration from Liferay
     */
    function getFragmentConfiguration() {
        let config;
        
        // Try to get configuration from Liferay's fragment configuration system
        if (typeof configuration !== 'undefined') {
            config = {
                showNewsletter: configuration.showNewsletter !== undefined ? configuration.showNewsletter : false,
                showSocialMedia: configuration.showSocialMedia !== undefined ? configuration.showSocialMedia : true,
                showBackToTop: configuration.showBackToTop !== undefined ? configuration.showBackToTop : true,
                companyName: configuration.companyName || 'Johnson Matthey',
                footerStyle: configuration.footerStyle || 'dark',
                columnLayout: configuration.columnLayout || '5-column',
                enableTracking: configuration.enableTracking !== undefined ? configuration.enableTracking : true,
                newsletterService: configuration.newsletterService || 'custom'
            };
        } else {
            // Fallback default values if configuration is not available
            config = {
                showNewsletter: false,
                showSocialMedia: true,
                showBackToTop: true,
                companyName: 'Johnson Matthey',
                footerStyle: 'dark',
                columnLayout: '5-column',
                enableTracking: true,
                newsletterService: 'custom'
            };
        }
        return config;
    }
    
    /**
     * Apply configuration settings to the footer
     */
    function applyConfiguration(config) {
        const footer = fragmentElement.querySelector('.jm-footer');
        const newsletterSection = fragmentElement.querySelector('#jm-newsletter-section');
        const socialMediaSection = fragmentElement.querySelector('.jm-footer-social');
        const backToTopBtn = fragmentElement.querySelector('.jm-back-to-top-btn');
        const companyNameElements = fragmentElement.querySelectorAll('.jm-company-name');
        const footerColumns = fragmentElement.querySelector('.jm-footer-main');
        // Apply footer style
        if (footer) {
            footer.setAttribute('data-style', config.footerStyle);
        }
        
        // Apply column layout
        if (footerColumns) {
            footerColumns.setAttribute('data-layout', config.columnLayout);
        }
        
        // Show/hide newsletter section
        if (newsletterSection) {
            newsletterSection.style.display = config.showNewsletter ? 'block' : 'none';
        } else {
        }
        
        // Show/hide social media section
        if (socialMediaSection) {
            socialMediaSection.style.display = config.showSocialMedia ? 'flex' : 'none';
        } else {
        }
        
        // Show/hide back to top button
        if (backToTopBtn) {
            backToTopBtn.style.display = config.showBackToTop ? 'block' : 'none';
        } else {
        }
        
        // Update company name
        if (companyNameElements.length > 0) {
            companyNameElements.forEach((element, index) => {
                if (element) {
                    const oldText = element.textContent;
                    element.textContent = config.companyName;
                }
            });
        } else {
        }
    }
    
    function initializeBackToTop() {
        const backToTopBtn = fragmentElement.querySelector('.jm-back-to-top-btn');
        if (!backToTopBtn) return;
        
        // Show/hide button based on scroll position
        function toggleBackToTopButton() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const threshold = 500; // Show button after scrolling 500px
            
            if (scrollTop > threshold) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.setAttribute('aria-hidden', 'false');
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.setAttribute('aria-hidden', 'true');
            }
        }
        
        // Smooth scroll to top
        function scrollToTop() {
            const scrollToTopOptions = {
                top: 0,
                left: 0,
                behavior: 'smooth'
            };
            
            // Fallback for browsers that don't support smooth scrolling
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo(scrollToTopOptions);
            } else {
                // Polyfill for smooth scroll
                smoothScrollTo(0, 500);
            }
        }
        
        // Smooth scroll polyfill
        function smoothScrollTo(targetY, duration) {
            const startY = window.pageYOffset;
            const distance = targetY - startY;
            const startTime = performance.now();
            
            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const ease = 1 - Math.pow(1 - progress, 3);
                
                window.scrollTo(0, startY + distance * ease);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }
            
            requestAnimationFrame(step);
        }
        
        // Event listeners
        window.addEventListener('scroll', throttle(toggleBackToTopButton, 100));
        backToTopBtn.addEventListener('click', scrollToTop);
        
        // Keyboard support
        backToTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });
        
        // Initial check
        toggleBackToTopButton();
    }
    
    function initializeNewsletter() {
        const newsletterForm = fragmentElement.querySelector('#jm-newsletter-form');
        const newsletterSection = fragmentElement.querySelector('#jm-newsletter-section');
        
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
        
        // Show newsletter section if configured (this could be controlled by fragment configuration)
        // For now, we'll show it by default
        if (newsletterSection) {
            newsletterSection.style.display = 'block';
        }
    }
    
    function handleNewsletterSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const emailInput = form.querySelector('#newsletter-email');
        const submitBtn = form.querySelector('.jm-newsletter-btn');
        const email = emailInput.value.trim();
        
        // Basic email validation
        if (!email || !isValidEmail(email)) {
            showNewsletterMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Subscribing...</span>';
        submitBtn.disabled = true;
        
        // Simulate newsletter subscription
        // In real implementation, this would connect to your newsletter service
        setTimeout(() => {
            // Simulate success (in real implementation, handle actual API response)
            showNewsletterMessage('Thank you for subscribing! You\'ll receive a confirmation email shortly.', 'success');
            form.reset();
            
            // Restore button
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
            
            // Track subscription (if analytics are set up)
            trackNewsletterSignup(email);
            
        }, 1500);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNewsletterMessage(message, type) {
        // Remove existing message
        const existingMessage = fragmentElement.querySelector('.jm-newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `jm-newsletter-message jm-newsletter-message-${type}`;
        messageElement.textContent = message;
        messageElement.setAttribute('role', 'alert');
        
        // Insert message
        const form = fragmentElement.querySelector('#jm-newsletter-form');
        if (form) {
            form.parentNode.insertBefore(messageElement, form.nextSibling);
            
            // Auto-remove success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    messageElement.remove();
                }, 5000);
            }
        }
    }
    
    function trackNewsletterSignup(email) {
        // Newsletter signup tracking (integrate with your analytics)
        if (window.gtag) {
            window.gtag('event', 'newsletter_signup', {
                'event_category': 'engagement',
                'event_label': 'footer_newsletter'
            });
        }
        
        // Custom event for other tracking systems
        document.dispatchEvent(new CustomEvent('jm:newsletter:signup', {
            detail: { email: email, source: 'footer' }
        }));
    }
    
    function initializeAccessibility() {
        // Enhance footer accessibility
        const footer = fragmentElement.querySelector('.jm-footer');
        if (footer) {
            footer.setAttribute('role', 'contentinfo');
        }
        
        // Add skip link functionality (back to top serves as skip to top)
        const backToTopBtn = fragmentElement.querySelector('.jm-back-to-top-btn');
        if (backToTopBtn) {
            backToTopBtn.setAttribute('tabindex', '0');
        }
        
        // Enhance social links accessibility
        const socialLinks = fragmentElement.querySelectorAll('.jm-social-link');
        socialLinks.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Add screen reader text for external links
            const srText = document.createElement('span');
            srText.className = 'sr-only';
            srText.textContent = ' (opens in new window)';
            link.appendChild(srText);
        });
        
        // Enhance newsletter form accessibility
        const newsletterInput = fragmentElement.querySelector('#newsletter-email');
        if (newsletterInput) {
            newsletterInput.setAttribute('aria-describedby', 'newsletter-description');
        }
    }
    
    function initializeSocialTracking() {
        // Track social media link clicks
        const socialLinks = fragmentElement.querySelectorAll('.jm-social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = getSocialPlatform(link.href);
                trackSocialClick(platform);
            });
        });
    }
    
    function getSocialPlatform(url) {
        if (url.includes('linkedin')) return 'linkedin';
        if (url.includes('youtube')) return 'youtube';
        if (url.includes('instagram')) return 'instagram';
        if (url.includes('twitter')) return 'twitter';
        return 'unknown';
    }
    
    function trackSocialClick(platform) {
        // Social media click tracking
        if (window.gtag) {
            window.gtag('event', 'social_click', {
                'event_category': 'engagement',
                'event_label': platform,
                'value': 1
            });
        }
        
        // Custom event
        document.dispatchEvent(new CustomEvent('jm:social:click', {
            detail: { platform: platform, location: 'footer' }
        }));
    }
    
    // Utility function for throttling
    function throttle(func, delay) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, delay);
            }
        };
    }
    
    // Add screen reader only class for accessibility
    if (!document.querySelector('.sr-only-styles')) {
        const style = document.createElement('style');
        style.className = 'sr-only-styles';
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
})();
