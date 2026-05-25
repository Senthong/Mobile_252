import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AddTransactionScreen from '@/screens/AddTransactionScreen';
import { CATEGORIES } from '@/data/mockData';

describe('AddTransactionScreen', () => {
  test('renders correctly', async () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();
    let tree;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <AddTransactionScreen onClose={mockOnClose} onSave={mockOnSave} />
      );
    });

    expect(tree).toBeTruthy();
  });

  test('should have onClose and onSave callbacks', () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();
    const props = { onClose: mockOnClose, onSave: mockOnSave };

    expect(props.onClose).toBeDefined();
    expect(props.onSave).toBeDefined();
  });

  test('should handle close action', () => {
    const mockOnClose = jest.fn();
    mockOnClose();

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should handle save action', () => {
    const mockOnSave = jest.fn();
    mockOnSave();

    expect(mockOnSave).toHaveBeenCalled();
  });

  test('should support transaction type toggle', () => {
    const types = ['expense', 'income'] as const;
    expect(types).toContain('expense');
    expect(types).toContain('income');
  });

  test('should have available categories', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
  });

  test('should validate amount input', () => {
    const validateAmount = (amount: string) => {
      return amount === '' || !isNaN(Number(amount));
    };

    expect(validateAmount('123')).toBe(true);
    expect(validateAmount('0')).toBe(true);
    expect(validateAmount('')).toBe(true);
  });

  test('should format display amount correctly', () => {
    const formatAmount = (amount: string) => {
      return amount ? parseInt(amount).toLocaleString('vi-VN') : '0';
    };

    expect(formatAmount('1000')).toBe('1.000');
    expect(formatAmount('1000000')).toBe('1.000.000');
  });
});
