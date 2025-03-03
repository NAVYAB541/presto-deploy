import { useState } from 'react';

const AddVideoModal = ({ onSave, onClose }) => {
  const [size, setSize] = useState({ width: 50, height: 50 });
  const [url, setUrl] = useState('');
  const [autoplay, setAutoplay] = useState(false);
  const [errors, setErrors] = useState({ width: '', height: '', url: '' });

  const handleSave = () => {
    let isValid = true;
    const newErrors = { width: '', height: '', url: '' };

    // Extract YouTube video ID from the regular URL
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) {
      newErrors.url = 'Please enter a valid YouTube URL.';
      isValid = false;
    }

    if (size.width < 0 || size.width > 100) {
      newErrors.width = 'Width must be between 0 and 100.';
      isValid = false;
    }
    if (size.height < 0 || size.height > 100) {
      newErrors.height = 'Height must be between 0 and 100.';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    const videoId = videoIdMatch[1];

    onSave({ videoId, size, autoplay });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 10000 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">Add Video</h3>

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
            {errors.width && <p className="text-red-600 text-sm">{errors.width}</p>}
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
            {errors.height && <p className="text-red-600 text-sm">{errors.height}</p>}
          </div>
        </div>

        {/* Video URL */}
        <label className="block mb-1 font-semibold">Video URL</label>
        <input
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        {errors.url && <p className="text-red-600 text-sm mb-2">{errors.url}</p>}

        {/* Autoplay Option */}
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              className="form-checkbox"
            />
            <span>Autoplay</span>
          </label>
        </div>

        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Add Video</button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default AddVideoModal;
