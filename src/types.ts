export interface Song {
  id: string;
  name: string;
  author: string;
  lyrics: string;
  fontSize: number;
  scrollSpeed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Setlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  defaultFontSize: number;
  defaultScrollSpeed: number;
  backgroundColor: string;
  fontColor: string;
  autoplayEnabled: boolean;
  autoplayDelay: number;
  showTimerInSetlists: boolean;
}

export interface AppState {
  songs: Song[];
  setlists: Setlist[];
  settings: Settings;
  currentView: 'songs' | 'setlists' | 'song-display' | 'settings';
  currentSong: string | null;
  currentSetlist: string | null;
  isAutoplayActive: boolean;
}