/**
 * Scottish Power Training Center Fragment JavaScript
 * Handles course interactions, progress tracking, and certification management
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') {
        console.error('SP Training Center: fragmentElement not available');
        return;
    }

    window.ScottishPower = window.ScottishPower || {};
    window.ScottishPower.trainingCenter = {
        
        init: function() {
            this.setupEventListeners();
            this.initializeProgressBars();
            this.updateProgressStats();
            console.log('SP Training Center: Initialized successfully');
        },

        setupEventListeners: function() {
            // Course action buttons
            const courseButtons = fragmentElement.querySelectorAll('.sp-course-card .sp-btn');
            courseButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const courseCard = e.currentTarget.closest('.sp-course-card');
                    const courseTitle = courseCard.querySelector('h4')?.textContent || 'Course';
                    const action = e.currentTarget.textContent.toLowerCase();
                    this.handleCourseAction(courseTitle, action);
                });
            });

            // Certification action buttons
            const certButtons = fragmentElement.querySelectorAll('.sp-cert-card .sp-btn');
            certButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const certCard = e.currentTarget.closest('.sp-cert-card');
                    const certTitle = certCard.querySelector('h4')?.textContent || 'Certification';
                    const action = e.currentTarget.textContent.toLowerCase();
                    this.handleCertificationAction(certTitle, action);
                });
            });

            // Learning path interactions
            const pathCards = fragmentElement.querySelectorAll('.sp-path-card');
            pathCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    const pathTitle = e.currentTarget.querySelector('h4')?.textContent || 'Learning Path';
                    this.handleLearningPathClick(pathTitle);
                });
            });
        },

        initializeProgressBars: function() {
            const progressBars = fragmentElement.querySelectorAll('.sp-progress-fill');
            
            progressBars.forEach(bar => {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                
                // Animate to target width after a delay
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 500);
            });
        },

        updateProgressStats: function() {
            // Animate progress statistics
            const statNumbers = fragmentElement.querySelectorAll('.sp-stat-number');
            
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseFloat(text);
                
                if (!isNaN(number)) {
                    this.animateCounter(stat, number);
                }
            });
        },

        animateCounter: function(element, target, duration = 1500) {
            let current = 0;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target % 1 === 0) {
                    element.textContent = Math.floor(current);
                } else {
                    element.textContent = current.toFixed(1) + '%';
                }
            }, 16);
        },

        handleCourseAction: function(courseTitle, action) {
            switch (action) {
                case 'start course':
                    this.startCourse(courseTitle);
                    break;
                case 'continue':
                    this.continueCourse(courseTitle);
                    break;
                case 'view certificate':
                    this.viewCertificate(courseTitle);
                    break;
                default:
                    console.log('SP Training Center: Unknown course action:', action);
            }
        },

        startCourse: function(courseTitle) {
            // In real implementation, this would launch the course
            alert(`Starting course: ${courseTitle}\n\nThis would launch the training module in a new window.`);
            this.trackCourseAction('start', courseTitle);
        },

        continueCourse: function(courseTitle) {
            // In real implementation, this would resume the course
            alert(`Continuing course: ${courseTitle}\n\nThis would resume your progress in the training module.`);
            this.trackCourseAction('continue', courseTitle);
        },

        viewCertificate: function(courseTitle) {
            // In real implementation, this would display/download the certificate
            alert(`Certificate for: ${courseTitle}\n\nThis would display or download your completion certificate.`);
            this.trackCourseAction('certificate_view', courseTitle);
        },

        handleCertificationAction: function(certTitle, action) {
            if (action.includes('schedule')) {
                this.scheduleCertificationRenewal(certTitle);
            } else if (action.includes('view')) {
                this.viewCertificate(certTitle);
            }
        },

        scheduleCertificationRenewal: function(certTitle) {
            // In real implementation, this would open scheduling system
            alert(`Scheduling renewal for: ${certTitle}\n\nThis would open the certification renewal booking system.`);
            this.trackCertificationAction('schedule_renewal', certTitle);
        },

        handleLearningPathClick: function(pathTitle) {
            // In real implementation, this would show detailed learning path
            alert(`Learning Path: ${pathTitle}\n\nThis would display the detailed learning path with all courses and requirements.`);
            this.trackLearningPathAction('view', pathTitle);
        },

        trackCourseAction: function(action, courseTitle) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'course_action', {
                    'action': action,
                    'course_title': courseTitle,
                    'location': 'training_center'
                });
            }
            console.log('SP Training Center: Course action:', action, courseTitle);
        },

        trackCertificationAction: function(action, certTitle) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'certification_action', {
                    'action': action,
                    'certification_title': certTitle,
                    'location': 'training_center'
                });
            }
            console.log('SP Training Center: Certification action:', action, certTitle);
        },

        trackLearningPathAction: function(action, pathTitle) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'learning_path_action', {
                    'action': action,
                    'path_title': pathTitle,
                    'location': 'training_center'
                });
            }
            console.log('SP Training Center: Learning path action:', action, pathTitle);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => ScottishPower.trainingCenter.init(), 100);
        });
    } else {
        setTimeout(() => ScottishPower.trainingCenter.init(), 100);
    }

})();