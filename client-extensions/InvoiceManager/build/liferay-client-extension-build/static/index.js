// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  invoices;
  currentUserId;
  currentInvoiceId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.invoices = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentInvoiceId = 1;
    this.initializeInvoices();
  }
  initializeInvoices() {
    const sampleInvoices = [
      {
        invoiceNumber: "INV-2024-001",
        customerName: "Acme Corporation",
        issueDate: "2024-01-15",
        dueDate: "2024-02-14",
        amount: "2450.00",
        status: "paid"
      },
      {
        invoiceNumber: "INV-2024-002",
        customerName: "TechStart Solutions",
        issueDate: "2024-01-20",
        dueDate: "2024-02-19",
        amount: "1750.00",
        status: "pending"
      },
      {
        invoiceNumber: "INV-2024-003",
        customerName: "Global Industries Ltd",
        issueDate: "2024-01-10",
        dueDate: "2024-02-09",
        amount: "3200.00",
        status: "overdue"
      },
      {
        invoiceNumber: "INV-2024-004",
        customerName: "Creative Agency Inc",
        issueDate: "2024-01-25",
        dueDate: "2024-02-24",
        amount: "890.00",
        status: "draft"
      },
      {
        invoiceNumber: "INV-2024-005",
        customerName: "DataFlow Systems",
        issueDate: "2024-01-28",
        dueDate: "2024-02-27",
        amount: "5100.00",
        status: "paid"
      },
      {
        invoiceNumber: "INV-2024-006",
        customerName: "Metro Services Group",
        issueDate: "2024-02-01",
        dueDate: "2024-03-02",
        amount: "1420.00",
        status: "pending"
      }
    ];
    sampleInvoices.forEach((invoice) => {
      this.createInvoice(invoice);
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getAllInvoices() {
    return Array.from(this.invoices.values()).sort(
      (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
  }
  async getInvoice(id) {
    return this.invoices.get(id);
  }
  async getInvoiceByNumber(invoiceNumber) {
    return Array.from(this.invoices.values()).find(
      (invoice) => invoice.invoiceNumber === invoiceNumber
    );
  }
  async createInvoice(insertInvoice) {
    const id = this.currentInvoiceId++;
    const invoice = {
      ...insertInvoice,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }
  async updateInvoice(id, updates) {
    const existing = this.invoices.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.invoices.set(id, updated);
    return updated;
  }
  async deleteInvoice(id) {
    return this.invoices.delete(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  issueDate: text("issue_date").notNull(),
  // Using text for date strings
  dueDate: text("due_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  // 'paid', 'pending', 'overdue', 'draft'
  createdAt: timestamp("created_at").defaultNow()
});
var insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/invoices", async (req, res) => {
    try {
      const invoices2 = await storage.getAllInvoices();
      res.json(invoices2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  app2.get("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const invoice = await storage.getInvoice(id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });
  app2.post("/api/invoices", async (req, res) => {
    try {
      const validatedData = insertInvoiceSchema.parse(req.body);
      const existing = await storage.getInvoiceByNumber(validatedData.invoiceNumber);
      if (existing) {
        return res.status(400).json({ message: "Invoice number already exists" });
      }
      const invoice = await storage.createInvoice(validatedData);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid invoice data",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });
  app2.patch("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const updateData = insertInvoiceSchema.partial().parse(req.body);
      if (updateData.invoiceNumber) {
        const existing = await storage.getInvoiceByNumber(updateData.invoiceNumber);
        if (existing && existing.id !== id) {
          return res.status(400).json({ message: "Invoice number already exists" });
        }
      }
      const invoice = await storage.updateInvoice(id, updateData);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid invoice data",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });
  app2.delete("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const deleted = await storage.deleteInvoice(id);
      if (!deleted) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
