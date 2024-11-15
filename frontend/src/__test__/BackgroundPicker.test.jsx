import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, afterEach, expect } from 'vitest';
import BackgroundPickerModal from '../page/dashboard/modal/BackgroundPickerModal';

describe('BackgroundPickerModal Component', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    onSave: mockOnSave,
    onClose: mockOnClose,
    currentBackground: {
      type: 'solid',
      color: '#ffffff',
    },
    defaultBackground: {
      type: 'gradient',
      gradient: {
        start: '#ff0000',
        end: '#00ff00',
        direction: 'to right',
      },
    },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct initial background data', () => {
    render(<BackgroundPickerModal {...defaultProps} />);

    expect(screen.getByText('Select Background')).toBeInTheDocument();
    expect(screen.getByText('Current')).toHaveClass('bg-blue-600 text-white');
    expect(screen.getByText('Default')).toHaveClass('bg-gray-200 text-gray-800');
    expect(screen.getByDisplayValue('#ffffff')).toBeInTheDocument(); // Solid color
  });

  it('switches to default background settings when toggled', () => {
    render(<BackgroundPickerModal {...defaultProps} />);

    // Click the "Default" button
    const defaultButton = screen.getByText('Default');
    fireEvent.click(defaultButton);

    // Assert that the Default button is active
    expect(screen.getByText('Default')).toHaveClass('bg-blue-600 text-white');
    expect(screen.getByText('Current')).toHaveClass('bg-gray-200 text-gray-800');

    // Select the second combobox (Direction dropdown)
    const directionDropdown = screen.getAllByRole('combobox')[1];
    expect(directionDropdown).toHaveValue('to right'); // Assert its value
  });

  it('allows changing background type', () => {
    render(<BackgroundPickerModal {...defaultProps} />);

    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'gradient' } });

    expect(dropdown).toHaveValue('gradient'); // Confirm the type is updated

    // Verify the presence of gradient-specific fields
    expect(screen.getByText('Start Color')).toBeInTheDocument();
    expect(screen.getByText('End Color')).toBeInTheDocument();
  });

  it('calls onSave with updated background settings', () => {
    render(<BackgroundPickerModal {...defaultProps} />);

    // Change the background type to "gradient"
    const dropdown = screen.getByText('Background Type').nextElementSibling;
    fireEvent.change(dropdown, { target: { value: 'gradient' } });

    // Locate the Start Color input field using `getAllByText` and ensure it's the correct input
    const startColorLabel = screen.getAllByText('Start Color').find(
      (label) => label.tagName.toLowerCase() === 'label'
    );
    const startColorInput = startColorLabel.nextElementSibling;

    // Update the color
    fireEvent.change(startColorInput, { target: { value: '#123456' } });
    fireEvent.change(startColorInput, { target: { value: '#123456' } });

    // Save the updated background
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Verify that onSave was called with the correct data
    expect(mockOnSave).toHaveBeenCalledWith({
      currentBackground: {
        type: 'gradient',
        gradient: {
          start: '#123456',
          end: '#000000', // Black by default
          direction: 'to right',
        },
      },
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes without saving changes when cancel is clicked', () => {
    render(<BackgroundPickerModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles incomplete or invalid background data gracefully', () => {
    const invalidProps = {
      ...defaultProps,
      currentBackground: null,
      defaultBackground: null,
    };

    render(<BackgroundPickerModal {...invalidProps} />);

    expect(screen.getByText('Select Background')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#ffffff')).toBeInTheDocument(); // Default fallback color
  });
});
