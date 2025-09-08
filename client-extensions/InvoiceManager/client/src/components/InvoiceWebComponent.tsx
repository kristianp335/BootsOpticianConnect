import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import type { Invoice } from "@shared/schema";
import ClientInvoiceTable from "./ClientInvoiceTable";

// Web Component wrapper for Liferay integration
class InvoiceDataTableElement extends HTMLElement {
  private root: any;
  private reactRoot: any;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }

  // Public API for external integration
  setData(data: Invoice[]) {
    // This would need to be implemented with a state management solution
    // For now, the component fetches its own data
    console.log('External data set:', data);
  }

  setLoading(loading: boolean) {
    console.log('External loading state:', loading);
  }

  setError(error: string | null) {
    console.log('External error state:', error);
  }

  private render() {
    if (!this.shadowRoot) return;

    // Create a container for React
    const container = document.createElement('div');
    this.shadowRoot.appendChild(container);

    // Add styles to shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://cdn.jsdelivr.net/npm/@clayui/css@3.56.0/lib/css/atlas.css');
      @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
      
      /* Include essential styles for the component */
      ${this.getComponentStyles()}
    `;
    this.shadowRoot.appendChild(style);

    // Render React component
    this.reactRoot = createRoot(container);
    this.reactRoot.render(
      <TooltipProvider>
        <ClientInvoiceTable 
          onInvoiceClick={this.handleInvoiceClick.bind(this)}
          onExport={this.handleExport.bind(this)}
          onCreateInvoice={this.handleCreateInvoice.bind(this)}
        />
        <Toaster />
      </TooltipProvider>
    );
  }

  private getComponentStyles(): string {
    return `
      :host {
        display: block;
        width: 100%;
        font-family: 'Source Sans Pro', sans-serif;
      }
      
      .invoice-table-container {
        background: #FFFFFF;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(39, 40, 51, 0.1);
        overflow: hidden;
      }
      
      .table-header {
        background: #FFFFFF;
        border-bottom: 1px solid #E7E7ED;
        padding: 24px;
      }
      
      .table-title {
        color: #272833;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 8px 0;
      }
      
      .table-subtitle {
        color: #6B6C7E;
        font-size: 0.875rem;
        margin: 0;
      }
      
      .clay-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }
      
      .clay-table th {
        background: #F7F8F9;
        border-bottom: 1px solid #E7E7ED;
        color: #272833;
        font-weight: 600;
        padding: 16px;
        text-align: left;
        cursor: pointer;
        user-select: none;
      }
      
      .clay-table th:hover {
        background: #F1F2F5;
      }
      
      .clay-table th.sortable::after {
        content: "↕";
        color: #6B6C7E;
        font-size: 0.75rem;
        margin-left: 8px;
        opacity: 0.5;
      }
      
      .clay-table th.sort-asc::after {
        content: "↑";
        color: #0B5FFF;
        opacity: 1;
      }
      
      .clay-table th.sort-desc::after {
        content: "↓";
        color: #0B5FFF;
        opacity: 1;
      }
      
      .clay-table td {
        border-bottom: 1px solid #E7E7ED;
        color: #272833;
        padding: 16px;
        vertical-align: middle;
      }
      
      .clay-table tbody tr:hover {
        background: #F7F8F9;
      }
      
      .status-badge {
        border-radius: 16px;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 4px 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .status-paid {
        background: #D4EDDA;
        color: #287D3C;
      }
      
      .status-pending {
        background: #FFF3CD;
        color: #B95000;
      }
      
      .status-overdue {
        background: #F8D7DA;
        color: #DA1414;
      }
      
      .status-draft {
        background: #E2E3E5;
        color: #6B6C7E;
      }
      
      .amount-cell {
        font-weight: 600;
        text-align: right;
      }
      
      .invoice-number {
        color: #0B5FFF;
        font-weight: 600;
        text-decoration: none;
      }
      
      .invoice-number:hover {
        text-decoration: underline;
      }
      
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }
      
      .loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #E7E7ED;
        border-top: 3px solid #0B5FFF;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .error-state {
        padding: 48px 24px;
        text-align: center;
        color: #6B6C7E;
      }
      
      .error-icon {
        color: #DA1414;
        font-size: 3rem;
        margin-bottom: 16px;
      }
      
      .table-actions {
        padding: 16px 24px;
        border-top: 1px solid #E7E7ED;
        background: #F7F8F9;
        text-align: right;
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .table-header {
          padding: 16px;
        }
        
        .table-title {
          font-size: 1.25rem;
        }
        
        .clay-table th,
        .clay-table td {
          padding: 12px 8px;
          font-size: 0.75rem;
        }
        
        .clay-table th:nth-child(3),
        .clay-table td:nth-child(3),
        .clay-table th:nth-child(4),
        .clay-table td:nth-child(4) {
          display: none;
        }
        
        .amount-cell {
          text-align: left;
        }
      }
      
      @media (max-width: 480px) {
        .clay-table th:nth-child(2),
        .clay-table td:nth-child(2) {
          display: none;
        }
      }
    `;
  }

  private handleInvoiceClick(invoice: Invoice) {
    // Dispatch custom event for Liferay integration
    this.dispatchEvent(new CustomEvent('invoiceClick', {
      detail: { invoice },
      bubbles: true,
      composed: true
    }));
  }

  private handleExport() {
    // Dispatch custom event for Liferay integration
    this.dispatchEvent(new CustomEvent('exportRequested', {
      bubbles: true,
      composed: true
    }));
  }

  private handleCreateInvoice() {
    // Dispatch custom event for Liferay integration
    this.dispatchEvent(new CustomEvent('createInvoiceRequested', {
      bubbles: true,
      composed: true
    }));
  }
}

// Register the custom element
if (!customElements.get('invoice-data-table')) {
  customElements.define('invoice-data-table', InvoiceDataTableElement);
}

export default InvoiceDataTableElement;
