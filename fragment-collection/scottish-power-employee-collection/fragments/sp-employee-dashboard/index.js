/**
 * Scottish Power Employee Dashboard Fragment JavaScript
 * Handles KPI animations, real-time updates, and interactive elements
 */

(function() {
    'use strict';
    
    // Ensure fragmentElement is available
    if (typeof fragmentElement === 'undefined') {
        console.error('SP Employee Dashboard: fragmentElement not available');
        return;
    }

    // Create ScottishPower namespace if it doesn't exist
    window.ScottishPower = window.ScottishPower || {};
    window.ScottishPower.dashboard = window.ScottishPower.dashboard || {};

    // Dashboard functionality
    ScottishPower.dashboard = {
        
        /**
         * Initialize dashboard functionality
         */
        init: function() {
            this.updateDateTime();
            this.initializeCounters();
            this.setupEventListeners();
            this.loadPersonalData();
            this.startRealTimeUpdates();
            
            console.log('SP Employee Dashboard: Initialized successfully');
        },

        /**
         * Update current date and time display
         */
        updateDateTime: function() {
            const dateElement = fragmentElement.querySelector('#sp-current-date');
            const timeElement = fragmentElement.querySelector('#sp-current-time');
            
            if (dateElement || timeElement) {
                const now = new Date();
                
                if (dateElement) {
                    dateElement.textContent = now.toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
                
                if (timeElement) {
                    timeElement.textContent = now.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            }
        },

        /**
         * Initialize animated counters for KPIs and metrics
         */
        initializeCounters: function() {
            const counters = fragmentElement.querySelectorAll('[data-count]');
            
            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-count'));
                if (!isNaN(target)) {
                    this.animateCounter(counter, target);
                }
            });
        },

        /**
         * Animate number counter with smooth transition
         * @param {HTMLElement} element - Element to animate
         * @param {number} target - Target number
         * @param {number} duration - Animation duration in ms
         */
        animateCounter: function(element, target, duration = 2000) {
            if (!element) return;
            
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format number appropriately
                if (target >= 100) {
                    element.textContent = Math.floor(current);
                } else {
                    element.textContent = current.toFixed(1);
                }
            }, 16);
        },

        /**
         * Setup event listeners for interactive elements
         */
        setupEventListeners: function() {
            const dashboard = fragmentElement;
            if (!dashboard) return;

            // Quick action buttons
            const actionCards = dashboard.querySelectorAll('.sp-action-card');
            actionCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    const action = e.currentTarget.getAttribute('data-action');
                    this.handleQuickAction(action);
                });
            });

            // Task item interactions
            const taskItems = dashboard.querySelectorAll('.sp-task-item');
            taskItems.forEach(task => {
                task.addEventListener('click', (e) => {
                    this.handleTaskClick(e.currentTarget);
                });
            });

            // Activity item interactions
            const activityItems = dashboard.querySelectorAll('.sp-activity-item');
            activityItems.forEach(activity => {
                activity.addEventListener('click', (e) => {
                    this.handleActivityClick(e.currentTarget);
                });
            });

            // KPI card hover effects
            const kpiCards = dashboard.querySelectorAll('.sp-kpi-card');
            kpiCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    this.highlightRelatedMetrics(card);
                });
                
                card.addEventListener('mouseleave', () => {
                    this.clearMetricHighlights();
                });
            });
        },

        /**
         * Handle quick action button clicks
         */
        handleQuickAction: function(action) {
            switch (action) {
                case 'timesheet':
                    this.openTimesheet();
                    break;
                case 'safety-report':
                    this.openSafetyReport();
                    break;
                case 'leave-request':
                    this.openLeaveRequest();
                    break;
                case 'training':
                    this.openTrainingPortal();
                    break;
                default:
                    console.log('SP Dashboard: Unknown action:', action);
            }
        },

        /**
         * Open timesheet submission form
         */
        openTimesheet: function() {
            // In real implementation, this would open the timesheet form
            alert('Timesheet submission form would open here.\n\nThis would integrate with your HR system.');
            this.trackAction('timesheet_access');
        },

        /**
         * Open safety reporting form
         */
        openSafetyReport: function() {
            // In real implementation, this would open safety reporting system
            alert('Safety reporting system would open here.\n\nReport incidents, near misses, or safety observations.');
            this.trackAction('safety_report_access');
        },

        /**
         * Open leave request form
         */
        openLeaveRequest: function() {
            // In real implementation, this would open leave management system
            alert('Leave request system would open here.\n\nSubmit holiday requests and track approval status.');
            this.trackAction('leave_request_access');
        },

        /**
         * Open training portal
         */
        openTrainingPortal: function() {
            // In real implementation, this would redirect to training system
            window.open('/employee/training', '_blank');
            this.trackAction('training_portal_access');
        },

        /**
         * Handle task item clicks
         */
        handleTaskClick: function(taskElement) {
            const taskTitle = taskElement.querySelector('h4')?.textContent || 'Task';
            console.log('SP Dashboard: Task clicked:', taskTitle);
            
            // Add visual feedback
            taskElement.style.transform = 'scale(0.98)';
            setTimeout(() => {
                taskElement.style.transform = '';
            }, 150);
            
            this.trackAction('task_click', { task_title: taskTitle });
        },

        /**
         * Handle activity item clicks
         */
        handleActivityClick: function(activityElement) {
            const activityTitle = activityElement.querySelector('h4')?.textContent || 'Activity';
            console.log('SP Dashboard: Activity clicked:', activityTitle);
            
            this.trackAction('activity_click', { activity_title: activityTitle });
        },

        /**
         * Load personalized data for current user
         */
        loadPersonalData: function() {
            const user = window.ScottishPower.auth ? 
                window.ScottishPower.auth.getCurrentUser() : null;
            
            if (user) {
                this.updatePersonalInfo(user);
                this.loadUserMetrics(user);
                this.loadUserTasks(user);
            }
        },

        /**
         * Update personal information in dashboard
         */
        updatePersonalInfo: function(user) {
            // Update welcome message
            const welcomeTitle = fragmentElement.querySelector('.sp-welcome-title');
            if (welcomeTitle && user.firstName) {
                welcomeTitle.textContent = `Welcome back, ${user.firstName}`;
            }

            const welcomeSubtitle = fragmentElement.querySelector('.sp-welcome-subtitle');
            if (welcomeSubtitle && user.department) {
                welcomeSubtitle.textContent = `Here's your personalized dashboard for ${user.department}`;
            }
        },

        /**
         * Load user-specific metrics and KPIs
         */
        loadUserMetrics: function(user) {
            // In real implementation, this would load actual user metrics from API
            console.log('SP Dashboard: Loading metrics for user:', user.id);
            
            // Simulate loading updated metrics
            setTimeout(() => {
                this.updateMetricValues({
                    tasksCompleted: Math.floor(Math.random() * 50) + 30,
                    responseTime: (Math.random() * 2 + 1.5).toFixed(1),
                    efficiency: Math.floor(Math.random() * 15) + 85,
                    safetyRating: (Math.random() * 1 + 4).toFixed(1),
                    incidentFreeDays: Math.floor(Math.random() * 100) + 100
                });
            }, 1000);
        },

        /**
         * Update metric values in the dashboard
         */
        updateMetricValues: function(metrics) {
            Object.keys(metrics).forEach(key => {
                const element = fragmentElement.querySelector(`[data-count="${key}"]`);
                if (element) {
                    element.setAttribute('data-count', metrics[key]);
                    this.animateCounter(element, parseFloat(metrics[key]), 1000);
                }
            });
        },

        /**
         * Load user-specific tasks
         */
        loadUserTasks: function(user) {
            // In real implementation, this would load tasks from task management system
            console.log('SP Dashboard: Loading tasks for user:', user.id);
        },

        /**
         * Highlight related metrics on hover
         */
        highlightRelatedMetrics: function(kpiCard) {
            const allKpiCards = fragmentElement.querySelectorAll('.sp-kpi-card');
            allKpiCards.forEach(card => {
                if (card !== kpiCard) {
                    card.style.opacity = '0.6';
                }
            });
        },

        /**
         * Clear metric highlights
         */
        clearMetricHighlights: function() {
            const allKpiCards = fragmentElement.querySelectorAll('.sp-kpi-card');
            allKpiCards.forEach(card => {
                card.style.opacity = '';
            });
        },

        /**
         * Start real-time updates for dashboard
         */
        startRealTimeUpdates: function() {
            // Update time every minute
            setInterval(() => {
                this.updateDateTime();
            }, 60000);

            // Update metrics every 5 minutes
            setInterval(() => {
                this.refreshMetrics();
            }, 300000);
        },

        /**
         * Refresh dashboard metrics
         */
        refreshMetrics: function() {
            const user = window.ScottishPower.auth ? 
                window.ScottishPower.auth.getCurrentUser() : null;
            
            if (user) {
                this.loadUserMetrics(user);
            }
        },

        /**
         * Track user actions for analytics
         */
        trackAction: function(action, data = {}) {
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    'custom_parameter': JSON.stringify(data),
                    'location': 'employee_dashboard'
                });
            }
            
            console.log('SP Dashboard: Action tracked:', action, data);
        },

        /**
         * Handle responsive layout changes
         */
        handleResize: function() {
            const isMobile = window.innerWidth <= 768;
            const dashboard = fragmentElement.querySelector('.sp-employee-dashboard-fragment');
            
            if (dashboard) {
                if (isMobile) {
                    dashboard.classList.add('sp-mobile-layout');
                } else {
                    dashboard.classList.remove('sp-mobile-layout');
                }
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => ScottishPower.dashboard.init(), 100);
        });
    } else {
        setTimeout(() => ScottishPower.dashboard.init(), 100);
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        ScottishPower.dashboard.handleResize();
    });

})();