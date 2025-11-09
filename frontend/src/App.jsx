import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import VideoCallPage from "./pages/VideoCallPage";
import MyAccountSettings from "./pages/settings/MyAccountSettings";
import NotificationsSettings from "./pages/settings/NotificationsSettings";
import PrivacySettings from "./pages/settings/PrivacySettings";
import ChatSettings from "./pages/settings/ChatSettings";
import { useAuthStore } from "./store/useAuthStore";
import { useCallStore } from "./store/useCallStore";
import { useEffect, useState } from "react";
import PageLoader from "./components/PageLoader";
import IncomingCallModal from "./components/IncomingCallModal";
import WhatsAppCallScreen from "./components/call/WhatsAppCallScreen";
import InstallPWA from "./components/InstallPWA";

import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser, socket } = useAuthStore();
  const { incomingCall, activeCall, setIncomingCall, setCallStartTime, startCall, endCall } = useCallStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for incoming calls
  useEffect(() => {
    if (!socket || !authUser) {
      console.log("⚠️ Socket or authUser not ready:", { socket: !!socket, authUser: !!authUser });
      return;
    }

    console.log("✅ Setting up call listeners for:", authUser.fullName);

    socket.on("incomingCall", (callData) => {
      console.log("📞 Incoming call received:", callData);
      setIncomingCall(callData);
    });

    socket.on("callRejected", () => {
      console.log("❌ Call rejected by other user");
      endCall();
    });

    socket.on("callAccepted", () => {
      console.log("✅ Call accepted by other user");
      setCallStartTime();
    });

    socket.on("callEnded", () => {
      console.log("📴 Call ended by other user");
      endCall();
    });

    return () => {
      console.log("🧹 Cleaning up call listeners");
      socket.off("incomingCall");
      socket.off("callRejected");
      socket.off("callAccepted");
      socket.off("callEnded");
    };
  }, [socket, authUser, setIncomingCall, endCall, setCallStartTime]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="h-screen bg-slate-900 relative flex items-center justify-center p-2 md:p-0 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/video-call" element={authUser ? <VideoCallPage /> : <Navigate to={"/login"} />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to={"/login"} />} />
        <Route path="/settings/account" element={authUser ? <MyAccountSettings /> : <Navigate to={"/login"} />} />
        <Route path="/settings/notifications" element={authUser ? <NotificationsSettings /> : <Navigate to={"/login"} />} />
        <Route path="/settings/privacy" element={authUser ? <PrivacySettings /> : <Navigate to={"/login"} />} />
        <Route path="/settings/chat" element={authUser ? <ChatSettings /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      {/* Incoming Call Modal */}
      {incomingCall && !activeCall && (
        <IncomingCallModal
          caller={incomingCall.caller}
          callType={incomingCall.callType}
          onAccept={() => {
            console.log("✅ Accepting call from:", incomingCall.caller.fullName);
            
            socket.emit("callAccepted", {
              callerId: incomingCall.caller._id,
              roomId: incomingCall.roomId,
            });
            socket.emit("join-call-room", { roomId: incomingCall.roomId });
            
            // Start call with custom UI (receiver is NOT initiator)
            startCall(incomingCall.caller, incomingCall.callType, incomingCall.roomId);
            
            // Clear incoming call modal
            setIncomingCall(null);
          }}
          onReject={() => {
            console.log("❌ Rejecting call from:", incomingCall.caller.fullName);
            
            socket.emit("callRejected", {
              callerId: incomingCall.caller._id,
              receiverId: authUser._id,
              callType: incomingCall.callType,
              roomId: incomingCall.roomId,
            });
            
            // Clear incoming call modal
            setIncomingCall(null);
          }}
        />
      )}

      {/* Active Call Screen */}
      {activeCall && (
        <WhatsAppCallScreen
          contact={activeCall.user}
          callType={activeCall.callType}
          roomId={activeCall.roomId}
          isInitiator={activeCall.startTime === null}
          onEnd={() => {
            console.log("📴 Ending call");
            socket.emit("endCall", { 
              receiverId: activeCall.user._id, 
              roomId: activeCall.roomId 
            });
            endCall();
          }}
          onMinimize={() => {
            console.log("📦 Minimizing call");
            // Keep call active but minimized
          }}
        />
      )}

      <Toaster />
      
      {/* PWA Install Prompt */}
      <InstallPWA />
    </div>
  );
}
export default App;
