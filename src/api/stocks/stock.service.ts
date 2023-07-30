import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  // Stock

  // Carts
  async getCarts(filters: any, search, sorter) {
    const where: any = {
      ...filters,
      OR: [
        { code: { contains: search } },
        { name: { contains: search } },
        { barcode: { contains: search } },
      ],
    };
    const orderBy: any = { [sorter.sorter_name]: sorter.sorter_dir };

    let total = await this.prisma.stockCart.count({ where });
    let stockCarts = await this.prisma.stockCart.findMany({ where, orderBy });
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

  async updateCart(user, id, data) {
    let where = { id, company_id: user.company_id };
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
  async getCategories(filters: any, search, sorter) {
    const where: any = {
      ...filters,
      OR: [{ code: { contains: search } }, { name: { contains: search } }],
    };
    const orderBy: any = { [sorter.sorter_name]: sorter.sorter_dir };

    let total = await this.prisma.stockCategory.count({ where });
    let stockCategories = await this.prisma.stockCategory.findMany({
      where,
      orderBy,
    });
    return {
      total,
      stockCategories,
    };
  }

  async getCategory(filters: any) {
    const where: any = {
      ...filters,
    };
    let stockCategory = await this.prisma.stockCategory.findFirst({
      where,
    });
    return {
      stockCategory,
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

  async updateCategory(user, id, data) {
    let where = { id, company_id: user.company_id };
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
