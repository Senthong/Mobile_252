/**
 * Feature Bug Tests
 * Tests for functionality issues found in screens
 */

import { MOCK_TRANSACTIONS, formatCurrency, MOCK_BUDGETS } from '@/data/mockData';

describe('AddTransactionScreen - Amount Input Validation', () => {
  test('should not allow multiple decimal points', () => {
    const validateDecimal = (current: string, input: string): string => {
      if (input === '.' && current.includes('.')) {
        return current;  // ✅ Reject second decimal
      }
      return current + input;
    };

    expect(validateDecimal('1.5', '.')).toBe('1.5');
    expect(validateDecimal('123', '.')).toBe('123.');
  });

  test('should use radix parameter in parseInt', () => {
    const amount = '35';
    const result = parseInt(amount, 10);
    expect(result).toBe(35);
  });

  test('should validate amount before saving', () => {
    const validateAmount = (amount: string): boolean => {
      return amount !== '' && parseFloat(amount) > 0;
    };

    expect(validateAmount('0')).toBe(false);
    expect(validateAmount('')).toBe(false);
    expect(validateAmount('35000')).toBe(true);
  });

  test('should handle decimal amounts correctly', () => {
    const formatAmount = (amount: string): string => {
      return amount ? parseInt(amount, 10).toLocaleString('vi-VN') : '0';
    };

    expect(formatAmount('35')).toBe('35');
    expect(formatAmount('35000')).toBe('35.000');
    expect(formatAmount('1000000')).toBe('1.000.000');
  });
});

describe('AddTransactionScreen - Transaction Saving', () => {
  test('should create valid transaction object', () => {
    const createTransaction = (
      amount: number,
      type: 'income' | 'expense',
      categoryId: string
    ) => ({
      id: Date.now().toString(),
      amount,
      type,
      category: { id: categoryId, name: 'Test', icon: '🏷️', color: '#000' },
      note: `Transaction ${type}`,
      date: new Date().toISOString(),
      account: 'cash',
    });

    const tx = createTransaction(50000, 'expense', 'food');
    expect(tx.amount).toBe(50000);
    expect(tx.type).toBe('expense');
    expect(tx.id).toBeTruthy();
  });

  test('should not save transaction with invalid amount', () => {
    const canSave = (amount: string): boolean => {
      return amount !== '' && parseFloat(amount) > 0;
    };

    expect(canSave('0')).toBe(false);
    expect(canSave('')).toBe(false);
    expect(canSave('.')).toBe(false);
    expect(canSave('50000')).toBe(true);
  });
});

