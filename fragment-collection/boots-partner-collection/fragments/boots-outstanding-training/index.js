/**
 * Boots Outstanding Training Fragment JavaScript
 * Handles interaction and dynamic behavior for outstanding training notifications
 */

(function() {
    'use strict';
    
    // Fragment initialization
    function initOutstandingTraining() {
        const fragmentElement = document.querySelector('.boots-outstanding-training-fragment');
        if (!fragmentElement) return;
        
        // Check if we're in edit mode
        const isEditMode = document.querySelector('.control-menu') || 
                          document.querySelector('#wrapper.has-edit-mode-menu') ||
                          document.body.classList.contains('has-edit-mode-menu');
        
        if (isEditMode) {
            console.log('Outstanding Training Fragment: Edit mode detected');
            return;
        }
        
        // Add click handler for the training card (if enabled in configuration)
        if (typeof configuration !== 'undefined' && configuration.enableClickAction !== false) {
            const trainingCard = fragmentElement.querySelector('.boots-outstanding-training-card');
            if (trainingCard) {
                trainingCard.addEventListener('click', handleTrainingClick);
                trainingCard.style.cursor = 'pointer';
                trainingCard.setAttribute('role', 'button');
                trainingCard.setAttribute('tabindex', '0');
                
                // Keyboard accessibility
                trainingCard.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTrainingClick();
                    }
                });
            }
        }
        
        // Check for overdue training and update styling
        checkDueDateStatus();
        
        // Set up training completion listener
        setupTrainingCompletionListener();
        
        console.log('Outstanding Training Fragment: Initialized successfully');
    }
    
    // Handle training card click
    function handleTrainingClick() {
        console.log('Outstanding Training: Card clicked');
        
        // You can customize this action based on your needs
        // For example, redirect to training portal or show more details
        
        // Example: Redirect to training page
        // window.location.href = '/training/outstanding';
        
        // Example: Show alert (for demo purposes)
        if (window.Liferay && window.Liferay.Util) {
            window.Liferay.Util.openToast({
                message: 'Redirecting to training portal...',
                type: 'info'
            });
        }
    }
    
    // Set up listener for training completion based on floating button
    function setupTrainingCompletionListener() {
        console.log('Outstanding Training: Setting up completion listener...');
        
        // Function to check if training is complete
        function checkTrainingCompletion() {
            console.log('Outstanding Training: Checking for completion...');
            
            // Look for ANY element containing "Page 3 / 3" text (not just buttons)
            const allElements = document.querySelectorAll('*');
            let pageElement = null;
            
            // First, try specific selectors for buttons/interactive elements
            const buttonSelectors = [
                '.btn-floating-bar.btn-floating-bar-text.btn.btn-primary',
                '.btn-floating-bar',
                'button[title*="jump"]',
                'button[title*="page"]',
                '[class*="floating"][class*="bar"]'
            ];
            
            for (let selector of buttonSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    const text = element.textContent.trim();
                    console.log('Outstanding Training: Found button element:', selector, 'Text:', text);
                    if (text.includes('Page 3 / 3') || text.includes('3 / 3')) {
                        pageElement = element;
                        break;
                    }
                }
            }
            
            // If no button found, search ALL elements for page text
            if (!pageElement) {
                for (let element of allElements) {
                    const text = element.textContent?.trim() || '';
                    // Look for elements that contain page information
                    if (text === 'Page 3 / 3' || text === '3 / 3' || 
                        (text.includes('Page') && text.includes('3 / 3'))) {
                        console.log('Outstanding Training: Found page element:', element.tagName, 'Class:', element.className, 'Text:', text);
                        pageElement = element;
                        break;
                    }
                }
            }
            
            if (pageElement) {
                const elementText = pageElement.textContent.trim();
                const titleText = pageElement.getAttribute('title') || '';
                console.log('Outstanding Training: Page element text:', elementText);
                console.log('Outstanding Training: Page element title:', titleText);
                console.log('Outstanding Training: Page element tag:', pageElement.tagName);
                console.log('Outstanding Training: Page element classes:', pageElement.className);
                
                // Check for completion indicators
                if (elementText.includes('Page 3 / 3') || elementText === '3 / 3' || 
                    titleText.includes('Page 3 / 3')) {
                    console.log('Outstanding Training: Training completion detected!');
                    markTrainingComplete();
                    return true;
                }
            } else {
                console.log('Outstanding Training: No page element found - searching for partial matches');
                
                // Search for any element containing "3 / 3" as a last resort
                for (let element of allElements) {
                    const text = element.textContent?.trim() || '';
                    if (text.includes('3 / 3') && text.length < 50) { // Limit length to avoid false positives
                        console.log('Outstanding Training: Found potential page element:', element.tagName, 'Text:', text);
                        pageElement = element;
                        break;
                    }
                }
            }
            
            return false;
        }
        
        // Initial check with longer delay to ensure document viewer is loaded
        setTimeout(() => {
            console.log('Outstanding Training: Running initial completion check (1s delay)...');
            if (checkTrainingCompletion()) {
                return;
            }
        }, 1000);
        
        // Additional delayed check for slow-loading document viewers
        setTimeout(() => {
            console.log('Outstanding Training: Running delayed completion check (5s delay)...');
            if (checkTrainingCompletion()) {
                return;
            }
        }, 5000);
        
        // Another check for very slow document viewers
        setTimeout(() => {
            console.log('Outstanding Training: Running extended completion check (10s delay)...');
            if (checkTrainingCompletion()) {
                return;
            }
        }, 10000);
        
        // Set up MutationObserver to watch for changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Check if any added nodes contain our button
                    if (mutation.addedNodes) {
                        for (let node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches && (node.matches('.btn-floating-bar') || 
                                    node.querySelector && node.querySelector('.btn-floating-bar'))) {
                                    console.log('Outstanding Training: Floating button detected in DOM change');
                                    setTimeout(checkTrainingCompletion, 100);
                                    return;
                                }
                            }
                        }
                    }
                    // Also check for text changes
                    if (mutation.type === 'characterData') {
                        setTimeout(checkTrainingCompletion, 100);
                    }
                }
            });
        });
        
        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        // Also set up a more frequent periodic check as backup
        const intervalCheck = setInterval(() => {
            if (checkTrainingCompletion()) {
                clearInterval(intervalCheck);
                observer.disconnect();
            }
        }, 1000); // Check every second
        
        console.log('Outstanding Training: Training completion listener set up successfully');
    }
    
    // Mark training as complete
    function markTrainingComplete() {
        const fragmentElement = document.querySelector('.boots-outstanding-training-fragment');
        if (!fragmentElement) return;
        
        console.log('Outstanding Training: Marking training as complete');
        
        // Update the fragment styling
        const card = fragmentElement.querySelector('.boots-outstanding-training-card');
        const statusBadge = fragmentElement.querySelector('.boots-status-badge');
        const trainingIcon = fragmentElement.querySelector('.boots-training-icon');
        const title = fragmentElement.querySelector('.boots-training-title');
        
        if (card) {
            card.classList.add('boots-training-completed');
        }
        
        if (statusBadge) {
            statusBadge.textContent = 'Completed';
            statusBadge.className = 'boots-status-badge boots-status-completed';
            statusBadge.style.background = '#d4edda';
            statusBadge.style.color = '#155724';
            statusBadge.style.borderColor = '#c3e6cb';
        }
        
        if (trainingIcon) {
            // Change icon to checkmark
            trainingIcon.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
            trainingIcon.style.background = '#28a745';
        }
        
        if (title) {
            title.textContent = 'Training Completed';
        }
        
        // Show completion notification
        if (window.Liferay && window.Liferay.Util) {
            window.Liferay.Util.openToast({
                message: 'Training has been completed successfully!',
                type: 'success'
            });
        }
        
        // Disable click handler since training is complete
        const trainingCard = fragmentElement.querySelector('.boots-outstanding-training-card');
        if (trainingCard) {
            trainingCard.style.cursor = 'default';
            trainingCard.removeAttribute('role');
            trainingCard.removeAttribute('tabindex');
            
            // Remove event listeners by cloning and replacing the element
            const newCard = trainingCard.cloneNode(true);
            trainingCard.parentNode.replaceChild(newCard, trainingCard);
        }
    }
    
    // Check due date status and update styling accordingly
    function checkDueDateStatus() {
        const dueDateElement = document.querySelector('.boots-outstanding-training-fragment .boots-due-date');
        if (!dueDateElement) return;
        
        const dueDateText = dueDateElement.textContent.trim();
        const dueDate = new Date(dueDateText);
        const today = new Date();
        
        // Check if the date is valid
        if (isNaN(dueDate.getTime())) return;
        
        const daysDifference = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const statusBadge = document.querySelector('.boots-outstanding-training-fragment .boots-status-badge');
        
        if (statusBadge) {
            if (daysDifference < 0) {
                // Overdue
                statusBadge.textContent = 'Overdue';
                statusBadge.className = 'boots-status-badge boots-status-overdue';
                statusBadge.style.background = '#f8d7da';
                statusBadge.style.color = '#721c24';
                statusBadge.style.borderColor = '#f5c6cb';
            } else if (daysDifference <= 7) {
                // Due soon
                statusBadge.textContent = 'Due Soon';
                statusBadge.className = 'boots-status-badge boots-status-urgent';
            } else {
                // Upcoming
                statusBadge.textContent = 'Upcoming';
                statusBadge.className = 'boots-status-badge boots-status-upcoming';
                statusBadge.style.background = '#d1ecf1';
                statusBadge.style.color = '#0c5460';
                statusBadge.style.borderColor = '#bee5eb';
            }
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOutstandingTraining);
    } else {
        initOutstandingTraining();
    }
    
    // Re-initialize if fragment is dynamically loaded
    if (typeof fragmentElement !== 'undefined') {
        initOutstandingTraining();
    }
    
})();