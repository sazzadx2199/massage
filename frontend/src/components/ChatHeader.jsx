import { XIcon, Search, Video, Phone } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import VideoCallModal from "./VideoCallModal";

function ChatHeader({ onSearchClick }) {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  const [showVideoCall, setShowVideoCall] = useState(false);

  const handleVideoCall = () => {
    setShowVideoCall(true);
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-4 md:px-6 py-3 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-10 md:w-12 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium text-sm md:text-base">{selectedUser.fullName}</h3>
          <p className="text-slate-400 text-xs md:text-sm">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Video Call Button */}
        <button 
          onClick={handleVideoCall}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          aria-label="Video call"
          title="Video call"
        >
          <Video className="w-5 h-5 text-slate-400 hover:text-green-400 transition-colors" />
        </button>

        {/* Audio Call Button */}
        <button 
          onClick={handleVideoCall}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          aria-label="Audio call"
          title="Audio call"
        >
          <Phone className="w-5 h-5 text-slate-400 hover:text-green-400 transition-colors" />
        </button>

        {/* Search Button */}
        <button 
          onClick={onSearchClick}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          aria-label="Search in chat"
          title="Search"
        >
          <Search className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors" />
        </button>
        
        {/* Close Button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          aria-label="Close chat"
          title="Close"
        >
          <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors" />
        </button>
      </div>

      {/* Video Call Modal */}
      {showVideoCall && (
        <VideoCallModal
          isOpen={showVideoCall}
          onClose={() => setShowVideoCall(false)}
          roomId={`${authUser._id}-${selectedUser._id}`}
          userName={authUser.fullName}
          userId={authUser._id}
        />
      )}
    </div>
  );
}

export default ChatHeader;
