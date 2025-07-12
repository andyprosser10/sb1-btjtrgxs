import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
    Alert.alert('Success', 'Settings saved successfully!');
    onBack();
  };

  const applyColorPreset = (bg: string, text: string) => {
    setLocalSettings({
      ...localSettings,
      backgroundColor: bg,
      fontColor: text
    });
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setLocalSettings({
      ...localSettings,
      [key]: value
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Display Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Default Font Size</Text>
            <TextInput
              style={styles.numberInput}
              value={localSettings.defaultFontSize.toString()}
              onChangeText={(text) => {
                const size = parseInt(text) || 18;
                updateSetting('defaultFontSize', Math.max(12, Math.min(48, size)));
              }}
              keyboardType="numeric"
              placeholder="18"
            />
          </View>
          <Text style={styles.helpText}>Used for new songs (12-48px)</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Default Scroll Speed</Text>
            <TextInput
              style={styles.numberInput}
              value={localSettings.defaultScrollSpeed.toString()}
              onChangeText={(text) => {
                const speed = parseInt(text) || 50;
                updateSetting('defaultScrollSpeed', Math.max(10, Math.min(200, speed)));
              }}
              keyboardType="numeric"
              placeholder="50"
            />
          </View>
          <Text style={styles.helpText}>Pixels per second (10-200)</Text>

          <Text style={styles.settingLabel}>Color Presets</Text>
          <View style={styles.colorPresets}>
            {COLOR_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.name}
                onPress={() => applyColorPreset(preset.bg, preset.text)}
                style={[
                  styles.colorPreset,
                  { backgroundColor: preset.bg }
                ]}
              >
                <Text style={[styles.presetText, { color: preset.text }]}>
                  {preset.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Autoplay Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Autoplay Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Autoplay in Setlists</Text>
              <Text style={styles.settingDescription}>
                Automatically advance to the next song when the current song ends
              </Text>
            </View>
            <Switch
              value={localSettings.autoplayEnabled}
              onValueChange={(value) => updateSetting('autoplayEnabled', value)}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={localSettings.autoplayEnabled ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Show Timer in Setlists</Text>
              <Text style={styles.settingDescription}>
                Display elapsed time during setlist playback
              </Text>
            </View>
            <Switch
              value={localSettings.showTimerInSetlists}
              onValueChange={(value) => updateSetting('showTimerInSetlists', value)}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={localSettings.showTimerInSetlists ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>

          {localSettings.autoplayEnabled && (
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Autoplay Delay (seconds)</Text>
              <TextInput
                style={styles.numberInput}
                value={localSettings.autoplayDelay.toString()}
                onChangeText={(text) => {
                  const delay = parseInt(text) || 3;
                  updateSetting('autoplayDelay', Math.max(1, Math.min(30, delay)));
                }}
                keyboardType="numeric"
                placeholder="3"
              />
            </View>
          )}
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View
            style={[
              styles.preview,
              {
                backgroundColor: localSettings.backgroundColor,
                borderColor: localSettings.fontColor + '30'
              }
            ]}
          >
            <Text
              style={[
                styles.previewTitle,
                {
                  color: localSettings.fontColor,
                  fontSize: localSettings.defaultFontSize
                }
              ]}
            >
              Sample Song Title
            </Text>
            <Text
              style={[
                styles.previewAuthor,
                { color: localSettings.fontColor + 'CC' }
              ]}
            >
              by Sample Artist
            </Text>
            <Text
              style={[
                styles.previewLyrics,
                {
                  color: localSettings.fontColor,
                  fontSize: localSettings.defaultFontSize * 0.9
                }
              ]}
            >
              This is how your lyrics will appear{'\n'}
              With the current settings applied{'\n'}
              <Text style={{ fontWeight: 'bold' }}>Key: C</Text>{' '}
              <Text style={{ fontWeight: 'bold' }}>Tempo: 120 BPM</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    width: 80,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  colorPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  colorPreset: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 100,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  preview: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  previewTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewAuthor: {
    fontSize: 14,
    marginBottom: 16,
  },
  previewLyrics: {
    lineHeight: 24,
  },
});