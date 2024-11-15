import defaultThumbnail from '../../../assets/default-thumbnail.png';
import { useNavigate } from 'react-router-dom';

const PresentationCard = ({ presentation }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the presentation editor with the slide number set to 1
    navigate(`/presentation/${presentation.id}/slide/1`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-auto p-4 bg-gray-200 rounded-lg shadow flex flex-col justify-between"
    >
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
