const ConfirmDeleteElement = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10000">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <p>Are you sure you want to delete this element?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded">Yes</button>
          <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteElement;
