import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import SongsList from './components/SongsList';
import SongEditor from './components/SongEditor';
import SetlistManager from './components/SetlistManager';
import SongDisplay from './components/SongDisplay';
import Settings from './components/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Song, Setlist, Settings as AppSettings, AppState } from './types';

const DEFAULT_SETTINGS: AppSettings = {
  defaultFontSize: 18,
  defaultScrollSpeed: 50,
  backgroundColor: '#1f2937',
  fontColor: '#f9fafb',
  autoplayEnabled: false,
  autoplayDelay: 3,
  showTimerInSetlists: false
};

function App() {
  const [songs, setSongs] = useLocalStorage<Song[]>('songs', []);
  const [setlists, setSetlists] = useLocalStorage<Setlist[]>('setlists', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('settings', DEFAULT_SETTINGS);
  
  const [currentView, setCurrentView] = useState<AppState['currentView']>('songs');
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [currentSetlist, setCurrentSetlist] = useState<string | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [showSongEditor, setShowSongEditor] = useState(false);
  const [isAutoplayActive, setIsAutoplayActive] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  // Auto-advance to next song when autoplay is enabled
  useEffect(() => {
    if (!settings.autoplayEnabled || !isAutoplayActive || !currentSetlist || !currentSong) {
      return;
    }

    const setlist = setlists.find(s => s.id === currentSetlist);
    if (!setlist) return;

    const currentIndex = setlist.songIds.indexOf(currentSong);
    const isLastSong = currentIndex === setlist.songIds.length - 1;

    if (isLastSong) {
      setIsAutoplayActive(false);
      return;
    }

    const timer = setTimeout(() => {
      const nextSongId = setlist.songIds[currentIndex + 1];
      setCurrentSong(nextSongId);
    }, settings.autoplayDelay * 1000);

    return () => clearTimeout(timer);
  }, [currentSong, currentSetlist, settings.autoplayEnabled, settings.autoplayDelay, isAutoplayActive, setlists]);

  // Song management
  const handleAddSong = () => {
    setEditingSong(null);
    setShowSongEditor(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowSongEditor(true);
  };

  const handleSaveSong = (songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingSong) {
      // Update existing song
      setSongs(songs.map(song => 
        song.id === editingSong.id 
          ? { ...songData, id: editingSong.id, createdAt: editingSong.createdAt, updatedAt: now }
          : song
      ));
    } else {
      // Create new song
      const newSong: Song = {
        ...songData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      setSongs([...songs, newSong]);
    }
    
    setShowSongEditor(false);
    setEditingSong(null);
  };

  const handleDeleteSong = (id: string) => {
    if (confirm('Are you sure you want to delete this song?')) {
      setSongs(songs.filter(song => song.id !== id));
      // Remove from setlists
      setSetlists(setlists.map(setlist => ({
        ...setlist,
        songIds: setlist.songIds.filter(songId => songId !== id)
      })));
    }
  };

  const handlePlaySong = (id: string) => {
    setCurrentSong(id);
    setCurrentSetlist(null);
    setCurrentView('song-display');
    setIsAutoplayActive(false);
  };

  const handleUpdateSong = (updatedSong: Song) => {
    setSongs(songs.map(song => 
      song.id === updatedSong.id ? updatedSong : song
    ));
  };

  // Setlist management
  const handleCreateSetlist = (name: string, songIds: string[]) => {
    const now = new Date();
    const newSetlist: Setlist = {
      id: Date.now().toString(),
      name,
      songIds,
      createdAt: now,
      updatedAt: now
    };
    setSetlists([...setlists, newSetlist]);
  };

  const handleUpdateSetlist = (updatedSetlist: Setlist) => {
    setSetlists(setlists.map(setlist => 
      setlist.id === updatedSetlist.id ? updatedSetlist : setlist
    ));
  };

  const handleDeleteSetlist = (id: string) => {
    if (confirm('Are you sure you want to delete this setlist?')) {
      setSetlists(setlists.filter(setlist => setlist.id !== id));
    }
  };

  const handlePlaySetlist = (id: string) => {
    const setlist = setlists.find(s => s.id === id);
    if (setlist && setlist.songIds.length > 0) {
      setShowTimer(settings.showTimerInSetlists);
      setCurrentSetlist(id);
      setCurrentSong(setlist.songIds[0]);
      setCurrentView('song-display');
      setIsAutoplayActive(settings.autoplayEnabled);
    }
  };

  // Navigation within setlists
  const handleNextSong = () => {
    if (!currentSetlist) return;
    
    const setlist = setlists.find(s => s.id === currentSetlist);
    if (!setlist) return;
    
    const currentIndex = setlist.songIds.indexOf(currentSong!);
    if (currentIndex < setlist.songIds.length - 1) {
      setCurrentSong(setlist.songIds[currentIndex + 1]);
    }
  };

  const handlePrevSong = () => {
    if (!currentSetlist) return;
    
    const setlist = setlists.find(s => s.id === currentSetlist);
    if (!setlist) return;
    
    const currentIndex = setlist.songIds.indexOf(currentSong!);
    if (currentIndex > 0) {
      setCurrentSong(setlist.songIds[currentIndex - 1]);
    }
  };

  const handleBackToLibrary = () => {
    setCurrentView(currentSetlist ? 'setlists' : 'songs');
    setCurrentSong(null);
    setCurrentSetlist(null);
    setIsAutoplayActive(false);
    setShowTimer(false);
  };

  // Get current song and setlist objects
  const getCurrentSong = () => songs.find(song => song.id === currentSong);
  const getCurrentSetlist = () => setlists.find(setlist => setlist.id === currentSetlist);

  const currentSongObj = getCurrentSong();
  const currentSetlistObj = getCurrentSetlist();

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'songs':
        return (
          <SongsList
            songs={songs}
            onEditSong={handleEditSong}
            onDeleteSong={handleDeleteSong}
            onPlaySong={handlePlaySong}
            onAddSong={handleAddSong}
          />
        );
      
      case 'setlists':
        return (
          <SetlistManager
            setlists={setlists}
            songs={songs}
            onCreateSetlist={handleCreateSetlist}
            onUpdateSetlist={handleUpdateSetlist}
            onDeleteSetlist={handleDeleteSetlist}
            onPlaySetlist={handlePlaySetlist}
          />
        );
      
      case 'settings':
        return (
          <Settings
            settings={settings}
            onUpdateSettings={setSettings}
            onBack={() => setCurrentView('songs')}
          />
        );
      
      case 'song-display':
        return currentSongObj ? (
          <SongDisplay
            song={currentSongObj}
            setlist={currentSetlistObj}
            songs={songs}
            settings={settings}
            onBack={handleBackToLibrary}
            onNextSong={handleNextSong}
            onPrevSong={handlePrevSong}
            onUpdateSong={handleUpdateSong}
            showTimer={showTimer}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {currentView !== 'song-display' && (
        <Navigation
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      )}
      
      <main className={currentView === 'song-display' ? '' : 'container mx-auto'}>
        {renderCurrentView()}
      </main>

      {showSongEditor && (
        <SongEditor
          song={editingSong || undefined}
          onSave={handleSaveSong}
          onClose={() => {
            setShowSongEditor(false);
            setEditingSong(null);
          }}
          defaultFontSize={settings.defaultFontSize}
          defaultScrollSpeed={settings.defaultScrollSpeed}
        />
      )}
    </div>
  );
}

export default App;