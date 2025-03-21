import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/theme-context';
import GrokButton from '../GrokButton';

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
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('displays loading spinner when isLoading is true', () => {
    renderWithTheme(<GrokButton isLoading>Loading</GrokButton>);
    // Check for spinner presence by looking for the span with animate-spin class
    const spinner = screen.getByText('Loading').parentElement?.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  test('is disabled when disabled prop is true', () => {
    renderWithTheme(<GrokButton disabled>Disabled</GrokButton>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  test('applies different styles based on variant prop', () => {
    const { rerender } = renderWithTheme(<GrokButton variant="primary">Primary</GrokButton>);
    let button = screen.getByText('Primary');
    
    // Primary variant has text-white class
    expect(button).toHaveClass('text-white');
    
    rerender(
      <ThemeProvider>
        <GrokButton variant="secondary">Secondary</GrokButton>
      </ThemeProvider>
    );
    button = screen.getByText('Secondary');
    expect(button).toHaveClass('text-white');
    
    rerender(
      <ThemeProvider>
        <GrokButton variant="outline">Outline</GrokButton>
      </ThemeProvider>
    );
    button = screen.getByText('Outline');
    expect(button).toHaveClass('bg-transparent');
  });
});
