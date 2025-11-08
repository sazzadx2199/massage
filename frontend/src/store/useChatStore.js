import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  isTyping: false,
  typingUsers: new Set(),

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;
    const isFirstMessage = messages.length === 0;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    
    // Immediately update the UI by adding the optimistic message
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      
      // Replace optimistic message with real message from server
      set({ 
        messages: get().messages.map(m => 
          m._id === tempId ? res.data : m
        )
      });

      // If this was the first message, refresh chat list and contacts
      if (isFirstMessage) {
        get().getMyChatPartners();
        get().getAllContacts();
      }
    } catch (error) {
      // Remove optimistic message on failure
      set({ messages: get().messages.filter(m => m._id !== tempId) });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      const isFirstMessage = currentMessages.length === 0;
      
      set({ messages: [...currentMessages, newMessage] });

      // If this was the first message, refresh chat list
      if (isFirstMessage) {
        get().getMyChatPartners();
        get().getAllContacts();
      }

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0; // reset to start
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // Delete message
  deleteMessage: async (messageId, deleteForEveryone = false) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`, {
        data: { deleteForEveryone }
      });
      
      if (deleteForEveryone) {
        // Remove from UI
        set({ messages: get().messages.filter(m => m._id !== messageId) });
      } else {
        // Mark as deleted for current user
        set({ 
          messages: get().messages.map(m => 
            m._id === messageId ? { ...m, deletedForMe: true } : m
          )
        });
      }
      
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  // Edit message
  editMessage: async (messageId, newText) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}`, { text: newText });
      
      // Update in UI
      set({ 
        messages: get().messages.map(m => 
          m._id === messageId ? res.data : m
        )
      });
      
      toast.success("Message edited");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit message");
    }
  },

  // Add reaction
  addReaction: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.post(`/messages/${messageId}/reaction`, { emoji });
      
      // Update in UI
      set({ 
        messages: get().messages.map(m => 
          m._id === messageId ? res.data : m
        )
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reaction");
    }
  },

  // Remove reaction
  removeReaction: async (messageId) => {
    try {
      const res = await axiosInstance.delete(`/messages/${messageId}/reaction`);
      
      // Update in UI
      set({ 
        messages: get().messages.map(m => 
          m._id === messageId ? res.data : m
        )
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove reaction");
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (userId) => {
    try {
      await axiosInstance.put(`/messages/${userId}/read`);
      
      // Update messages in UI
      set({ 
        messages: get().messages.map(m => 
          m.senderId === userId ? { ...m, isRead: true, readAt: new Date() } : m
        )
      });

      // Refresh chat list to update unread count
      get().getMyChatPartners();
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  },

  // Toggle pin message
  togglePinMessage: async (messageId) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}/pin`);
      
      // Update in UI
      set({ 
        messages: get().messages.map(m => 
          m._id === messageId ? res.data : m
        )
      });
      
      toast.success(res.data.isPinned ? "Message pinned" : "Message unpinned");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to pin message");
    }
  },
}));
