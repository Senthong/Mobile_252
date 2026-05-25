import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const transaction = new this.transactionModel({
      userId,
      ...createTransactionDto,
    });
    return transaction.save();
  }

  async findAll(userId: string, limit: number = 50, skip: number = 0) {
    const transactions = await this.transactionModel
      .find({ userId })
      .limit(limit)
      .skip(skip)
      .sort({ date: -1 });

    const total = await this.transactionModel.countDocuments({ userId });

    return {
      data: transactions,
      total,
      limit,
      skip,
    };
  }

  async findByCategory(userId: string, category: string, month?: number, year?: number) {
    const query: any = { userId, category };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    return this.transactionModel.find(query).sort({ date: -1 });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionModel.findOne({ _id: id, userId });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async update(id: string, userId: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionModel.findOneAndUpdate(
      { _id: id, userId },
      updateTransactionDto,
      { new: true },
    );

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async remove(id: string, userId: string) {
    const transaction = await this.transactionModel.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return { message: 'Transaction deleted successfully' };
  }

  async getMonthlyStats(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await this.transactionModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    const categoryBreakdown = {};
    transactions.forEach((t) => {
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        categoryBreakdown[t.category].income += t.amount;
      } else {
        categoryBreakdown[t.category].expense += t.amount;
      }
    });

    return {
      period: `${month}/${year}`,
      income,
      expense,
      balance: income - expense,
      categoryBreakdown,
    };
  }
}
