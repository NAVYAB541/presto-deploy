import { useState } from 'react';

const NewPresentationModal = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);

  const handleCreate = () => {
    const newPresentation = {
      name,
      description,
      thumbnail: thumbnail || 'default-thumbnail.png',
      slides: 1, // Default single slide
    };
    onCreate(newPresentation);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">New Presentation</h3>
        <input
          type="text"
          placeholder="Presentation Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setThumbnail(URL.createObjectURL(e.target.files[0]))}
          className="w-full mb-4"
        />
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
          Create
        </button>
        <button onClick={onClose} className="bg-black text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewPresentationModal;
