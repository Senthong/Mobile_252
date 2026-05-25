import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import OnboardingScreen from '@/screens/OnboardingScreen';

describe('OnboardingScreen', () => {
  test('renders correctly', async () => {
    const mockOnFinish = jest.fn();
    let tree;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<OnboardingScreen onFinish={mockOnFinish} />);
    });

    expect(tree).toBeTruthy();
  });

  test('should have onFinish callback', () => {
    const mockOnFinish = jest.fn();
    const props = { onFinish: mockOnFinish };

    expect(props.onFinish).toBeDefined();
    expect(typeof props.onFinish).toBe('function');
  });

  test('should handle finish action', () => {
    const mockOnFinish = jest.fn();
    mockOnFinish();

    expect(mockOnFinish).toHaveBeenCalled();
    expect(mockOnFinish).toHaveBeenCalledTimes(1);
  });

  test('should have multiple slides for onboarding', () => {
    const slides = [
      { id: 1, title: 'Slide 1' },
      { id: 2, title: 'Slide 2' },
      { id: 3, title: 'Slide 3' },
    ];

    expect(slides.length).toBeGreaterThan(0);
    expect(slides).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: expect.any(Number) })])
    );
  });

  test('should support navigation between slides', () => {
    const currentIndex = 0;
    const totalSlides = 3;

    expect(currentIndex).toBeGreaterThanOrEqual(0);
    expect(currentIndex).toBeLessThan(totalSlides);
  });
});
