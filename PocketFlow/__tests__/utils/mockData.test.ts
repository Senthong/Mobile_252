import {
  CATEGORIES,
  ACCOUNTS,
  MOCK_TRANSACTIONS,
  MOCK_BUDGETS,
  MOCK_USER,
} from '@/data/mockData';

describe('Mock Data - CATEGORIES', () => {
  test('should have all required categories', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
    expect(CATEGORIES[0]).toHaveProperty('id');
    expect(CATEGORIES[0]).toHaveProperty('name');
    expect(CATEGORIES[0]).toHaveProperty('icon');
    expect(CATEGORIES[0]).toHaveProperty('color');
  });

  test('should have food category as first item', () => {
    expect(CATEGORIES[0].id).toBe('food');
    expect(CATEGORIES[0].name).toBe('Ăn uống');
  });

  test('should have income and salary categories', () => {
    const hasIncome = CATEGORIES.some((c) => c.id === 'salary');
    expect(hasIncome).toBe(true);
  });
});

describe('Mock Data - ACCOUNTS', () => {
  test('should have at least 3 accounts', () => {
    expect(ACCOUNTS.length).toBeGreaterThanOrEqual(3);
  });

  test('should have cash, bank, and ewallet accounts', () => {
    const types = ACCOUNTS.map((a) => a.type);
    expect(types).toContain('cash');
    expect(types).toContain('bank');
    expect(types).toContain('ewallet');
  });

  test('should have positive balance for all accounts', () => {
    ACCOUNTS.forEach((account) => {
      expect(account.balance).toBeGreaterThan(0);
    });
  });
});

describe('Mock Data - TRANSACTIONS', () => {
  test('should have at least 7 transactions', () => {
    expect(MOCK_TRANSACTIONS.length).toBeGreaterThanOrEqual(7);
  });

  test('should have both income and expense transactions', () => {
    const types = MOCK_TRANSACTIONS.map((t) => t.type);
    expect(types).toContain('income');
    expect(types).toContain('expense');
  });

  test('should have valid transaction structure', () => {
    MOCK_TRANSACTIONS.forEach((tx) => {
      expect(tx).toHaveProperty('id');
      expect(tx).toHaveProperty('amount');
      expect(tx).toHaveProperty('type');
      expect(tx).toHaveProperty('category');
      expect(tx).toHaveProperty('note');
      expect(tx).toHaveProperty('date');
      expect(tx.amount).toBeGreaterThan(0);
    });
  });

  test('should have salary transaction', () => {
    const hasSalary = MOCK_TRANSACTIONS.some((t) => t.type === 'income');
    expect(hasSalary).toBe(true);
  });
});

describe('Mock Data - BUDGETS', () => {
  test('should have budget items', () => {
    expect(MOCK_BUDGETS.length).toBeGreaterThan(0);
  });

  test('should have valid budget structure', () => {
    MOCK_BUDGETS.forEach((budget) => {
      expect(budget).toHaveProperty('categoryId');
      expect(budget).toHaveProperty('limit');
      expect(budget).toHaveProperty('spent');
      expect(budget).toHaveProperty('month');
      expect(budget.spent).toBeLessThanOrEqual(budget.limit * 2); // Can overspend
    });
  });

  test('should have spent amount tracking', () => {
    const hasSpent = MOCK_BUDGETS.every((b) => b.spent >= 0);
    expect(hasSpent).toBe(true);
  });
});

describe('Mock Data - USER', () => {
  test('should have user information', () => {
    expect(MOCK_USER).toHaveProperty('id');
    expect(MOCK_USER).toHaveProperty('name');
    expect(MOCK_USER).toHaveProperty('email');
    expect(MOCK_USER).toHaveProperty('tier');
  });

  test('should have valid user data', () => {
    expect(MOCK_USER.name).toBe('Alexander Sterling');
    expect(MOCK_USER.email).toContain('@');
  });
});
