import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Settings as AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onBack: () => void;
}

const COLOR_PRESETS = [
  { name: 'Dark Mode', bg: '#1f2937', text: '#f9fafb' },
  { name: 'Light Mode', bg: '#ffffff', text: '#111827' },
  { name: 'Stage Green', bg: '#064e3b', text: '#6ee7b7' },
  { name: 'Warm Night', bg: '#422006', text: '#fcd34d' },
  { name: 'Ocean Blue', bg: '#0c4a6e', text: '#93c5fd' },
  { name: 'Purple Haze', bg: '#581c87', text: '#d8b4fe' }
];

export default function Settings({ settings, onUpdateSettings, onBack }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onBack();
  };

  const applyColorPreset = (bg: string, text: string) => {
    setLocalSettings({
      ...localSettings,
      backgroundColor: bg,
      fontColor: text
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Display Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Display Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Font Size
              </label>
              <input
                type="number"
                min="12"
                max="48"
                value={localSettings.defaultFontSize}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  defaultFontSize: parseInt(e.target.value)
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-600 mt-1">Used for new songs (12-48px)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Scroll Speed
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={localSettings.defaultScrollSpeed}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  defaultScrollSpeed: parseInt(e.target.value)
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-600 mt-1">Pixels per second (10-200)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={localSettings.backgroundColor}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  backgroundColor: e.target.value
                })}
                className="w-full h-12 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Color
              </label>
              <input
                type="color"
                value={localSettings.fontColor}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  fontColor: e.target.value
                })}
                className="w-full h-12 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyColorPreset(preset.bg, preset.text)}
                    className="p-3 rounded-lg border text-sm font-medium transition-transform hover:scale-105"
                    style={{ 
                      backgroundColor: preset.bg, 
                      color: preset.text,
                      borderColor: preset.text + '30'
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Autoplay Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Autoplay Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localSettings.autoplayEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    autoplayEnabled: e.target.checked
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable Autoplay in Setlists
                </span>
              </label>
              <p className="text-sm text-gray-600 mt-2 ml-7">
                Automatically advance to the next song when the current song ends
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localSettings.showTimerInSetlists}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    showTimerInSetlists: e.target.checked
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show Timer in Setlists
                </span>
              </label>
              <p className="text-sm text-gray-600 mt-2 ml-7">
                Display elapsed time during setlist playback
              </p>
            </div>

            {localSettings.autoplayEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autoplay Delay (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.autoplayDelay}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    autoplayDelay: parseInt(e.target.value)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Time to wait before advancing to next song
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Preview</h3>
            <div
              className="p-6 rounded-lg border-2"
              style={{ 
                backgroundColor: localSettings.backgroundColor,
                color: localSettings.fontColor,
                fontSize: `${localSettings.defaultFontSize}px`
              }}
            >
              <div className="font-bold mb-2">Sample Song Title</div>
              <div className="opacity-80 text-sm mb-4">by Sample Artist</div>
              <div>
                <strong>VERSE 1</strong><br />
                This is how your lyrics will appear<br />
                With the current settings applied<br />
                <strong>Key: C</strong> <strong>Tempo: 120 BPM</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}