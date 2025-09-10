/**
 * Boots Dashboard Fragment JavaScript
 * Handles dashboard functionality, charts, and interactive elements
 */

(function() {
    'use strict';
    
    if (typeof fragmentElement === 'undefined') return;
    
    let revenueChart, appointmentsChart;
    
    /**
     * Initialize dashboard functionality
     */
    function init() {
        updateCurrentDate();
        initializeCounters();
        initializeChartControls();
        initializeCharts();
        bindInteractionEvents();
    }
    
    /**
     * Update current date display
     */
    function updateCurrentDate() {
        const dateElement = fragmentElement.querySelector('#boots-current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('en-GB', options);
        }
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
        if (value >= 1000000) {
            return '£' + (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return '£' + (value / 1000).toFixed(1) + 'K';
        } else if (value < 100 && value % 1 !== 0) {
            return value + '%';
        }
        return new Intl.NumberFormat('en-GB').format(value);
    }
    
    /**
     * Initialize chart period controls
     */
    function initializeChartControls() {
        const controls = fragmentElement.querySelectorAll('[data-period]');
        
        controls.forEach(function(control) {
            control.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active state
                controls.forEach(function(c) { c.classList.remove('active'); });
                this.classList.add('active');
                
                // Update charts with new period
                const period = this.dataset.period;
                updateChartData(period);
            });
        });
    }
    
    /**
     * Initialize Chart.js charts
     */
    function initializeCharts() {
        // Load Chart.js from CDN if not available
        if (typeof Chart === 'undefined') {
            loadChartJS().then(function() {
                createCharts();
            }).catch(function(error) {
                console.error('Failed to load Chart.js:', error);
                showChartError();
            });
        } else {
            createCharts();
        }
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
     * Create dashboard charts
     */
    function createCharts() {
        createRevenueChart();
        createAppointmentsChart();
    }
    
    /**
     * Create revenue trend chart
     */
    function createRevenueChart() {
        const canvas = fragmentElement.querySelector('#boots-revenue-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Revenue (£)',
                    data: [3200, 3800, 4100, 3900],
                    borderColor: '#184290',
                    backgroundColor: 'rgba(24, 66, 144, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#184290',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f2f5'
                        },
                        ticks: {
                            callback: function(value) {
                                return '£' + value.toLocaleString();
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
     * Create appointments volume chart
     */
    function createAppointmentsChart() {
        const canvas = fragmentElement.querySelector('#boots-appointments-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        appointmentsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Appointments',
                    data: [12, 15, 18, 14, 20, 16],
                    backgroundColor: '#184290',
                    borderColor: '#0f2a5a',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f2f5'
                        },
                        ticks: {
                            stepSize: 5
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
    
    /**
     * Update chart data based on selected period
     */
    function updateChartData(period) {
        const revenueData = getRevenueData(period);
        const appointmentsData = getAppointmentsData(period);
        
        if (revenueChart) {
            revenueChart.data.labels = revenueData.labels;
            revenueChart.data.datasets[0].data = revenueData.data;
            revenueChart.update('active');
        }
        
        if (appointmentsChart) {
            appointmentsChart.data.labels = appointmentsData.labels;
            appointmentsChart.data.datasets[0].data = appointmentsData.data;
            appointmentsChart.update('active');
        }
    }
    
    /**
     * Get revenue data for different periods
     */
    function getRevenueData(period) {
        const data = {
            week: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [580, 720, 650, 890, 920, 780, 450]
            },
            month: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [3200, 3800, 4100, 3900]
            },
            quarter: {
                labels: ['Month 1', 'Month 2', 'Month 3'],
                data: [14200, 15800, 16100]
            }
        };
        
        return data[period] || data.month;
    }
    
    /**
     * Get appointments data for different periods
     */
    function getAppointmentsData(period) {
        const data = {
            week: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [8, 12, 10, 15, 18, 14, 6]
            },
            month: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [58, 65, 72, 68]
            },
            quarter: {
                labels: ['Month 1', 'Month 2', 'Month 3'],
                data: [245, 267, 289]
            }
        };
        
        return data[period] || data.month;
    }
    
    /**
     * Show chart error state
     */
    function showChartError() {
        const chartContainers = fragmentElement.querySelectorAll('.boots-chart-container');
        chartContainers.forEach(function(container) {
            container.innerHTML = '<div class="boots-chart-error">Unable to load chart. Please refresh the page.</div>';
        });
    }
    
    /**
     * Bind interaction events
     */
    function bindInteractionEvents() {
        // Metric card hover effects
        const metricCards = fragmentElement.querySelectorAll('.boots-metric-card');
        metricCards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Announcement item interactions
        const announcementItems = fragmentElement.querySelectorAll('.boots-announcement-item');
        announcementItems.forEach(function(item) {
            item.addEventListener('click', function() {
                // Add click feedback
                this.style.transform = 'scale(0.98)';
                setTimeout(function() {
                    item.style.transform = 'scale(1)';
                }, 150);
            });
        });
        
        // Action item interactions
        const actionItems = fragmentElement.querySelectorAll('.boots-action-item');
        actionItems.forEach(function(item) {
            item.addEventListener('click', function() {
                // Mark as completed visually
                this.style.opacity = '0.6';
                this.style.textDecoration = 'line-through';
                
                // Show completion message
                setTimeout(function() {
                    item.innerHTML += '<div class="boots-action-completed">Completed!</div>';
                }, 300);
            });
        });
    }
    
    /**
     * Handle window resize
     */
    function handleResize() {
        if (revenueChart) {
            revenueChart.resize();
        }
        if (appointmentsChart) {
            appointmentsChart.resize();
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
