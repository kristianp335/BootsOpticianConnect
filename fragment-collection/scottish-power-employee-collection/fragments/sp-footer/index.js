/**
 * Scottish Power Footer Fragment JavaScript
 * Handles back to top functionality and footer interactions
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') {
        console.error('SP Footer: fragmentElement not available');
        return;
    }

    window.ScottishPower = window.ScottishPower || {};
    window.ScottishPower.footer = {
        
        init: function() {
            this.setupEventListeners();
            this.updateYear();
            console.log('SP Footer: Initialized successfully');
        },

        setupEventListeners: function() {
            const backToTop = fragmentElement.querySelector('.sp-back-to-top');
            if (backToTop) {
                backToTop.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }

            // Track footer link clicks
            const footerLinks = fragmentElement.querySelectorAll('.sp-footer-links a');
            footerLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const linkText = e.currentTarget.textContent;
                    this.trackFooterLink(linkText);
                });
            });
        },

        updateYear: function() {
            const copyright = fragmentElement.querySelector('.sp-copyright');
            if (copyright) {
                const currentYear = new Date().getFullYear();
                copyright.textContent = copyright.textContent.replace(/\d{4}/, currentYear);
            }
        },

        trackFooterLink: function(linkText) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'footer_link_click', {
                    'link_text': linkText,
                    'location': 'footer'
                });
            }
            console.log('SP Footer: Link clicked:', linkText);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => ScottishPower.footer.init(), 100);
        });
    } else {
        setTimeout(() => ScottishPower.footer.init(), 100);
    }

})();