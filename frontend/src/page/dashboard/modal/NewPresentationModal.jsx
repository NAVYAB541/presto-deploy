import { useState } from 'react';
import defaultThumbnail from '../../../assets/default-thumbnail.png';

const NewPresentationModal = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [nameError, setNameError] = useState('');
  const [activeInput, setActiveInput] = useState('url'); // 'url' or 'file'
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

  const handleCreate = () => {
    // Validate name field
    if (!name) {
      setNameError('Presentation name is required');
      return;
    }

    const thumbnail = thumbnailFile
      ? URL.createObjectURL(thumbnailFile)
      : thumbnailUrl.trim() || defaultThumbnail

    const initialSlide = {
      id: `slide-${Date.now()}`,
      elements: [],
    };

    const newPresentation = {
      name,
      description,
      thumbnail,
      slides: 1, // Default single slide
      slidesArr: [initialSlide],
    };
    onCreate(newPresentation);
    onClose();
  };

  const handleUrlPreview = () => {
    if (thumbnailUrl.trim()) {
      setPreviewThumbnail(thumbnailUrl);
    } else {
      setPreviewThumbnail(null); // Hide preview if URL is empty
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewThumbnail(URL.createObjectURL(file));
    } else {
      setPreviewThumbnail(null); // Hide preview if file is removed
    }
  };

  const handleInputToggle = (inputType) => {
    setActiveInput(inputType);
    setThumbnailUrl(''); // Clear URL input
    setThumbnailFile(null); // Clear file input
    setPreviewThumbnail(null); // Hide preview when switching inputs
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError) setNameError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
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
    } else if (e.key === 'Enter' && e.target.id === 'thumbnailUrl') {
      handleUrlPreview(); // Trigger preview for URL field only
    }
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

        {/* Preview of the thumbnail */}
        {previewThumbnail && (
          <div className="mb-4 flex justify-center relative">
            <img
              src={previewThumbnail}
              alt="Thumbnail preview"
              className="w-32 h-20 object-cover border"
            />
            {previewThumbnail === defaultThumbnail && (
              <span className="absolute inset-0 flex items-center justify-center text-black">No Thumbnail</span>
            )}
          </div>
        )}

        {/* Toggle Buttons for URL and File Upload */}
        <div className="flex mb-4">
          <button
            onClick={() => handleInputToggle('url')}
            className={`flex-1 px-4 py-2 rounded-l-lg ${activeInput === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Insert URL
          </button>
          <button
            onClick={() => handleInputToggle('file')}
            className={`flex-1 px-4 py-2 rounded-r-lg ${activeInput === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Upload File
          </button>
        </div>

        {/* Conditional Input Fields based on selected option */}
        {activeInput === 'url' && (
          <input
            id="thumbnailUrl"
            type="url"
            placeholder="Thumbnail URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            onBlur={handleUrlPreview} // Preview the URL on blur
            onKeyDown={handleKeyDown} // Preview on Enter key press
            className="w-full mb-4 p-2 border rounded"
          />
        )}

        {activeInput === 'file' && (
          <div className="mb-4">
            <input
              id="thumbnailFile"
              type="file"
              onChange={handleFileChange} // Preview the file when chosen
              className="w-full"
            />
          </div>
        )}

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
