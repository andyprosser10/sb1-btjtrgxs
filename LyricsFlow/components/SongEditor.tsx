import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';

interface SongEditorProps {
  visible: boolean;
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

export default function SongEditor({
  visible,
  song,
  onSave,
  onClose,
  defaultFontSize,
  defaultScrollSpeed
}: SongEditorProps) {
  const [formData, setFormData] = useState({
    name: song?.name || '',
    author: song?.author || '',
    lyrics: song?.lyrics || '',
    fontSize: song?.fontSize || defaultFontSize,
    scrollSpeed: song?.scrollSpeed || defaultScrollSpeed
  });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.author.trim()) {
      Alert.alert('Error', 'Please fill in both song name and author');
      return;
    }
    onSave(formData);
    onClose();
  };

  const insertShortcut = (shortcut: string) => {
    const newLyrics = formData.lyrics + `**${shortcut}**\n`;
    setFormData({ ...formData, lyrics: newLyrics });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {song ? 'Edit Song' : 'Add New Song'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Ionicons name="checkmark" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Song Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter song name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Author/Artist</Text>
            <TextInput
              style={styles.input}
              value={formData.author}
              onChangeText={(text) => setFormData({ ...formData, author: text })}
              placeholder="Enter author/artist name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Font Size</Text>
              <TextInput
                style={styles.input}
                value={formData.fontSize.toString()}
                onChangeText={(text) => {
                  const size = parseInt(text) || defaultFontSize;
                  setFormData({ ...formData, fontSize: Math.max(12, Math.min(48, size)) });
                }}
                keyboardType="numeric"
                placeholder="18"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Scroll Speed</Text>
              <TextInput
                style={styles.input}
                value={formData.scrollSpeed.toString()}
                onChangeText={(text) => {
                  const speed = parseInt(text) || defaultScrollSpeed;
                  setFormData({ ...formData, scrollSpeed: Math.max(10, Math.min(200, speed)) });
                }}
                keyboardType="numeric"
                placeholder="50"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Quick Shortcuts</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.shortcutsContainer}
            >
              {SHORTCUTS.map((shortcut) => (
                <TouchableOpacity
                  key={shortcut}
                  onPress={() => insertShortcut(shortcut)}
                  style={styles.shortcutButton}
                >
                  <Text style={styles.shortcutText}>{shortcut}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Lyrics</Text>
            <TextInput
              style={styles.lyricsInput}
              value={formData.lyrics}
              onChangeText={(text) => setFormData({ ...formData, lyrics: text })}
              placeholder="Enter song lyrics... Use **text** for bold formatting"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.helpText}>
              Tip: Use **text** to make text bold (e.g., **CHORUS**, **Key: C**)
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginVertical: 12,
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
  row: {
    flexDirection: 'row',
  },
  shortcutsContainer: {
    flexDirection: 'row',
  },
  shortcutButton: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  shortcutText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  lyricsInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    height: 200,
    fontFamily: 'monospace',
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
});