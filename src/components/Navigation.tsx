import React from 'react';
import { List, Settings as SettingsIcon, Music } from 'lucide-react';
import Logo from './Logo';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: 'songs' | 'setlists' | 'settings') => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'songs', label: 'Songs', icon: Music },
    { id: 'setlists', label: 'Setlists', icon: List },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <h1 className="text-xl font-bold text-gray-800">LyricsFlow</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id as any)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentView === id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}