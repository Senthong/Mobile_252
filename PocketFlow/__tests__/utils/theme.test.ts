import { Colors, Spacing, Radius, FontSize, Shadow } from '@/utils/theme';

describe('Theme - Colors', () => {
  test('should have primary color', () => {
    expect(Colors.primary).toBe('#1A7A4A');
  });

  test('should have all required color properties', () => {
    expect(Colors).toHaveProperty('primary');
    expect(Colors).toHaveProperty('accent');
    expect(Colors).toHaveProperty('background');
    expect(Colors).toHaveProperty('surface');
    expect(Colors).toHaveProperty('text');
    expect(Colors).toHaveProperty('error');
    expect(Colors).toHaveProperty('success');
    expect(Colors).toHaveProperty('warning');
  });

  test('should have category colors', () => {
    expect(Colors).toHaveProperty('food');
    expect(Colors).toHaveProperty('transport');
    expect(Colors).toHaveProperty('shopping');
    expect(Colors).toHaveProperty('housing');
  });

  test('should have dark mode colors', () => {
    expect(Colors.dark).toHaveProperty('background');
    expect(Colors.dark).toHaveProperty('surface');
    expect(Colors.dark).toHaveProperty('text');
  });

  test('should have transaction type colors', () => {
    expect(Colors).toHaveProperty('income');
    expect(Colors).toHaveProperty('expense');
  });
});

describe('Theme - Spacing', () => {
  test('should have spacing constants', () => {
    expect(Spacing).toHaveProperty('xs');
    expect(Spacing).toHaveProperty('sm');
    expect(Spacing).toHaveProperty('md');
    expect(Spacing).toHaveProperty('lg');
    expect(Spacing).toHaveProperty('xl');
  });

  test('spacing should be numeric values', () => {
    expect(typeof Spacing.xs).toBe('number');
    expect(typeof Spacing.md).toBe('number');
    expect(Spacing.md).toBeGreaterThan(Spacing.sm);
  });
});

describe('Theme - Radius', () => {
  test('should have border radius constants', () => {
    expect(Radius).toHaveProperty('sm');
    expect(Radius).toHaveProperty('md');
    expect(Radius).toHaveProperty('lg');
  });

  test('radius should be numeric and progressive', () => {
    expect(Radius.sm).toBeLessThan(Radius.md);
    expect(Radius.md).toBeLessThan(Radius.lg);
  });
});

describe('Theme - FontSize', () => {
  test('should have font size constants', () => {
    expect(FontSize).toHaveProperty('xs');
    expect(FontSize).toHaveProperty('sm');
    expect(FontSize).toHaveProperty('base');
    expect(FontSize).toHaveProperty('md');
    expect(FontSize).toHaveProperty('lg');
    expect(FontSize).toHaveProperty('xl');
  });

  test('font sizes should be numeric and progressive', () => {
    expect(FontSize.sm).toBeLessThan(FontSize.md);
    expect(FontSize.md).toBeLessThan(FontSize.lg);
  });

  test('should have large heading sizes', () => {
    expect(FontSize).toHaveProperty('xxl');
    expect(FontSize).toHaveProperty('xxxl');
  });
});

describe('Theme - Shadow', () => {
  test('should have shadow constants', () => {
    expect(Shadow).toHaveProperty('sm');
    expect(Shadow).toHaveProperty('md');
    expect(Shadow).toHaveProperty('lg');
  });

  test('shadow should have required properties', () => {
    expect(Shadow.md).toHaveProperty('shadowColor');
    expect(Shadow.md).toHaveProperty('shadowOffset');
    expect(Shadow.md).toHaveProperty('shadowOpacity');
    expect(Shadow.md).toHaveProperty('shadowRadius');
  });

  test('shadow opacity should be valid', () => {
    expect(Shadow.md.shadowOpacity).toBeGreaterThan(0);
    expect(Shadow.md.shadowOpacity).toBeLessThanOrEqual(1);
  });
});
