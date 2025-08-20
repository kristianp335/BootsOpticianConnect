/* Johnson Matthey Company Overview Fragment JavaScript */
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
    ready(initializeCompanyOverview);
    
    // Listen for Liferay SPA navigation events
    if (window.Liferay) {
        Liferay.on('allPortletsReady', function(event) {
            // SPA navigation complete - reinitialize
            setTimeout(initializeCompanyOverview, 100);
        });
    }
    
    // Listen for standard navigation events
    document.addEventListener('navigate', function(event) {
        setTimeout(initializeCompanyOverview, 100);
    });
    
    function initializeCompanyOverview() {
        // Initialize company overview fragment
        
        // Initialize video functionality
        initializeVideo();
        
        // Initialize animations
        initializeAnimations();
        
        // Initialize statistics counter
        initializeStatsCounter();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        // Company overview fragment ready
    }
    
    function initializeVideo() {
        const playButton = fragmentElement.querySelector('.jm-video-play-btn');
        const videoModal = fragmentElement.querySelector('.jm-overview-video-modal');
        const videoBackdrop = fragmentElement.querySelector('.jm-overview-video-backdrop');
        const videoIframe = fragmentElement.querySelector('#jm-overview-video');
        
        if (!playButton || !videoModal || !videoIframe) return;
        
        // Company overview video URL - replace with actual Johnson Matthey video
        const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
        
        playButton.addEventListener('click', () => {
            // Set video source
            videoIframe.src = videoUrl;
            
            // Open modal using global utility if available
            if (window.JohnsonMatthey && window.JohnsonMatthey.openModal) {
                window.JohnsonMatthey.openModal(videoModal);
            } else {
                // Fallback modal opening
                videoBackdrop.classList.add('show');
                videoModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close video and stop playback when modal closes
        videoModal.addEventListener('jm:modal:closed', () => {
            videoIframe.src = '';
        });
        
        // Fallback close handler
        const closeButton = videoModal.querySelector('.jm-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                videoIframe.src = '';
                videoBackdrop.classList.remove('show');
                videoModal.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
        
        // Keyboard support for play button
        playButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playButton.click();
            }
        });
    }
    
    function initializeAnimations() {
        // Use Intersection Observer for scroll-triggered animations
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('jm-animate-in');
                        
                        // Start stats counter animation for stats items
                        if (entry.target.classList.contains('jm-company-stats')) {
                            animateStats();
                        }
                    }
                });
            }, observerOptions);
            
            // Observe elements for animation
            const animateElements = fragmentElement.querySelectorAll(
                '.jm-section-header, .jm-overview-content, .jm-overview-media, .jm-company-stats, .jm-focus-areas'
            );
            
            animateElements.forEach(el => {
                el.classList.add('jm-animate-ready');
                observer.observe(el);
            });
        }
        
        // Add staggered animation delays
        const focusItems = fragmentElement.querySelectorAll('.jm-focus-item');
        focusItems.forEach((item, index) => {
            item.style.setProperty('--animation-delay', `${index * 0.1}s`);
        });
    }
    
    function initializeStatsCounter() {
        // Stats counter will be triggered by intersection observer
        window.overviewStatsAnimated = false;
    }
    
    function animateStats() {
        if (window.overviewStatsAnimated) return;
        window.overviewStatsAnimated = true;
        
        const statNumbers = fragmentElement.querySelectorAll('.jm-stat-number');
        
        statNumbers.forEach(statElement => {
            const text = statElement.textContent;
            const hasPlus = text.includes('+');
            const numericValue = parseInt(text.replace(/[^\d]/g, '')) || 0;
            
            if (numericValue > 0) {
                animateCounter(statElement, numericValue, hasPlus);
            }
        });
    }
    
    function animateCounter(element, finalValue, hasPlus) {
        const duration = 2000; // 2 seconds
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        const increment = finalValue / totalFrames;
        
        let currentValue = 0;
        let frame = 0;
        
        const counter = () => {
            frame++;
            currentValue += increment;
            
            if (currentValue >= finalValue) {
                element.textContent = finalValue + (hasPlus ? '+' : '');
                return;
            }
            
            element.textContent = Math.floor(currentValue) + (hasPlus ? '+' : '');
            requestAnimationFrame(counter);
        };
        
        // Start animation
        element.textContent = '0' + (hasPlus ? '+' : '');
        requestAnimationFrame(counter);
    }
    
    function initializeAccessibility() {
        // Set up proper ARIA labels
        const section = fragmentElement.querySelector('.jm-company-overview');
        if (section) {
            section.setAttribute('aria-labelledby', 'company-overview-title');
        }
        
        const sectionTitle = fragmentElement.querySelector('.jm-section-title');
        if (sectionTitle) {
            sectionTitle.id = 'company-overview-title';
        }
        
        // Enhanced focus management for video button
        const videoButton = fragmentElement.querySelector('.jm-video-play-btn');
        if (videoButton) {
            videoButton.setAttribute('role', 'button');
            videoButton.setAttribute('tabindex', '0');
        }
        
        // Stats accessibility
        const statItems = fragmentElement.querySelectorAll('.jm-stat-item');
        statItems.forEach((item, index) => {
            const number = item.querySelector('.jm-stat-number');
            const label = item.querySelector('.jm-stat-label');
            
            if (number && label) {
                const id = `stat-${index}`;
                number.id = id;
                item.setAttribute('aria-labelledby', id);
                item.setAttribute('role', 'img');
                item.setAttribute('aria-label', `${number.textContent} ${label.textContent}`);
            }
        });
        
        // Focus areas accessibility
        const focusItems = fragmentElement.querySelectorAll('.jm-focus-item');
        focusItems.forEach(item => {
            item.setAttribute('role', 'listitem');
        });
        
        const focusGrid = fragmentElement.querySelector('.jm-focus-grid');
        if (focusGrid) {
            focusGrid.setAttribute('role', 'list');
            focusGrid.setAttribute('aria-label', 'Key focus areas');
        }
    }
    
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            .jm-company-overview-fragment * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Performance optimization: lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = fragmentElement.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
})();
