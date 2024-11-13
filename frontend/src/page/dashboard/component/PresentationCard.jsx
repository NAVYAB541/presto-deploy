import defaultThumbnail from '../../../assets/default-thumbnail.png';

const PresentationCard = ({ presentation }) => {
  return (
    <div className="w-full h-auto p-4 bg-gray-200 rounded-lg shadow flex flex-col justify-between">
      <img
        src={presentation.thumbnail || defaultThumbnail}
        alt="thumbnail"
        className="w-full h-32 object-cover rounded mb-2"
      />
      <div className="font-semibold text-lg truncate">{presentation.name}</div>
      <div className="text-sm text-gray-600 truncate">{presentation.description || ''}</div>
      <div className="text-xs text-gray-500 mt-2">Slides: {presentation.slides}</div>
    </div>
  );
};

export default PresentationCard;
