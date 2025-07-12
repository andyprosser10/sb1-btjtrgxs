import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

const { width, height } = Dimensions.get('window');

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
  const [showSettings, setShowSettings] = useState(false);
  
  const scrollIntervalRef = useRef<NodeJS.Timeout>();
  const timerIntervalRef = useRef<NodeJS.Timeout>();
  const scrollViewRef = useRef<ScrollView>(null);
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
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
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

  // Auto-hide controls
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
        scrollViewRef.current?.scrollTo({
          y: scrollProgress + 1,
          animated: false
        });
      }, 1000 / localScrollSpeed);
    }
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(48, localFontSize + delta));
    setLocalFontSize(newSize);
    onUpdateSong({ ...song, fontSize: newSize });
  };

  const handleScrollSpeedChange = (delta: number) => {
    const newSpeed = Math.max(10, Math.min(200, localScrollSpeed + delta));
    setLocalScrollSpeed(newSpeed);
    onUpdateSong({ ...song, scrollSpeed: newSpeed });
    
    if (isScrolling && scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = setInterval(() => {
        scrollViewRef.current?.scrollTo({
          y: scrollProgress + 1,
          animated: false
        });
      }, 1000 / newSpeed);
    }
  };

  const formatLyrics = (lyrics: string) => {
    return lyrics.split('\n').map((line, index) => {
      // Handle bold formatting
      const parts = line.split(/(\*\*.*?\*\*)/);
      const formattedParts = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const text = part.slice(2, -2);
          return (
            <Text key={partIndex} style={styles.boldText}>
              {text}
            </Text>
          );
        }
        return part;
      });
      
      // Check if line contains capitalized shortcuts (all caps words)
      const hasCapitalizedShortcut = /\*\*[A-Z][A-Z0-9\s-]*\*\*/.test(line);
      
      return (
        <Text
          key={index}
          style={[
            styles.lyricsLine,
            { 
              marginTop: hasCapitalizedShortcut ? 24 : 0,
              marginBottom: hasCapitalizedShortcut ? 8 : 4
            }
          ]}
        >
          {formattedParts}
        </Text>
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
    <View 
      style={[
        styles.container,
        { backgroundColor: settings.backgroundColor }
      ]}
    >
      <StatusBar hidden />
      
      {/* Progress Bar */}
      <View style={[styles.progressBar, { backgroundColor: settings.fontColor + '20' }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${scrollProgress}%`,
              backgroundColor: settings.fontColor
            }
          ]}
        />
      </View>

      {/* Timer Display */}
      {showTimer && setlist && (
        <View style={[styles.timer, { backgroundColor: settings.fontColor + '10' }]}>
          <Ionicons name="time" size={16} color={settings.fontColor} />
          <Text style={[styles.timerText, { color: settings.fontColor }]}>
            {formatTime(elapsedTime)}
          </Text>
        </View>
      )}

      {/* Header Controls */}
      {showControls && (
        <SafeAreaView style={styles.headerContainer}>
          <View style={[styles.header, { borderBottomColor: settings.fontColor + '20' }]}>
            <TouchableOpacity
              onPress={onBack}
              style={[styles.controlButton, { backgroundColor: settings.fontColor + '10' }]}
            >
              <Ionicons name="arrow-back" size={24} color={settings.fontColor} />
            </TouchableOpacity>
            
            <View style={styles.songInfo}>
              <Text style={[styles.songTitle, { color: settings.fontColor }]}>
                {song.name}
              </Text>
              <Text style={[styles.songAuthor, { color: settings.fontColor + 'B3' }]}>
                by {song.author}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowSettings(!showSettings)}
              style={[styles.controlButton, { backgroundColor: settings.fontColor + '10' }]}
            >
              <Ionicons name="settings" size={24} color={settings.fontColor} />
            </TouchableOpacity>
          </View>

          {/* Settings Panel */}
          {showSettings && (
            <View style={[styles.settingsPanel, { backgroundColor: settings.backgroundColor + 'F0' }]}>
              <View style={styles.settingRow}>
                <Ionicons name="text" size={20} color={settings.fontColor} />
                <TouchableOpacity
                  onPress={() => handleFontSizeChange(-2)}
                  style={[styles.settingButton, { backgroundColor: settings.fontColor + '10' }]}
                >
                  <Ionicons name="remove" size={16} color={settings.fontColor} />
                </TouchableOpacity>
                <Text style={[styles.settingValue, { color: settings.fontColor }]}>
                  {localFontSize}
                </Text>
                <TouchableOpacity
                  onPress={() => handleFontSizeChange(2)}
                  style={[styles.settingButton, { backgroundColor: settings.fontColor + '10' }]}
                >
                  <Ionicons name="add" size={16} color={settings.fontColor} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingRow}>
                <Ionicons name="speedometer" size={20} color={settings.fontColor} />
                <TouchableOpacity
                  onPress={() => handleScrollSpeedChange(-10)}
                  style={[styles.settingButton, { backgroundColor: settings.fontColor + '10' }]}
                >
                  <Ionicons name="remove" size={16} color={settings.fontColor} />
                </TouchableOpacity>
                <Text style={[styles.settingValue, { color: settings.fontColor }]}>
                  {localScrollSpeed}
                </Text>
                <TouchableOpacity
                  onPress={() => handleScrollSpeedChange(10)}
                  style={[styles.settingButton, { backgroundColor: settings.fontColor + '10' }]}
                >
                  <Ionicons name="add" size={16} color={settings.fontColor} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      )}

      {/* Lyrics Display */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.lyricsContainer}
        contentContainerStyle={styles.lyricsContent}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const maxScroll = contentSize.height - layoutMeasurement.height;
          const progress = maxScroll > 0 ? (contentOffset.y / maxScroll) * 100 : 0;
          setScrollProgress(Math.min(progress, 100));
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onTouchStart={() => setShowControls(true)}
      >
        <View style={styles.lyricsWrapper}>
          <Text style={[styles.lyrics, { 
            color: settings.fontColor,
            fontSize: localFontSize 
          }]}>
            {formatLyrics(song.lyrics)}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Controls */}
      {showControls && (
        <View style={[styles.bottomControls, { backgroundColor: settings.backgroundColor + 'F0' }]}>
          <View style={styles.playbackControls}>
            {canGoPrev && (
              <TouchableOpacity
                onPress={onPrevSong}
                style={[styles.controlButton, { backgroundColor: settings.fontColor + '10' }]}
              >
                <Ionicons name="play-skip-back" size={24} color={settings.fontColor} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={toggleScrolling}
              style={[
                styles.playButton,
                { backgroundColor: isScrolling ? '#10B981' : settings.fontColor + '10' }
              ]}
            >
              <Ionicons 
                name={isScrolling ? 'pause' : 'play'} 
                size={32} 
                color={isScrolling ? '#FFFFFF' : settings.fontColor} 
              />
            </TouchableOpacity>

            {canGoNext && (
              <TouchableOpacity
                onPress={onNextSong}
                style={[styles.controlButton, { backgroundColor: settings.fontColor + '10' }]}
              >
                <Ionicons name="play-skip-forward" size={24} color={settings.fontColor} />
              </TouchableOpacity>
            )}
          </View>

          {setlist && (
            <Text style={[styles.setlistInfo, { color: settings.fontColor + 'B3' }]}>
              {setlist.name} • Song {currentSongIndex + 1} of {setlist.songIds.length}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 50,
  },
  progressFill: {
    height: '100%',
    opacity: 0.8,
  },
  timer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 40,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  songInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  songTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  songAuthor: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  settingsPanel: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  settingButton: {
    padding: 8,
    borderRadius: 8,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
  },
  lyricsContainer: {
    flex: 1,
  },
  lyricsContent: {
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 150,
  },
  lyricsWrapper: {
    maxWidth: width - 40,
  },
  lyrics: {
    lineHeight: 1.2,
  },
  lyricsLine: {
    lineHeight: 1.2,
  },
  boldText: {
    fontWeight: 'bold',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    padding: 12,
    borderRadius: 50,
  },
  playButton: {
    padding: 16,
    borderRadius: 50,
  },
  setlistInfo: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
});