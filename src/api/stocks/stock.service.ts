import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  // Stock
  async getAll(filters: any, search, sorter) {
    const where: any = {
      ...filters,
      OR: [
        {
          stock_cart: {
            OR: [
              { code: { contains: search } },
              { name: { contains: search } },
              { barcode: { contains: search } },
            ],
          },
        },
        {
          customer: {
            OR: [
              { code: { contains: search } },
              { name: { contains: search } },
            ],
          },
        },
      ],
    };

    let stockGroups = await this.prisma.stock.groupBy({
      where,
      by: ['stock_cart_id'],
      _sum: {
        quantity: true,
      },
    });

    let stocks = [];

    await Promise.all(
      stockGroups.map(async (group) => {
        let stockCart = await this.prisma.stockCart.findFirst({
          where: { id: group.stock_cart_id },
        });
        stocks.push({ ...group, stockCart });
      }),
    );

    return {
      total: stockGroups.length,
      stocks: _.orderBy(stocks, [sorter.sorter_name], [sorter.sorter_dir]),
    };
  }
  async getMovements(filters: any, search, sorter) {
    const where: any = {
      ...filters,
      OR: [
        {
          stock_cart: {
            OR: [
              { code: { contains: search } },
              { name: { contains: search } },
              { barcode: { contains: search } },
            ],
          },
        },
        {
          customer: {
            OR: [
              { code: { contains: search } },
              { name: { contains: search } },
            ],
          },
        },
      ],
    };
    const orderBy: any = { [sorter.sorter_name]: sorter.sorter_dir };

    let total = await this.prisma.stock.count({ where });
    let data = await this.prisma.stock.findMany({
      where,
      orderBy,
    });
    let stockMovements = [];
    await Promise.all(
      data.map((item, index) => {
        let prevItems = data.slice(0, index + 1);
        stockMovements.push({
          ...item,
          stock: prevItems.reduce((sum, curr) => sum + curr.quantity, 0),
        });
      }),
    );

    return {
      total,
      stockMovements,
    };
  }
  async getIncomeAndExpense(filters: any, search, sorter) {
    const where: any = {
      ...filters,
      OR: [
        {
          stock_cart: {
            OR: [
              { code: { contains: search } },
              { name: { contains: search } },
              { barcode: { contains: search } },
            ],
          },
        },
        {
          customer: {
            OR: [
              { code: { contains: search } },
              { name: { contains: search } },
            ],
          },
        },
      ],
    };
    let data = await this.prisma.stock.findMany({
      select: {
        date: true,
        price: true,
        quantity: true,
        stock_type: true,
      },
      where,
    });
    let date_group = _.groupBy(data, (item) =>
      moment(item.date).format('YYYY-MM-DD'),
    );
    let income_and_expense = [];
    await Promise.all(
      Object.entries(date_group).map(([key, item]) => {
        let _sum = {
          price: 0,
        };
        let _sum_income = {
          price: 0,
        };

        let _sum_expense = {
          price: 0,
        };
        item.map(({ price, quantity, stock_type }) => {
          if (stock_type == 'SUPPLY' || stock_type == 'RETURN') {
            _sum_expense.price += quantity * price;
          } else if (stock_type == 'SELL' || stock_type == 'TRASH') {
            _sum_income.price += Math.abs(quantity * price);
          }
        });
        _sum.price = _sum_expense.price + _sum_income.price;

        income_and_expense.push({
          date: item[0].date,
          _sum,
          _sum_income,
          _sum_expense,
        });
      }),
    );
    return {
      total: income_and_expense.length,
      income_and_expense: _.orderBy(
        income_and_expense,
        [sorter.sorter_name],
        [sorter.sorter_dir],
      ),
    };
  }
  async getCurrentAccounts(filters: any, search, sorter) {

    return {
      total: 0,
      currentAccounts: [],
    };
  }
  //
  async get(filters: any) {
    const where: any = {
      ...filters,
    };
    let stock = await this.prisma.stock.findFirst({
      where,
    });
    return {
      stock,
    };
  }
  async stockData(data) {
    let stockCart = null;
    if (data.stock_cart_id) {
      stockCart = await this.prisma.stockCart.findFirst({
        where: {
          id: data.stock_cart_id,
          company_id: data.company_id,
          warehouse_id: data.warehouse_id,
        },
        include: {
          supplier: true,
          stock_brand: true,
          stock_group: true,
          stock_model: true,
        },
      });
    }
    let customer = null;
    if (data.customer_id) {
      customer = await this.prisma.customer.findFirst({
        where: {
          id: data.customer_id,
          company_id: data.company_id,
          warehouse_id: data.warehouse_id,
        },
      });
    }
    return { stockCart, customer };
  }
  exDir(stock_type) {
    return {
      q:
        stock_type == 'SUPPLY' || stock_type == 'RETURN'
          ? 1
          : stock_type == 'SELL' || stock_type == 'TRASH'
          ? -1
          : 0,
      p:
        stock_type == 'SUPPLY' || stock_type == 'RETURN'
          ? -1
          : stock_type == 'SELL'
          ? 1
          : 0,
    };
  }
  async create(data) {
    let stock_type = data.stock_type;

    let quantity = data.quantity * this.exDir(stock_type).q;
    let price = data.price * this.exDir(stock_type).p;

    let stock = await this.prisma.stock.create({
      data: {
        company_id: data.company_id,
        warehouse_id: data.warehouse_id,
        status: data.status,
        stock_type,
        stock_cart_id: data.stock_cart_id,
        quantity,
        price,
        customer_id: data.customer_id,
        date: new Date(data.date),
        description: data.description,
        data: await this.stockData(data),
        payment_status: data.payment_status,
      },
    });
    return {
      stock,
    };
  }
  async update(id, data) {
    let where = {
      id,
      warehouse_id: data.warehouse_id,
      company_id: data.company_id,
    };
    let stock_type = data.stock_type;
    console.log(stock_type);

    let quantity = data.quantity * this.exDir(stock_type).q;
    let price = data.price * this.exDir(stock_type).p;

    await this.prisma.stock.updateMany({
      where,
      data: {
        status: data.status,
        stock_type,
        stock_cart_id: data.stock_cart_id,
        quantity,
        price,
        customer_id: data.customer_id,
        date: new Date(data.date),
        description: data.description,
        data: await this.stockData(data),
        payment_status: data.payment_status,
      },
    });
    let stock = await this.prisma.stock.findFirst({
      where,
    });
    return {
      stock,
    };
  }

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
    let stockCarts = await this.prisma.stockCart.findMany({
      where,
      orderBy,
      include: {
        supplier: true,
        stock_group: true,
        stock_brand: true,
        stock_model: true,
      },
    });
    return {
      total,
      stockCarts,
    };
  }
  async getCart(filters: any) {
    const where: any = {
      ...filters,
    };
    let stockCart = await this.prisma.stockCart.findFirst({
      where,
    });
    return {
      stockCart,
    };
  }

  async createCart(data) {
    let stockCart = await this.prisma.stockCart.create({
      data: {
        company_id: data.company_id,
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

  async updateCart(id, data) {
    let where = { id, company_id: data.company_id };
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

  async deleteCart(id, filters) {
    let where = { id, ...filters };
    let deleted = await this.prisma.stockCart.updateMany({
      where,
      data: { status: 'DELETED' },
    });
    return deleted;
  }

  async codeControlCart(code: string, filters = {}) {
    let count = await this.prisma.stockCategory.count({
      where: { code, ...filters },
    });
    if (count <= 0) return true;
    return false;
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

  async createCategory(data) {
    let stockCategory = await this.prisma.stockCategory.create({
      data: {
        company_id: data.company_id,
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

  async updateCategory(id, data) {
    let where = { id, company_id: data.company_id };
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

  async deleteCategory(id, filters) {
    let where = { id, ...filters };
    let deleted = await this.prisma.stockCategory.updateMany({
      where,
      data: { status: 'DELETED' },
    });
    return deleted;
  }

  async codeControlCategory(code: string, filters = {}) {
    let count = await this.prisma.stockCategory.count({
      where: { code, ...filters },
    });
    if (count <= 0) return true;
    return false;
  }
}
