import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import backendConfig from '../../../../backend.config.json';
import ErrorPopup from '../../../component/ErrorPopup';
import EditTitleModal from '../modal/EditTitleModal';
import EditThumbnailModal from '../modal/EditThumbnailModal';
import Slide from '../component/Slide';
import Toolbar from '../component/Toolbar';
import defaultThumbnail from '../../../assets/default-thumbnail.png';
import EditTextModal from '../modal/EditTextModal';
import EditImageModal from '../modal/EditImageModal';
import EditVideoModal from '../modal/EditVideoModal';
import EditCodeModal from '../modal/EditCodeModal';
import ConfirmDeleteElement from '../modal/ConfirmDeleteElement';

const BACKEND_BASE_URL = `http://localhost:${backendConfig.BACKEND_PORT}`;

const EditPresentation = () => {
  const { id, slideNumber } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [isDeleteSlideError, setIsDeleteSlideError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [presentation, setPresentation] = useState(null);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(parseInt(slideNumber, 10) - 1 || 0);
  const [showToolbar, setShowToolbar] = useState(false);
  const [editingElement, setEditingElement] = useState(null); // Track the element being edited
  const [showTextModal, setShowTextModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showDeleteElementModal, setShowDeleteElementModal] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);

  // Fetch presentation data on component mount
  useEffect(() => {
    axios.get(`${BACKEND_BASE_URL}/store`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((response) => {
        const presentationData = response.data.store.decks.find((deck) => deck.id === id);
        if (presentationData) {
          setPresentation(presentationData);
        } else {
          setError('Presentation not found');
          setShowPopup(true);
        }
      })
      .catch((error) => {
        setError(error.response?.data?.error || 'Failed to load presentation');
        setShowPopup(true);
      });
  }, [id]);

  // Close Error Popup
  const handlePopupClose = () => {
    setShowPopup(false);
    if (!isDeleteSlideError) {
      navigate('/dashboard'); // Only redirect if not a delete-slide error
    }
    setIsDeleteSlideError(false); // Reset the flag after closing
  };

  // Update the presentation data on the backend
  const updatePresentation = (updatedData) => {
    axios.get(`${BACKEND_BASE_URL}/store`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => {
        const updatedStore = {
          ...response.data.store,
          decks: response.data.store.decks.map((deck) =>
            deck.id === id ? { ...deck, ...updatedData } : deck
          ),
        };

        return axios.put(`${BACKEND_BASE_URL}/store`, { store: updatedStore }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      })
      .then(() => {
        setPresentation((prev) => ({ ...prev, ...updatedData }));
      })
      .catch((error) => {
        setError(error.response?.data?.error || 'Failed to update presentation');
        setShowPopup(true);
      });
  };

  // Add a new slide to the presentation
  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      elements: [],
      background: presentation.defaultBackground, // Set the slide's background to the default background of the presentation
      useDefaultBackground: true, // Mark this slide as using the default background
    };

    const updatedSlidesArr = [...(presentation.slidesArr || []), newSlide];
    const updatedSlidesCount = updatedSlidesArr.length;

    updatePresentation({ slidesArr: updatedSlidesArr, slides: updatedSlidesCount });
  };

  // Delete the current slide from the presentation
  const handleDeleteSlide = () => {
    if (presentation.slidesArr.length === 1) {
      setError('Cannot delete the only slide. Consider deleting the entire presentation.');
      setIsDeleteSlideError(true); // Set the flag to prevent redirection
      setShowPopup(true);
      return;
    }

    const updatedSlidesArr = presentation.slidesArr.filter((_, index) => index !== currentSlideIndex);
    const updatedSlidesCount = updatedSlidesArr.length;

    const newIndex = Math.max(0, currentSlideIndex - 1);
    setCurrentSlideIndex(newIndex);

    updatePresentation({ slidesArr: updatedSlidesArr, slides: updatedSlidesCount });
  };

  // Delete the entire presentation
  const handleDeletePresentation = () => {
    axios.get(`${BACKEND_BASE_URL}/store`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => {
        const updatedStore = {
          ...response.data.store,
          decks: response.data.store.decks.filter((deck) => deck.id !== id),
        };
        return axios.put(`${BACKEND_BASE_URL}/store`, { store: updatedStore }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      })
      .then(() => {
        navigate('/dashboard');
      })
      .catch((error) => {
        setError(error.response?.data?.error || 'Failed to delete presentation');
        setShowPopup(true);
      });
  };

  // Update the URL whenever the current slide index changes
  useEffect(() => {
    if (presentation) {
      navigate(`/presentation/${id}/slide/${currentSlideIndex + 1}`, { replace: true });
    }
  }, [currentSlideIndex, id, navigate, presentation]);

  // Go to the next slide
  const handleNextSlide = () => {
    if (currentSlideIndex < (presentation.slidesArr.length - 1)) {
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Go to the previous slide
  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Handle keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentSlideIndex < presentation.slidesArr.length - 1) {
        handleNextSlide();
      }
      if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
        handlePreviousSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, presentation]);

  // Edit an element on the slide
  const handleEditElement = (element) => {
    setEditingElement(element);
    if (element.type === 'text') {
      setShowTextModal(true);
    } else if (element.type === 'image') {
      setShowImageModal(true);
    } else if (element.type === 'video') {
      setShowVideoModal(true);
    } else if (element.type === 'code') {
      setShowCodeModal(true);
    }
  };

  // Save changes to the edited element
  const handleSaveEditedElement = (updatedElement) => {
    const updatedSlidesArr = presentation.slidesArr.map((slide, index) =>
      index === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === updatedElement.id ? updatedElement : el
          ),
        }
        : slide
    );

    updatePresentation({ slidesArr: updatedSlidesArr });
    setShowTextModal(false);
    setShowImageModal(false);
    setShowVideoModal(false);
    setShowCodeModal(false);
    setEditingElement(null); // Clear the editing element
  };

  // Delete an element from the slide
  const handleDeleteElement = (elementId) => {
    setElementToDelete(elementId);
    setShowDeleteElementModal(true);
  };

  // Confirm deletion of an element
  const confirmDeleteElement = () => {
    const updatedSlidesArr = presentation.slidesArr.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: slide.elements.filter((el) => el.id !== elementToDelete) }
        : slide
    );
    updatePresentation({ slidesArr: updatedSlidesArr });
    setShowDeleteElementModal(false);
    setElementToDelete(null);
  };

  // Cancel deletion of an element
  const cancelDeleteElement = () => {
    setShowDeleteElementModal(false);
    setElementToDelete(null);
  };

  // Add this handler for saving the background in `EditPresentation`
  const handleSaveBackground = (backgroundsToSave) => {
    const updatedSlidesArr = presentation.slidesArr.map((slide, index) => {
      // Update the current slide background if provided
      if (index === currentSlideIndex && backgroundsToSave.currentBackground) {
        return {
          ...slide,
          background: backgroundsToSave.currentBackground,
          useDefaultBackground: false, // Indicates that the current slide is not using the default
        };
      }

      // Update slides that are using the default background if the default background has changed
      if (backgroundsToSave.defaultBackground && slide.useDefaultBackground) {
        return {
          ...slide,
          background: backgroundsToSave.defaultBackground,
        };
      }

      // No changes for slides not meeting either condition
      return slide;
    });

    // Update the default background in the presentation if it was changed
    const updatedPresentation = {
      ...presentation,
      slidesArr: updatedSlidesArr,
      defaultBackground: backgroundsToSave.defaultBackground || presentation.defaultBackground,
    };

    // Persist the updated presentation
    updatePresentation(updatedPresentation);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold mr-6">{presentation?.name || 'Untitled'}</h2>
        <button
          onClick={() => setShowTitleModal(true)}
          className="bg-black text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
        >
          <svg
            className="h-4 w-4 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>Edit Title</span>
        </button>
      </div>

      {/* Thumbnail & Controls */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setShowThumbnailModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 mr-2 hover:bg-blue-700"
        >
          <svg
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>Edit Thumbnail</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2  hover:bg-red-700"
          >
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M15 4l-1-1H10L9 4" />
            </svg>
            <span>Delete Presentation</span>
          </button>

          <button onClick={() => navigate('/dashboard')} className="bg-black text-white px-4 py-2 rounded">
            Back
          </button>
        </div>
      </div>

      {/* Button to toggle toolbar and preview presentation */}
      <div className="flex justify-between items-center mb-4">
        {/* Toolbar Toggle Button */}
        <button
          onClick={() => setShowToolbar((prev) => !prev)}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          {showToolbar ? "Hide Toolbar" : "Show Toolbar"}
        </button>

        {/* Preview Button */}
        <button
          onClick={() => window.open(`/preview/${id}/slide/1`, '_blank')}
          className="bg-black text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-900"
        >
          <svg className="h-5 w-5 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="15" y1="6" x2="15.01" y2="6" />
            <rect x="3" y="3" width="18" height="14" rx="3" />
            <path d="M3 13l4 -4a3 5 0 0 1 3 0l4 4" />
            <path d="M13 12l2 -2a3 5 0 0 1 3 0l3 3" />
            <line x1="8" y1="21" x2="8.01" y2="21" />
            <line x1="12" y1="21" x2="12.01" y2="21" />
            <line x1="16" y1="21" x2="16.01" y2="21" />
          </svg>
          <span>Preview Slides</span>
        </button>
      </div>

      {/* Responsive layout with the toolbar */}
      <div className="flex flex-col lg:flex-row lg:space-x-4 items-center lg:items-start">
        {/* Toolbar positioned at the top for small screens */}
        {showToolbar && (
          <div className="block lg:hidden w-full mb-4">
            <Toolbar
              currentSlideIndex={currentSlideIndex}
              updatePresentation={updatePresentation}
              presentation={presentation}
            />
          </div>
        )}

        {/* Toolbar positioned on the left for large screens */}
        {showToolbar && (
          <div className="lg:w-1/4 lg:block hidden"> {/* Show only on larger screens */}
            <Toolbar
              currentSlideIndex={currentSlideIndex}
              updatePresentation={updatePresentation}
              presentation={presentation}
            />
          </div>
        )}

        {/* Slide Display */}
        <div className={`w-full max-w-3xl mx-auto mb-4 bg-gray-50 rounded-md overflow-hidden ${showToolbar ? 'lg:ml-auto' : ''}`} style={{ aspectRatio: '16 / 9' }}>
          {presentation && presentation.slidesArr && presentation.slidesArr.length > 0 ? (
            <Slide
              slide={presentation.slidesArr[currentSlideIndex]}
              index={currentSlideIndex}
              onEditElement={handleEditElement}
              onDeleteElement={handleDeleteElement}
              onSaveBackground={handleSaveBackground}
              presentation={presentation}
            />
          ) : (
            <div className="text-gray-500 flex items-center justify-center h-full">No slides available</div>
          )}
        </div>
      </div>
      {/* Render Modals for editing text, image or video elements */}
      {showTextModal && editingElement && (
        <EditTextModal
          element={editingElement}
          onSave={handleSaveEditedElement}
          onClose={() => setShowTextModal(false)}
        />
      )}
      {showImageModal && editingElement && editingElement.type === 'image' && (
        <EditImageModal
          element={editingElement}
          onSave={handleSaveEditedElement}
          onClose={() => setShowImageModal(false)}
        />
      )}
      {showVideoModal && editingElement && editingElement.type === 'video' && (
        <EditVideoModal
          element={editingElement}
          onSave={handleSaveEditedElement}
          onClose={() => setShowVideoModal(false)}
        />
      )}
      {showCodeModal && editingElement && editingElement.type === 'code' && (
        <EditCodeModal
          element={editingElement}
          onSave={handleSaveEditedElement}
          onClose={() => setShowCodeModal(false)}
        />
      )}

      {/* Navigation Controls */}
      <div className="flex justify-center items-center space-x-4">
        {presentation?.slidesArr?.length > 1 && (
          <button
            onClick={handlePreviousSlide}
            disabled={currentSlideIndex === 0}
            className={currentSlideIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-black'}
          >
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 8 8 12 12 16" />
              <line x1="16" y1="12" x2="8" y2="12" />
            </svg>
          </button>
        )}
        <button onClick={handleAddSlide} className="bg-blue-600 text-white px-4 py-2 rounded  hover:bg-blue-700">New Slide</button>
        <button onClick={handleDeleteSlide} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete Slide</button>
        {presentation?.slidesArr?.length > 1 && (
          <button
            onClick={handleNextSlide}
            disabled={currentSlideIndex === presentation.slidesArr.length - 1}
            className={currentSlideIndex === presentation.slidesArr.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-black'}
          >
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 16 16 12 12 8" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        )}
      </div>

      {showTitleModal && (
        <EditTitleModal
          currentTitle={presentation?.name}
          onSave={(newTitle) => updatePresentation({ name: newTitle })}
          onClose={() => setShowTitleModal(false)}
        />
      )}
      {showThumbnailModal && (
        <EditThumbnailModal
          currentThumbnail={presentation?.thumbnail || defaultThumbnail}
          onSave={(newThumbnail) => updatePresentation({ thumbnail: newThumbnail })}
          onClose={() => setShowThumbnailModal(false)}
        />
      )}
      {showPopup && <ErrorPopup message={error} onClose={handlePopupClose} />}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 10000 }}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <p>Are you sure?</p>
            <button onClick={handleDeletePresentation} className="bg-red-600 text-white px-4 py-2 rounded mt-4">Yes</button>
            <button onClick={() => setConfirmDelete(false)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">No</button>
          </div>
        </div>
      )}

      {/* Confirm Delete Element Modal */}
      {showDeleteElementModal && (
        <ConfirmDeleteElement
          onConfirm={confirmDeleteElement}
          onCancel={cancelDeleteElement}
        />
      )}
    </div>
  );
};

export default EditPresentation;
