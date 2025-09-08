export function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numAmount);
}

export function getStatusBadgeClass(status: string): string {
  return `status-badge status-${status}`;
}

export function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export type SortDirection = 'asc' | 'desc';
export type SortKey = 'invoiceNumber' | 'customerName' | 'issueDate' | 'dueDate' | 'amount' | 'status' | 'numberOfAppointments';

export interface SortConfig {
  key: SortKey | null;
  direction: SortDirection;
}

export function sortInvoices<T extends Record<string, any>>(
  invoices: T[],
  sortConfig: SortConfig
): T[] {
  if (!sortConfig.key) return invoices;

  return [...invoices].sort((a, b) => {
    let aVal = a[sortConfig.key!];
    let bVal = b[sortConfig.key!];

    // Handle different data types
    if (sortConfig.key === 'amount' || sortConfig.key === 'numberOfAppointments') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    } else if (sortConfig.key === 'issueDate' || sortConfig.key === 'dueDate') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }

    if (sortConfig.direction === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
}
