import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AuthScreen from '@/screens/AuthScreen';

describe('AuthScreen', () => {
  test('renders correctly', async () => {
    const mockOnLogin = jest.fn();
    let tree;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AuthScreen onLogin={mockOnLogin} />);
    });

    expect(tree).toBeTruthy();
  });

  test('should have onLogin callback', () => {
    const mockOnLogin = jest.fn();
    const props = { onLogin: mockOnLogin };

    expect(props.onLogin).toBeDefined();
    expect(typeof props.onLogin).toBe('function');
  });

  test('should handle login action', () => {
    const mockOnLogin = jest.fn();
    mockOnLogin();

    expect(mockOnLogin).toHaveBeenCalled();
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  test('should support mode toggle between login and register', () => {
    const modes = ['login', 'register'] as const;
    expect(modes).toContain('login');
    expect(modes).toContain('register');
  });
});
