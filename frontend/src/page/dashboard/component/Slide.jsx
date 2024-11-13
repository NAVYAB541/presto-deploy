const Slide = ({ slide, index }) => {
  return (
    <div className="bg-white w-full h-full flex items-center justify-center border border-gray-300 rounded relative">
      {/* Placeholder for slide content */}
      Slide {slide.position}

      {/* Slide number overlay at bottom left */}
      <div className="absolute bottom-1 left-0.5 w-12 h-12 flex items-center justify-center text-sm font-semibold text-gray-400 bg-white rounded" style={{ fontSize: '1em' }}>
        {index + 1}
      </div>
    </div>
  );
};

export default Slide;
