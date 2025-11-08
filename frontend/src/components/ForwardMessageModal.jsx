import { X, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function ForwardMessageModal({ message, onClose, onForward }) {
  const { chats, allContacts } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Combine chats and contacts
  const allUsers = [...chats, ...allContacts];

  // Filter users based on search
  const filteredUsers = allUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleForward = () => {
    if (selectedUsers.length === 0) return;
    onForward(selectedUsers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200">Forward Message</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-700">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            autoFocus
          />
        </div>

        {/* User list */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {filteredUsers.map((user) => {
            const isSelected = selectedUsers.includes(user._id);
            const isOnline = onlineUsers.includes(user._id);

            return (
              <div
                key={user._id}
                onClick={() => toggleUser(user._id)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-slate-700/30 ${
                  isSelected ? "bg-cyan-500/10" : "hover:bg-slate-700/30"
                }`}
              >
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected 
                    ? "bg-cyan-500 border-cyan-500" 
                    : "border-slate-600"
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img 
                    src={user.profilePic || "/avatar.png"} 
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                  )}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-slate-200 font-medium truncate text-sm">
                    {user.fullName}
                  </h4>
                  <p className="text-slate-400 text-xs truncate">
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            {selectedUsers.length} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleForward}
              disabled={selectedUsers.length === 0}
              className="px-4 py-2 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForwardMessageModal;
