import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Slide from '../page/dashboard/component/Slide';

describe('Slide Component', () => {
  const mockEditElement = vi.fn();
  const mockDeleteElement = vi.fn();
  const mockSaveBackground = vi.fn();

  const baseSlideProps = {
    slide: {
      background: { type: 'solid', color: '#ffffff' },
      elements: [],
    },
    index: 0,
    onEditElement: mockEditElement,
    onDeleteElement: mockDeleteElement,
    onSaveBackground: mockSaveBackground,
    presentation: {
      defaultBackground: { type: 'solid', color: '#000000' },
    },
    previewMode: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with no elements', () => {
    render(<Slide {...baseSlideProps} previewMode={true} />);
    expect(screen.getByText('1')).toBeInTheDocument(); // Slide number indicator
    expect(screen.queryByText(/Fill/)).not.toBeInTheDocument(); // Background button should not be visible in preview mode
  });


  it('renders text element correctly', () => {
    const slide = {
      ...baseSlideProps.slide,
      elements: [
        {
          id: 'text-1',
          type: 'text',
          content: 'Hello World',
          size: { width: 50, height: 10 },
          position: { x: 10, y: 10 },
          fontSize: 1.5,
          color: '#333',
          fontFamily: 'Arial',
          layerIndex: 1,
        },
      ],
    };

    render(<Slide {...baseSlideProps} slide={slide} />);
    const textElement = screen.getByText('Hello World');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveStyle({
      fontSize: '1.5em',
      color: '#333',
      fontFamily: 'Arial',
    });

    fireEvent.doubleClick(textElement);
    expect(mockEditElement).toHaveBeenCalledWith(slide.elements[0]);

    fireEvent.contextMenu(textElement);
    expect(mockDeleteElement).toHaveBeenCalledWith(slide.elements[0].id);
  });

  it('renders image element correctly', () => {
    const slide = {
      ...baseSlideProps.slide,
      elements: [
        {
          id: 'image-1',
          type: 'image',
          src: 'https://example.com/image.png',
          alt: 'Example Image',
          size: { width: 50, height: 50 },
          position: { x: 20, y: 20 },
          layerIndex: 1,
        },
      ],
    };

    render(<Slide {...baseSlideProps} slide={slide} />);
    const imageElement = screen.getByAltText('Example Image');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'https://example.com/image.png');

    fireEvent.doubleClick(imageElement);
    expect(mockEditElement).toHaveBeenCalledWith(slide.elements[0]);

    fireEvent.contextMenu(imageElement);
    expect(mockDeleteElement).toHaveBeenCalledWith(slide.elements[0].id);
  });

  it('renders video element correctly', () => {
    const slide = {
      ...baseSlideProps.slide,
      elements: [
        {
          id: 'video-1',
          type: 'video',
          videoId: 'abc123',
          size: { width: 60, height: 40 },
          position: { x: 30, y: 30 },
          autoplay: true,
          layerIndex: 1,
        },
      ],
    };

    render(<Slide {...baseSlideProps} slide={slide} />);

    // Look for a container with the YouTube video iframe
    const videoContainer = document.querySelector('.w-full.h-full'); // Adjust to match your DOM structure
    expect(videoContainer).toBeInTheDocument();
  });

  it('renders code element correctly', () => {
    const slide = {
      ...baseSlideProps.slide,
      elements: [
        {
          id: 'code-1',
          type: 'code',
          content: 'console.log("Hello, world!");',
          language: 'javascript',
          size: { width: 80, height: 20 },
          fontSize: 1.2,
          position: { x: 5, y: 5 },
          layerIndex: 1,
        },
      ],
    };

    render(<Slide {...baseSlideProps} slide={slide} />);

    // Locate the `pre` or `code` block inside the rendered Slide component
    const codeBlock = document.querySelector('pre > code');
    expect(codeBlock).toBeInTheDocument();

    // Check if the content matches the expected code
    expect(codeBlock.textContent).toContain('console.log("Hello, world!");');
  });

  it('disables background button and interactions in preview mode', () => {
    render(<Slide {...baseSlideProps} previewMode={true} />);
    expect(screen.queryByText(/Fill/)).not.toBeInTheDocument();
  });

  it('handles unsupported element types gracefully', () => {
    const slide = {
      ...baseSlideProps.slide,
      elements: [
        {
          id: 'unsupported-1',
          type: 'unsupported',
        },
      ],
    };

    render(<Slide {...baseSlideProps} slide={slide} />);
    expect(screen.queryByText('unsupported-1')).not.toBeInTheDocument();
  });

  it('opens background picker when the button is clicked', () => {
    render(<Slide {...baseSlideProps} />);
    const backgroundButton = screen.getByText(/Fill/);
    expect(backgroundButton).toBeInTheDocument();

    fireEvent.click(backgroundButton);
    expect(mockSaveBackground).not.toHaveBeenCalled(); // Modal interaction is mocked
  });
});
