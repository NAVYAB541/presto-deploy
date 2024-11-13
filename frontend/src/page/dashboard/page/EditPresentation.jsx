import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import backendConfig from '../../../../backend.config.json';
import ErrorPopup from '../../../component/ErrorPopup';

const BACKEND_BASE_URL = `http://localhost:${backendConfig.BACKEND_PORT}`;

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    // Fetch the presentation data using the presentation ID
    axios.get(`${BACKEND_BASE_URL}/store`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((response) => {
        const presentationData = response.data.store.decks.find((deck) => deck.id === id);
        if (!presentationData) {
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

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeletePresentation = () => {
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
      <h2 className="text-2xl font-bold mb-4">Edit Presentation</h2>
      <button
        onClick={handleBack}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-6"
      >
        Back
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded mb-6 ml-4"
      >
        Delete Presentation
      </button>

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <p>Are you sure?</p>
            <button
              onClick={confirmDeletePresentation}
              className="bg-red-600 text-white px-4 py-2 rounded mt-4"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="bg-black text-white px-4 py-2 rounded mt-4 ml-2"
            >
              No
            </button>
          </div>
        </div>
      )}

      {showPopup && <ErrorPopup message={error} onClose={handlePopupClose} />}
    </div>
  );
};

export default EditPresentation;
