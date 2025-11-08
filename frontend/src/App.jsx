import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import MyAccountSettings from "./pages/settings/MyAccountSettings";
import NotificationsSettings from "./pages/settings/NotificationsSettings";
import PrivacySettings from "./pages/settings/PrivacySettings";
import ChatSettings from "./pages/settings/ChatSettings";
import { useAuthStore } from "./store/useAuthStore";
import { useCallStore } from "./store/useCallStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import IncomingCallModal from "./components/IncomingCallModal";
import VideoCallModal from "./components/VideoCallModal";

import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser, socket } = useAuthStore();
  const { incomingCall, activeCall, isCallModalOpen, setIncomingCall, acceptCall, rejectCall, endCall } = useCallStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for incoming calls
  useEffect(() => {
    if (!socket || !authUser) return;

    socket.on("incomingCall", (callData) => {
      setIncomingCall(callData);
    });

    socket.on("callRejected", () => {
      endCall();
    });

    socket.on("callEnded", () => {
      endCall();
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callRejected");
      socket.off("callEnded");
    };
  }, [socket, authUser, setIncomingCall, endCall]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="h-screen bg-slate-900 relative flex items-center justify-center p-2 md:p-0 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to={"/login"} />} />
        <Route path="/settings/account" element={authUser ? <MyAccountSettings /> : <Navigate to={"/login"} />} />
        <Route path="/settings/notifications" element={authUser ? <NotificationsSettings /> : <Navigate to={"/login"} />} />
        <Route path="/settings/privacy" element={authUser ? <PrivacySettings /> : <Navigate to={"/login"} />} />
        <Route path="/settings/chat" element={authUser ? <ChatSettings /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <IncomingCallModal
          caller={incomingCall.caller}
          callType={incomingCall.callType}
          onAccept={() => {
            acceptCall();
            socket.emit("callAccepted", {
              callerId: incomingCall.caller._id,
              roomId: incomingCall.roomId,
            });
          }}
          onReject={() => {
            rejectCall();
            socket.emit("callRejected", {
              callerId: incomingCall.caller._id,
            });
          }}
        />
      )}

      {/* Active Call Modal */}
      {activeCall && isCallModalOpen && (
        <VideoCallModal
          isOpen={isCallModalOpen}
          onClose={() => {
            endCall();
            socket.emit("endCall", {
              receiverId: activeCall.user._id,
            });
          }}
          roomId={activeCall.roomId}
          userName={authUser.fullName}
          userId={authUser._id}
        />
      )}

      <Toaster />
    </div>
  );
}
export default App;
