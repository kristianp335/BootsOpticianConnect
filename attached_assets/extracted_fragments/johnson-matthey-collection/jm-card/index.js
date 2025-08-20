// JM Card Fragment JavaScript
(function() {
    'use strict';
    
    // Ensure fragmentElement is available
    if (typeof fragmentElement === 'undefined') {
        return;
    }
    
    const cardElement = fragmentElement.querySelector('.jm-card');
    
    if (!cardElement) {
        return;
    }
    
    function initializeCard() {
        // Initialize card functionality
        
        // Add compact class if in mega menu context
        const isInMegaMenu = cardElement.closest('.jm-mega-content') || 
                           cardElement.closest('.jm-dropdown-menu');
        
        if (isInMegaMenu) {
            cardElement.classList.add('compact');
            // Applied compact styling
        }
        
        // Add click analytics if needed
        const cardButton = cardElement.querySelector('.jm-card-button');
        if (cardButton) {
            cardButton.addEventListener('click', function(e) {
                // Track card click analytics
                const cardTitle = cardElement.querySelector('.jm-card-title')?.textContent || 'Unknown';
                // Card button clicked
                
                // Add any analytics tracking here
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'card_click', {
                        'card_title': cardTitle,
                        'card_location': isInMegaMenu ? 'mega_menu' : 'page'
                    });
                }
            });
        }
        
        // Image lazy loading optimization
        const cardImage = cardElement.querySelector('.jm-card-image img');
        if (cardImage) {
            cardImage.loading = 'lazy';
            
            // Add error handling
            cardImage.addEventListener('error', function() {
                // Image load error handled
                this.style.display = 'none';
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCard);
    } else {
        initializeCard();
    }
    
    // JM Card fragment ready
    
})();