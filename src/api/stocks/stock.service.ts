import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  // Stock
  async get(fields?: any) {
    const where = { ...fields };

    let total = await this.prisma.stock.count({ where });
    let stocks = await this.prisma.stock.findMany({ where });
    return {
      total,
      stocks,
    };
  }

  // Carts
  async getCarts(fields?: any) {
    const where = { ...fields };

    let total = await this.prisma.stockCart.count({ where });
    let stockCarts = await this.prisma.stockCart.findMany({ where });
    return {
      total,
      stockCarts,
    };
  }

  async createCart(user, data) {
    let stockCart = await this.prisma.stockCart.create({
      data: {
        company_id: user.company_id,
        warehouse_id: data.warehouse_id,
        supplier_id: data.supplier_id,
        stock_brand_id: data.stock_brand_id,
        stock_group_id: data.stock_group_id,
        stock_model_id: data.stock_model_id,
        status: data.status,
        code: data.code,
        name: data.name,
        barcode: data.barcode,
        kdv: data.kdv,
        supply_price: data.supply_price,
        sell_price: data.sell_price,
        description: data.description,
        unit_type: data.unit_type,
      },
    });
    return {
      stockCart,
    };
  }

  async updateCart(user, stockCartId, data) {
    let where = { id: stockCartId, company_id: user.company_id };
    await this.prisma.stockCart.updateMany({
      where,
      data: {
        supplier_id: data.supplier_id,
        stock_brand_id: data.stock_brand_id,
        stock_group_id: data.stock_group_id,
        stock_model_id: data.stock_model_id,
        status: data.status,
        code: data.code,
        name: data.name,
        barcode: data.barcode,
        kdv: data.kdv,
        supply_price: data.supply_price,
        sell_price: data.sell_price,
        description: data.description,
        unit_type: data.unit_type,
      },
    });
    let stockCart = await this.prisma.stockCart.findFirst({
      where,
    });
    return {
      stockCart,
    };
  }

  // Categories
  async getCategories(fields?: any) {
    const where = { ...fields };

    let total = await this.prisma.stockCategory.count({ where });
    let stockCategories = await this.prisma.stockCategory.findMany({ where });
    return {
      total,
      stockCategories,
    };
  }

  async createCategory(user, data) {
    let stockCategory = await this.prisma.stockCategory.create({
      data: {
        company_id: user.company_id,
        warehouse_id: data.warehouse_id,
        status: data.status,
        code: data.code,
        name: data.name,
        stock_category_type: data.stock_category_type,
      },
    });
    return {
      stockCategory,
    };
  }

  async updateCategory(user, stockCartId, data) {
    let where = { id: stockCartId, company_id: user.company_id };
    await this.prisma.stockCategory.updateMany({
      where,
      data: {
        status: data.status,
        code: data.code,
        name: data.name,
      },
    });
    let stockCategory = await this.prisma.stockCategory.findFirst({
      where,
    });
    return {
      stockCategory,
    };
  }
}
