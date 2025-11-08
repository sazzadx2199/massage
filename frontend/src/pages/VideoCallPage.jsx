import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Loader2 } from "lucide-react";

function VideoCallPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authUser, socket } = useAuthStore();
  const containerRef = useRef(null);
  const zpRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomId = searchParams.get("roomId");
  const callType = searchParams.get("type") || "video";
  const receiverId = searchParams.get("receiverId");

  useEffect(() => {
    if (!authUser || !roomId) {
      navigate("/");
      return;
    }

    const initCall = async () => {
      try {
        setIsLoading(true);
        
        const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

        if (!appID || !serverSecret) {
          throw new Error("ZegoCloud credentials not configured");
        }

        // Generate token
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          authUser._id,
          authUser.fullName
        );

        // Create instance
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        // Advanced configuration
        await zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          
          // UI Configuration
          showScreenSharingButton: callType === "video",
          showPreJoinView: false,
          showRoomTimer: true,
          showUserList: false,
          showTextChat: false,
          showLayoutButton: true,
          showNonVideoUser: true,
          showOnlyAudioUser: true,
          
          // Media Configuration
          turnOnCameraWhenJoining: callType === "video",
          turnOnMicrophoneWhenJoining: true,
          useFrontFacingCamera: true,
          
          // Button Configuration
          showMyCameraToggleButton: callType === "video",
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showLeavingView: true,
          
          // Layout Configuration
          layout: callType === "audio" ? "Auto" : "Grid",
          maxUsers: 2,
          
          // Video Configuration
          videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_720P,
          
          // Callbacks
          onJoinRoom: () => {
            console.log("✓ Joined room successfully");
            setIsLoading(false);
          },
          
          onLeaveRoom: () => {
            console.log("✓ Left room");
            handleLeaveCall();
          },
          
          onUserJoin: (users) => {
            console.log("✓ User joined:", users);
          },
          
          onUserLeave: (users) => {
            console.log("✓ User left:", users);
          },
        });

      } catch (error) {
        console.error("❌ Call initialization error:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    initCall();

    // Cleanup
    return () => {
      if (zpRef.current) {
        try {
          // Stop all media tracks
          if (containerRef.current) {
            const videos = containerRef.current.querySelectorAll('video');
            videos.forEach(video => {
              if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
                video.srcObject = null;
              }
            });
          }
          
          zpRef.current.destroy();
          zpRef.current = null;
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }
    };
  }, [authUser, roomId, callType, navigate]);

  const handleLeaveCall = () => {
    // Notify other user
    if (socket && receiverId) {
      socket.emit("endCall", { receiverId });
    }
    
    // Navigate back
    navigate("/");
  };

  if (error) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-2">Call Failed</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-4" />
          <p className="text-white text-xl font-medium">Connecting...</p>
          <p className="text-slate-400 text-sm mt-2">Please wait</p>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={handleLeaveCall}
        className="absolute top-4 left-4 z-40 bg-slate-800/80 hover:bg-slate-700 text-white p-3 rounded-full backdrop-blur-sm transition-all"
        title="Leave Call"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Call Type Indicator */}
      <div className="absolute top-4 right-4 z-40 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="text-white text-sm font-medium">
          {callType === "video" ? "📹 Video Call" : "📞 Audio Call"}
        </span>
      </div>

      {/* Video Call Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        }}
      />
    </div>
  );
}

export default VideoCallPage;
