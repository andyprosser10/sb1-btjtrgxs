import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
    if (!newSetlistName.trim()) {
      Alert.alert('Error', 'Please enter a setlist name');
      return;
    }

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
  };

  const toggleSong = (songId: string) => {
    setSelectedSongs(prev =>
      prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const handleDeleteSetlist = (id: string, name: string) => {
    Alert.alert(
      'Delete Setlist',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteSetlist(id) }
      ]
    );
  };

  const renderSetlist = ({ item }: { item: Setlist }) => (
    <View style={styles.setlistCard}>
      <View style={styles.setlistInfo}>
        <Text style={styles.setlistName}>{item.name}</Text>
        <Text style={styles.setlistMeta}>{item.songIds.length} songs</Text>
      </View>
      
      <View style={styles.setlistActions}>
        <TouchableOpacity
          onPress={() => onPlaySetlist(item.id)}
          style={[styles.playButton, item.songIds.length === 0 && styles.disabledButton]}
          disabled={item.songIds.length === 0}
        >
          <Ionicons name="play" size={16} color="#FFFFFF" />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => openEditor(item)}
            style={styles.actionButton}
          >
            <Ionicons name="pencil" size={16} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleDeleteSetlist(item.id, item.name)}
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSongItem = ({ item }: { item: Song }) => {
    const isSelected = selectedSongs.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSong(item.id)}
        style={[styles.songItem, isSelected && styles.selectedSongItem]}
      >
        <View style={styles.songItemInfo}>
          <Text style={styles.songItemName}>{item.name}</Text>
          <Text style={styles.songItemAuthor}>by {item.author}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>
        {setlists.length === 0 ? 'No setlists yet' : 'No setlists found'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {setlists.length === 0
          ? 'Create your first setlist to organize songs for performances!'
          : 'Try adjusting your search terms'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Setlists</Text>
        <TouchableOpacity onPress={() => openEditor()} style={styles.addButton}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>New Setlist</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search setlists..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <FlatList
        data={filteredSetlists}
        renderItem={renderSetlist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Setlist Editor Modal */}
      <Modal visible={showEditor} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeEditor} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingSetlist ? 'Edit Setlist' : 'Create New Setlist'}
            </Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Setlist Name</Text>
              <TextInput
                style={styles.input}
                value={newSetlistName}
                onChangeText={setNewSetlistName}
                placeholder="Enter setlist name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <Text style={styles.sectionTitle}>
              Select Songs ({selectedSongs.length})
            </Text>
            
            <FlatList
              data={songs}
              renderItem={renderSongItem}
              keyExtractor={(item) => item.id}
              style={styles.songsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  setlistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  setlistInfo: {
    marginBottom: 12,
  },
  setlistName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  setlistMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  setlistActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 8,
    borderRadius: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  songsList: {
    flex: 1,
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedSongItem: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  songItemInfo: {
    flex: 1,
  },
  songItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  songItemAuthor: {
    fontSize: 14,
    color: '#6B7280',
  },
});