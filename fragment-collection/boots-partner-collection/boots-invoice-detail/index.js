/**
 * Boots Invoice Detail Fragment JavaScript
 * Handles download functionality and interactions
 */

(function() {
  'use strict';
  
  // Ensure we're working within this fragment's scope
  const fragmentElement = document.currentScript?.closest('.boots-invoice-detail-fragment') || 
                         document.querySelector('.boots-invoice-detail-fragment');
  
  if (!fragmentElement) {
    console.warn('Boots Invoice Detail: Fragment element not found');
    return;
  }

  /**
   * Initialize the invoice detail fragment
   */
  function initializeInvoiceDetail() {
    const downloadBtn = fragmentElement.querySelector('#download-invoice-btn');
    
    if (downloadBtn) {
      // Remove any existing event listeners
      const newDownloadBtn = downloadBtn.cloneNode(true);
      downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);
      
      // Add click event listener for download functionality
      newDownloadBtn.addEventListener('click', handleDownloadInvoice);
    }
    
    // Check if we're in edit mode and adjust styling accordingly
    updateEditModeStyles();
  }

  /**
   * Handle invoice download
   */
  function handleDownloadInvoice(event) {
    event.preventDefault();
    
    try {
      // Get invoice details from the fragment
      const invoiceNumber = getEditableContent('invoice-number') || 'INV-UNKNOWN';
      const customerName = getEditableContent('customer-name') || 'Unknown Customer';
      const amount = getEditableContent('invoice-amount') || '£0.00';
      const dueDate = getEditableContent('due-date') || 'Unknown';
      const appointments = getEditableContent('number-of-appointments') || '0';
      
      // Create invoice data object
      const invoiceData = {
        invoiceNumber,
        customerName,
        amount,
        dueDate,
        appointments,
        downloadDate: new Date().toLocaleDateString('en-GB')
      };
      
      // Check if we're in a Liferay environment and try to integrate with portlets
      if (window.Liferay && window.Liferay.fire) {
        // Fire custom event that other portlets can listen to
        window.Liferay.fire('boots:invoiceDownload', {
          invoiceData: invoiceData
        });
      }
      
      // Provide visual feedback
      showDownloadFeedback(event.target);
      
      // For demo purposes, generate and download a simple text file
      generateInvoiceFile(invoiceData);
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
      showErrorFeedback(event.target);
    }
  }

  /**
   * Get content from editable fields
   */
  function getEditableContent(editableId) {
    const element = fragmentElement.querySelector(`[data-lfr-editable-id="${editableId}"]`);
    return element ? element.textContent.trim() : null;
  }

  /**
   * Generate and download invoice file
   */
  function generateInvoiceFile(invoiceData) {
    const content = `
BOOTS OPTICIAN PARTNER PORTAL
INVOICE DETAILS

Invoice Number: ${invoiceData.invoiceNumber}
Customer: ${invoiceData.customerName}
Amount: ${invoiceData.amount}
Due Date: ${invoiceData.dueDate}
Number of Appointments: ${invoiceData.appointments}

Downloaded: ${invoiceData.downloadDate}

This is a generated invoice summary from the Boots Partner Portal.
    `.trim();
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${invoiceData.invoiceNumber}_invoice_details.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * Show download success feedback
   */
  function showDownloadFeedback(button) {
    const originalText = button.innerHTML;
    
    button.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="boots-download-icon">
        <path d="M22 11.08V12C22 17.52 17.52 22 12 22S2 17.52 2 12S6.48 2 12 2C14.1 2 15.99 2.64 17.54 3.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Downloaded
    `;
    
    button.style.background = '#28a745';
    button.style.borderColor = '#28a745';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      button.style.borderColor = '';
    }, 2000);
  }

  /**
   * Show error feedback
   */
  function showErrorFeedback(button) {
    const originalText = button.innerHTML;
    
    button.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="boots-download-icon">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
      </svg>
      Error
    `;
    
    button.style.background = '#dc3545';
    button.style.borderColor = '#dc3545';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      button.style.borderColor = '';
    }, 2000);
  }

  /**
   * Update styles based on edit mode
   */
  function updateEditModeStyles() {
    const isEditMode = document.querySelector('.control-menu-active') !== null;
    
    if (isEditMode) {
      fragmentElement.setAttribute('data-edit-mode', 'true');
    } else {
      fragmentElement.removeAttribute('data-edit-mode');
    }
  }

  /**
   * Initialize when DOM is ready
   */
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeInvoiceDetail);
    } else {
      initializeInvoiceDetail();
    }
  }

  // Start initialization
  initialize();

  // Listen for Liferay edit mode changes
  if (window.Liferay && window.Liferay.on) {
    window.Liferay.on('portletReady', updateEditModeStyles);
    window.Liferay.on('editModeChanged', updateEditModeStyles);
  }

})();