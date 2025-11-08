import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Notification Settings
      notificationSound: true,
      messagePreview: true,
      desktopNotifications: true,

      // Privacy Settings
      lastSeen: "everyone",
      profilePhoto: "everyone",
      readReceipts: true,

      // Chat Settings
      enterToSend: true,
      fontSize: "medium",
      theme: "dark",

      // Language
      language: "English",

      // Actions
      toggleNotificationSound: () =>
        set({ notificationSound: !get().notificationSound }),
      
      toggleMessagePreview: () =>
        set({ messagePreview: !get().messagePreview }),
      
      toggleDesktopNotifications: () =>
        set({ desktopNotifications: !get().desktopNotifications }),
      
      setLastSeen: (value) => set({ lastSeen: value }),
      
      setProfilePhoto: (value) => set({ profilePhoto: value }),
      
      toggleReadReceipts: () =>
        set({ readReceipts: !get().readReceipts }),
      
      toggleEnterToSend: () =>
        set({ enterToSend: !get().enterToSend }),
      
      setFontSize: (size) => set({ fontSize: size }),
      
      setTheme: (theme) => set({ theme }),
      
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "settings-storage",
    }
  )
);
