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
        
        // Add click handler for the training card
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
        // Function to check if training is complete
        function checkTrainingCompletion() {
            const floatingButton = document.querySelector('.btn-floating-bar.btn-floating-bar-text.btn.btn-primary');
            if (floatingButton) {
                const buttonText = floatingButton.textContent.trim();
                console.log('Outstanding Training: Floating button text:', buttonText);
                
                if (buttonText === 'Page 3 / 3') {
                    markTrainingComplete();
                    return true;
                }
            }
            return false;
        }
        
        // Initial check
        if (checkTrainingCompletion()) {
            return;
        }
        
        // Set up MutationObserver to watch for changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    checkTrainingCompletion();
                }
            });
        });
        
        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        // Also set up a periodic check as backup
        const intervalCheck = setInterval(() => {
            if (checkTrainingCompletion()) {
                clearInterval(intervalCheck);
            }
        }, 2000);
        
        console.log('Outstanding Training: Training completion listener set up');
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