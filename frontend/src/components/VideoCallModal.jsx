import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function VideoCallModal({ isOpen, onClose, roomId, userName, userId, callType = "video" }) {
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
        
        // Configure call based on type
        const callConfig = {
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall, // 1-on-1 call
          },
          showScreenSharingButton: callType === "video",
          showPreJoinView: false,
          turnOnCameraWhenJoining: callType === "video",
          turnOnMicrophoneWhenJoining: true,
          showMyCameraToggleButton: callType === "video",
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showTextChat: false,
          showUserList: false,
          maxUsers: 2,
          layout: callType === "audio" ? "Auto" : "Grid",
          showLayoutButton: false,
          onLeaveRoom: () => {
            console.log("✓ Left room");
            onClose();
          },
        };

        // Start call
        zp.joinRoom(callConfig);
        
        console.log(`✓ ${callType === "video" ? "Video" : "Audio"} call started!`);
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
        try {
          // Stop all media tracks
          if (containerRef.current) {
            const videos = containerRef.current.querySelectorAll('video');
            videos.forEach(video => {
              if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => {
                  track.stop();
                  console.log("Stopped track:", track.kind);
                });
                video.srcObject = null;
              }
            });
          }
          
          // Destroy ZegoCloud instance
          zpRef.current.destroy();
          zpRef.current = null;
        } catch (error) {
          console.error("Error destroying call:", error);
        }
      }
    };
  }, [isOpen, roomId, userName, userId, onClose, callType]);

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
