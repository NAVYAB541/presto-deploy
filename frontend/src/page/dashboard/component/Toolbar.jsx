import { useState } from 'react';
import AddTextModal from '../modal/AddTextModal';
import AddImageModal from '../modal/AddImageModal';
import AddVideoModal from '../modal/AddVideoModal';
import AddCodeModal from '../modal/AddCodeModal';

const Toolbar = ({ currentSlideIndex, updatePresentation, presentation }) => {
  const [showTextModal, setShowTextModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

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
      fontFamily: textProperties.fontFamily,
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

  const handleAddCodeBlock = (codeProperties) => {
    const newCodeElement = {
      id: `element-${Date.now()}`,
      type: 'code',
      content: codeProperties.content,
      language: codeProperties.language,
      size: codeProperties.size,
      fontSize: codeProperties.fontSize,
      position: { x: 0, y: 0 },
      layerIndex: presentation.slidesArr[currentSlideIndex].elements.length,
    };

    const updatedSlidesArr = presentation.slidesArr.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newCodeElement] }
        : slide
    );

    updatePresentation({ slidesArr: updatedSlidesArr });
    setShowCodeModal(false);
  };

  return (
    <div className="toolbar bg-gray-200 p-3 rounded lg:w-40 lg:ml-0 mb-5 flex lg:flex-col justify-center items-center lg:space-y-2 lg:space-x-0 space-x-2">
      <button
        onClick={() => setShowTextModal(true)}
        className="bg-black text-white w-28 h-10 flex items-center justify-center space-x-2 rounded"
      >
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
        <span>Add Text</span>
      </button>

      <button
        onClick={() => setShowImageModal(true)}
        className="bg-black text-white w-28 h-10 flex items-center justify-center space-x-2 rounded"
      >
        <svg className="h-5 w-5 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="15" y1="8" x2="15.01" y2="8" />
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
          <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
        </svg>
        <span>Add Image</span>
      </button>

      <button
        onClick={() => setShowVideoModal(true)}
        className="bg-black text-white w-28 h-10 flex items-center justify-center space-x-2 rounded"
      >
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
        <span>Add Video</span>
      </button>

      <button
        onClick={() => setShowCodeModal(true)}
        className="bg-black text-white w-28 h-10 flex items-center justify-center space-x-2 rounded"
      >
        <svg className="h-5 w-5 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="7 8 3 12 7 16" />
          <polyline points="17 8 21 12 17 16" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
        <span>Add Code</span>
      </button>

      {showTextModal && <AddTextModal onSave={handleAddTextBox} onClose={() => setShowTextModal(false)} />}
      {showImageModal && <AddImageModal onSave={handleAddImage} onClose={() => setShowImageModal(false)} />}
      {showVideoModal && <AddVideoModal onSave={handleAddVideo} onClose={() => setShowVideoModal(false)} />}
      {showCodeModal && <AddCodeModal onSave={handleAddCodeBlock} onClose={() => setShowCodeModal(false)} />}
    </div>
  );
};

export default Toolbar;
