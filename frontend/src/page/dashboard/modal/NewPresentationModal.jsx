import { useState } from 'react';
import defaultThumbnail from '../../../assets/default-thumbnail.png';

const NewPresentationModal = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [nameError, setNameError] = useState('');

  const handleCreate = () => {
    // Validate name field
    if (!name) {
      setNameError('Presentation name is required');
      return;
    }

    const newPresentation = {
      name,
      description,
      thumbnail: thumbnailFile
        ? URL.createObjectURL(thumbnailFile)
        : thumbnailUrl || defaultThumbnail,
      slides: 1, // Default single slide
    };
    onCreate(newPresentation);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'ArrowDown') {
      if (e.target.id === 'name') {
        document.getElementById('description').focus();
      } else if (e.target.id === 'description') {
        document.getElementById('thumbnailUrl').focus();
      } else if (e.target.id === 'thumbnailUrl') {
        document.getElementById('thumbnailFile').focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (e.target.id === 'thumbnailFile') {
        document.getElementById('thumbnailUrl').focus();
      } else if (e.target.id === 'thumbnailUrl') {
        document.getElementById('description').focus();
      } else if (e.target.id === 'description') {
        document.getElementById('name').focus();
      }
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError) setNameError('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">New Presentation</h3>
        <input
          id="name"
          type="text"
          placeholder="Presentation Name"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          className="w-full mb-2 p-2 border rounded"
        />
        {nameError && <p className="text-red-600 text-sm mb-2">{nameError}</p>}
        <input
          id="description"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full mb-2 p-2 border rounded"
        />

        {/* URL Input for Thumbnail */}
        <input
          id="thumbnailUrl"
          type="url"
          placeholder="Thumbnail URL"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full mb-2 p-2 border rounded"
        />
        {/* File Upload for Thumbnail */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Or upload a file:</label>
          <input
            id="thumbnailFile"
            type="file"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>

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
