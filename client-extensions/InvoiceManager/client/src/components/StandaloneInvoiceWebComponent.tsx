import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { formatCurrency, getStatusBadgeClass, formatStatus, sortInvoices, type SortConfig, type SortKey } from "@/lib/clayUtils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Invoice type definition for the component
interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: string;
  numberOfAppointments: number;
  accountId?: number | null;
  createdAt?: Date | null;
}

// Theme management
const getTheme = () => {
  return localStorage.getItem('invoice-theme') || 'light';
};

const setTheme = (theme: string) => {
  localStorage.setItem('invoice-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
};

// React component for the invoice table
function InvoiceTableComponent({ data = [], onEvent }: { data?: Invoice[], onEvent?: (type: string, detail?: any) => void }) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(getTheme() === 'dark');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
  const [accountName, setAccountName] = useState('Loading Account...');
  const [formData, setFormData] = useState({
    amount: '',
    dueDate: ''
  });

  useEffect(() => {
    // Initialize theme
    setTheme(darkMode ? 'dark' : 'light');
    
    // Initialize account from CommerceContext
    initializeAccount();
    
    if (data.length > 0) {
      setInvoices(data);
      setLoading(false);
      setDataLoaded(true);
    } else {
      fetchInvoicesFromLiferay();
    }
  }, [data, darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    setTheme(newTheme ? 'dark' : 'light');
  };

  const toggleChart = () => {
    setShowChart(!showChart);
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setCreatedInvoice(null);
  };

  const fetchAccountName = async (accountId: string) => {
    try {
      const authToken = (window as any).Liferay?.authToken;
      
      if (!authToken) {
        console.warn('No auth token available for account fetch');
        return 'Default Account';
      }

      const response = await fetch(`/o/headless-commerce-admin-account/v1.0/accounts/${accountId}?p_auth=${authToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const accountData = await response.json();
        return accountData.name || 'Unknown Account';
      } else {
        console.error('Failed to fetch account:', response.status);
        return 'Default Account';
      }
    } catch (error) {
      console.error('Error fetching account:', error);
      return 'Default Account';
    }
  };

  const initializeAccount = async () => {
    try {
      const commerceContext = (window as any).Liferay?.CommerceContext;
      
      if (commerceContext?.account) {
        const { accountId, accountName } = commerceContext.account;
        
        if (accountName) {
          // Use the account name directly from CommerceContext
          setAccountName(accountName);
        } else if (accountId) {
          // Fetch account name using the accountId
          const fetchedName = await fetchAccountName(accountId);
          setAccountName(fetchedName);
        } else {
          setAccountName('Default Account');
        }
      } else {
        console.warn('No commerce context available');
        setAccountName('Default Account');
        setFormData(prev => ({ ...prev, customerName: 'Default Account' }));
      }
    } catch (error) {
      console.error('Error initializing account:', error);
      setAccountName('Default Account');
      setFormData(prev => ({ ...prev, customerName: 'Default Account' }));
    }
  };



  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const authToken = (window as any).Liferay?.authToken;
      const commerceContext = (window as any).Liferay?.CommerceContext;
      const accountId = commerceContext?.account?.accountId;
      
      if (!authToken) {
        throw new Error('Authentication token not available');
      }

      if (!accountId) {
        throw new Error('Account ID not available');
      }

      // Prepare the data for Liferay API
      const invoiceData = {
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        r_accountToSAPInvoice_accountEntryId: accountId
      };

      // Post to Liferay API
      const response = await fetch(`/o/c/sapinvoices/?p_auth=${encodeURIComponent(authToken)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify(invoiceData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create invoice: ${response.status} ${response.statusText}`);
      }

      const createdInvoiceData = await response.json();
      
      // Create invoice object for display
      const newInvoice: Invoice = {
        id: createdInvoiceData.id,
        invoiceNumber: createdInvoiceData.id.toString(),
        customerName: accountName,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: formData.dueDate,
        amount: formData.amount,
        status: 'draft',
        createdAt: new Date()
      };
      
      // Show Liferay toast notification
      if ((window as any).Liferay?.Util?.openToast) {
        (window as any).Liferay.Util.openToast({
          message: 'Invoice created successfully!',
          type: 'success',
          title: 'Success'
        });
      }

      // Reset form
      setFormData({
        amount: '',
        dueDate: ''
      });
      
      setShowCreateForm(false);
      
      // Refresh the invoice data from the API
      await fetchInvoicesFromLiferay();
      
      // Call onEvent if provided
      onEvent?.('invoice-created', newInvoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert(`Error creating invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const prepareChartData = () => {
    if (!invoices.length) return null;

    // Group invoices by month/year and calculate totals
    const monthlyData = invoices.reduce((acc, invoice) => {
      const date = new Date(invoice.issueDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const amount = parseFloat(invoice.amount) || 0;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, count: 0 };
      }
      acc[monthKey].total += amount;
      acc[monthKey].count += 1;
      
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const sortedKeys = Object.keys(monthlyData).sort();
    const labels = sortedKeys.map(key => {
      const [year, month] = key.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    });

    const data = sortedKeys.map(key => monthlyData[key].total);
    const counts = sortedKeys.map(key => monthlyData[key].count);

    return {
      labels,
      datasets: [
        {
          label: 'Invoice Value',
          data,
          backgroundColor: darkMode 
            ? 'rgba(102, 179, 255, 0.8)'
            : 'rgba(11, 95, 255, 0.8)',
          borderColor: darkMode 
            ? 'rgba(102, 179, 255, 1)'
            : 'rgba(11, 95, 255, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Invoice Count',
          data: counts,
          backgroundColor: darkMode 
            ? 'rgba(255, 165, 51, 0.8)'
            : 'rgba(255, 140, 0, 0.8)',
          borderColor: darkMode 
            ? 'rgba(255, 165, 51, 1)'
            : 'rgba(255, 140, 0, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          yAxisID: 'y1',
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#ffffff' : '#272833',
          font: {
            size: 14,
            weight: 'bold' as const,
          }
        }
      },
      title: {
        display: true,
        text: 'Invoice Analytics by Month',
        color: darkMode ? '#ffffff' : '#272833',
        font: {
          size: 18,
          weight: 'bold' as const,
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: darkMode ? '#ffffff' : '#272833',
        bodyColor: darkMode ? '#cccccc' : '#6B6C7E',
        borderColor: darkMode ? '#404040' : '#E7E7ED',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            if (context.datasetIndex === 0) {
              return `Invoice Value: ${formatCurrency(context.parsed.y)}`;
            } else {
              return `Invoice Count: ${context.parsed.y}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(64, 64, 64, 0.3)' : 'rgba(231, 231, 237, 0.5)',
        },
        ticks: {
          color: darkMode ? '#cccccc' : '#6B6C7E',
          font: {
            size: 12,
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: darkMode ? 'rgba(64, 64, 64, 0.3)' : 'rgba(231, 231, 237, 0.5)',
        },
        ticks: {
          color: darkMode ? '#cccccc' : '#6B6C7E',
          font: {
            size: 12,
          },
          callback: (value: any) => formatCurrency(value)
        },
        title: {
          display: true,
          text: 'Value ($)',
          color: darkMode ? '#ffffff' : '#272833',
          font: {
            size: 14,
            weight: 'bold' as const,
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: darkMode ? '#cccccc' : '#6B6C7E',
          font: {
            size: 12,
          }
        },
        title: {
          display: true,
          text: 'Count',
          color: darkMode ? '#ffffff' : '#272833',
          font: {
            size: 14,
            weight: 'bold' as const,
          }
        }
      },
    },
  };

  const chartData = prepareChartData();

  const preparePieChartData = () => {
    if (!invoices.length) return null;

    // Group invoices by status and calculate totals
    const statusData = invoices.reduce((acc, invoice) => {
      const status = invoice.status.toLowerCase();
      const amount = parseFloat(invoice.amount) || 0;
      
      if (!acc[status]) {
        acc[status] = { total: 0, count: 0 };
      }
      acc[status].total += amount;
      acc[status].count += 1;
      
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const labels = Object.keys(statusData).map(status => formatStatus(status));
    const data = Object.values(statusData).map(item => item.total);
    const counts = Object.values(statusData).map(item => item.count);

    const colors = Object.keys(statusData).map(status => {
      switch (status) {
        case 'paid':
          return darkMode ? '#66ff99' : '#287D3C';
        case 'pending':
          return darkMode ? '#ffcc66' : '#B95000';
        case 'overdue':
          return darkMode ? '#ff6666' : '#DA1414';
        case 'draft':
          return darkMode ? '#cccccc' : '#6B6C7E';
        default:
          return darkMode ? '#99ccff' : '#0B5FFF';
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Invoice Value by Status',
          data,
          backgroundColor: colors.map(color => color + '80'), // Add transparency
          borderColor: colors,
          borderWidth: 2,
          hoverOffset: 20,
        }
      ]
    };
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: darkMode ? '#ffffff' : '#272833',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Invoice Status Distribution',
        color: darkMode ? '#ffffff' : '#272833',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: darkMode ? '#ffffff' : '#272833',
        bodyColor: darkMode ? '#cccccc' : '#6B6C7E',
        borderColor: darkMode ? '#404040' : '#E7E7ED',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
          }
        }
      }
    },
  };

  const pieChartData = preparePieChartData();

  const fetchInvoicesFromLiferay = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get authentication token from Liferay context
      const authToken = (window as any).Liferay?.authToken || '';
      const companyId = (window as any).Liferay?.ThemeDisplay?.getCompanyId?.() || '';
      const siteId = (window as any).Liferay?.ThemeDisplay?.getScopeGroupId?.() || '';
      
      console.log('Liferay context:', {
        hasLiferay: !!(window as any).Liferay,
        hasAuthToken: !!authToken,
        hasThemeDisplay: !!(window as any).Liferay?.ThemeDisplay,
        companyId,
        siteId
      });
      
      if (!authToken || !companyId) {
        throw new Error('Liferay authentication context not available');
      }

      // Construct API URL for the sapinvoices object with auth token as URL parameter
      const apiUrl = `/o/c/sapinvoices/?p_auth=${encodeURIComponent(authToken)}`;
      
      console.log('Fetching SAP invoices from URL:', apiUrl);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      });
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin'
      });

      console.log('API Response status:', response.status, response.statusText);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('API request failed:', response.status, response.statusText);
        throw new Error(`Failed to fetch invoices: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('API Response data:', responseData);
      console.log('Number of invoices found:', responseData.items?.length || 0);
      const items = responseData.items || [];
      
      // Fetch account names for customer display
      const accountMap = new Map();
      const uniqueAccountIds = [...new Set(items.map((item: any) => item.r_accountToSAPInvoice_accountEntryId).filter(Boolean))];
      
      // Fetch account details if we have account IDs
      if (uniqueAccountIds.length > 0) {
        try {
          const accountPromises = uniqueAccountIds.map(async (accountId: number) => {
            const accountResponse = await fetch(`/o/headless-admin-user/v1.0/accounts/${accountId}?p_auth=${encodeURIComponent(authToken)}`, {
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
              },
              credentials: 'same-origin'
            });
            if (accountResponse.ok) {
              const accountData = await accountResponse.json();
              return { id: accountId, name: accountData.name };
            }
            return { id: accountId, name: `Account ${accountId}` };
          });
          
          const accounts = await Promise.allSettled(accountPromises);
          accounts.forEach((result) => {
            if (result.status === 'fulfilled') {
              accountMap.set(result.value.id, result.value.name);
            }
          });
        } catch (accountError) {
          console.warn('Could not fetch account names:', accountError);
        }
      }
      
      // Map Liferay object data to our Invoice interface
      const mappedInvoices: Invoice[] = items.map((item: any) => {
        // Get customer name from account map or use ERC as fallback
        const accountId = item.r_accountToSAPInvoice_accountEntryId;
        const customerName = accountMap.get(accountId) || 
                           item.r_accountToSAPInvoice_accountEntryERC || 
                           item.accountToSAPInvoiceERC || 
                           `Account ${accountId || 'Unknown'}`;
        
        // Format dates properly
        const formatDate = (dateString: string) => {
          if (!dateString) return new Date().toISOString().split('T')[0];
          return new Date(dateString).toISOString().split('T')[0];
        };
        
        // Determine status from the status object
        const status = item.status?.label?.toLowerCase() || 'draft';
        
        return {
          id: item.id,
          invoiceNumber: item.id.toString(),
          customerName: customerName,
          issueDate: formatDate(item.dateCreated),
          dueDate: formatDate(item.dueDate),
          amount: (item.amount || 0).toString(),
          status: status === 'approved' ? 'paid' : status,
          numberOfAppointments: item.numberOfAppointments || 0,
          accountId: accountId,
          createdAt: item.dateCreated ? new Date(item.dateCreated) : new Date()
        };
      });

      setInvoices(mappedInvoices);
      setDataLoaded(true);
    } catch (err) {
      console.error('Error fetching invoices from Liferay:', err);
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
      
      // For demonstration purposes in development, show sample data for the chart
      const sampleData: Invoice[] = [
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
          issueDate: "2024-02-20",
          dueDate: "2024-03-19",
          amount: "1750.00",
          status: "pending",
          numberOfAppointments: 8,
          accountId: 12346,
          createdAt: new Date("2024-02-20")
        },
        {
          id: 3,
          invoiceNumber: "INV-2024-003",
          customerName: "Global Industries Ltd",
          issueDate: "2024-03-10",
          dueDate: "2024-04-09",
          amount: "3200.00",
          status: "overdue",
          numberOfAppointments: 15,
          accountId: 12347,
          createdAt: new Date("2024-03-10")
        },
        {
          id: 4,
          invoiceNumber: "INV-2024-004",
          customerName: "Creative Agency Inc",
          issueDate: "2024-01-25",
          dueDate: "2024-02-24",
          amount: "890.00",
          status: "paid",
          numberOfAppointments: 4,
          accountId: 12348,
          createdAt: new Date("2024-01-25")
        },
        {
          id: 5,
          invoiceNumber: "INV-2024-005",
          customerName: "DataFlow Systems",
          issueDate: "2024-02-28",
          dueDate: "2024-03-27",
          amount: "5100.00",
          status: "paid",
          numberOfAppointments: 22,
          accountId: 12349,
          createdAt: new Date("2024-02-28")
        }
      ];
      setInvoices(sampleData);
      setDataLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const sortedInvoices = sortInvoices(invoices, sortConfig);

  const handleSort = (key: SortKey) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleInvoiceClick = (invoice: Invoice) => {
    onEvent?.('invoiceClick', { invoice });
  };

  const handleExport = () => {
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

    onEvent?.('export', { format: 'csv', recordCount: sortedInvoices.length });
  };

  const handleCreateInvoice = () => {
    onEvent?.('createInvoice');
  };

  const getSortClass = (key: SortKey) => {
    if (sortConfig.key === key) {
      return `sort-${sortConfig.direction}`;
    }
    return '';
  };

  const getLiferayStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'label label-success';
      case 'pending':
        return 'label label-warning';
      case 'overdue':
        return 'label label-danger';
      case 'draft':
        return 'label label-secondary';
      default:
        return 'label label-secondary';
    }
  };



  if (loading) {
    return (
      <div className={`portlet-content-container ${darkMode ? 'dark' : 'light'}`}>
        <div className="card">
          <div className="card-header d-flex justify-content-end align-items-center">
            <button className="btn btn-outline-secondary" onClick={toggleTheme}>
              <svg className="lexicon-icon lexicon-icon-moon" focusable="false" role="presentation">
                <use xlinkHref={`/o/classic-theme/images/clay/icons.svg#${darkMode ? 'sun' : 'moon'}`}></use>
              </svg>
            </button>
          </div>
          <div className="card-body text-center py-5">
            <div className="loading-animation mb-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <p className="text-muted">Fetching invoices from Liferay object...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portlet-content-container">
        <div className="card">
          <div className="card-header d-flex justify-content-end align-items-center">
            <button className="btn btn-outline-secondary" onClick={toggleTheme}>
              <svg className="lexicon-icon lexicon-icon-moon" focusable="false" role="presentation">
                <use xlinkHref={`/o/classic-theme/images/clay/icons.svg#${darkMode ? 'sun' : 'moon'}`}></use>
              </svg>
            </button>
          </div>
          <div className="card-body text-center py-5">
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">Connection Error</h4>
              <p>{error}</p>
              <hr />
              <button className="btn btn-outline-primary" onClick={() => fetchInvoicesFromLiferay()}>
                <span className="inline-item inline-item-before">
                  <svg className="lexicon-icon lexicon-icon-reload" focusable="false" role="presentation">
                    <use xlinkHref="/o/classic-theme/images/clay/icons.svg#reload"></use>
                  </svg>
                </span>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleViewInvoice = (invoice: Invoice) => {
    window.location.href = `/web/boots-opticians-portal/e/invoice-detail/${invoice.id}/${invoice.accountId || 'unknown'}`;
  };

  return (
    <div className={`portlet-content-container ${darkMode ? 'dark' : 'light'}`}>
      <div className={`card ${dataLoaded ? 'fade-in-animation' : ''}`}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <button className="btn btn-primary" onClick={toggleCreateForm}>
            <svg className="lexicon-icon lexicon-icon-plus" focusable="false" role="presentation">
              <use xlinkHref="/o/classic-theme/images/clay/icons.svg#plus"></use>
            </svg>
            <span className="ml-2">Create Invoice</span>
          </button>
          <button className="btn btn-outline-secondary" onClick={toggleTheme}>
            <svg className="lexicon-icon" focusable="false" role="presentation">
              <use xlinkHref={`/o/classic-theme/images/clay/icons.svg#${darkMode ? 'sun' : 'moon'}`}></use>
            </svg>
          </button>
        </div>
        
        <div className="card-body">
          {showCreateForm && (
            <div className="sheet-section mb-4">
              <form onSubmit={handleFormSubmit}>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="control-label" htmlFor="amount">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="amount"
                        value={formData.amount}
                        onChange={(e) => handleFormChange('amount', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="control-label" htmlFor="dueDate">Due Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={(e) => handleFormChange('dueDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    <svg className="lexicon-icon lexicon-icon-check" focusable="false" role="presentation">
                      <use xlinkHref="/o/classic-theme/images/clay/icons.svg#check"></use>
                    </svg>
                    <span className="ml-2">Create Invoice</span>
                  </button>
                  <button type="button" className="btn btn-secondary ml-3" onClick={toggleCreateForm}>
                    <svg className="lexicon-icon lexicon-icon-times" focusable="false" role="presentation">
                      <use xlinkHref="/o/classic-theme/images/clay/icons.svg#times"></use>
                    </svg>
                    <span className="ml-2">Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {showChart && chartData && (
            <div className="charts-row mb-4">
              <div className="row">
                <div className="col-lg-8 col-md-12">
                  <div className="chart-container p-3" style={{ 
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.5)' : 'rgba(245, 247, 250, 0.5)',
                    borderRadius: '8px',
                    border: `1px solid ${darkMode ? '#404040' : '#E7E7ED'}`,
                    height: '400px'
                  }}>
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>
                <div className="col-lg-4 col-md-12">
                  {pieChartData && (
                    <div className="pie-chart-container p-3" style={{ 
                      backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.5)' : 'rgba(245, 247, 250, 0.5)',
                      borderRadius: '8px',
                      border: `1px solid ${darkMode ? '#404040' : '#E7E7ED'}`,
                      height: '400px'
                    }}>
                      <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {invoices.length === 0 ? (
            <div className="empty-state text-center py-5">
              <div className="empty-state-icon mb-3">
                <svg className="lexicon-icon lexicon-icon-documents-and-media" focusable="false" role="presentation" width="48" height="48">
                  <use xlinkHref="/o/classic-theme/images/clay/icons.svg#documents-and-media"></use>
                </svg>
              </div>
              <h4>No Invoices Found</h4>
              <p className="text-muted">There are no invoices in the SAP system to display.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-light">
                  <tr>
                    <th className={`sortable ${getSortClass('invoiceNumber')}`} onClick={() => handleSort('invoiceNumber')}>
                      Invoice Number
                    </th>
                    <th className={`sortable ${getSortClass('customerName')}`} onClick={() => handleSort('customerName')}>
                      Account
                    </th>
                    <th className={`sortable ${getSortClass('issueDate')}`} onClick={() => handleSort('issueDate')}>
                      Issue Date
                    </th>
                    <th className={`sortable ${getSortClass('dueDate')}`} onClick={() => handleSort('dueDate')}>
                      Due Date
                    </th>
                    <th className={`sortable ${getSortClass('amount')}`} onClick={() => handleSort('amount')}>
                      Amount
                    </th>
                    <th className={`sortable ${getSortClass('status')}`} onClick={() => handleSort('status')}>
                      Status
                    </th>
                    <th className={`sortable ${getSortClass('numberOfAppointments')}`} onClick={() => handleSort('numberOfAppointments')}>
                      Appointments
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvoices.map((invoice, index) => (
                    <tr key={invoice.id} className={dataLoaded ? `fade-in-row-${index % 3}` : ''}>
                      <td>
                        <button
                          className="btn btn-link p-0 text-primary fw-bold"
                          onClick={() => handleInvoiceClick(invoice)}
                        >
                          {invoice.invoiceNumber}
                        </button>
                      </td>
                      <td className="text-dark">{invoice.customerName}</td>
                      <td className="text-muted">{invoice.issueDate}</td>
                      <td className="text-muted">{invoice.dueDate}</td>
                      <td className="text-end fw-bold">{formatCurrency(invoice.amount)}</td>
                      <td>
                        <span className={getLiferayStatusClass(invoice.status)}>
                          {formatStatus(invoice.status)}
                        </span>
                      </td>
                      <td className="text-center">{invoice.numberOfAppointments}</td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {invoices.length > 0 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Last updated: {new Date().toLocaleString()}
            </small>
            <div className="d-flex" style={{ gap: '10px' }}>
              <button className="btn btn-outline-secondary" onClick={toggleChart}>
                <span className="inline-item inline-item-before">
                  <svg className="lexicon-icon lexicon-icon-analytics" focusable="false" role="presentation">
                    <use xlinkHref="/o/classic-theme/images/clay/icons.svg#analytics"></use>
                  </svg>
                </span>
                {showChart ? 'Hide Chart' : 'Show Chart'}
              </button>
              <button className="btn btn-outline-secondary" onClick={handleExport}>
                <span className="inline-item inline-item-before">
                  <svg className="lexicon-icon lexicon-icon-download" focusable="false" role="presentation">
                    <use xlinkHref="/o/classic-theme/images/clay/icons.svg#download"></use>
                  </svg>
                </span>
                <span className="ml-2">Export CSV</span>
              </button>
              <button className="btn btn-outline-secondary" onClick={() => fetchInvoicesFromLiferay()}>
                <span className="inline-item inline-item-before">
                  <svg className="lexicon-icon lexicon-icon-reload" focusable="false" role="presentation">
                    <use xlinkHref="/o/classic-theme/images/clay/icons.svg#reload"></use>
                  </svg>
                </span>
                <span className="ml-2">Refresh</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && createdInvoice && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
          <div className="modal-backdrop fade show"></div>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  <svg className="lexicon-icon lexicon-icon-check-circle" focusable="false" role="presentation" style={{ color: '#28a745', marginRight: '8px' }}>
                    <use xlinkHref="/o/classic-theme/images/clay/icons.svg#check-circle"></use>
                  </svg>
                  Invoice Created Successfully
                </h4>
                <button type="button" className="btn btn-unstyled" onClick={closeSuccessModal}>
                  <svg className="lexicon-icon lexicon-icon-times" focusable="false" role="presentation">
                    <use xlinkHref="/o/classic-theme/images/clay/icons.svg#times"></use>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="alert alert-success" role="alert">
                  <p className="mb-3">Your SAP invoice has been created and saved to the system.</p>
                  <div className="row">
                    <div className="col-6">
                      <strong>Invoice Number:</strong><br/>
                      <span className="text-primary">{createdInvoice.invoiceNumber}</span>
                    </div>
                    <div className="col-6">
                      <strong>Account:</strong><br/>
                      {createdInvoice.customerName}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <strong>Amount:</strong><br/>
                      <span className="font-weight-bold">${parseFloat(createdInvoice.amount).toFixed(2)}</span>
                    </div>
                    <div className="col-6">
                      <strong>Status:</strong><br/>
                      <span className={getLiferayStatusClass(createdInvoice.status)}>
                        {createdInvoice.status.charAt(0).toUpperCase() + createdInvoice.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeSuccessModal}>
                  <svg className="lexicon-icon lexicon-icon-check" focusable="false" role="presentation">
                    <use xlinkHref="/o/classic-theme/images/clay/icons.svg#check"></use>
                  </svg>
                  <span className="ml-2">Continue</span>
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  closeSuccessModal();
                  handleViewInvoice(createdInvoice);
                }}>
                  <svg className="lexicon-icon lexicon-icon-view" focusable="false" role="presentation">
                    <use xlinkHref="/o/classic-theme/images/clay/icons.svg#view"></use>
                  </svg>
                  <span className="ml-2">View Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Web Component wrapper
class InvoiceDataTableElement extends HTMLElement {
  private reactRoot: any;
  private invoiceData: Invoice[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }

  // Public API methods
  setData(data: Invoice[]) {
    this.invoiceData = data;
    this.render();
  }

  getData(): Invoice[] {
    return this.invoiceData;
  }

  exportData(format: string = 'csv') {
    const event = new CustomEvent('export', {
      detail: { format, data: this.invoiceData },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  private render() {
    // Clear existing content
    this.innerHTML = '';

    // Create container for React
    const container = document.createElement('div');
    this.appendChild(container);

    // Render React component
    this.reactRoot = createRoot(container);
    this.reactRoot.render(
      <InvoiceTableComponent 
        data={this.invoiceData}
        onEvent={this.handleEvent.bind(this)}
      />
    );
  }

  private handleEvent(type: string, detail?: any) {
    const event = new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

// Register the custom element
if (!customElements.get('invoice-data-table')) {
  customElements.define('invoice-data-table', InvoiceDataTableElement);
}

export default InvoiceDataTableElement;
export type { Invoice };