import { useState } from 'react';

const EditTitleModal = ({ currentTitle, onSave, onClose }) => {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [titleError, setTitleError] = useState('');

  const handleSave = () => {
    if (newTitle.trim() === '') {
      setTitleError('Title cannot be empty');
      return;
    }
    onSave(newTitle);
    onClose();
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
    if (titleError) setTitleError('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 10000 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">Edit Title</h3>
        <input
          type="text"
          value={newTitle}
          onChange={handleTitleChange}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter new title"
        />
        {titleError && <p className="text-red-600 text-sm mb-4">{titleError}</p>}
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Save</button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default EditTitleModal;
