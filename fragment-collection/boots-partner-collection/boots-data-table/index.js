/**
 * Boots Data Table Fragment JavaScript
 * Handles table functionality, search, and pagination
 */

(function() {
    'use strict';
    
    let currentData = [];
    let filteredData = [];
    let currentPage = 1;
    let rowsPerPage = 10;
    
    // Initialize data table functionality
    function initializeDataTable() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const dataTable = container.querySelector('.boots-data-table-fragment');
        
        if (!dataTable) {
            return;
        }
        
        // Get configuration
        const table = container.querySelector('.boots-data-table');
        const tableType = table.getAttribute('data-table-type') || 'cases';
        rowsPerPage = parseInt(table.getAttribute('data-rows-per-page')) || 10;
        
        // Initialize search functionality
        initializeSearch();
        
        // Initialize pagination
        initializePagination();
        
        // Load sample data
        loadSampleData(tableType);
    }
    
    /**
     * Initialize search functionality
     */
    function initializeSearch() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const searchInput = container.querySelector('.boots-search-input');
        
        if (!searchInput) {
            return;
        }
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm === '') {
                filteredData = [...currentData];
            } else {
                filteredData = currentData.filter(function(row) {
                    return Object.values(row).some(function(value) {
                        return value.toString().toLowerCase().includes(searchTerm);
                    });
                });
            }
            
            currentPage = 1;
            renderTable();
            updatePagination();
        });
    }
    
    /**
     * Initialize pagination controls
     */
    function initializePagination() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const prevBtn = container.querySelector('.boots-pagination-controls .boots-btn:first-child');
        const nextBtn = container.querySelector('.boots-pagination-controls .boots-btn:last-child');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    renderTable();
                    updatePagination();
                }
            });
            
            nextBtn.addEventListener('click', function() {
                const totalPages = Math.ceil(filteredData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTable();
                    updatePagination();
                }
            });
        }
    }
    
    /**
     * Load sample data based on table type
     */
    function loadSampleData(tableType) {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const tbody = container.querySelector('.boots-data-table tbody');
        
        if (!tbody) {
            return;
        }
        
        // Show loading state
        tbody.innerHTML = '<tr><td colspan="100%" class="boots-table-loading">Loading data...</td></tr>';
        
        // Simulate API delay
        setTimeout(function() {
            currentData = getSampleData(tableType);
            filteredData = [...currentData];
            renderTable();
            updatePagination();
        }, 500);
    }
    
    /**
     * Get sample data based on table type
     */
    function getSampleData(tableType) {
        switch (tableType) {
            case 'cases':
                return [
                    { id: 'CASE-001', customer: 'John Smith', type: 'Eye Exam', status: 'Active', date: '2024-01-15' },
                    { id: 'CASE-002', customer: 'Sarah Johnson', type: 'Frame Repair', status: 'Pending', date: '2024-01-14' },
                    { id: 'CASE-003', customer: 'Mike Wilson', type: 'Prescription', status: 'Completed', date: '2024-01-13' },
                    { id: 'CASE-004', customer: 'Emma Davis', type: 'Contact Lenses', status: 'Active', date: '2024-01-12' },
                    { id: 'CASE-005', customer: 'James Brown', type: 'Eye Exam', status: 'Resolved', date: '2024-01-11' }
                ];
            case 'appointments':
                return [
                    { time: '09:00', customer: 'Alice Cooper', service: 'Eye Test', status: 'Confirmed' },
                    { time: '10:30', customer: 'Bob Martin', service: 'Frame Fitting', status: 'Pending' },
                    { time: '14:00', customer: 'Carol White', service: 'Contact Lens Check', status: 'Confirmed' },
                    { time: '15:30', customer: 'David Lee', service: 'Prescription Review', status: 'Cancelled' },
                    { time: '16:45', customer: 'Eva Green', service: 'Frame Repair', status: 'Confirmed' }
                ];
            case 'training':
                return [
                    { module: 'Eye Health Basics', progress: '100%', dueDate: '2024-01-20', status: 'Completed' },
                    { module: 'Product Knowledge', progress: '75%', dueDate: '2024-01-25', status: 'In Progress' },
                    { module: 'Customer Service', progress: '50%', dueDate: '2024-01-30', status: 'In Progress' },
                    { module: 'Safety Protocols', progress: '0%', dueDate: '2024-02-05', status: 'Not Started' },
                    { module: 'Advanced Techniques', progress: '25%', dueDate: '2024-02-10', status: 'In Progress' }
                ];
            default:
                return [
                    { name: 'Sample Item 1', value: '100', status: 'Active', date: '2024-01-15' },
                    { name: 'Sample Item 2', value: '250', status: 'Pending', date: '2024-01-14' },
                    { name: 'Sample Item 3', value: '75', status: 'Completed', date: '2024-01-13' }
                ];
        }
    }
    
    /**
     * Render the table with current data
     */
    function renderTable() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const tbody = container.querySelector('.boots-data-table tbody');
        const showActions = container.querySelector('[data-show-actions]');
        
        if (!tbody) {
            return;
        }
        
        if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="100%" class="boots-table-empty">No data found</td></tr>';
            return;
        }
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);
        
        // Generate table rows
        const rows = pageData.map(function(item) {
            const values = Object.values(item);
            const actionCell = showActions !== null ? '<td><div class="boots-table-actions"><button class="boots-btn boots-btn-outline">View</button><button class="boots-btn boots-btn-outline">Edit</button></div></td>' : '';
            
            return '<tr>' + 
                values.map(function(value) {
                    if (typeof value === 'string' && (value.includes('Active') || value.includes('Completed') || value.includes('Pending') || value.includes('Resolved') || value.includes('Cancelled') || value.includes('Failed'))) {
                        const statusClass = 'boots-status-' + value.toLowerCase().replace(' ', '-');
                        return '<td><span class="boots-status ' + statusClass + '">' + value + '</span></td>';
                    }
                    return '<td>' + value + '</td>';
                }).join('') + 
                actionCell + 
                '</tr>';
        }).join('');
        
        tbody.innerHTML = rows;
    }
    
    /**
     * Update pagination controls and info
     */
    function updatePagination() {
        const container = (typeof fragmentElement !== 'undefined') ? fragmentElement : document;
        const startRowSpan = container.querySelector('.boots-start-row');
        const endRowSpan = container.querySelector('.boots-end-row');
        const totalRowsSpan = container.querySelector('.boots-total-rows');
        const prevBtn = container.querySelector('.boots-pagination-controls .boots-btn:first-child');
        const nextBtn = container.querySelector('.boots-pagination-controls .boots-btn:last-child');
        
        if (!startRowSpan || !endRowSpan || !totalRowsSpan) {
            return;
        }
        
        const startRow = ((currentPage - 1) * rowsPerPage) + 1;
        const endRow = Math.min(currentPage * rowsPerPage, filteredData.length);
        const totalRows = filteredData.length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        
        startRowSpan.textContent = totalRows > 0 ? startRow : 0;
        endRowSpan.textContent = endRow;
        totalRowsSpan.textContent = totalRows;
        
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentPage <= 1;
            nextBtn.disabled = currentPage >= totalPages;
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDataTable);
    } else {
        initializeDataTable();
    }
    
    // Initialize with delay for Liferay fragment loading
    setTimeout(initializeDataTable, 100);
    
})();