function ErrorPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-red-600 p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-white text-xl font-semibold">Error</h3>
        <p className="text-white mt-4">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-white text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
