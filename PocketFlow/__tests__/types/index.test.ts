import {
  Transaction,
  TransactionType,
  Category,
  Account,
  Budget,
  User,
} from '@/types';

describe('Type Definitions', () => {
  test('TransactionType should be valid', () => {
    const validTypes: TransactionType[] = ['income', 'expense'];
    validTypes.forEach((type) => {
      expect(['income', 'expense']).toContain(type);
    });
  });

  test('Category should have required properties', () => {
    const mockCategory: Category = {
      id: 'food',
      name: 'Ăn uống',
      icon: '🍜',
      color: '#FF6B6B',
    };
    expect(mockCategory.id).toBe('food');
    expect(mockCategory.color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  test('Transaction should have required properties', () => {
    const mockTx: Transaction = {
      id: '1',
      amount: 50000,
      type: 'expense',
      category: {
        id: 'food',
        name: 'Ăn uống',
        icon: '🍜',
        color: '#FF6B6B',
      },
      note: 'Cà phê',
      date: new Date().toISOString(),
      account: 'cash',
    };
    expect(mockTx.amount).toBeGreaterThan(0);
    expect(['income', 'expense']).toContain(mockTx.type);
  });

  test('Account should have required properties', () => {
    const mockAccount: Account = {
      id: 'cash',
      name: 'Tiền mặt',
      balance: 1000000,
      type: 'cash',
      currency: 'VND',
    };
    expect(mockAccount.balance).toBeGreaterThan(0);
    expect(['cash', 'bank', 'ewallet']).toContain(mockAccount.type);
  });

  test('Budget should have required properties', () => {
    const mockBudget: Budget = {
      categoryId: 'food',
      limit: 5000000,
      spent: 2000000,
      month: '2023-10',
    };
    expect(mockBudget.spent).toBeLessThanOrEqual(mockBudget.limit * 2);
    expect(mockBudget.month).toMatch(/^\d{4}-\d{2}$/);
  });

  test('User should have required properties', () => {
    const mockUser: User = {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      tier: 'STANDARD',
    };
    expect(mockUser.email).toContain('@');
  });
});
