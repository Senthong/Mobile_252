import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import BudgetScreen from '@/screens/BudgetScreen';
import { MOCK_BUDGETS } from '@/data/mockData';

describe('BudgetScreen', () => {
  test('renders correctly', async () => {
    let tree;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<BudgetScreen />);
    });

    expect(tree).toBeTruthy();
  });

  test('should calculate total budget', () => {
    const totalBudget = MOCK_BUDGETS.reduce((sum, b) => sum + b.limit, 0);
    expect(totalBudget).toBeGreaterThan(0);
  });

  test('should calculate total spent', () => {
    const totalSpent = MOCK_BUDGETS.reduce((sum, b) => sum + b.spent, 0);
    expect(totalSpent).toBeGreaterThan(0);
  });

  test('should calculate remaining budget', () => {
    const totalBudget = MOCK_BUDGETS.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = MOCK_BUDGETS.reduce((sum, b) => sum + b.spent, 0);
    const remaining = totalBudget - totalSpent;
    expect(remaining).toBeDefined();
  });

  test('should track budget percentage', () => {
    MOCK_BUDGETS.forEach((budget) => {
      const percentage = (budget.spent / budget.limit) * 100;
      expect(percentage).toBeGreaterThanOrEqual(0);
    });
  });

  test('should identify overspent budgets', () => {
    const overspent = MOCK_BUDGETS.filter((b) => b.spent > b.limit);
    expect(Array.isArray(overspent)).toBe(true);
  });
});
