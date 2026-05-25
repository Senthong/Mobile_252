import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget, BudgetDocument } from '../../schemas/budget.schema';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    // Check if budget for this category and month already exists
    const existing = await this.budgetModel.findOne({
      userId,
      categoryId: createBudgetDto.categoryId,
      month: createBudgetDto.month,
      year: createBudgetDto.year,
    });

    if (existing) {
      throw new BadRequestException('Budget for this category and period already exists');
    }

    const budget = new this.budgetModel({
      userId,
      ...createBudgetDto,
    });

    return budget.save();
  }

  async findAll(userId: string, month?: number, year?: number) {
    const query: any = { userId };

    if (month && year) {
      query.month = month;
      query.year = year;
    }

    return this.budgetModel.find(query).sort({ categoryName: 1 });
  }

  async findOne(id: string, userId: string) {
    const budget = await this.budgetModel.findOne({ _id: id, userId });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  async update(id: string, userId: string, updateBudgetDto: UpdateBudgetDto) {
    const budget = await this.budgetModel.findOneAndUpdate(
      { _id: id, userId },
      updateBudgetDto,
      { new: true },
    );

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  async remove(id: string, userId: string) {
    const budget = await this.budgetModel.findOneAndDelete({ _id: id, userId });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return { message: 'Budget deleted successfully' };
  }

  async getBudgetByCategory(userId: string, categoryId: string, month: number, year: number) {
    return this.budgetModel.findOne({
      userId,
      categoryId,
      month,
      year,
    });
  }

  async updateSpent(userId: string, categoryId: string, amount: number, month: number, year: number) {
    const budget = await this.budgetModel.findOne({
      userId,
      categoryId,
      month,
      year,
    });

    if (!budget) {
      return null;
    }

    budget.spent += amount;
    return budget.save();
  }

  async getBudgetHealth(userId: string, month: number, year: number) {
    const budgets = await this.findAll(userId, month, year);

    const health = budgets.map((budget) => {
      const percentage = (budget.spent / budget.limit) * 100;
      const status = percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'ok';

      return {
        categoryId: budget.categoryId,
        categoryName: budget.categoryName,
        limit: budget.limit,
        spent: budget.spent,
        remaining: budget.limit - budget.spent,
        percentage: parseFloat(percentage.toFixed(2)),
        status,
      };
    });

    return health;
  }
}
