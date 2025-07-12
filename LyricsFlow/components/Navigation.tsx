import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from './Logo';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: 'songs' | 'setlists' | 'settings') => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'songs', label: 'Songs', icon: 'musical-notes' as const },
    { id: 'setlists', label: 'Setlists', icon: 'list' as const },
    { id: 'settings', label: 'Settings', icon: 'settings' as const }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo size={32} />
          <Text style={styles.title}>LyricsFlow</Text>
        </View>
        
        <View style={styles.navContainer}>
          {navItems.map(({ id, label, icon }) => (
            <TouchableOpacity
              key={id}
              onPress={() => onViewChange(id as any)}
              style={[
                styles.navButton,
                currentView === id && styles.activeNavButton
              ]}
            >
              <Ionicons 
                name={icon} 
                size={20} 
                color={currentView === id ? '#1D4ED8' : '#6B7280'} 
              />
              <Text style={[
                styles.navText,
                currentView === id && styles.activeNavText
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  navContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeNavButton: {
    backgroundColor: '#DBEAFE',
  },
  navText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeNavText: {
    color: '#1D4ED8',
    fontWeight: '500',
  },
});