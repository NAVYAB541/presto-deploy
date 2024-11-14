import YouTube from 'react-youtube';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import c from 'highlight.js/lib/languages/c';

// Register languages in highlight.js
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('c', c);

const Slide = ({ slide, index, onEditElement, onDeleteElement }) => {
  return (
    <div className="bg-white w-full h-full flex items-center justify-center border border-gray-300 rounded relative">
      {slide.elements.map((element) => (
        element.type === 'text' ? (
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
              fontFamily: element.fontFamily,
              zIndex: element.layerIndex,
              border: '1px solid lightgrey',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {element.content}
          </div>
        ) : element.type === 'image' ? (
          <img
            key={element.id}
            src={element.src}
            alt={element.alt}
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
              zIndex: element.layerIndex,
            }}
          />
        ) : element.type === 'video' ? (
          <div
            key={element.id}
            onDoubleClick={() => onEditElement(element)}
            onContextMenu={(e) => {
              e.preventDefault();
              onDeleteElement(element.id);
            }}
            className="absolute flex items-center justify-center"
            style={{
              width: `${element.size.width}%`,
              height: `${element.size.height}%`,
              top: `${element.position.y}%`,
              left: `${element.position.x}%`,
              zIndex: element.layerIndex,
              border: '0.3em solid lightgrey'
            }}
          >
            <YouTube
              videoId={element.videoId}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: element.autoplay ? 1 : 0,
                },
              }}
              className="w-full h-full"
            />
          </div>
        ) : element.type === 'code' ? (
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
              zIndex: element.layerIndex,
              overflow: 'auto',
              fontSize: `${element.fontSize}em`,
              border: '1px solid lightgrey',
              backgroundColor: '#1e1e1e',
              color: 'white',
              padding: '5px',
            }}
          >
            <SyntaxHighlighter language={hljs.highlightAuto(element.content).language} style={vs2015}>
              {element.content}
            </SyntaxHighlighter>
          </div>
        ) : null  // Default case to handle other element types
      ))}
      <div className="absolute bottom-1 left-0.5 w-12 h-12 flex items-center justify-center text-sm font-semibold text-gray-400 bg-white rounded" style={{ fontSize: '1em' }}>
        {index + 1}
      </div>
    </div>
  );
};

export default Slide;
