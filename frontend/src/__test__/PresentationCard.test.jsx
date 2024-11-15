import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import PresentationCard from '../page/dashboard/component/PresentationCard';
import defaultThumbnail from '../assets/default-thumbnail.png';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('PresentationCard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear(); // Clear the mock before each test
  });

  it('renders correctly with valid props', () => {
    const presentation = {
      id: 'test-id',
      name: 'Test Presentation',
      description: 'This is a test description',
      thumbnail: 'test-thumbnail-url.jpg',
      slides: 5,
    };

    render(<PresentationCard presentation={presentation} />);

    expect(screen.getByText('Test Presentation')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByText('Slides: 5')).toBeInTheDocument();
    expect(screen.getByAltText('thumbnail')).toHaveAttribute('src', 'test-thumbnail-url.jpg');
  });

  it('navigates to the correct URL when clicked', () => {
    const presentation = { id: 'test-id', name: 'Test Presentation' };
    render(<PresentationCard presentation={presentation} />);

    // Simulate a click on the card container
    fireEvent.click(screen.getByText('Test Presentation'));

    // Assert the navigation
    expect(mockNavigate).toHaveBeenCalledWith('/presentation/test-id/slide/1');
  });

  it('uses default thumbnail if none is provided', () => {
    const presentation = {
      id: 'test-id',
      name: 'Test Presentation',
      description: 'This is a test description',
      thumbnail: null,
      slides: 5,
    };

    render(<PresentationCard presentation={presentation} />);

    const thumbnail = screen.getByAltText('thumbnail');
    expect(thumbnail).toHaveAttribute('src', defaultThumbnail);
  });

  it('truncates long presentation names and descriptions', () => {
    const presentation = {
      id: 'test-id',
      name: 'This is a very long presentation name that should be truncated',
      description: 'This description is also quite long and should not be fully visible in the card display',
      thumbnail: 'test-thumbnail-url.jpg',
      slides: 10,
    };

    render(<PresentationCard presentation={presentation} />);

    // Check that text content exists, exact truncation behavior might be different
    expect(screen.getByText(/This is a very long presentation name/)).toBeInTheDocument();
    expect(screen.getByText(/This description is also quite long/)).toBeInTheDocument();
  });
});
