import { useState, useEffect } from 'react';
import axios from 'axios';
import backendConfig from '../../../backend.config.json';
import NewPresentationModal from './modal/NewPresentationModal';
import PresentationCard from './component/PresentationCard';
import ErrorPopup from '../../component/ErrorPopup';

const BACKEND_BASE_URL = `http://localhost:${backendConfig.BACKEND_PORT}`;

const Dashboard = ({ token }) => {
  const [store, setStore] = useState({ decks: [] });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const updateStore = (newStore) => {
    axios.put(
      `${BACKEND_BASE_URL}/store`,
      {
        store: newStore,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(() => {
        setStore(newStore);
      })
      .catch((error) => {
        setError(error.response?.data?.error || 'Failed to update store');
        setShowPopup(true);
      });
  }

  useEffect(() => {
    if (token) {
      axios.get(`${BACKEND_BASE_URL}/store`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          setStore(response.data.store || { decks: [] });
        })
        .catch((error) => {
          setError(error.response?.data?.error || 'Failed to load store');
          setShowPopup(true);
        });
    }
  }, [token]);

  const handleCreatePresentation = (newPresentation) => {
    const newDeck = {
      ...newPresentation,
      id: `deck-${Date.now()}`, // Generate unique ID
    };
    const newStore = {
      ...store,
      decks: [...(store.decks || []), newDeck],
    };
    updateStore(newStore);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        New Presentation
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {store && store.decks
          ? [...store.decks].reverse().map((presentation, index) => (
            <PresentationCard key={index} presentation={presentation} />
          ))
          : 'No presentations to display'}
      </div>
      {showModal && (
        <NewPresentationModal
          onCreate={handleCreatePresentation}
          onClose={() => setShowModal(false)}
        />
      )}
      {showPopup && (
        <ErrorPopup message={error} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default Dashboard;