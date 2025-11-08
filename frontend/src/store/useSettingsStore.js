import { create } from "zustand";

// Helper to load from localStorage
const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to save to localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

export const useSettingsStore = create((set, get) => ({
  // Notification Settings
  notificationSound: loadFromStorage("notificationSound", true),
  messagePreview: loadFromStorage("messagePreview", true),
  desktopNotifications: loadFromStorage("desktopNotifications", true),

  // Privacy Settings
  lastSeen: loadFromStorage("lastSeen", "everyone"),
  profilePhoto: loadFromStorage("profilePhoto", "everyone"),
  readReceipts: loadFromStorage("readReceipts", true),

  // Chat Settings
  enterToSend: loadFromStorage("enterToSend", true),
  fontSize: loadFromStorage("fontSize", "medium"),
  theme: loadFromStorage("theme", "dark"),

  // Language
  language: loadFromStorage("language", "English"),

  // Actions
  toggleNotificationSound: () => {
    const newValue = !get().notificationSound;
    set({ notificationSound: newValue });
    saveToStorage("notificationSound", newValue);
  },
  
  toggleMessagePreview: () => {
    const newValue = !get().messagePreview;
    set({ messagePreview: newValue });
    saveToStorage("messagePreview", newValue);
  },
  
  toggleDesktopNotifications: () => {
    const newValue = !get().desktopNotifications;
    set({ desktopNotifications: newValue });
    saveToStorage("desktopNotifications", newValue);
  },
  
  setLastSeen: (value) => {
    set({ lastSeen: value });
    saveToStorage("lastSeen", value);
  },
  
  setProfilePhoto: (value) => {
    set({ profilePhoto: value });
    saveToStorage("profilePhoto", value);
  },
  
  toggleReadReceipts: () => {
    const newValue = !get().readReceipts;
    set({ readReceipts: newValue });
    saveToStorage("readReceipts", newValue);
  },
  
  toggleEnterToSend: () => {
    const newValue = !get().enterToSend;
    set({ enterToSend: newValue });
    saveToStorage("enterToSend", newValue);
  },
  
  setFontSize: (size) => {
    set({ fontSize: size });
    saveToStorage("fontSize", size);
  },
  
  setTheme: (theme) => {
    set({ theme });
    saveToStorage("theme", theme);
  },
  
  setLanguage: (lang) => {
    set({ language: lang });
    saveToStorage("language", lang);
  },
}));
