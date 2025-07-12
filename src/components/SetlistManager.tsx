import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Play, GripVertical, X } from 'lucide-react';
import { Setlist, Song } from '../types';

interface SetlistManagerProps {
  setlists: Setlist[];
  songs: Song[];
  onCreateSetlist: (name: string, songIds: string[]) => void;
  onUpdateSetlist: (setlist: Setlist) => void;
  onDeleteSetlist: (id: string) => void;
  onPlaySetlist: (id: string) => void;
}

export default function SetlistManager({ 
  setlists, 
  songs, 
  onCreateSetlist, 
  onUpdateSetlist, 
  onDeleteSetlist, 
  onPlaySetlist 
}: SetlistManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingSetlist, setEditingSetlist] = useState<Setlist | null>(null);
  const [newSetlistName, setNewSetlistName] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const filteredSetlists = setlists.filter(setlist =>
    setlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditor = (setlist?: Setlist) => {
    if (setlist) {
      setEditingSetlist(setlist);
      setNewSetlistName(setlist.name);
      setSelectedSongs([...setlist.songIds]);
    } else {
      setEditingSetlist(null);
      setNewSetlistName('');
      setSelectedSongs([]);
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingSetlist(null);
    setNewSetlistName('');
    setSelectedSongs([]);
  };

  const handleSave = () => {
    if (newSetlistName.trim()) {
      if (editingSetlist) {
        onUpdateSetlist({
          ...editingSetlist,
          name: newSetlistName,
          songIds: selectedSongs,
          updatedAt: new Date()
        });
      } else {
        onCreateSetlist(newSetlistName, selectedSongs);
      }
      closeEditor();
    }
  };

  const toggleSong = (songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const reorderSongs = (fromIndex: number, toIndex: number) => {
    const newOrder = [...selectedSongs];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    setSelectedSongs(newOrder);
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      reorderSongs(draggedItem, index);
      setDraggedItem(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getSongById = (id: string) => songs.find(song => song.id === id);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Setlists</h1>
        <button
          onClick={() => openEditor()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Setlist
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search setlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredSetlists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {setlists.length === 0 ? (
              <div>
                <h3 className="text-xl font-semibold mb-2">No setlists yet</h3>
                <p>Create your first setlist to organize songs for performances!</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-2">No setlists found</h3>
                <p>Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSetlists.map((setlist) => (
            <div key={setlist.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{setlist.name}</h3>
                <p className="text-gray-600 mb-4">{setlist.songIds.length} songs</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => onPlaySetlist(setlist.id)}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    disabled={setlist.songIds.length === 0}
                  >
                    <Play className="w-4 h-4" />
                    Play
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditor(setlist)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSetlist(setlist.id)}
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

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingSetlist ? 'Edit Setlist' : 'Create New Setlist'}
              </h2>
              <button
                onClick={closeEditor}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setlist Name
                </label>
                <input
                  type="text"
                  value={newSetlistName}
                  onChange={(e) => setNewSetlistName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter setlist name"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Available Songs</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
                    {songs.map(song => (
                      <div
                        key={song.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSongs.includes(song.id)
                            ? 'bg-blue-100 border-blue-300'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleSong(song.id)}
                      >
                        <div className="font-medium">{song.name}</div>
                        <div className="text-sm text-gray-600">by {song.author}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Setlist Songs ({selectedSongs.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
                    {selectedSongs.map((songId, index) => {
                      const song = getSongById(songId);
                      if (!song) return null;
                      
                      return (
                        <div
                          key={`${songId}-${index}`}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`p-3 rounded-lg border bg-white cursor-move transition-opacity ${
                            draggedItem === index ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <div className="flex-1">
                              <div className="font-medium">{song.name}</div>
                              <div className="text-sm text-gray-600">by {song.author}</div>
                            </div>
                            <span className="text-sm text-gray-500">#{index + 1}</span>
                          </div>
                        </div>
                      );
                    })}
                    {selectedSongs.length === 0 && (
                      <div className="text-gray-400 text-center py-8">
                        No songs selected. Click songs from the left to add them.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t mt-6">
                <button
                  onClick={closeEditor}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!newSetlistName.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingSetlist ? 'Update Setlist' : 'Create Setlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}