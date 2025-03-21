import { render, screen } from '@testing-library/react';
import StatsCard from '../stats-card';

describe('StatsCard', () => {
  const mockProps = {
    title: 'Test Card',
    stats: ['Stat 1', 'Stat 2'],
    actionText: 'View More',
    actionUrl: '/test',
    icon: <div>Icon</div>,
  };

  it('renders correctly', () => {
    render(<StatsCard {...mockProps} />);
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Stat 1')).toBeInTheDocument();
    expect(screen.getByText('Stat 2')).toBeInTheDocument();
    expect(screen.getByText('View More')).toBeInTheDocument();
  });
}); 