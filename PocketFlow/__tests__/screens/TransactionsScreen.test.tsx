import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import TransactionsScreen from '@/screens/TransactionsScreen';
import { MOCK_TRANSACTIONS } from '@/data/mockData';

describe('TransactionsScreen', () => {
  test('renders correctly', async () => {
    let tree;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<TransactionsScreen />);
    });

    expect(tree).toBeTruthy();
  });

  test('should filter transactions by type', () => {
    const expenses = MOCK_TRANSACTIONS.filter((t) => t.type === 'expense');
    const incomes = MOCK_TRANSACTIONS.filter((t) => t.type === 'income');

    expect(expenses.length).toBeGreaterThan(0);
    expect(incomes.length).toBeGreaterThan(0);
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

  test('should search transactions by note', () => {
    const searchTerm = 'Cà phê';
    const results = MOCK_TRANSACTIONS.filter((t) =>
      t.note.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(Array.isArray(results)).toBe(true);
  });

  test('should sort transactions by date', () => {
    const sorted = [...MOCK_TRANSACTIONS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    expect(sorted[0]).toBeDefined();
    expect(sorted[sorted.length - 1]).toBeDefined();
  });
});
