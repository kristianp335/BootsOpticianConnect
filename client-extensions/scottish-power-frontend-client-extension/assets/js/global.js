/**
 * Scottish Power Energy Networks Global JavaScript
 * Provides shared utilities and functionality for all fragments
 */

// Scottish Power Global Utilities
window.ScottishPower = window.ScottishPower || {};

ScottishPower.utils = {
    /**
     * Format dates for Scottish locale
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDate: function(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
        });
    },

    /**
     * Format energy consumption values
     * @param {number} value - Energy value
     * @param {string} unit - Unit (kWh, MWh, etc.)
     * @returns {string} Formatted energy string
     */
    formatEnergy: function(value, unit = 'kWh') {
        if (typeof value !== 'number') return '';
        return value.toLocaleString('en-GB') + ' ' + unit;
    },

    /**
     * Format currency for UK locale
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    formatCurrency: function(amount) {
        if (typeof amount !== 'number') return '';
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP'
        }).format(amount);
    },

    /**
     * Generate random employee ID for demo purposes
     * @returns {string} Employee ID
     */
    generateEmployeeId: function() {
        return 'SP' + Math.floor(Math.random() * 90000 + 10000);
    },

    /**
     * Check if user has specific role/permission
     * @param {string} role - Role to check
     * @returns {boolean} Has role
     */
    hasRole: function(role) {
        // In real implementation, this would check actual user permissions
        return window.ScottishPower.currentUser?.roles?.includes(role) || false;
    },

    /**
     * Show energy status indicator
     * @param {string} status - operational, maintenance, alert
     * @returns {string} HTML for status indicator
     */
    getEnergyStatusHTML: function(status) {
        const statusConfig = {
            operational: { text: 'Operational', icon: '✓' },
            maintenance: { text: 'Maintenance', icon: '⚠' },
            alert: { text: 'Alert', icon: '⚡' }
        };
        
        const config = statusConfig[status] || statusConfig.operational;
        return `<span class="sp-energy-status ${status}">
                    <span>${config.icon}</span>
                    <span>${config.text}</span>
                </span>`;
    },

    /**
     * Create safety badge HTML
     * @param {string} text - Badge text
     * @returns {string} HTML for safety badge
     */
    getSafetyBadgeHTML: function(text) {
        return `<span class="sp-safety-badge">
                    <span>⚠</span>
                    <span>${text}</span>
                </span>`;
    }
};

// Employee Authentication and Profile
ScottishPower.auth = {
    /**
     * Get current user information
     * @returns {Object|null} User object or null if not authenticated
     */
    getCurrentUser: function() {
        return window.ScottishPower.currentUser || null;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} Is authenticated
     */
    isAuthenticated: function() {
        return !!this.getCurrentUser();
    },

    /**
     * Get user display name
     * @returns {string} Display name
     */
    getUserDisplayName: function() {
        const user = this.getCurrentUser();
        if (!user) return 'Employee';
        return user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.email || 'Employee';
    },

    /**
     * Get user department
     * @returns {string} Department name
     */
    getUserDepartment: function() {
        const user = this.getCurrentUser();
        return user?.department || 'General';
    }
};

// Energy Grid Utilities
ScottishPower.grid = {
    /**
     * Get grid status information
     * @returns {Object} Grid status data
     */
    getGridStatus: function() {
        // In real implementation, this would call actual APIs
        return {
            status: 'operational',
            load: 85,
            generation: 92,
            lastUpdate: new Date()
        };
    },

    /**
     * Format grid load percentage
     * @param {number} load - Load percentage
     * @returns {string} Formatted load string
     */
    formatGridLoad: function(load) {
        if (typeof load !== 'number') return '';
        const status = load > 90 ? 'critical' : load > 75 ? 'high' : 'normal';
        return `${load}% (${status})`;
    }
};

// Safety and Compliance
ScottishPower.safety = {
    /**
     * Check if safety training is current
     * @param {Date} lastTrainingDate - Last training completion date
     * @returns {boolean} Is training current
     */
    isTrainingCurrent: function(lastTrainingDate) {
        if (!lastTrainingDate) return false;
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return new Date(lastTrainingDate) > sixMonthsAgo;
    },

    /**
     * Get safety rating color
     * @param {number} rating - Safety rating (1-5)
     * @returns {string} CSS class for rating color
     */
    getSafetyRatingClass: function(rating) {
        if (rating >= 4) return 'sp-text-success';
        if (rating >= 3) return 'sp-text-warning';
        return 'sp-text-danger';
    }
};

// Animation and UI Enhancements
ScottishPower.ui = {
    /**
     * Animate number counter
     * @param {HTMLElement} element - Element to animate
     * @param {number} target - Target number
     * @param {number} duration - Animation duration in ms
     */
    animateCounter: function(element, target, duration = 1000) {
        if (!element) return;
        
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    },

    /**
     * Show loading spinner
     * @param {HTMLElement} container - Container element
     * @param {string} message - Loading message
     */
    showLoading: function(container, message = 'Loading...') {
        if (!container) return;
        container.innerHTML = `
            <div class="sp-flex sp-flex-center" style="padding: var(--sp-spacing-xl);">
                <div style="text-align: center;">
                    <div style="width: 32px; height: 32px; border: 3px solid var(--sp-medium-gray); 
                                border-top: 3px solid var(--sp-primary); border-radius: 50%; 
                                animation: spin 1s linear infinite; margin: 0 auto var(--sp-spacing-sm);"></div>
                    <p style="color: var(--sp-grid-gray); margin: 0;">${message}</p>
                </div>
            </div>
        `;
    }
};

// Initialize Scottish Power utilities when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set up demo user data for development
    if (!window.ScottishPower.currentUser) {
        window.ScottishPower.currentUser = {
            id: ScottishPower.utils.generateEmployeeId(),
            firstName: 'John',
            lastName: 'MacLeod',
            email: 'john.macleod@scottishpower.com',
            department: 'Network Operations',
            roles: ['employee', 'technician'],
            safetyRating: 4.2,
            lastTraining: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        };
    }

    // Add CSS animation for loading spinners
    if (!document.querySelector('#sp-animations')) {
        const style = document.createElement('style');
        style.id = 'sp-animations';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
});