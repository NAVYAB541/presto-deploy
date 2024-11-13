import { useState } from 'react';
import defaultThumbnail from '../../../assets/default-thumbnail.png';

const NewPresentationModal = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleCreate = () => {
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
        {/* URL Input for Thumbnail */}
        <input
          type="url"
          placeholder="Thumbnail URL"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        {/* File Upload for Thumbnail */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Or upload a file:</label>
          <input
            type="file"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
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
