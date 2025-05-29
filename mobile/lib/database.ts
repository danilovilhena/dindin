import * as SQLite from "expo-sqlite";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";
import { PaymentMethod, UpdatePaymentMethodInput, PAYMENT_METHODS } from "@/types/paymentMethod";

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    if (this.db) return;

    this.db = await SQLite.openDatabaseAsync("dindin.db");

    // Create categories table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create payment methods table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Seed payment methods if they don't exist
    await this.seedPaymentMethods();
  }

  async getCategories(): Promise<Category[]> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(`SELECT * FROM categories ORDER BY name ASC`);

    return result.map((row: any) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      color: row.color,
      type: row.type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const id = this.generateId();
    const now = new Date().toISOString();

    const category: Category = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.runAsync(
      `INSERT INTO categories (id, name, icon, color, type, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [category.id, category.name, category.icon, category.color, category.type, category.createdAt, category.updatedAt]
    );

    return category;
  }

  async updateCategory(input: UpdateCategoryInput): Promise<Category> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const now = new Date().toISOString();

    // Get current category
    const current = (await this.db.getFirstAsync("SELECT * FROM categories WHERE id = ?", [input.id])) as any;

    if (!current) {
      throw new Error("Category not found");
    }

    const updated: Category = {
      id: current.id,
      name: input.name ?? current.name,
      icon: input.icon ?? current.icon,
      color: input.color ?? current.color,
      type: input.type ?? current.type,
      createdAt: current.created_at,
      updatedAt: now,
    };

    await this.db.runAsync(
      `UPDATE categories SET name = ?, icon = ?, color = ?, updated_at = ? 
       WHERE id = ?`,
      [updated.name, updated.icon, updated.color, updated.updatedAt, updated.id]
    );

    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync("DELETE FROM categories WHERE id = ?", [id]);
  }

  async seedPaymentMethods(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    // Check if payment methods already exist
    const existingCount = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM payment_methods");

    if ((existingCount as any)?.count > 0) return;

    // Seed default payment methods
    const now = new Date().toISOString();

    for (const method of PAYMENT_METHODS) {
      const id = this.generateId();
      await this.db.runAsync(
        `INSERT INTO payment_methods (id, name, icon, enabled, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, method.name, method.icon, 1, now, now]
      );
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(`SELECT * FROM payment_methods ORDER BY name ASC`);

    return result.map((row: any) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      enabled: Boolean(row.enabled),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async updatePaymentMethod(input: UpdatePaymentMethodInput): Promise<PaymentMethod> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const now = new Date().toISOString();

    // Get current payment method
    const current = (await this.db.getFirstAsync("SELECT * FROM payment_methods WHERE id = ?", [input.id])) as any;

    if (!current) {
      throw new Error("Payment method not found");
    }

    const updated: PaymentMethod = {
      id: current.id,
      name: current.name,
      icon: current.icon,
      enabled: input.enabled,
      createdAt: current.created_at,
      updatedAt: now,
    };

    await this.db.runAsync(
      `UPDATE payment_methods SET enabled = ?, updated_at = ? 
       WHERE id = ?`,
      [input.enabled ? 1 : 0, updated.updatedAt, updated.id]
    );

    return updated;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const databaseService = new DatabaseService();
