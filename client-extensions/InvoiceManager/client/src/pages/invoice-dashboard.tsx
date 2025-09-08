import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

export default function InvoiceDashboard() {
  const { toast } = useToast();
  const webComponentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleInvoiceClick = (event: any) => {
      const invoice = event.detail.invoice;
      toast({
        title: "Invoice Selected",
        description: `Viewing details for ${invoice.invoiceNumber}`,
      });
    };

    const handleExport = (event: any) => {
      toast({
        title: "Export Complete",
        description: "Invoice data exported successfully",
      });
    };

    const handleCreateInvoice = (event: any) => {
      toast({
        title: "Create Invoice",
        description: "Opening invoice creation form...",
      });
    };

    // Listen to web component events
    if (webComponentRef.current) {
      webComponentRef.current.addEventListener('invoiceClick', handleInvoiceClick);
      webComponentRef.current.addEventListener('export', handleExport);
      webComponentRef.current.addEventListener('createInvoice', handleCreateInvoice);
    }

    return () => {
      if (webComponentRef.current) {
        webComponentRef.current.removeEventListener('invoiceClick', handleInvoiceClick);
        webComponentRef.current.removeEventListener('export', handleExport);
        webComponentRef.current.removeEventListener('createInvoice', handleCreateInvoice);
      }
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-clay-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Management System</CardTitle>
            <CardDescription>
              A standalone web component using Liferay Clay design system for invoice management
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <invoice-data-table ref={webComponentRef}></invoice-data-table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
