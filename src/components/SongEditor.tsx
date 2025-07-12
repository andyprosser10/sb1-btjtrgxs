import React, { useState } from 'react';
import { X, Save, Type, Gauge } from 'lucide-react';
import { Song } from '../types';

interface SongEditorProps {
  song?: Song;
  onSave: (song: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  defaultFontSize: number;
  defaultScrollSpeed: number;
}

const SHORTCUTS = [
  'Key:', 'Tempo:', 'Tuning:', 'Capo:', 'Song Introduction:',
  'VERSE1', 'VERSE2', 'VERSE3', 'VERSE4', 'VERSE5', 'VERSE6',
  'CHORUS', 'PRE-CHORUS', 'BRIDGE', 'INTRO', 'OUTRO'
];

export default function SongEditor({ song, onSave, onClose, defaultFontSize, defaultScrollSpeed }: SongEditorProps) {
  const [formData, setFormData] = useState({
    name: song?.name || '',
    author: song?.author || '',
    lyrics: song?.lyrics || '',
    fontSize: song?.fontSize || defaultFontSize,
    scrollSpeed: song?.scrollSpeed || defaultScrollSpeed
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.author.trim()) {
      onSave(formData);
    }
  };

  const insertShortcut = (shortcut: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newLyrics = formData.lyrics.substring(0, start) + 
                       `**${shortcut}**\n` + 
                       formData.lyrics.substring(end);
      setFormData({ ...formData, lyrics: newLyrics });
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + shortcut.length + 5, start + shortcut.length + 5);
      }, 0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {song ? 'Edit Song' : 'Add New Song'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Song Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter song name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author/Artist
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter author/artist name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4 inline mr-1" />
                Font Size
              </label>
              <input
                type="number"
                min="12"
                max="48"
                value={formData.fontSize}
                onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Gauge className="w-4 h-4 inline mr-1" />
                Scroll Speed (px/s)
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={formData.scrollSpeed}
                onChange={(e) => setFormData({ ...formData, scrollSpeed: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Shortcuts
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {SHORTCUTS.map((shortcut) => (
                <button
                  key={shortcut}
                  type="button"
                  onClick={() => insertShortcut(shortcut)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {shortcut}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lyrics
            </label>
            <textarea
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="Enter song lyrics... Use **text** for bold formatting"
            />
            <p className="text-sm text-gray-600 mt-2">
              Tip: Use **text** to make text bold (e.g., **CHORUS**, **Key: C**)
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Song
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}