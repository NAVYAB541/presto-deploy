# Testing Approach

## Component Testing

---

### 1. **Presentation Card**
- **File**: `src/__test__/PresentationCard.test.jsx`
- **Description**:
  The `PresentationCard` component is responsible for displaying the basic details of a presentation, including its title, thumbnail, and metadata (e.g., slide count, last modified date). It also supports interaction buttons like edit and delete.
  
- **Tests**:
  - Verifies that the component renders correctly with given props (e.g., title, thumbnail).
  - Tests the behavior when a user clicks the edit or delete button.
  - Checks edge cases, such as handling missing props (e.g., no thumbnail provided).

---

### 2. **Slide**
- **File**: `src/__test__/Slide.test.jsx`
- **Description**:
  The `Slide` component displays individual slide content, including text, images, videos, and code blocks. It supports features like double-clicking for editing and context menu actions for deleting elements.
  
- **Tests**:
  - Validates that all slide elements (text, image, video, code) render correctly based on the input props.
  - Tests the functionality of interactive events (e.g., double-click to edit, right-click to delete).
  - Handles edge cases like missing elements or invalid slide data.

---

### 3. **Background Color Picker Modal**
- **File**: `src/__test__/BackgroundPicker.test.jsx`
- **Description**:
  The `BackgroundPickerModal` component allows users to customize the background of slides by selecting a solid color, gradient, or image. It supports toggling between current and default background settings and dynamically updates based on user input.
  
- **Tests**:
  - Validates that the modal renders with the correct initial background data.
  - Verifies switching between "current" and "default" background modes.
  - Tests interactions like selecting a background type (solid, gradient, image) and updating its properties.
  - Handles edge cases like invalid or incomplete background data gracefully.
  - Ensures the `onSave` callback is triggered with the correct data when saving changes.
  - Verifies that the modal closes without saving when canceling.

---

### Testing Tools and Framework
- **Framework**: [Vitest](https://vitest.dev/) for unit testing.
- **Library**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) for rendering components and simulating user interactions.

### Folder Structure
All component test files are located in the `src/__test__` directory:
- `PresentationCard.test.jsx`
- `Slide.test.jsx`
- `BackgroundPicker.test.jsx`

## UI Testing
