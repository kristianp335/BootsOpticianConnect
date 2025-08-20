/* Johnson Matthey News Carousel Fragment JavaScript */
(function() {
    'use strict';
    
    // Use the fragmentElement provided by Liferay instead of document.currentScript
    // Liferay injects: const fragmentElement = document.querySelector('#fragment-xyz');
    if (!fragmentElement) {
        return;
    }
    
    let currentSlide = 0;
    let slides = [];
    let slidesToShow = 3;
    let autoplayInterval = null;
    let isAutoplayPaused = false;
    
    // Configuration from Liferay - using simple fallback approach
    const config = {
        showAutoplay: typeof configuration !== 'undefined' && configuration.showAutoplay !== undefined ? configuration.showAutoplay : true,
        autoplayDelay: typeof configuration !== 'undefined' && configuration.autoplayDelay !== undefined ? Math.max(parseInt(configuration.autoplayDelay) * 1000, 3000) : 5000,
        showControls: typeof configuration !== 'undefined' && configuration.showControls !== undefined ? configuration.showControls : true,
        showIndicators: typeof configuration !== 'undefined' && configuration.showIndicators !== undefined ? configuration.showIndicators : true,
        slidesToShowDesktop: typeof configuration !== 'undefined' && configuration.slidesToShowDesktop !== undefined ? parseInt(configuration.slidesToShowDesktop) : 3,
        carouselStyle: typeof configuration !== 'undefined' && configuration.carouselStyle !== undefined ? configuration.carouselStyle : 'standard'
    };
    
    // Initialize on DOM ready and SPA navigation events
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }
    
    // Initial load
    ready(initializeCarousel);
    
    // Listen for Liferay SPA navigation events
    if (window.Liferay) {
        Liferay.on('allPortletsReady', function(event) {
            setTimeout(initializeCarousel, 100);
        });
    }
    
    // Listen for standard navigation events
    document.addEventListener('navigate', function(event) {
        setTimeout(initializeCarousel, 100);
    });
    
    function initializeCarousel() {
        // Initialize slidesToShow from configuration
        slidesToShow = parseInt(config.slidesToShowDesktop) || 3;
        
        // Detect edit mode for proper handling
        const isEditMode = detectEditMode();
        
        // Get carousel elements
        const track = fragmentElement.querySelector('#jm-news-track');
        const prevButton = fragmentElement.querySelector('.jm-carousel-prev');
        const nextButton = fragmentElement.querySelector('.jm-carousel-next');
        const indicatorsContainer = fragmentElement.querySelector('#jm-carousel-indicators');
        
        if (!track || !prevButton || !nextButton || !indicatorsContainer) {
            return;
        }
        
        slides = track.querySelectorAll('.jm-carousel-slide');
        
        if (slides.length === 0) {
            return;
        }
        
        // Setup responsive behavior
        setupResponsiveCarousel();
        
        // Setup controls visibility
        if (!config.showControls) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
        
        // Setup controls
        setupCarouselControls(prevButton, nextButton);
        
        // Setup indicators
        setupCarouselIndicators(indicatorsContainer);
        
        // Setup touch/swipe support
        setupTouchSupport(track);
        
        // Setup keyboard navigation
        setupKeyboardNavigation();
        
        // Setup autoplay
        setupAutoplay();
        
        // Initial display
        updateCarousel();
        
        // Setup resize listener
        window.addEventListener('resize', debounce(setupResponsiveCarousel, 250));
        

        
        // Apply edit mode styles if in edit mode
        if (isEditMode) {
            applyEditModeStyles();
        }
    }
    
    function detectEditMode() {
        return document.body.classList.contains('has-edit-mode-menu') ||
               document.querySelector('[data-editor-enabled="true"]') !== null ||
               document.querySelector('.is-edit-mode') !== null ||
               window.location.search.includes('p_l_mode=edit');
    }
    
    function applyEditModeStyles() {
        // Add edit mode class to fragment for CSS targeting
        fragmentElement.classList.add('edit-mode-active');
        
        // Make all cards more accessible in edit mode
        const cards = fragmentElement.querySelectorAll('.jm-news-item .jm-card');
        cards.forEach((card, index) => {
            card.style.outline = '2px dashed var(--jm-primary, #0b5fff)';
            card.style.outlineOffset = '4px';
            card.setAttribute('data-edit-card', `news-card-${index + 1}`);
        });
    }
    
    function setupResponsiveCarousel() {
        const containerWidth = fragmentElement.querySelector('.jm-carousel-container').offsetWidth;
        
        if (containerWidth < 768) {
            slidesToShow = 1;
        } else if (containerWidth < 1024) {
            slidesToShow = 2;
        } else {
            slidesToShow = config.slidesToShowDesktop;
        }
        
        // Ensure current slide is still valid
        const maxSlide = Math.max(0, slides.length - slidesToShow);
        currentSlide = Math.min(currentSlide, maxSlide);
        
        updateCarousel();
    }
    
    function setupCarouselControls(prevButton, nextButton) {
        // Always set up event listeners, visibility is controlled by CSS and HTML
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!prevButton.classList.contains('carousel-disabled')) {
                previousSlide();
                pauseAutoplay();
            }
        });
        
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!nextButton.classList.contains('carousel-disabled')) {
                nextSlide();
                pauseAutoplay();
            }
        });
        
        // Update button states
        updateControlButtons();
    }
    
    function setupCarouselIndicators(container) {

        
        if (!config.showIndicators) {
            container.style.display = 'none';

            return;
        }
        
        container.innerHTML = '';
        container.style.display = 'flex';
        
        const totalIndicators = Math.ceil(slides.length / slidesToShow);

        
        for (let i = 0; i < totalIndicators; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'jm-carousel-indicator';
            indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
            indicator.addEventListener('click', () => {

                goToSlide(i * slidesToShow);
                pauseAutoplay();
            });
            container.appendChild(indicator);
        }
        
        updateIndicators();
    }
    
    function setupTouchSupport(track) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            pauseAutoplay();
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const difference = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(difference) > threshold) {
                if (difference > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        }, { passive: true });
        
        // Mouse support for desktop
        track.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            pauseAutoplay();
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const difference = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(difference) > threshold) {
                if (difference > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        });
    }
    
    function setupKeyboardNavigation() {
        const carousel = fragmentElement.querySelector('.jm-carousel-container');
        carousel.setAttribute('tabindex', '0');
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-label', 'News carousel');
        
        carousel.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    previousSlide();
                    pauseAutoplay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    pauseAutoplay();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(0);
                    pauseAutoplay();
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(slides.length - slidesToShow);
                    pauseAutoplay();
                    break;
            }
        });
    }
    
    function setupAutoplay() {
        if (!config.showAutoplay) return;
        
        // Start autoplay
        startAutoplay();
        
        // Pause on hover
        const container = fragmentElement.querySelector('.jm-carousel-container');
        container.addEventListener('mouseenter', pauseAutoplay);
        container.addEventListener('mouseleave', resumeAutoplay);
        
        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseAutoplay();
            } else {
                resumeAutoplay();
            }
        });
    }
    
    function startAutoplay() {
        if (!config.showAutoplay) return;
        if (autoplayInterval) clearInterval(autoplayInterval);
        
        autoplayInterval = setInterval(() => {
            if (!isAutoplayPaused) {
                nextSlide();
            }
        }, config.autoplayDelay);
    }
    
    function pauseAutoplay() {
        isAutoplayPaused = true;
    }
    
    function resumeAutoplay() {
        isAutoplayPaused = false;
        if (!autoplayInterval) {
            startAutoplay();
        }
    }
    
    function nextSlide() {
        const maxSlide = slides.length - slidesToShow;

        currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + slidesToShow;

        updateCarousel();
    }
    
    function previousSlide() {
        const maxSlide = slides.length - slidesToShow;

        currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - slidesToShow;

        updateCarousel();
    }
    
    function goToSlide(index) {
        const maxSlide = Math.max(0, slides.length - slidesToShow);
        currentSlide = Math.max(0, Math.min(index, maxSlide));
        updateCarousel();
    }
    
    function updateCarousel() {
        const track = fragmentElement.querySelector('#jm-news-track');
        if (!track) {
            return;
        }
        

        
        // Move by full page of slides: jump by slidesToShow positions  
        const slideWidth = 100 / slides.length;  // Width of each individual slide
        const translateX = -(currentSlide * slideWidth);
        

        
        // Apply transform to track
        track.style.transform = `translateX(${translateX}%)`;
        track.style.transition = 'transform 0.5s ease-in-out';
        
        // Set track width to fit all slides in one row
        const totalTrackWidth = (slides.length / slidesToShow) * 100;
        track.style.width = `${totalTrackWidth}%`;
        

        
        // Size each slide to fit exactly in visible area
        slides.forEach((slide, index) => {
            const actualSlideWidth = 100 / slides.length; // Each slide's width relative to full track
            slide.style.width = `${actualSlideWidth}%`;
            slide.style.flex = `0 0 ${actualSlideWidth}%`;
            

            
            // Update accessibility
            const isVisible = index >= currentSlide && index < currentSlide + slidesToShow;
            slide.setAttribute('aria-hidden', !isVisible);
            
            // Update tab index for focusable elements
            const focusableElements = slide.querySelectorAll('a, button');
            focusableElements.forEach(el => {
                el.tabIndex = isVisible ? 0 : -1;
            });
        });
        
        updateControlButtons();
        updateIndicators();
    }
    
    function updateControlButtons() {
        const prevButton = fragmentElement.querySelector('.jm-carousel-prev');
        const nextButton = fragmentElement.querySelector('.jm-carousel-next');
        
        if (!prevButton || !nextButton) {
            return;
        }
        
        const maxSlide = Math.max(0, slides.length - slidesToShow);
        

        
        // Update button states - don't disable buttons to prevent interaction issues
        prevButton.classList.toggle('carousel-disabled', currentSlide === 0);
        nextButton.classList.toggle('carousel-disabled', currentSlide >= maxSlide);
        
        // Update ARIA labels
        prevButton.setAttribute('aria-label', 
            `Previous news items ${currentSlide === 0 ? '(disabled)' : ''}`);
        nextButton.setAttribute('aria-label', 
            `Next news items ${currentSlide >= maxSlide ? '(disabled)' : ''}`);
    }
    
    function updateIndicators() {
        const indicators = fragmentElement.querySelectorAll('.jm-carousel-indicator');
        
        indicators.forEach((indicator, index) => {
            const isActive = index === Math.floor(currentSlide / slidesToShow);
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-pressed', isActive);
        });
    }
    
    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    });
    
})();