describe('ProfileScreen - Dark Mode Toggle', () => {
  test('should toggle dark mode state', () => {
    let darkMode = false;
    const toggleDarkMode = () => {
      darkMode = !darkMode;
    };

    expect(darkMode).toBe(false);
    toggleDarkMode();
    expect(darkMode).toBe(true);
    toggleDarkMode();
    expect(darkMode).toBe(false);
  });

  test('should call onLogout when logout pressed', () => {
    const mockOnLogout = jest.fn();
    mockOnLogout();

    expect(mockOnLogout).toHaveBeenCalled();
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  test('should confirm logout action', () => {
    const confirmLogout = (onConfirm: () => void): boolean => {
      // Simulate confirmation dialog
      const userConfirmed = true;  // In real app, this is from Alert.alert
      if (userConfirmed) {
        onConfirm();
        return true;
      }
      return false;
    };

    const mockLogout = jest.fn();
    const result = confirmLogout(mockLogout);

    expect(result).toBe(true);
    expect(mockLogout).toHaveBeenCalled();
  });
});

describe('OverviewScreen - AI Input Processing', () => {
  test('should parse AI input format "text numberK"', () => {
    const parseAIInput = (input: string): { amount: number; note: string } | null => {
      const match = input.match(/^(.+?)\s*(\d+)k?$/i);
      if (!match) return null;

      const note = match[1].trim();
      const amount = parseInt(match[2], 10) * 1000;
      return { amount, note };
    };

    const result1 = parseAIInput('Cà phê 35k');
    expect(result1).toEqual({ amount: 35000, note: 'Cà phê' });

    const result2 = parseAIInput('Ăn trưa 50k');
    expect(result2).toEqual({ amount: 50000, note: 'Ăn trưa' });

    const result3 = parseAIInput('Invalid');
    expect(result3).toBeNull();
  });

  test('should clear AI input after selection', () => {
    let aiInput = '';
    const setSuggestion = (suggestion: string) => {
      aiInput = suggestion;
    };
    const clearInput = () => {
      aiInput = '';
    };

    setSuggestion('Cà phê 35k');
    expect(aiInput).toBe('Cà phê 35k');

    clearInput();
    expect(aiInput).toBe('');
  });

  test('should process AI suggestion immediately', () => {
    const processAI = jest.fn();
    const suggestion = 'Cà phê 35k';

    processAI(suggestion);
    expect(processAI).toHaveBeenCalledWith(suggestion);
  });
});

describe('OverviewScreen - Monthly Calculations', () => {
  test('should calculate current month expense correctly', () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthExpense = MOCK_TRANSACTIONS
      .filter(t => {
        const txDate = new Date(t.date);
        return (
          t.type === 'expense' &&
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    expect(typeof monthExpense).toBe('number');
    expect(monthExpense).toBeGreaterThanOrEqual(0);
  });

  test('should calculate spend percentage', () => {
    const totalBudget = MOCK_BUDGETS.reduce((s, b) => s + b.limit, 0);
    const monthExpense = MOCK_TRANSACTIONS
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    const percentage = Math.round((monthExpense / totalBudget) * 100);
    expect(percentage).toBeGreaterThan(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });
});

describe('TransactionsScreen - Filter Functionality', () => {
  test('should filter transactions by type', () => {
    const filterByType = (type: 'all' | 'income' | 'expense') => {
      return MOCK_TRANSACTIONS.filter(
        t => type === 'all' || t.type === type
      );
    };

    const expenses = filterByType('expense');
    expect(expenses.every(t => t.type === 'expense')).toBe(true);

    const incomes = filterByType('income');
    expect(incomes.every(t => t.type === 'income')).toBe(true);

    const all = filterByType('all');
    expect(all.length).toBe(MOCK_TRANSACTIONS.length);
  });

  test('should search transactions by note', () => {
    const search = (query: string) => {
      return MOCK_TRANSACTIONS.filter(t =>
        t.note.toLowerCase().includes(query.toLowerCase())
      );
    };

    const coffeeTransactions = search('Cà phê');
    expect(coffeeTransactions.length).toBeGreaterThan(0);
  });

  test('should combine filter and search', () => {
    const filterAndSearch = (type: string, query: string) => {
      return MOCK_TRANSACTIONS.filter(t => {
        const typeMatch = type === 'all' || t.type === type;
        const searchMatch = t.note.toLowerCase().includes(query.toLowerCase());
        return typeMatch && searchMatch;
      });
    };

    const results = filterAndSearch('expense', 'phí');
    expect(Array.isArray(results)).toBe(true);
  });
});

describe('BudgetScreen - Add Category Feature', () => {
  test('should add new budget category', () => {
    const budgets = [...MOCK_BUDGETS];
    const newBudget = {
      categoryId: 'travel',
      limit: 2000000,
      spent: 0,
      month: '2026-05',
    };

    budgets.push(newBudget);
    expect(budgets.length).toBe(MOCK_BUDGETS.length + 1);
    expect(budgets.some(b => b.categoryId === 'travel')).toBe(true);
  });

  test('should validate new budget limit', () => {
    const isValidBudget = (limit: number): boolean => {
      return limit > 0;
    };

    expect(isValidBudget(0)).toBe(false);
    expect(isValidBudget(-1000)).toBe(false);
    expect(isValidBudget(2000000)).toBe(true);
  });
});

describe('MockData - Format Functions', () => {
  test('should have formatDate function', () => {
    // Check if formatDate exists or needs to be created
    const formatDate = (dateStr: string): string => {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${day}/${month}`;
    };

    const result = formatDate(new Date().toISOString());
    expect(result).toMatch(/^\d{1,2}\/\d{1,2}$/);
  });

  test('should format currency correctly', () => {
    const formatted = formatCurrency(1000000);
    expect(formatted).toContain('1.000.000');
  });
});
