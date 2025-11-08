import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function VideoCallModal({ isOpen, onClose, roomId, userName, userId }) {
  const containerRef = useRef(null);
  const zpRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const initCall = async () => {
      try {
        // Generate Kit Token
        const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
        
        console.log("ZegoCloud Init:", { appID, serverSecret: serverSecret ? "✓" : "✗", roomId, userId, userName });
        
        if (!appID || !serverSecret) {
          console.error("❌ ZegoCloud credentials not found!");
          console.error("AppID:", appID);
          console.error("ServerSecret:", serverSecret ? "exists" : "missing");
          alert("Video call credentials not configured. Please check environment variables.");
          return;
        }

        console.log("✓ Generating token...");
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          userId,
          userName
        );

        console.log("✓ Creating ZegoCloud instance...");
        // Create instance
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        console.log("✓ Joining room:", roomId);
        // Start call
        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall, // 1-on-1 call
          },
          showScreenSharingButton: true,
          showPreJoinView: false,
          onLeaveRoom: () => {
            console.log("✓ Left room");
            onClose();
          },
        });
        
        console.log("✓ Video call started!");
      } catch (error) {
        console.error("❌ Video call error:", error);
        alert("Failed to start video call: " + error.message);
      }
    };

    initCall();

    // Cleanup
    return () => {
      if (zpRef.current) {
        console.log("Cleaning up video call...");
        zpRef.current.destroy();
      }
    };
  }, [isOpen, roomId, userName, userId, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-[80vh] bg-slate-900 rounded-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video call container */}
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}

export default VideoCallModal;
