import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import backendConfig from '../../../../backend.config.json';
import ErrorPopup from '../../../component/ErrorPopup';
import EditTitleModal from '../modal/EditTitleModal';
import EditThumbnailModal from '../modal/EditThumbnailModal';
import Slide from '../component/Slide';
import defaultThumbnail from '../../../assets/default-thumbnail.png';

const BACKEND_BASE_URL = `http://localhost:${backendConfig.BACKEND_PORT}`;

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [presentation, setPresentation] = useState(null);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/dashboard');
  };

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

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      position: (presentation.slidesArr?.length || 0) + 1,
    };

    const updatedSlidesArr = [...(presentation.slidesArr || []), newSlide];
    const updatedSlidesCount = updatedSlidesArr.length;

    updatePresentation({ slidesArr: updatedSlidesArr, slides: updatedSlidesCount });
  };

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

  const handleNextSlide = () => {
    if (currentSlideIndex < (presentation.slidesArr.length - 1)) {
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
    }
  };

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


  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold mr-6">{presentation?.name || 'Untitled'}</h2>
        <button
          onClick={() => setShowTitleModal(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200">
          Edit
        </button>
      </div>

      {/* Thumbnail & Controls */}
      <div className="flex justify-between mb-6">
        <button onClick={() => setShowThumbnailModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Edit Thumbnail
        </button>
        <div className="flex items-center space-x-2">
          <button onClick={() => setConfirmDelete(true)} className="bg-red-600 text-white px-4 py-2 rounded">
            Delete Presentation
          </button>
          <button onClick={() => navigate('/dashboard')} className="bg-black text-white px-4 py-2 rounded">
            Back
          </button>
        </div>
      </div>

      {/* Slide Display */}
      <div className="w-full max-w-3xl mx-auto mb-4 bg-gray-50 rounded-md overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
        {presentation && presentation.slidesArr && presentation.slidesArr.length > 0 ? (
          <Slide slide={presentation.slidesArr[currentSlideIndex]} />
        ) : (
          <div className="text-gray-500 flex items-center justify-center h-full">No slides available</div>
        )}
      </div>

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
        <button onClick={handleAddSlide} className="bg-blue-600 text-white px-4 py-2 rounded">New Slide</button>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <p>Are you sure?</p>
            <button onClick={handleDeletePresentation} className="bg-red-600 text-white px-4 py-2 rounded mt-4">Yes</button>
            <button onClick={() => setConfirmDelete(false)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPresentation;
