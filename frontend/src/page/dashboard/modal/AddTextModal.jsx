import { useState } from 'react';

const AddTextModal = ({ onSave, onClose }) => {
  const [content, setContent] = useState('');
  const [size, setSize] = useState({ width: 50, height: 10 });
  const [fontSize, setFontSize] = useState(1);
  const [color, setColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('sans');

  const handleSave = () => {
    onSave({ content, size, fontSize, color, fontFamily });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 10000 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">Add Text Box</h3>

        {/* Content */}
        <label className="block mb-1 font-semibold">Text Content</label>
        <input
          type="text"
          placeholder="Enter text content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

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

        {/* Font Size and Font Family */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Font Size (em)</label>
            <input
              type="number"
              placeholder="Font size (e.g., 1.5)"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Font Style</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 border rounded"
              style={{ fontFamily: fontFamily }}
            >
              <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
              <option value="Merriweather" style={{ fontFamily: 'Merriweather' }}>Merriweather</option>
              <option value="Dancing Script" style={{ fontFamily: 'Dancing Script' }}>Dancing Script</option>
              <option value="Lato" style={{ fontFamily: 'Lato' }}>Lato</option>
            </select>
          </div>
        </div>

        {/* Color */}
        <label className="block mb-1 font-semibold">Text Color</label>
        <div className="flex items-center mb-6">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 p-0 border-none cursor-pointer"
            style={{ appearance: 'none' }}
          />
        </div>

        {/* Action Buttons */}
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
          Add Text
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddTextModal;
