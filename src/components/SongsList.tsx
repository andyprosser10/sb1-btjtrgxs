import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Play } from 'lucide-react';
import { Song } from '../types';

interface SongsListProps {
  songs: Song[];
  onEditSong: (song: Song) => void;
  onDeleteSong: (id: string) => void;
  onPlaySong: (id: string) => void;
  onAddSong: () => void;
}

export default function SongsList({ songs, onEditSong, onDeleteSong, onPlaySong, onAddSong }: SongsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSongs = songs.filter(song =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Song Library</h1>
        <button
          onClick={onAddSong}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Song
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredSongs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {songs.length === 0 ? (
              <div>
                <h3 className="text-xl font-semibold mb-2">No songs yet</h3>
                <p>Start building your song library by adding your first song!</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-2">No songs found</h3>
                <p>Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSongs.map((song) => (
            <div key={song.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{song.name}</h3>
                <p className="text-gray-600 mb-3">by {song.author}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <span>Font: {song.fontSize}px</span>
                  <span className="ml-4">Speed: {song.scrollSpeed}px/s</span>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => onPlaySong(song.id)}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Play
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditSong(song)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSong(song.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}