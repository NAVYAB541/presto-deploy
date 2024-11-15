import { useState } from 'react';
import YouTube from 'react-youtube';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import c from 'highlight.js/lib/languages/c';
import BackgroundPickerModal from '../modal/BackgroundPickerModal';

// Register languages in highlight.js
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('c', c);

const Slide = ({ slide, index, onEditElement, onDeleteElement, onSaveBackground, presentation, previewMode }) => {
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  return (
    <div className="bg-white w-full h-full flex items-center justify-center border border-gray-300 rounded relative"
      style={{
        backgroundColor: slide.background?.type === 'solid' ? slide.background.color : 'transparent',
        backgroundImage: slide.background?.type === 'gradient'
          ? `linear-gradient(${slide.background.gradient.direction}, ${slide.background.gradient.start}, ${slide.background.gradient.end})`
          : slide.background?.type === 'image'
            ? `url(${slide.background.image})`
            : 'none',
        backgroundSize: 'cover',
        border: previewMode ? 'none' : '1px solid lightgrey',
      }}
    >
      {/* Conditionally render the Background Picker Button */}
      {!previewMode && (
        <button
          onClick={() => setShowBackgroundModal(true)}
          className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded flex items-center space-x-2"
        >
          <svg className="h-5 w-5 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="11" y1="7" x2="17" y2="13" />
            <path d="M5 19v-4l9.7 -9.7a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4l-9.7 9.7h-4" />
          </svg>
          <span>Fill</span>
        </button>
      )};

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
      {/* Slide Number Indicator */}
      <div className="absolute bottom-1 left-0.5 w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-600 rounded bg-white" style={{ fontSize: '1em' }}>
        {index + 1}
      </div>

      {/* Background Picker Modal */}
      {showBackgroundModal && (
        <BackgroundPickerModal
          onSave={(backgroundsToSave) => {
            onSaveBackground(backgroundsToSave); // Use the handler to save backgrounds
            setShowBackgroundModal(false);
          }}
          onClose={() => setShowBackgroundModal(false)}
          currentBackground={slide.background}
          defaultBackground={slide.useDefaultBackground ? presentation.defaultBackground : undefined}
        />
      )}
    </div>
  );
};

export default Slide;
