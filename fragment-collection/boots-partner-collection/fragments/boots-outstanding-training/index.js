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