/* Johnson Matthey Share Price Fragment JavaScript */
(function() {
    'use strict';
    
    // Use the fragmentElement provided by Liferay instead of document.currentScript
    // Liferay injects: const fragmentElement = document.querySelector('#fragment-xyz');
    if (!fragmentElement) {
        return;
    }
    
    let priceUpdateInterval = null;
    let currentTimeframe = '1D';
    
    // Initialize on DOM ready and SPA navigation events
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }
    
    // Initial load
    ready(initializeSharePrice);
    
    // Listen for Liferay SPA navigation events
    if (window.Liferay) {
        Liferay.on('allPortletsReady', function(event) {
            // SPA navigation complete - reinitialize
            setTimeout(initializeSharePrice, 100);
        });
    }
    
    // Listen for standard navigation events
    document.addEventListener('navigate', function(event) {
        setTimeout(initializeSharePrice, 100);
    });
    
    function initializeSharePrice() {
        // Initialize share price fragment
        
        // Apply configuration settings
        applyConfiguration();
        
        // Initialize chart controls
        initializeChartControls();
        
        // Initialize price updates
        initializePriceUpdates();
        
        // Initialize accessibility
        initializeAccessibility();
        
        // Load initial price data
        loadPriceData();
        
        // Share price fragment ready
    }
    
    function applyConfiguration() {
        // Get fragment configuration from Liferay
        const config = {
            showChart: configuration.showChart !== false,
            showStatistics: configuration.showStatistics !== false,
            autoUpdate: configuration.autoUpdate !== false,
            updateInterval: parseInt(configuration.updateInterval) || 30,
            stockSymbol: configuration.stockSymbol || 'JMAT',
            exchangeName: configuration.exchangeName || 'LON',
            compactMode: configuration.compactMode === true,
            widgetTheme: configuration.widgetTheme || 'standard'
        };
        
        // Configuration applied
        
        // Apply theme to widget
        const widget = fragmentElement.querySelector('.jm-share-price-widget');
        if (widget) {
            widget.setAttribute('data-theme', config.widgetTheme);
            
            if (config.compactMode) {
                widget.setAttribute('data-compact', 'true');
            }
        }
        
        // Show/hide chart based on configuration
        const chartContainer = fragmentElement.querySelector('.jm-price-chart');
        if (chartContainer) {
            chartContainer.style.display = config.showChart ? 'block' : 'none';
        }
        
        // Show/hide statistics based on configuration
        const statsContainer = fragmentElement.querySelector('.jm-price-stats');
        if (statsContainer) {
            statsContainer.style.display = config.showStatistics ? 'block' : 'none';
        }
        
        // Update price update interval
        if (priceUpdateInterval) {
            clearInterval(priceUpdateInterval);
            priceUpdateInterval = null;
        }
        
        if (config.autoUpdate) {
            // Convert seconds to milliseconds - optimize for performance
            const intervalMs = Math.max(config.updateInterval * 1000, 15000); // Minimum 15 seconds
            priceUpdateInterval = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    loadPriceData();
                }
            }, intervalMs);
        }
    }
    
    function initializeChartControls() {
        const timeframeBtns = fragmentElement.querySelectorAll('.jm-timeframe-btn');
        
        timeframeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                timeframeBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Update current timeframe
                currentTimeframe = btn.dataset.timeframe;
                
                // Update chart (in real implementation, this would fetch new data)
                updateChart(currentTimeframe);
                
                // Update accessibility
                btn.setAttribute('aria-pressed', 'true');
                timeframeBtns.forEach(b => {
                    if (b !== btn) b.setAttribute('aria-pressed', 'false');
                });
            });
        });
        
        // Initialize ARIA attributes
        timeframeBtns.forEach(btn => {
            btn.setAttribute('role', 'button');
            btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
        });
    }
    
    function initializePriceUpdates() {
        // Simulate real-time price updates every 30 seconds
        // In real implementation, this would connect to actual market data feed
        priceUpdateInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                loadPriceData();
            }
        }, 30000);
        
        // Retry button functionality
        const retryBtn = fragmentElement.querySelector('#jm-retry-price');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                loadPriceData();
            });
        }
    }
    
    function initializeAccessibility() {
        const widget = fragmentElement.querySelector('.jm-share-price-widget');
        if (widget) {
            widget.setAttribute('role', 'region');
            widget.setAttribute('aria-label', 'Johnson Matthey share price information');
        }
        
        // Make price display more accessible
        const priceDisplay = fragmentElement.querySelector('#jm-share-price-display');
        if (priceDisplay) {
            priceDisplay.setAttribute('aria-live', 'polite');
            priceDisplay.setAttribute('aria-label', 'Current share price');
        }
    }
    
    function loadPriceData() {
        showLoadingState();
        
        // Simulate API call - in real implementation, this would fetch from actual market data API
        // Using setTimeout to simulate network delay
        setTimeout(() => {
            try {
                // Simulate successful price data load with current actual data
                const mockPriceData = {
                    price: 1789.00,
                    currency: 'GBX',
                    change: 24.00,
                    changePercent: 1.36,
                    date: '12 August 2025',
                    dayRange: '1,765 - 1,795',
                    yearRange: '1,420 - 1,850',
                    volume: '1.2M',
                    marketCap: '£3.4B',
                    timestamp: new Date().toISOString()
                };
                
                updatePriceDisplay(mockPriceData);
                hideLoadingState();
                
            } catch (error) {
                // Error loading price data
                showErrorState();
            }
        }, 1000);
    }
    
    function updatePriceDisplay(data) {
        // Update main price
        const priceAmount = fragmentElement.querySelector('#jm-price-amount');
        if (priceAmount) {
            priceAmount.textContent = data.price.toLocaleString('en-GB', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        
        // Update change amount and percentage
        const changeContainer = fragmentElement.querySelector('#jm-price-change');
        if (changeContainer) {
            const changeAmount = changeContainer.querySelector('.jm-change-amount');
            const changePercent = changeContainer.querySelector('.jm-change-percentage');
            
            const isPositive = data.change >= 0;
            const changeClass = isPositive ? 'positive' : 'negative';
            
            if (changeAmount) {
                changeAmount.textContent = `${isPositive ? '+' : ''}${data.change.toFixed(2)}`;
            }
            
            if (changePercent) {
                changePercent.textContent = `(${isPositive ? '+' : ''}${data.changePercent.toFixed(2)}%)`;
            }
            
            // Update styling based on positive/negative change
            changeContainer.className = `jm-share-price-change ${changeClass}`;
        }
        
        // Update statistics
        updateStatistic('#jm-day-range', data.dayRange);
        updateStatistic('#jm-year-range', data.yearRange);
        updateStatistic('#jm-volume', data.volume);
        updateStatistic('#jm-market-cap', data.marketCap);
        
        // Update timestamp
        const priceDate = fragmentElement.querySelector('#jm-price-date span');
        if (priceDate && data.date) {
            priceDate.textContent = data.date;
        }
        
        // Update accessibility announcement
        announceUpdate(data);
    }
    
    function updateStatistic(selector, value) {
        const element = fragmentElement.querySelector(selector);
        if (element && value) {
            element.textContent = value;
        }
    }
    
    function updateChart(timeframe) {
        // In real implementation, this would update the chart with new data
        // For now, we'll just update the chart title/timeframe indicator
        
        const chartElement = fragmentElement.querySelector('.jm-price-chart');
        if (chartElement) {
            chartElement.setAttribute('data-timeframe', timeframe);
        }
        
        // Simulate chart update animation
        const chartSvg = fragmentElement.querySelector('.jm-chart-svg');
        if (chartSvg) {
            chartSvg.style.opacity = '0.7';
            setTimeout(() => {
                chartSvg.style.opacity = '1';
            }, 300);
        }
    }
    
    function showLoadingState() {
        const loadingElement = fragmentElement.querySelector('#jm-price-loading');
        const errorElement = fragmentElement.querySelector('#jm-price-error');
        
        if (loadingElement) loadingElement.style.display = 'flex';
        if (errorElement) errorElement.style.display = 'none';
    }
    
    function hideLoadingState() {
        const loadingElement = fragmentElement.querySelector('#jm-price-loading');
        if (loadingElement) loadingElement.style.display = 'none';
    }
    
    function showErrorState() {
        const loadingElement = fragmentElement.querySelector('#jm-price-loading');
        const errorElement = fragmentElement.querySelector('#jm-price-error');
        
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) errorElement.style.display = 'flex';
    }
    
    function announceUpdate(data) {
        // Create accessible announcement for screen readers
        const announcement = `Share price updated: ${data.price.toFixed(2)} ${data.currency}, ${data.change >= 0 ? 'up' : 'down'} ${Math.abs(data.change).toFixed(2)} or ${Math.abs(data.changePercent).toFixed(2)} percent`;
        
        // Use aria-live region to announce updates
        const priceDisplay = fragmentElement.querySelector('#jm-share-price-display');
        if (priceDisplay) {
            priceDisplay.setAttribute('aria-label', announcement);
        }
    }
    
    // Format large numbers for display
    function formatLargeNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (priceUpdateInterval) {
            clearInterval(priceUpdateInterval);
        }
    });
    
    // Pause updates when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && priceUpdateInterval) {
            clearInterval(priceUpdateInterval);
        } else if (document.visibilityState === 'visible' && !priceUpdateInterval) {
            initializePriceUpdates();
        }
    });
    
})();
