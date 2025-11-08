import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString(undefined, { weekday: "short" });
    } else {
      return messageDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="space-y-0">
      {chats.map((chat) => {
        const isSelected = selectedUser?._id === chat._id;
        const isOnline = onlineUsers.includes(chat._id);
        
        return (
          <div
            key={chat._id}
            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-slate-700/30 ${
              isSelected 
                ? "bg-slate-700/50" 
                : "hover:bg-slate-800/50"
            }`}
            onClick={() => setSelectedUser(chat)}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img 
                src={chat.profilePic || "/avatar.png"} 
                alt={chat.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-800"></div>
              )}
            </div>

            {/* Chat info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-1">
                <h4 className="text-slate-200 font-medium truncate text-sm">
                  {chat.fullName}
                </h4>
                {chat.lastMessageTime && (
                  <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                    {formatTime(chat.lastMessageTime)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm truncate">
                  {chat.lastMessage || "No messages yet"}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 bg-cyan-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default ChatsList;
