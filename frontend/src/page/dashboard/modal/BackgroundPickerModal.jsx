import { useState } from 'react';

const BackgroundPickerModal = ({ onSave, onClose, currentBackground, defaultBackground }) => {
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  // Separate states for current slide and default background settings
  const [currentBackgroundSettings, setCurrentBackgroundSettings] = useState({
    type: currentBackground?.type || 'solid',
    color: currentBackground?.color || '#ffffff',
    gradient: currentBackground?.gradient || { start: '#ffffff', end: '#000000', direction: 'to right' },
    image: currentBackground?.image || '',
  });

  const [defaultBackgroundSettings, setDefaultBackgroundSettings] = useState({
    type: defaultBackground?.type || 'solid',
    color: defaultBackground?.color || '#ffffff',
    gradient: defaultBackground?.gradient || { start: '#ffffff', end: '#000000', direction: 'to right' },
    image: defaultBackground?.image || '',
  });

  // Flags to track if changes were made to each background setting
  const [currentChanged, setCurrentChanged] = useState(false);
  const [defaultChanged, setDefaultChanged] = useState(false);

  // Choose which settings to display based on mode
  const activeSettings = isSettingDefault ? defaultBackgroundSettings : currentBackgroundSettings;

  const handleSwitchBackground = (isDefault) => {
    setIsSettingDefault(isDefault);
  };

  const handleSave = () => {
    const backgroundsToSave = {};

    // Only include the background settings that were changed
    if (currentChanged) {
      backgroundsToSave.currentBackground = {
        type: currentBackgroundSettings.type,
        ...(currentBackgroundSettings.type === 'solid' && { color: currentBackgroundSettings.color }),
        ...(currentBackgroundSettings.type === 'gradient' && { gradient: currentBackgroundSettings.gradient }),
        ...(currentBackgroundSettings.type === 'image' && { image: currentBackgroundSettings.image }),
      };
    }

    if (defaultChanged) {
      backgroundsToSave.defaultBackground = {
        type: defaultBackgroundSettings.type,
        ...(defaultBackgroundSettings.type === 'solid' && { color: defaultBackgroundSettings.color }),
        ...(defaultBackgroundSettings.type === 'gradient' && { gradient: defaultBackgroundSettings.gradient }),
        ...(defaultBackgroundSettings.type === 'image' && { image: defaultBackgroundSettings.image }),
      };
    }

    onSave(backgroundsToSave);
    onClose();
  };

  const handleBackgroundTypeChange = (type) => {
    const updateSettings = isSettingDefault ? setDefaultBackgroundSettings : setCurrentBackgroundSettings;
    const setChangedFlag = isSettingDefault ? setDefaultChanged : setCurrentChanged;

    updateSettings((prevSettings) => ({
      ...prevSettings,
      type,
    }));
    setChangedFlag(true);
  };

  const handleColorChange = (color) => {
    const updateSettings = isSettingDefault ? setDefaultBackgroundSettings : setCurrentBackgroundSettings;
    const setChangedFlag = isSettingDefault ? setDefaultChanged : setCurrentChanged;

    updateSettings((prevSettings) => ({
      ...prevSettings,
      color,
    }));
    setChangedFlag(true);
  };

  const handleGradientChange = (gradient) => {
    const updateSettings = isSettingDefault ? setDefaultBackgroundSettings : setCurrentBackgroundSettings;
    const setChangedFlag = isSettingDefault ? setDefaultChanged : setCurrentChanged;

    updateSettings((prevSettings) => ({
      ...prevSettings,
      gradient,
    }));
    setChangedFlag(true);
  };

  const handleImageChange = (image) => {
    const updateSettings = isSettingDefault ? setDefaultBackgroundSettings : setCurrentBackgroundSettings;
    const setChangedFlag = isSettingDefault ? setDefaultChanged : setCurrentChanged;

    updateSettings((prevSettings) => ({
      ...prevSettings,
      image,
    }));
    setChangedFlag(true);
  };

  // Preview style based on active settings
  const previewStyle = {
    ...(isSettingDefault
      ? defaultBackgroundSettings.type === 'solid' && { backgroundColor: defaultBackgroundSettings.color }
      : currentBackgroundSettings.type === 'solid' && { backgroundColor: currentBackgroundSettings.color }
    ),
    ...(isSettingDefault
      ? defaultBackgroundSettings.type === 'gradient' && {
        background: `linear-gradient(${defaultBackgroundSettings.gradient.direction}, ${defaultBackgroundSettings.gradient.start}, ${defaultBackgroundSettings.gradient.end})`
      }
      : currentBackgroundSettings.type === 'gradient' && {
        background: `linear-gradient(${currentBackgroundSettings.gradient.direction}, ${currentBackgroundSettings.gradient.start}, ${currentBackgroundSettings.gradient.end})`
      }
    ),
    ...(isSettingDefault
      ? defaultBackgroundSettings.type === 'image' && {
        backgroundImage: `url(${defaultBackgroundSettings.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
      : currentBackgroundSettings.type === 'image' && {
        backgroundImage: `url(${currentBackgroundSettings.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    ),
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 10000 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">Select Background</h3>

        {/* Switch between current and default background */}
        <div className="flex mb-4">
          <button
            onClick={() => handleSwitchBackground(false)}
            className={`flex-1 px-4 py-2 rounded-l-lg ${!isSettingDefault ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Current
          </button>
          <button
            onClick={() => handleSwitchBackground(true)}
            className={`flex-1 px-4 py-2 rounded-r-lg ${isSettingDefault ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Default
          </button>
        </div>

        {/* Background Type Selection */}
        <label className="block mb-2 font-semibold">Background Type</label>
        <select
          value={activeSettings.type}
          onChange={(e) => handleBackgroundTypeChange(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="solid">Solid Color</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
        </select>

        {/* Background Options */}
        {activeSettings.type === 'solid' && (
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Color</label>
            <input
              type="color"
              value={activeSettings.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full"
            />
          </div>
        )}

        {activeSettings.type === 'gradient' && (
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Gradient Colors</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block mb-1 text-sm">Start Color</label>
                <input
                  type="color"
                  value={activeSettings.gradient.start}
                  onChange={(e) => handleGradientChange({ ...activeSettings.gradient, start: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm">End Color</label>
                <input
                  type="color"
                  value={activeSettings.gradient.end}
                  onChange={(e) => handleGradientChange({ ...activeSettings.gradient, end: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
            <label className="block mt-2 mb-1 font-semibold">Direction</label>
            <select
              value={activeSettings.gradient.direction}
              onChange={(e) => handleGradientChange({ ...activeSettings.gradient, direction: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="to right">Left to Right</option>
              <option value="to bottom">Top to Bottom</option>
              <option value="to top right">Top Left to Bottom Right</option>
            </select>
          </div>
        )}

        {activeSettings.type === 'image' && (
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Image URL</label>
            <input
              type="text"
              placeholder="Enter image URL"
              value={activeSettings.image}
              onChange={(e) => handleImageChange(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {/* Background Preview */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Background Preview</label>
          <div
            className="w-full h-20 rounded border"
            style={previewStyle}
          />
        </div>

        {/* Save and Cancel Buttons */}
        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default BackgroundPickerModal;
