import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import backendConfig from '../../../../backend.config.json';
import Slide from '../component/Slide';

const BACKEND_BASE_URL = `http://localhost:${backendConfig.BACKEND_PORT}`;

const PreviewPresentation = () => {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    // Fetch the presentation data using the ID
    fetch(`${BACKEND_BASE_URL}/store`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const deck = data.store?.decks?.find((deck) => deck.id === id);
        if (deck) {
          setPresentation(deck);
        } else {
          console.error('Presentation not found');
        }
      })
      .catch((error) => console.error('Error fetching presentation:', error));
  }, [id]);

  const handleNextSlide = () => {
    if (currentSlideIndex < presentation.slidesArr.length - 1) {
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePreviousSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlideIndex, presentation]);

  if (!presentation) {
    return <div>Loading...</div>;
  }

  if (!presentation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col justify-center items-center">
      {/* Fullscreen Slide Display */}
      <div
        className="w-full h-full flex justify-center items-center"
        style={{ aspectRatio: '16 / 9' }}
      >
        <Slide
          slide={presentation.slidesArr[currentSlideIndex]}
          index={currentSlideIndex}
          onEditElement={() => { }}
          onDeleteElement={() => { }}
          onSaveBackground={() => { }}
          presentation={presentation}
          previewMode={true} // Indicate this is a preview
        />
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-0 flex justify-center items-center px-4 bg-white rounded-xl">
        {/* Previous Slide */}
        <button
          onClick={handlePreviousSlide}
          disabled={currentSlideIndex === 0}
          className={`text-black p-2 ${currentSlideIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Slide Number */}
        <span className="text-black text-lg px-2">
          {currentSlideIndex + 1} / {presentation.slidesArr.length}
        </span>

        {/* Next Slide */}
        <button
          onClick={handleNextSlide}
          disabled={currentSlideIndex === presentation.slidesArr.length - 1}
          className={`text-black p-2 ${currentSlideIndex === presentation.slidesArr.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PreviewPresentation;
