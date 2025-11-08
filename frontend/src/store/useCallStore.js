import { create } from "zustand";

export const useCallStore = create((set, get) => ({
  // Call state
  incomingCall: null, // { caller, callType, roomId }
  activeCall: null, // { user, callType, roomId, startTime }
  isCallModalOpen: false,

  // Set incoming call
  setIncomingCall: (callData) => {
    set({ incomingCall: callData });
  },

  // Accept call
  acceptCall: () => {
    const { incomingCall } = get();
    if (incomingCall) {
      set({
        activeCall: {
          user: incomingCall.caller,
          callType: incomingCall.callType,
          roomId: incomingCall.roomId,
          startTime: Date.now(),
        },
        isCallModalOpen: true,
        incomingCall: null,
      });
    }
  },

  // Reject call
  rejectCall: () => {
    set({ incomingCall: null });
  },

  // Start call (outgoing)
  startCall: (user, callType, roomId) => {
    set({
      activeCall: { user, callType, roomId, startTime: null },
      isCallModalOpen: true,
    });
  },

  // End call
  endCall: () => {
    set({
      activeCall: null,
      isCallModalOpen: false,
      incomingCall: null,
    });
  },

  // Set call start time (when other party accepts)
  setCallStartTime: () => {
    const { activeCall } = get();
    if (activeCall) {
      set({
        activeCall: {
          ...activeCall,
          startTime: Date.now(),
        },
      });
    }
  },
}));
