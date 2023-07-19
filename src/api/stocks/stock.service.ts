import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

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

  async createCart(user, payload) {
    let stockCart = await this.prisma.stockCart.create({
      data: {
        company_id: user.company_id,
        warehouse_id: payload.warehouse_id,
        supplier_id: payload.supplier_id,
        stock_brand_id: payload.stock_brand_id,
        stock_group_id: payload.stock_group_id,
        stock_model_id: payload.stock_model_id,
        status: payload.status,
        code: payload.code,
        name: payload.name,
        barcode: payload.barcode,
        kdv: payload.kdv,
        supply_price: payload.supply_price,
        sell_price: payload.sell_price,
        description: payload.description,
        unit_type: payload.unit_type,
      },
    });
    return {
      stockCart,
    };
  }

  async updateCart(user, stockCartId, payload) {
    let where = { id: stockCartId, company_id: user.company_id };
    await this.prisma.stockCart.updateMany({
      where,
      data: {
        supplier_id: payload.supplier_id,
        stock_brand_id: payload.stock_brand_id,
        stock_group_id: payload.stock_group_id,
        stock_model_id: payload.stock_model_id,
        status: payload.status,
        code: payload.code,
        name: payload.name,
        barcode: payload.barcode,
        kdv: payload.kdv,
        supply_price: payload.supply_price,
        sell_price: payload.sell_price,
        description: payload.description,
        unit_type: payload.unit_type,
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

  async createCategory(user, payload) {
    let stockCategory = await this.prisma.stockCategory.create({
      data: {
        company_id: user.company_id,
        warehouse_id: payload.warehouse_id,
        status: payload.status,
        code: payload.code,
        name: payload.name,
        stock_category_type: payload.stock_category_type,
      },
    });
    return {
      stockCategory,
    };
  }

  async updateCategory(user, stockCartId, payload) {
    let where = { id: stockCartId, company_id: user.company_id };
    await this.prisma.stockCategory.updateMany({
      where,
      data: {
        status: payload.status,
        code: payload.code,
        name: payload.name,
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
