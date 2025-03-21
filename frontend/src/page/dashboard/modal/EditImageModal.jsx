import { useState } from 'react';

const EditImageModal = ({ element, onSave, onClose }) => {
  const [size, setSize] = useState(element.size || { width: 50, height: 50 });
  const [position, setPosition] = useState(element.position || { x: 0, y: 0 });
  const [alt, setAlt] = useState(element.alt || 'Image');
  const [src, setSrc] = useState(element.src || '');
  const [activeInput, setActiveInput] = useState('url'); // 'url' or 'file'
  const [previewImage, setPreviewImage] = useState(element.src || '');

  const handleSave = () => {
    onSave({
      ...element,
      src: previewImage || src,
      size,
      position,
      alt,
    });
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlPreview = () => {
    if (src.trim()) {
      setPreviewImage(src);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 10000 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">Edit Image</h3>

        {/* Width and Height */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Width (%)</label>
            <input
              type="number"
              placeholder="Width (0-100)"
              value={size.width}
              onChange={(e) => setSize({ ...size, width: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Height (%)</label>
            <input
              type="number"
              placeholder="Height (0-100)"
              value={size.height}
              onChange={(e) => setSize({ ...size, height: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* X and Y Position */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">X Position (%)</label>
            <input
              type="number"
              placeholder="X (0-100)"
              value={position.x}
              onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Y Position (%)</label>
            <input
              type="number"
              placeholder="Y (0-100)"
              value={position.y}
              onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {previewImage && (
          <div className="flex justify-center items-center mb-4">
            <img src={previewImage} alt="Preview" className="max-w-20 max-h-20 object-contain mb-4" />
          </div>
        )}

        {/* Image Source - URL or File */}
        <div className="flex mb-4">
          <button
            onClick={() => setActiveInput('url')}
            className={`flex-1 px-4 py-2 rounded-l-lg ${activeInput === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Insert URL
          </button>
          <button
            onClick={() => setActiveInput('file')}
            className={`flex-1 px-4 py-2 rounded-r-lg ${activeInput === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Upload File
          </button>
        </div>

        {activeInput === 'url' ? (
          <input
            type="url"
            placeholder="Image URL"
            onChange={(e) => setSrc(e.target.value)}
            onBlur={handleUrlPreview} // Preview on blur
            onKeyDown={(e) => e.key === 'Enter' && handleUrlPreview()} // Preview on Enter key press
            className="w-full mb-4 p-2 border rounded"
          />
        ) : (
          <input type="file" onChange={handleFileChange} className="w-full mb-4 p-2 border rounded" />
        )}

        {/* Alt Text */}
        <label className="block mb-1 font-semibold">Alt Text</label>
        <input
          type="text"
          placeholder="Image description"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
          Save
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditImageModal;
