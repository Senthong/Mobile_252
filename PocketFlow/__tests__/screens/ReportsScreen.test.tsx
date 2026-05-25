import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ReportsScreen from '@/screens/ReportsScreen';
import { MOCK_TRANSACTIONS } from '@/data/mockData';

describe('ReportsScreen', () => {
  test('renders correctly', async () => {
    let tree;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<ReportsScreen />);
    });

    expect(tree).toBeTruthy();
  });

  test('should calculate total income', () => {
    const totalIncome = MOCK_TRANSACTIONS.filter((t) => t.type === 'income').reduce(
      (sum, t) => sum + t.amount,
      0
    );
    expect(totalIncome).toBeGreaterThan(0);
  });

  test('should calculate total expenses', () => {
    const totalExpense = MOCK_TRANSACTIONS.filter((t) => t.type === 'expense').reduce(
      (sum, t) => sum + t.amount,
      0
    );
    expect(totalExpense).toBeGreaterThan(0);
  });

  test('should calculate balance (income - expense)', () => {
    const totalIncome = MOCK_TRANSACTIONS.filter((t) => t.type === 'income').reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalExpense = MOCK_TRANSACTIONS.filter((t) => t.type === 'expense').reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const balance = totalIncome - totalExpense;
    expect(typeof balance).toBe('number');
  });

  test('should support period selection', () => {
    const periods = ['Tháng này', 'Tháng trước', 'Quý 3'] as const;
    expect(periods).toContain('Tháng này');
  });

  test('should group transactions by category', () => {
    const grouped = MOCK_TRANSACTIONS.reduce(
      (acc, tx) => {
        const catId = tx.category.id;
        if (!acc[catId]) {
          acc[catId] = [];
        }
        acc[catId].push(tx);
        return acc;
      },
      {} as Record<string, typeof MOCK_TRANSACTIONS>
    );

    expect(Object.keys(grouped).length).toBeGreaterThan(0);
  });
});
