import { useState } from 'react';
import AddTextModal from '../modal/AddTextModal';
import AddImageModal from '../modal/AddImageModal';
import AddVideoModal from '../modal/AddVideoModal';

const Toolbar = ({ currentSlideIndex, updatePresentation, presentation }) => {
  const [showTextModal, setShowTextModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

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

  const handleAddImage = (imageProperties) => {
    const newImageElement = {
      id: `element-${Date.now()}`,
      type: 'image',
      src: imageProperties.src,
      size: imageProperties.size,
      position: { x: 0, y: 0 },
      alt: imageProperties.alt,
      layerIndex: presentation.slidesArr[currentSlideIndex].elements.length,
    };

    const updatedSlidesArr = presentation.slidesArr.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newImageElement] }
        : slide
    );

    updatePresentation({ slidesArr: updatedSlidesArr });
    setShowImageModal(false);
  };

  const handleAddVideo = (videoProperties) => {
    const newVideoElement = {
      id: `element-${Date.now()}`,
      type: 'video',
      videoId: videoProperties.videoId,  // Store video ID for react-youtube
      size: videoProperties.size,
      position: { x: 0, y: 0 },
      autoplay: videoProperties.autoplay,
      layerIndex: presentation.slidesArr[currentSlideIndex].elements.length,
    };

    const updatedSlidesArr = presentation.slidesArr.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newVideoElement] }
        : slide
    );

    updatePresentation({ slidesArr: updatedSlidesArr });
    setShowVideoModal(false);
  };

  return (
    <div className="toolbar bg-gray-200 p-2 rounded mb-4">
      <button
        onClick={() => setShowTextModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Text Box
      </button>
      <button onClick={() => setShowImageModal(true)} className="bg-green-600 text-white px-4 py-2 rounded ml-2">
        Add Image
      </button>
      <button onClick={() => setShowVideoModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded ml-2">
        Add Video
      </button>

      {/* All 'add' modals*/}
      {showTextModal && <AddTextModal onSave={handleAddTextBox} onClose={() => setShowTextModal(false)} />}
      {showImageModal && <AddImageModal onSave={handleAddImage} onClose={() => setShowImageModal(false)} />}
      {showVideoModal && <AddVideoModal onSave={handleAddVideo} onClose={() => setShowVideoModal(false)} />}
    </div>
  );
};

export default Toolbar;
