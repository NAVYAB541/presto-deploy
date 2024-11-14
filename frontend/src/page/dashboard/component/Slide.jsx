const Slide = ({ slide, index, onEditElement, onDeleteElement }) => {
  return (
    <div className="bg-white w-full h-full flex items-center justify-center border border-gray-300 rounded relative">
      {slide.elements.map((element) => (
        <div
          key={element.id}
          onDoubleClick={() => onEditElement(element)}
          onContextMenu={(e) => {
            e.preventDefault();
            onDeleteElement(element.id);
          }}
          className="absolute"
          style={{
            width: `${element.size.width}%`,
            height: `${element.size.height}%`,
            top: `${element.position.y}%`,
            left: `${element.position.x}%`,
            fontSize: `${element.fontSize}em`,
            color: element.color,
            zIndex: element.layerIndex,
            border: '1px solid lightgrey',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {element.content}
        </div>
      ))}
      <div className="absolute bottom-1 left-0.5 w-12 h-12 flex items-center justify-center text-sm font-semibold text-gray-400 bg-white rounded" style={{ fontSize: '1em' }}>
        {index + 1}
      </div>
    </div>
  );
};

export default Slide;
