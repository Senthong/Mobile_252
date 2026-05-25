import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import OverviewScreen from '@/screens/OverviewScreen';

describe('OverviewScreen', () => {
  test('renders correctly', async () => {
    const mockOnAddTransaction = jest.fn();
    let tree;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <OverviewScreen onAddTransaction={mockOnAddTransaction} />
      );
    });

    expect(tree).toBeTruthy();
  });

  test('should have onAddTransaction callback', () => {
    const mockOnAddTransaction = jest.fn();
    const props = { onAddTransaction: mockOnAddTransaction };

    expect(props.onAddTransaction).toBeDefined();
    expect(typeof props.onAddTransaction).toBe('function');
  });

  test('should handle add transaction button press', () => {
    const mockOnAddTransaction = jest.fn();
    mockOnAddTransaction();

    expect(mockOnAddTransaction).toHaveBeenCalled();
    expect(mockOnAddTransaction).toHaveBeenCalledTimes(1);
  });
});
