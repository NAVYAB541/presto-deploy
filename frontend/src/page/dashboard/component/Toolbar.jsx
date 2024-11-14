import { useState } from 'react';
import AddTextModal from '../modal/AddTextModal';

const Toolbar = ({ currentSlideIndex, updatePresentation, presentation }) => {
  const [showTextModal, setShowTextModal] = useState(false);

  const handleAddTextBox = (textProperties) => {
    // Add a new text element to the current slide
    const newElement = {
      id: `element-${Date.now()}`,
      type: 'text',
      content: textProperties.content,
      size: textProperties.size,
      position: { x: 0, y: 0 },
      fontSize: textProperties.fontSize,
      color: textProperties.color,
      layerIndex: presentation.slidesArr[currentSlideIndex].elements.length,
    };

    // Update the presentation by adding the new element
    const updatedSlidesArr = presentation.slidesArr.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    );

    updatePresentation({ slidesArr: updatedSlidesArr });
    setShowTextModal(false);
  };

  return (
    <div className="toolbar bg-gray-200 p-2 rounded mb-4">
      <button
        onClick={() => setShowTextModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Text Box
      </button>

      {/* AddTextModal for adding a text box */}
      {showTextModal && <AddTextModal onSave={handleAddTextBox} onClose={() => setShowTextModal(false)} />}
    </div>
  );
};

export default Toolbar;
