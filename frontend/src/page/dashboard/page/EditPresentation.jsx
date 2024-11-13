import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import backendConfig from '../../../../backend.config.json';
import ErrorPopup from '../../../component/ErrorPopup';
import EditTitleModal from '../modal/EditTitleModal';
import EditThumbnailModal from '../modal/EditThumbnailModal';
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

  useEffect(() => {
    // Fetch the presentation data using the presentation ID
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
    navigate('/dashboard'); // Redirect to dashboard when popup is closed
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
        setPresentation((prev) => ({ ...prev, ...updatedData })); // Update local state
      })
      .catch((error) => {
        setError(error.response?.data?.error || 'Failed to update presentation');
        setShowPopup(true);
      });
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

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold mr-6">{presentation?.name || 'Untitled'}</h2>
        <button
          onClick={() => setShowTitleModal(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200">
          Edit
        </button>
      </div>
      <div className="flex justify-between mb-6">
        {/* Left-aligned Edit Thumbnail Button */}
        <button onClick={() => setShowThumbnailModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Edit Thumbnail
        </button>

        {/* Right-aligned Delete and Back Buttons */}
        <div className="flex items-center space-x-2">
          <button onClick={() => setConfirmDelete(true)} className="bg-red-600 text-white px-4 py-2 rounded">
            Delete Presentation
          </button>
          <button onClick={() => navigate('/dashboard')} className="bg-gray-500 text-white px-4 py-2 rounded">
            Back
          </button>
        </div>
      </div>

      {
        showTitleModal && (
          <EditTitleModal
            currentTitle={presentation?.name}
            onSave={(newTitle) => updatePresentation({ name: newTitle })}
            onClose={() => setShowTitleModal(false)}
          />
        )
      }
      {
        showThumbnailModal && (
          <EditThumbnailModal
            currentThumbnail={presentation?.thumbnail || defaultThumbnail}
            onSave={(newThumbnail) => updatePresentation({ thumbnail: newThumbnail })}
            onClose={() => setShowThumbnailModal(false)}
          />
        )
      }
      {showPopup && <ErrorPopup message={error} onClose={handlePopupClose} />}
      {
        confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <p>Are you sure?</p>
              <button onClick={handleDeletePresentation} className="bg-red-600 text-white px-4 py-2 rounded mt-4">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">No</button>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default EditPresentation;
