import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useInvoices } from "@/hooks/useInvoices";
import { formatCurrency, getStatusBadgeClass, formatStatus, sortInvoices, type SortConfig, type SortKey } from "@/lib/clayUtils";
import type { Invoice } from "@shared/schema";

interface InvoiceTableProps {
  onInvoiceClick?: (invoice: Invoice) => void;
  onExport?: () => void;
  onCreateInvoice?: () => void;
}

export default function InvoiceTable({ onInvoiceClick, onExport, onCreateInvoice }: InvoiceTableProps) {
  const { data: invoices, isLoading, error, refetch } = useInvoices();
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const sortedInvoices = useMemo(() => {
    if (!invoices) return [];
    return sortInvoices(invoices, sortConfig);
  }, [invoices, sortConfig]);

  const handleSort = (key: SortKey) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleInvoiceClick = (invoice: Invoice) => {
    if (onInvoiceClick) {
      onInvoiceClick(invoice);
    } else {
      toast({
        title: "Invoice Selected",
        description: `Viewing invoice ${invoice.invoiceNumber}`,
      });
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      toast({
        title: "Export Started",
        description: "Exporting invoice data...",
      });
    }
  };

  const handleCreateInvoice = () => {
    if (onCreateInvoice) {
      onCreateInvoice();
    } else {
      toast({
        title: "Create Invoice",
        description: "Opening invoice creation form...",
      });
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const getSortClass = (key: SortKey) => {
    if (sortConfig.key === key) {
      return `sortable sort-${sortConfig.direction}`;
    }
    return 'sortable';
  };

  if (error) {
    return (
      <div className="invoice-table-container">
        <div className="table-header">
          <h1 className="table-title">Invoice Management</h1>
          <p className="table-subtitle">Manage and track your invoice records</p>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠</div>
          <h3>Unable to load invoice data</h3>
          <p>Please check your connection and try again.</p>
          <Button onClick={handleRetry} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-table-container">
      <div className="table-header">
        <h1 className="table-title">Invoice Management</h1>
        <p className="table-subtitle">Manage and track your invoice records</p>
      </div>
      
      <div className="table-content" style={{ position: 'relative' }}>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        <table className="clay-table">
          <thead>
            <tr>
              <th className={getSortClass('invoiceNumber')} onClick={() => handleSort('invoiceNumber')}>
                Invoice Number
              </th>
              <th className={getSortClass('customerName')} onClick={() => handleSort('customerName')}>
                Customer
              </th>
              <th className={getSortClass('issueDate')} onClick={() => handleSort('issueDate')}>
                Issue Date
              </th>
              <th className={getSortClass('dueDate')} onClick={() => handleSort('dueDate')}>
                Due Date
              </th>
              <th className={getSortClass('amount')} onClick={() => handleSort('amount')}>
                Amount
              </th>
              <th className={getSortClass('status')} onClick={() => handleSort('status')}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <button
                    className="invoice-number"
                    onClick={() => handleInvoiceClick(invoice)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {invoice.invoiceNumber}
                  </button>
                </td>
                <td>{invoice.customerName}</td>
                <td>{invoice.issueDate}</td>
                <td>{invoice.dueDate}</td>
                <td className="amount-cell">{formatCurrency(invoice.amount)}</td>
                <td>
                  <span className={getStatusBadgeClass(invoice.status)}>
                    {formatStatus(invoice.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="table-actions">
        <Button
          variant="outline"
          onClick={handleExport}
          className="mr-2"
        >
          Export
        </Button>
        <Button onClick={handleCreateInvoice}>
          Create Invoice
        </Button>
      </div>
    </div>
  );
}
