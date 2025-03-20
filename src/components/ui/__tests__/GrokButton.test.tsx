import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GrokButton from '../GrokButton';
import { ThemeProvider } from '../../../context/ThemeContext';

// Wrap components with ThemeProvider for testing
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('GrokButton', () => {
  test('renders button with children', () => {
    renderWithTheme(<GrokButton>Click me</GrokButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    renderWithTheme(<GrokButton onClick={handleClick}>Click me</GrokButton>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('displays loading spinner when isLoading is true', () => {
    renderWithTheme(<GrokButton isLoading>Loading</GrokButton>);
    // Check for spinner presence (checking for the span with animate-spin class)
    expect(screen.getByText('Loading').previousSibling).toHaveClass('animate-spin');
  });

  test('is disabled when disabled prop is true', () => {
    renderWithTheme(<GrokButton disabled>Disabled</GrokButton>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  test('applies different styles based on variant prop', () => {
    const { rerender } = renderWithTheme(<GrokButton variant="primary">Primary</GrokButton>);
    let button = screen.getByText('Primary');
    
    // Primary variant has specific style attributes
    expect(button).toHaveStyle({ color: 'white' });
    
    rerender(
      <ThemeProvider>
        <GrokButton variant="secondary">Secondary</GrokButton>
      </ThemeProvider>
    );
    button = screen.getByText('Secondary');
    expect(button).toHaveStyle({ color: 'white' });
    
    rerender(
      <ThemeProvider>
        <GrokButton variant="outline">Outline</GrokButton>
      </ThemeProvider>
    );
    button = screen.getByText('Outline');
    expect(button).toHaveStyle({ backgroundColor: 'transparent' });
  });
});
