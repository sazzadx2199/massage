import { ArrowLeft, Video, Phone, MoreVertical, Search } from "lucide-react";
import { useState } from "react";

function WhatsAppChatHeader({ 
  user, 
  isOnline, 
  onBack, 
  onVideoCall, 
  onVoiceCall,
  onSearch 
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-[#F0F2F5] border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center gap-3 flex-1">
        {/* Back button (mobile) */}
        <button
          onClick={onBack}
          className="md:hidden text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Avatar */}
        <div className="relative">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white"></div>
          )}
        </div>

        {/* Name and status */}
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-medium text-[16px] truncate">
            {user.fullName}
          </h3>
          <p className="text-gray-500 text-[13px]">
            {isOnline ? "online" : "offline"}
          </p>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-4">
        {/* Video call */}
        <button
          onClick={onVideoCall}
          className="text-gray-600 hover:text-gray-800 transition-colors"
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Voice call */}
        <button
          onClick={onVoiceCall}
          className="text-gray-600 hover:text-gray-800 transition-colors"
          title="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>

        {/* Search */}
        <button
          onClick={onSearch}
          className="text-gray-600 hover:text-gray-800 transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Contact info
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Select messages
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Mute notifications
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Clear messages
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">
                  Delete chat
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WhatsAppChatHeader;
