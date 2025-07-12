import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';
import SongEditor from './SongEditor';

interface SongsListProps {
  songs: Song[];
  onEditSong: (song: Song) => void;
  onDeleteSong: (id: string) => void;
  onPlaySong: (id: string) => void;
  onAddSong: () => void;
  defaultFontSize: number;
  defaultScrollSpeed: number;
  onSaveSong: (songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function SongsList({
  songs,
  onEditSong,
  onDeleteSong,
  onPlaySong,
  onAddSong,
  defaultFontSize,
  defaultScrollSpeed,
  onSaveSong,
}: SongsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const filteredSongs = songs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSong = () => {
    setEditingSong(null);
    setShowEditor(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowEditor(true);
  };

  const handleSaveSong = (songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => {
    onSaveSong(songData);
    setShowEditor(false);
    setEditingSong(null);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingSong(null);
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <View style={styles.songCard}>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.name}</Text>
        <Text style={styles.songAuthor}>by {item.author}</Text>
        <View style={styles.songMeta}>
          <Text style={styles.metaText}>Font: {item.fontSize}px</Text>
          <Text style={styles.metaText}>Speed: {item.scrollSpeed}px/s</Text>
        </View>
      </View>
      
      <View style={styles.songActions}>
        <TouchableOpacity
          onPress={() => onPlaySong(item.id)}
          style={styles.playButton}
        >
          <Ionicons name="play" size={20} color="#ffffff" />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleEditSong(item)}
            style={styles.actionButton}
          >
            <Ionicons name="pencil" size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onDeleteSong(item.id)}
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="musical-notes-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>
        {songs.length === 0 ? 'No songs yet' : 'No songs found'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {songs.length === 0
          ? 'Start building your song library by adding your first song!'
          : 'Try adjusting your search terms'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Song Library</Text>
        <TouchableOpacity onPress={handleAddSong} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs..."
          placeholderTextColor="#9CA3AF"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Songs List */}
      <FlatList
        data={filteredSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Song Editor Modal */}
      <SongEditor
        visible={showEditor}
        song={editingSong || undefined}
        onSave={handleSaveSong}
        onClose={handleCloseEditor}
        defaultFontSize={defaultFontSize}
        defaultScrollSpeed={defaultScrollSpeed}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  songCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  songInfo: {
    marginBottom: 16,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  songAuthor: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  songMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});