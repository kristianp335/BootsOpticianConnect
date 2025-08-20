/* Johnson Matthey Hero Fragment JavaScript */
(function() {
    'use strict';
    
    // Use the fragmentElement provided by Liferay instead of document.currentScript
    // Liferay injects: const fragmentElement = document.querySelector('#fragment-xyz');
    if (!fragmentElement) {
        return;
    }
    
    // Ultra-fast initialization - execute immediately without waiting
    initializeHero();
    
    // Single initialization only - no looping event listeners for performance
    
    function initializeHero() {
        // Immediate critical path only - no deferred execution
        const config = getFragmentConfiguration();
        applyCriticalConfiguration(config);
        
        // Defer ALL non-critical JavaScript after LCP
        setTimeout(() => {
            applyConfiguration(config);
            if (config.showVideo) {
                initializeVideo();
            }
        }, 0);
    }
    
    /**
     * Get fragment configuration values
     */
    function getFragmentConfiguration() {
        return {
            showVideo: configuration.showVideo,
            showStats: configuration.showStats,
            layoutStyle: configuration.layoutStyle,
            backgroundStyle: configuration.backgroundStyle
        };
    }
    
    /**
     * Apply only critical configuration for faster LCP
     */
    function applyCriticalConfiguration(config) {
        const heroSection = fragmentElement.querySelector('.jm-hero');
        const heroImage = fragmentElement.querySelector('.jm-hero-img');
        
        // Only apply critical styles that affect rendering immediately
        if (heroSection) {
            heroSection.setAttribute('data-background', config.backgroundStyle);
        }
        
        // Ensure image loads with highest priority
        if (heroImage && !heroImage.complete) {
            heroImage.loading = 'eager';
            heroImage.fetchPriority = 'high';
        }
    }
    
    /**
     * Apply full configuration settings to the hero (deferred)
     */
    function applyConfiguration(config) {
        const heroContent = fragmentElement.querySelector('.jm-hero-content');
        const videoOverlay = fragmentElement.querySelector('.jm-hero-video-overlay');
        const heroStats = fragmentElement.querySelector('.jm-hero-stats');
        
        // Apply layout style
        if (heroContent) {
            heroContent.setAttribute('data-layout', config.layoutStyle);
        }
        
        // Show/hide video button
        if (videoOverlay) {
            videoOverlay.style.display = config.showVideo ? 'block' : 'none';
        }
        
        // Show/hide statistics
        if (heroStats) {
            heroStats.style.display = config.showStats ? 'flex' : 'none';
        }
    }
    
    function initializeVideo() {
        const playButton = fragmentElement.querySelector('.jm-play-button');
        const videoModal = fragmentElement.querySelector('.jm-video-modal');
        const videoBackdrop = fragmentElement.querySelector('.jm-video-modal-backdrop');
        const videoIframe = fragmentElement.querySelector('#jm-hero-video');
        
        if (!playButton || !videoModal || !videoIframe) return;
        
        // Get video URL from editable content or use default
        const videoCaption = fragmentElement.querySelector('.jm-video-caption');
        let videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'; // Default video
        
        // Try to extract video URL from caption or other editable content
        if (videoCaption && videoCaption.dataset.videoUrl) {
            videoUrl = videoCaption.dataset.videoUrl;
        }
        
        playButton.addEventListener('click', () => {
            // Set video source
            videoIframe.src = videoUrl;
            
            // Open modal
            if (window.JohnsonMatthey && window.JohnsonMatthey.openModal) {
                window.JohnsonMatthey.openModal(videoModal);
            } else {
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
    }
    
    // Handle keyboard navigation for video button
    const playButton = fragmentElement.querySelector('.jm-play-button');
    if (playButton) {
        playButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playButton.click();
            }
        });
    }
    
})();
