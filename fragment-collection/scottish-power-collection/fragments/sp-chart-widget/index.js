/**
 * Boots Chart Widget Fragment JavaScript
 * Handles chart rendering and interactions using Chart.js
 */

(function() {
    'use strict';
    
    // Chart instance storage
    let chartInstance = null;
    
    // Initialize chart widget functionality
    function initializeChartWidget() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const chartWidget = container.querySelector('.sp-chart-widget-fragment');
        
        if (!chartWidget) {
            return;
        }
        
        // Load Chart.js if not already loaded
        loadChartJS().then(function() {
            // Initialize chart
            initializeChart();
            
            // Initialize period controls
            initializePeriodControls();
        });
    }
    
    /**
     * Load Chart.js library if not already loaded
     */
    function loadChartJS() {
        return new Promise(function(resolve) {
            if (typeof Chart !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Initialize the chart
     */
    function initializeChart() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const canvas = container.querySelector('canvas[data-chart-type]');
        
        if (!canvas || typeof Chart === 'undefined') {
            showError('Chart.js not available');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const chartType = canvas.getAttribute('data-chart-type') || 'line';
        const dataSource = canvas.getAttribute('data-data-source') || 'sample';
        
        // Show loading state
        showLoading();
        
        // Get chart data based on source
        getChartData(dataSource).then(function(data) {
            hideLoading();
            
            // Destroy existing chart if it exists
            if (chartInstance) {
                chartInstance.destroy();
            }
            
            // Create new chart
            chartInstance = new Chart(ctx, {
                type: chartType,
                data: data,
                options: getChartOptions(chartType)
            });
        }).catch(function(error) {
            hideLoading();
            showError('Failed to load chart data');
        });
    }
    
    /**
     * Get chart data based on data source
     */
    function getChartData(dataSource) {
        return new Promise(function(resolve) {
            if (dataSource === 'sample') {
                resolve(getSampleData());
            } else if (dataSource === 'api') {
                // In a real implementation, this would fetch from an API
                setTimeout(function() {
                    resolve(getSampleData());
                }, 1000);
            } else {
                resolve(getSampleData());
            }
        });
    }
    
    /**
     * Get sample chart data
     */
    function getSampleData() {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Performance',
                data: [65, 59, 80, 81, 56, 89],
                backgroundColor: 'rgba(24, 66, 144, 0.1)',
                borderColor: 'rgba(24, 66, 144, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };
    }
    
    /**
     * Get chart options based on chart type
     */
    function getChartOptions(chartType) {
        const baseOptions = {
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
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };
        
        if (chartType === 'doughnut') {
            delete baseOptions.scales;
            baseOptions.plugins.legend.display = true;
            baseOptions.plugins.legend.position = 'bottom';
        }
        
        return baseOptions;
    }
    
    /**
     * Initialize period control buttons
     */
    function initializePeriodControls() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const controls = container.querySelectorAll('.sp-chart-controls .sp-btn');
        
        controls.forEach(function(button) {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                controls.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update chart data based on period
                const period = button.getAttribute('data-period');
                updateChartData(period);
            });
        });
    }
    
    /**
     * Update chart data based on selected period
     */
    function updateChartData(period) {
        if (!chartInstance) {
            return;
        }
        
        let newData;
        switch (period) {
            case 'week':
                newData = [45, 52, 38, 67, 49, 73, 61];
                chartInstance.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                break;
            case 'quarter':
                newData = [234, 267, 298, 245];
                chartInstance.data.labels = ['Q1', 'Q2', 'Q3', 'Q4'];
                break;
            default:
                newData = [65, 59, 80, 81, 56, 89];
                chartInstance.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        }
        
        chartInstance.data.datasets[0].data = newData;
        chartInstance.update('active');
    }
    
    /**
     * Show loading state
     */
    function showLoading() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const chartContainer = container.querySelector('.sp-chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = '<div class="sp-chart-loading">Loading chart data...</div>';
        }
    }
    
    /**
     * Hide loading state
     */
    function hideLoading() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const loading = container.querySelector('.sp-chart-loading');
        if (loading) {
            loading.remove();
        }
    }
    
    /**
     * Show error state
     */
    function showError(message) {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const chartContainer = container.querySelector('.sp-chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = '<div class="sp-chart-error">' + message + '</div>';
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChartWidget);
    } else {
        initializeChartWidget();
    }
    
    // Initialize with delay for Liferay fragment loading
    setTimeout(initializeChartWidget, 100);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        if (chartInstance) {
            chartInstance.destroy();
        }
    });
    
})();