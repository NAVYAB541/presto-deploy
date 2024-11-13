const PresentationCard = ({ presentation }) => {
  return (
    <div className="w-64 h-32 bg-gray-200 rounded-lg p-4 flex flex-col justify-between shadow">
      <img
        src={presentation.thumbnail || 'default-thumbnail.png'}
        alt="thumbnail"
        className="w-full h-12 object-cover mb-2"
      />
      <div className="font-semibold">{presentation.name}</div>
      <div className="text-sm text-gray-600">{presentation.description || 'No description'}</div>
      <div className="text-xs text-gray-500">Slides: {presentation.slides}</div>
    </div>
  );
};

export default PresentationCard;
