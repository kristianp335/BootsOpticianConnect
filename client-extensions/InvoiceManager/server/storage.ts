import { invoices, type Invoice, type InsertInvoice } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Invoice operations
  getAllInvoices(): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, updates: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private invoices: Map<number, Invoice>;
  currentUserId: number;
  currentInvoiceId: number;

  constructor() {
    this.users = new Map();
    this.invoices = new Map();
    this.currentUserId = 1;
    this.currentInvoiceId = 1;
    
    // Initialize with sample invoice data
    this.initializeInvoices();
  }

  private initializeInvoices() {
    const sampleInvoices: InsertInvoice[] = [
      {
        invoiceNumber: "INV-2024-001",
        customerName: "Acme Corporation",
        issueDate: "2024-01-15",
        dueDate: "2024-02-14",
        amount: "2450.00",
        status: "paid",
        numberOfAppointments: 12,
        accountId: 12345
      },
      {
        invoiceNumber: "INV-2024-002",
        customerName: "TechStart Solutions",
        issueDate: "2024-01-20",
        dueDate: "2024-02-19",
        amount: "1750.00",
        status: "pending",
        numberOfAppointments: 8,
        accountId: 12346
      },
      {
        invoiceNumber: "INV-2024-003",
        customerName: "Global Industries Ltd",
        issueDate: "2024-01-10",
        dueDate: "2024-02-09",
        amount: "3200.00",
        status: "overdue",
        numberOfAppointments: 15,
        accountId: 12347
      },
      {
        invoiceNumber: "INV-2024-004",
        customerName: "Creative Agency Inc",
        issueDate: "2024-01-25",
        dueDate: "2024-02-24",
        amount: "890.00",
        status: "draft",
        numberOfAppointments: 4,
        accountId: 12348
      },
      {
        invoiceNumber: "INV-2024-005",
        customerName: "DataFlow Systems",
        issueDate: "2024-01-28",
        dueDate: "2024-02-27",
        amount: "5100.00",
        status: "paid",
        numberOfAppointments: 22,
        accountId: 12349
      },
      {
        invoiceNumber: "INV-2024-006",
        customerName: "Metro Services Group",
        issueDate: "2024-02-01",
        dueDate: "2024-03-02",
        amount: "1420.00",
        status: "pending",
        numberOfAppointments: 6,
        accountId: 12350
      }
    ];

    sampleInvoices.forEach(invoice => {
      this.createInvoice(invoice);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).sort((a, b) => 
      new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    );
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    return Array.from(this.invoices.values()).find(
      (invoice) => invoice.invoiceNumber === invoiceNumber,
    );
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = this.currentInvoiceId++;
    const invoice: Invoice = { 
      ...insertInvoice, 
      id,
      createdAt: new Date()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: number, updates: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const existing = this.invoices.get(id);
    if (!existing) return undefined;
    
    const updated: Invoice = { ...existing, ...updates };
    this.invoices.set(id, updated);
    return updated;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    return this.invoices.delete(id);
  }
}

export const storage = new MemStorage();
