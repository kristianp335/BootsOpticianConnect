/**
 * Boots Training Fragment JavaScript
 * Handles training module functionality, progress tracking, and filtering
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') return;
    
    let progressChart;
    
    /**
     * Initialize training functionality
     */
    function init() {
        initializeCounters();
        initializeModuleFilters();
        initializeProgressChart();
        initializeModuleActions();
        bindInteractionEvents();
    }
    
    /**
     * Initialize animated counters
     */
    function initializeCounters() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target) || 0;
                    animateCounter(counter, 0, target);
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);
        
        const counters = fragmentElement.querySelectorAll('[data-counter]');
        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    }
    
    /**
     * Animate counter with easing
     */
    function animateCounter(element, start, end, duration = 2000) {
        let current = start;
        const increment = (end - start) / (duration / 16);
        const timer = setInterval(function() {
            current += increment;
            if (current >= end) {
                element.textContent = formatCounterValue(end);
                clearInterval(timer);
            } else {
                element.textContent = formatCounterValue(Math.floor(current));
            }
        }, 16);
    }
    
    /**
     * Format counter values
     */
    function formatCounterValue(value) {
        if (value >= 100) {
            return value + '%';
        }
        return value.toString();
    }
    
    /**
     * Initialize module filtering
     */
    function initializeModuleFilters() {
        const filterButtons = fragmentElement.querySelectorAll('.boots-filter-btn');
        const moduleCards = fragmentElement.querySelectorAll('.boots-module-card');
        
        filterButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active state
                filterButtons.forEach(function(btn) { btn.classList.remove('active'); });
                this.classList.add('active');
                
                // Filter modules
                const filterStatus = this.dataset.status;
                filterModules(moduleCards, filterStatus);
            });
        });
    }
    
    /**
     * Filter modules based on status
     */
    function filterModules(moduleCards, filterStatus) {
        moduleCards.forEach(function(card) {
            const cardStatus = card.dataset.status || '';
            const shouldShow = filterStatus === 'all' || cardStatus.includes(filterStatus);
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(function() {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(function() {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    /**
     * Initialize progress chart
     */
    function initializeProgressChart() {
        // Load Chart.js from CDN if not available
        if (typeof Chart === 'undefined') {
            loadChartJS().then(function() {
                createProgressChart();
            }).catch(function(error) {
                console.error('Failed to load Chart.js:', error);
                showChartError();
            });
        } else {
            createProgressChart();
        }
        
        // Initialize chart period controls
        const chartControls = fragmentElement.querySelectorAll('[data-chart-period]');
        chartControls.forEach(function(control) {
            control.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active state
                chartControls.forEach(function(c) { c.classList.remove('active'); });
                this.classList.add('active');
                
                // Update chart with new period
                const period = this.dataset.chartPeriod;
                updateProgressChart(period);
            });
        });
    }
    
    /**
     * Load Chart.js from CDN
     */
    function loadChartJS() {
        return new Promise(function(resolve, reject) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Create progress chart
     */
    function createProgressChart() {
        const canvas = fragmentElement.querySelector('#boots-progress-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Overall Progress (%)',
                        data: [45, 52, 58, 65, 72, 78],
                        borderColor: '#184290',
                        backgroundColor: 'rgba(24, 66, 144, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#184290',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    },
                    {
                        label: 'Required Training (%)',
                        data: [60, 68, 72, 78, 82, 85],
                        borderColor: '#b95000',
                        backgroundColor: 'rgba(185, 80, 0, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#b95000',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#f1f2f5'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
    
    /**
     * Update progress chart based on period
     */
    function updateProgressChart(period) {
        if (!progressChart) return;
        
        const chartData = getProgressData(period);
        
        progressChart.data.labels = chartData.labels;
        progressChart.data.datasets[0].data = chartData.overall;
        progressChart.data.datasets[1].data = chartData.required;
        progressChart.update('active');
    }
    
    /**
     * Get progress data for different periods
     */
    function getProgressData(period) {
        const data = {
            '3months': {
                labels: ['Jun', 'Jul', 'Aug'],
                overall: [65, 72, 78],
                required: [78, 82, 85]
            },
            '6months': {
                labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                overall: [58, 65, 72, 78, 82, 85],
                required: [72, 78, 82, 85, 88, 90]
            },
            '1year': {
                labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                overall: [35, 38, 42, 45, 52, 58, 65, 72, 78, 82, 85, 88],
                required: [50, 55, 60, 65, 68, 72, 78, 82, 85, 88, 90, 92]
            }
        };
        
        return data[period] || data['6months'];
    }
    
    /**
     * Show chart error state
     */
    function showChartError() {
        const chartContainer = fragmentElement.querySelector('.boots-chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = '<div class="boots-chart-error">Unable to load chart. Please refresh the page.</div>';
        }
    }
    
    /**
     * Initialize module actions
     */
    function initializeModuleActions() {
        // Module bookmark functionality
        const bookmarkBtns = fragmentElement.querySelectorAll('[data-module="bookmark"]');
        bookmarkBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleBookmark(this);
            });
        });
        
        // Module preview functionality
        const previewBtns = fragmentElement.querySelectorAll('[data-module="preview"]');
        previewBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showModulePreview(this);
            });
        });
        
        // Goal progress animations
        animateGoalProgress();
    }
    
    /**
     * Toggle bookmark state
     */
    function toggleBookmark(button) {
        const isBookmarked = button.classList.contains('bookmarked');
        
        if (isBookmarked) {
            button.classList.remove('bookmarked');
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2V14L8 11L13 14V2H3Z" stroke="currentColor" stroke-width="2"/></svg>';
        } else {
            button.classList.add('bookmarked');
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2V14L8 11L13 14V2H3Z"/></svg>';
        }
        
        // Add visual feedback
        button.style.transform = 'scale(0.9)';
        setTimeout(function() {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    /**
     * Show module preview (placeholder functionality)
     */
    function showModulePreview(button) {
        // Add click feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(function() {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // In a real implementation, this would open a modal or navigate to preview
        console.log('Module preview requested');
    }
    
    /**
     * Animate goal progress bars
     */
    function animateGoalProgress() {
        const progressBars = fragmentElement.querySelectorAll('.boots-goal-fill');
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const targetWidth = fill.style.width || '0%';
                    
                    // Reset and animate
                    fill.style.width = '0%';
                    fill.style.transition = 'width 1.5s ease-in-out';
                    
                    setTimeout(function() {
                        fill.style.width = targetWidth;
                    }, 100);
                    
                    observer.unobserve(fill);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(function(bar) {
            observer.observe(bar);
        });
    }
    
    /**
     * Bind interaction events
     */
    function bindInteractionEvents() {
        // Module card hover effects
        const moduleCards = fragmentElement.querySelectorAll('.boots-module-card');
        moduleCards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Upcoming training registration
        const registerBtns = fragmentElement.querySelectorAll('.boots-upcoming-actions .boots-btn-primary');
        registerBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Visual feedback
                this.innerHTML = 'Registered!';
                this.classList.remove('boots-btn-primary');
                this.classList.add('boots-btn-outline');
                this.disabled = true;
            });
        });
        
        // Achievement animations
        const achievementItems = fragmentElement.querySelectorAll('.boots-achievement-item');
        achievementItems.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.boots-achievement-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.boots-achievement-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    /**
     * Handle window resize
     */
    function handleResize() {
        if (progressChart) {
            progressChart.resize();
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
})();
