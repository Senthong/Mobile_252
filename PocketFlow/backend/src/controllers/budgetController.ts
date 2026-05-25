import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Budget from '../models/Budget';

// Create budget
export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { categoryId, categoryName, limit, month, year } = req.body;

    if (!categoryId || !limit || !month || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if budget already exists
    const existingBudget = await Budget.findOne({
      userId: req.user.id,
      categoryId,
      month,
      year,
    });

    if (existingBudget) {
      return res.status(400).json({ error: 'Budget already exists for this category' });
    }

    const budget = new Budget({
      userId: req.user.id,
      categoryId,
      categoryName,
      limit,
      month,
      year,
      spent: 0,
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

// Get budgets
export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { month, year } = req.query;
    const now = new Date();

    const filter: any = { userId: req.user.id };

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);

    if (!month || !year) {
      filter.month = now.getMonth() + 1;
      filter.year = now.getFullYear();
    }

    const budgets = await Budget.find(filter);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

// Update budget
export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { limit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { limit },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

// Delete budget
export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};
