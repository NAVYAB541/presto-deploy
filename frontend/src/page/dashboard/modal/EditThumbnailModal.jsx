import { useState } from 'react';
import defaultThumbnail from '../../../assets/default-thumbnail.png';

const EditThumbnailModal = ({ currentThumbnail, onSave, onClose }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [activeInput, setActiveInput] = useState('url'); // 'url' or 'file'
  const [previewThumbnail, setPreviewThumbnail] = useState(currentThumbnail);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleSave = () => {
    let newThumbnail = '';
    if (activeInput === 'url') {
      newThumbnail = thumbnailUrl.trim();
      if (!newThumbnail) {
        newThumbnail = defaultThumbnail;
      }
    } else if (activeInput === 'file' && thumbnailFile) {
      newThumbnail = URL.createObjectURL(thumbnailFile);
    } else if (!thumbnailFile && !thumbnailUrl) {
      newThumbnail = defaultThumbnail;
    }

    onSave(newThumbnail);
    onClose();
  };

  const isDefaultThumbnail = previewThumbnail === defaultThumbnail;

  const handleUrlPreview = () => {
    if (thumbnailUrl.trim()) {
      setPreviewThumbnail(thumbnailUrl);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewThumbnail(URL.createObjectURL(file));
    }
  };

  const handleInputToggle = (inputType) => {
    setActiveInput(inputType);
    setThumbnailUrl(''); // Clear URL field
    setThumbnailFile(null); // Clear file input
    if (isDeleted) {
      // Keep default-thumbnail as preview if delete flag is active
      setPreviewThumbnail(defaultThumbnail);
    } else {
      // Reset preview to the original thumbnail
      setPreviewThumbnail(currentThumbnail);
    }
  };

  const handleDeleteThumbnail = () => {
    setThumbnailUrl('');
    setThumbnailFile(null);
    setPreviewThumbnail(defaultThumbnail); // Set preview to default thumbnail
    setIsDeleted(true); // Set delete flag
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 10000 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">Edit Thumbnail</h3>
        <div className="mb-4 flex justify-center relative">
          <img
            src={previewThumbnail || defaultThumbnail}
            alt="Current thumbnail"
            className="w-32 h-20 object-cover border"
          />
          {isDefaultThumbnail && (
            <span className="absolute inset-0 flex items-center justify-center text-black">No Thumbnail</span>
          )}
        </div>

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
            type="url"
            placeholder="Thumbnail URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            onBlur={handleUrlPreview} // Preview the URL on blur
            onKeyDown={(e) => e.key === 'Enter' && handleUrlPreview()} // Preview on Enter key press
            className="w-full mb-4 p-2 border rounded"
          />
        )}

        {activeInput === 'file' && (
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange} // Preview the file when chosen
              className="w-full"
            />
          </div>
        )}

        {/* Delete Thumbnail Button */}
        {!isDefaultThumbnail && (
          <button onClick={handleDeleteThumbnail} className="bg-red-600 text-white px-4 py-2 rounded mb-4 w-full">
            Delete Thumbnail
          </button>
        )}

        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Save</button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default EditThumbnailModal;
