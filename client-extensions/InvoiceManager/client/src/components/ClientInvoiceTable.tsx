import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, getStatusBadgeClass, formatStatus, sortInvoices, type SortConfig, type SortKey } from "@/lib/clayUtils";
import type { Invoice } from "@shared/schema";

// Sample invoice data for client-side component
const sampleInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2024-001",
    customerName: "Acme Corporation",
    issueDate: "2024-01-15",
    dueDate: "2024-02-14",
    amount: "2450.00",
    status: "paid",
    numberOfAppointments: 12,
    accountId: 12345,
    createdAt: new Date("2024-01-15")
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-002",
    customerName: "TechStart Solutions",
    issueDate: "2024-01-20",
    dueDate: "2024-02-19",
    amount: "1750.00",
    status: "pending",
    numberOfAppointments: 8,
    accountId: 12346,
    createdAt: new Date("2024-01-20")
  },
  {
    id: 3,
    invoiceNumber: "INV-2024-003",
    customerName: "Global Industries Ltd",
    issueDate: "2024-01-10",
    dueDate: "2024-02-09",
    amount: "3200.00",
    status: "overdue",
    numberOfAppointments: 15,
    accountId: 12347,
    createdAt: new Date("2024-01-10")
  },
  {
    id: 4,
    invoiceNumber: "INV-2024-004",
    customerName: "Creative Agency Inc",
    issueDate: "2024-01-25",
    dueDate: "2024-02-24",
    amount: "890.00",
    status: "draft",
    numberOfAppointments: 4,
    accountId: 12348,
    createdAt: new Date("2024-01-25")
  },
  {
    id: 5,
    invoiceNumber: "INV-2024-005",
    customerName: "DataFlow Systems",
    issueDate: "2024-01-28",
    dueDate: "2024-02-27",
    amount: "5100.00",
    status: "paid",
    numberOfAppointments: 22,
    accountId: 12349,
    createdAt: new Date("2024-01-28")
  },
  {
    id: 6,
    invoiceNumber: "INV-2024-006",
    customerName: "Metro Services Group",
    issueDate: "2024-02-01",
    dueDate: "2024-03-02",
    amount: "1420.00",
    status: "pending",
    numberOfAppointments: 6,
    createdAt: new Date("2024-02-01")
  }
];

interface ClientInvoiceTableProps {
  data?: Invoice[];
  onInvoiceClick?: (invoice: Invoice) => void;
  onExport?: () => void;
  onCreateInvoice?: () => void;
}

export default function ClientInvoiceTable({ 
  data = sampleInvoices, 
  onInvoiceClick, 
  onExport, 
  onCreateInvoice 
}: ClientInvoiceTableProps) {
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const sortedInvoices = useMemo(() => {
    return sortInvoices(data, sortConfig);
  }, [data, sortConfig]);

  const handleSort = (key: SortKey) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleInvoiceClick = (invoice: Invoice) => {
    if (onInvoiceClick) {
      onInvoiceClick(invoice);
    } else {
      // Navigate to invoice detail page
      window.location.href = `/web/boots-opticians-portal/e/invoice-detail/46170/${invoice.id}`;
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Generate CSV export
      const headers = ['Invoice Number', 'Customer', 'Issue Date', 'Due Date', 'Amount', 'Status', 'Appointments'];
      const csvContent = [
        headers.join(','),
        ...sortedInvoices.map(invoice => [
          invoice.invoiceNumber,
          `"${invoice.customerName}"`,
          invoice.issueDate,
          invoice.dueDate,
          invoice.amount,
          invoice.status,
          invoice.numberOfAppointments
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoices.csv';
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Invoice data exported as CSV file",
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

  const getSortClass = (key: SortKey) => {
    if (sortConfig.key === key) {
      return `sortable sort-${sortConfig.direction}`;
    }
    return 'sortable';
  };

  return (
    <div className="invoice-table-container">
      <div className="table-header">
        <h1 className="table-title">Invoice Management</h1>
        <p className="table-subtitle">Manage and track your invoice records</p>
      </div>
      
      <div className="table-content">
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
              <th className={getSortClass('numberOfAppointments')} onClick={() => handleSort('numberOfAppointments')}>
                Appointments
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
                <td className="appointments-cell">{invoice.numberOfAppointments}</td>
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
          Export CSV
        </Button>
        <Button onClick={handleCreateInvoice}>
          Create Invoice
        </Button>
      </div>
    </div>
  );
}