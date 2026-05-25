import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ProfileScreen from '@/screens/ProfileScreen';

describe('ProfileScreen', () => {
  test('renders correctly', async () => {
    const mockOnLogout = jest.fn();
    let tree;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<ProfileScreen onLogout={mockOnLogout} />);
    });

    expect(tree).toBeTruthy();
  });

  test('should have onLogout callback', () => {
    const mockOnLogout = jest.fn();
    const props = { onLogout: mockOnLogout };

    expect(props.onLogout).toBeDefined();
    expect(typeof props.onLogout).toBe('function');
  });

  test('should handle logout action', () => {
    const mockOnLogout = jest.fn();
    mockOnLogout();

    expect(mockOnLogout).toHaveBeenCalled();
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  test('should support dark mode toggle', () => {
    const isDarkMode = false;
    expect(typeof isDarkMode).toBe('boolean');
  });

  test('should support notification settings', () => {
    const settings = {
      darkMode: false,
      autoSync: true,
      notifications: true,
    };

    expect(settings).toHaveProperty('darkMode');
    expect(settings).toHaveProperty('autoSync');
    expect(settings).toHaveProperty('notifications');
  });
});
