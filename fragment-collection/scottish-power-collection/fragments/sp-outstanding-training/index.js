/**
 * Boots Outstanding Training Fragment JavaScript
 * Handles interaction and dynamic behavior for outstanding training notifications
 */

(function() {
    'use strict';
    
    // Fragment initialization
    function initOutstandingTraining() {
        const fragmentElement = document.querySelector('.sp-outstanding-training-fragment');
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
            const trainingCard = fragmentElement.querySelector('.sp-outstanding-training-card');
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
            
            // Based on actual DOM structure, look for the specific button
            const specificButton = document.querySelector('.btn-floating-bar.btn-floating-bar-text.btn.btn-primary[title="Click to jump to a page."]');
            
            if (specificButton) {
                const buttonText = specificButton.textContent.trim();
                console.log('Outstanding Training: Found floating bar button - Text:', buttonText);
                console.log('Outstanding Training: Button title:', specificButton.getAttribute('title'));
                console.log('Outstanding Training: Button classes:', specificButton.className);
                
                // Check if we're on page 3 of 3
                if (buttonText === 'Page 3 / 3') {
                    console.log('Outstanding Training: ✅ COMPLETION DETECTED - Page 3 / 3!');
                    markTrainingComplete();
                    return true;
                }
                
                // Log current page for debugging
                console.log('Outstanding Training: Currently on:', buttonText, '(waiting for Page 3 / 3)');
                return false;
            }
            
            // Fallback: Look in preview toolbar container specifically
            const previewToolbar = document.querySelector('.preview-toolbar-container');
            if (previewToolbar) {
                console.log('Outstanding Training: Found preview toolbar container');
                
                const floatingBar = previewToolbar.querySelector('.floating-bar');
                if (floatingBar) {
                    console.log('Outstanding Training: Found floating bar within toolbar');
                    
                    const pageButton = floatingBar.querySelector('button');
                    if (pageButton) {
                        const pageText = pageButton.textContent.trim();
                        console.log('Outstanding Training: Found page button in toolbar - Text:', pageText);
                        
                        if (pageText === 'Page 3 / 3') {
                            console.log('Outstanding Training: ✅ COMPLETION DETECTED via toolbar!');
                            markTrainingComplete();
                            return true;
                        }
                    }
                }
            }
            
            // Ultimate fallback: Search for ANY button with "Page 3 / 3"
            const allButtons = document.querySelectorAll('button');
            for (let button of allButtons) {
                const text = button.textContent.trim();
                if (text === 'Page 3 / 3') {
                    console.log('Outstanding Training: ✅ COMPLETION DETECTED via fallback button search!');
                    console.log('Outstanding Training: Button found:', button.className);
                    markTrainingComplete();
                    return true;
                }
            }
            
            console.log('Outstanding Training: No completion detected. Document viewer may still be loading...');
            return false;
        }
        
        // Progressive timing checks for slow-loading document viewer
        const checkTimes = [500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000];
        let completed = false;
        
        checkTimes.forEach((delay, index) => {
            setTimeout(() => {
                if (completed) return;
                
                console.log(`Outstanding Training: Check #${index + 1} (${delay}ms delay)...`);
                if (checkTrainingCompletion()) {
                    completed = true;
                    return;
                }
            }, delay);
        });
        
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
        const fragmentElement = document.querySelector('.sp-outstanding-training-fragment');
        if (!fragmentElement) return;
        
        console.log('Outstanding Training: Marking training as complete');
        
        // Update the fragment styling
        const card = fragmentElement.querySelector('.sp-outstanding-training-card');
        const statusBadge = fragmentElement.querySelector('.sp-status-badge');
        const trainingIcon = fragmentElement.querySelector('.sp-training-icon');
        const title = fragmentElement.querySelector('.sp-training-title');
        
        if (card) {
            card.classList.add('sp-training-completed');
        }
        
        if (statusBadge) {
            statusBadge.textContent = 'Completed';
            statusBadge.className = 'sp-status-badge sp-status-completed';
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
        const trainingCard = fragmentElement.querySelector('.sp-outstanding-training-card');
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
        const dueDateElement = document.querySelector('.sp-outstanding-training-fragment .sp-due-date');
        if (!dueDateElement) return;
        
        const dueDateText = dueDateElement.textContent.trim();
        const dueDate = new Date(dueDateText);
        const today = new Date();
        
        // Check if the date is valid
        if (isNaN(dueDate.getTime())) return;
        
        const daysDifference = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const statusBadge = document.querySelector('.sp-outstanding-training-fragment .sp-status-badge');
        
        if (statusBadge) {
            if (daysDifference < 0) {
                // Overdue
                statusBadge.textContent = 'Overdue';
                statusBadge.className = 'sp-status-badge sp-status-overdue';
                statusBadge.style.background = '#f8d7da';
                statusBadge.style.color = '#721c24';
                statusBadge.style.borderColor = '#f5c6cb';
            } else if (daysDifference <= 7) {
                // Due soon
                statusBadge.textContent = 'Due Soon';
                statusBadge.className = 'sp-status-badge sp-status-urgent';
            } else {
                // Upcoming
                statusBadge.textContent = 'Upcoming';
                statusBadge.className = 'sp-status-badge sp-status-upcoming';
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