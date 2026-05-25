import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';

// Create transaction
export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { amount, type, category, note, date, account } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      amount,
      type,
      category,
      note,
      date: date ? new Date(date) : new Date(),
      account,
    });

    await transaction.save();

    // Update budget spent if expense
    if (type === 'expense') {
      const txDate = transaction.date;
      const month = txDate.getMonth() + 1;
      const year = txDate.getFullYear();

      await Budget.updateOne(
        { userId: req.user.id, categoryId: category, month, year },
        { $inc: { spent: amount } }
      );
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// Get transactions
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { type, month, year } = req.query;
    const filter: any = { userId: req.user.id };

    if (type) {
      filter.type = type;
    }

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get transaction by ID
export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

// Update transaction
export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { amount, type, category, note, date, account } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { amount, type, category, note, date, account },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

// Delete transaction
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Revert budget if expense
    if (transaction.type === 'expense') {
      const txDate = transaction.date;
      const month = txDate.getMonth() + 1;
      const year = txDate.getFullYear();

      await Budget.updateOne(
        { userId: req.user.id, categoryId: transaction.category, month, year },
        { $inc: { spent: -transaction.amount } }
      );
    }

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

// Get statistics
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? Number(month) - 1 : now.getMonth();
    const targetYear = year ? Number(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 1);

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = stats.find(s => s._id === 'income')?.total || 0;
    const expense = stats.find(s => s._id === 'expense')?.total || 0;

    res.json({
      month: targetMonth + 1,
      year: targetYear,
      income,
      expense,
      balance: income - expense,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};
