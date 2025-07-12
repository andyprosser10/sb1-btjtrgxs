import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Settings, 
  Type, 
  Gauge,
  Clock
} from 'lucide-react';
import { Song, Setlist, Settings as AppSettings } from '../types';

interface SongDisplayProps {
  song: Song;
  setlist?: Setlist;
  songs: Song[];
  settings: AppSettings;
  onBack: () => void;
  onNextSong?: () => void;
  onPrevSong?: () => void;
  onUpdateSong: (song: Song) => void;
  showTimer?: boolean;
}

export default function SongDisplay({ 
  song, 
  setlist, 
  songs, 
  settings, 
  onBack, 
  onNextSong, 
  onPrevSong, 
  onUpdateSong,
  showTimer = false
}: SongDisplayProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [localFontSize, setLocalFontSize] = useState(song.fontSize);
  const [localScrollSpeed, setLocalScrollSpeed] = useState(song.scrollSpeed);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const scrollIntervalRef = useRef<NodeJS.Timeout>();
  const timerIntervalRef = useRef<NodeJS.Timeout>();
  const lyricsRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Timer effect for setlist playback
  useEffect(() => {
    if (showTimer && setlist) {
      // Start timer when component mounts with timer enabled
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      // Clear timer if not showing or not in setlist
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setElapsedTime(0);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [showTimer, setlist]);

  // Reset timer when song changes
  useEffect(() => {
    if (showTimer && setlist) {
      setElapsedTime(0);
    }
  }, [song.id, showTimer, setlist]);
  // Update progress when scrolling
  useEffect(() => {
    const updateProgress = () => {
      if (lyricsRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = lyricsRef.current;
        const maxScroll = scrollHeight - clientHeight;
        const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    const lyricsElement = lyricsRef.current;
    if (lyricsElement) {
      lyricsElement.addEventListener('scroll', updateProgress);
      updateProgress(); // Initial calculation
      
      return () => {
        lyricsElement.removeEventListener('scroll', updateProgress);
      };
    }
  }, []);
  useEffect(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (!isScrolling) {
      setShowControls(true);
    } else {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isScrolling]);

  const toggleScrolling = () => {
    if (isScrolling) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      setIsScrolling(false);
    } else {
      setIsScrolling(true);
      scrollIntervalRef.current = setInterval(() => {
        if (lyricsRef.current) {
          lyricsRef.current.scrollTop += 1;
        }
      }, 1000 / localScrollSpeed);
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    setLocalFontSize(newSize);
    onUpdateSong({ ...song, fontSize: newSize });
  };

  const handleScrollSpeedChange = (newSpeed: number) => {
    setLocalScrollSpeed(newSpeed);
    onUpdateSong({ ...song, scrollSpeed: newSpeed });
    
    if (isScrolling && scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = setInterval(() => {
        if (lyricsRef.current) {
          lyricsRef.current.scrollTop += 1;
        }
      }, 1000 / newSpeed);
    }
  };

  const formatLyrics = (lyrics: string) => {
    return lyrics.split('\n').map((line, index) => {
      // Handle bold formatting
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Check if line contains capitalized shortcuts (all caps words)
      const hasCapitalizedShortcut = /\*\*[A-Z][A-Z0-9\s-]*\*\*/.test(line);
      
      return (
        <div
          key={index}
          className={`leading-tight ${hasCapitalizedShortcut ? 'mt-6 mb-2' : 'mb-1'}`}
          style={{ lineHeight: '1.2' }}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSongIndex = setlist ? setlist.songIds.indexOf(song.id) : -1;
  const canGoNext = setlist && currentSongIndex < setlist.songIds.length - 1;
  const canGoPrev = setlist && currentSongIndex > 0;

  return (
    <div 
      className="h-screen flex flex-col"
      style={{ 
        backgroundColor: settings.backgroundColor,
        color: settings.fontColor 
      }}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 z-50"
        style={{ backgroundColor: `${settings.fontColor}20` }}
      >
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${scrollProgress}%`,
            backgroundColor: settings.fontColor,
            opacity: 0.8
          }}
        />
      </div>

      {/* Timer Display */}
      {showTimer && setlist && (
        <div 
          className="fixed top-6 right-6 z-40 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ 
            backgroundColor: `${settings.fontColor}05`,
            color: settings.fontColor,
            opacity: 0.3
          }}
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
        </div>
      )}

      {/* Header Controls */}
      <div 
        className={`p-4 border-b transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ borderColor: `${settings.fontColor}20` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: `${settings.fontColor}10`,
                color: settings.fontColor 
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{song.name}</h1>
              <p className="opacity-70">by {song.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Font Size Control */}
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <input
                type="range"
                min="12"
                max="48"
                value={localFontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-sm w-8">{localFontSize}</span>
            </div>

            {/* Scroll Speed Control */}
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <input
                type="range"
                min="10"
                max="200"
                value={localScrollSpeed}
                onChange={(e) => handleScrollSpeedChange(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-sm w-12">{localScrollSpeed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lyrics Display */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={lyricsRef}
          className="h-full overflow-y-auto p-8 pb-32"
          style={{ fontSize: `${localFontSize}px` }}
        >
          <div className="max-w-4xl mx-auto">
            {formatLyrics(song.lyrics)}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ 
          background: `linear-gradient(transparent, ${settings.backgroundColor}90, ${settings.backgroundColor})` 
        }}
      >
        <div className="flex items-center justify-center gap-4">
          {canGoPrev && (
            <button
              onClick={onPrevSong}
              className="p-3 rounded-full transition-colors"
              style={{ 
                backgroundColor: `${settings.fontColor}10`,
                color: settings.fontColor 
              }}
            >
              <SkipBack className="w-6 h-6" />
            </button>
          )}

          <button
            onClick={toggleScrolling}
            className="p-4 rounded-full transition-colors"
            style={{ 
              backgroundColor: isScrolling ? '#10B981' : `${settings.fontColor}10`,
              color: isScrolling ? 'white' : settings.fontColor 
            }}
          >
            {isScrolling ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>

          {canGoNext && (
            <button
              onClick={onNextSong}
              className="p-3 rounded-full transition-colors"
              style={{ 
                backgroundColor: `${settings.fontColor}10`,
                color: settings.fontColor 
              }}
            >
              <SkipForward className="w-6 h-6" />
            </button>
          )}
        </div>

        {setlist && (
          <div className="text-center mt-4 opacity-70">
            <p className="text-sm">
              {setlist.name} • Song {currentSongIndex + 1} of {setlist.songIds.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}