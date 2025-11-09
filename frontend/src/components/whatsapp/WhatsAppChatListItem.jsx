import StatusIndicator from "./StatusIndicator";

function WhatsAppChatListItem({ 
  chat, 
  isSelected, 
  isOnline, 
  onClick,
  authUser 
}) {
  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString(undefined, { weekday: "short" });
    } else {
      return messageDate.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
      });
    }
  };

  const isLastMessageFromMe = chat.lastMessageSenderId === authUser?._id;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-200 ${
        isSelected ? "bg-[#F0F2F5]" : "bg-white hover:bg-[#F5F6F6]"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={chat.profilePic || "/avatar.png"}
          alt={chat.fullName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* Chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <h4
            className={`truncate text-[16px] ${
              chat.unreadCount > 0
                ? "text-gray-900 font-semibold"
                : "text-gray-900 font-normal"
            }`}
          >
            {chat.fullName}
          </h4>
          {chat.lastMessageTime && (
            <span
              className={`text-[12px] ml-2 flex-shrink-0 ${
                chat.unreadCount > 0 ? "text-[#25D366] font-medium" : "text-gray-500"
              }`}
            >
              {formatTime(chat.lastMessageTime)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {/* Status indicator for sent messages */}
            {isLastMessageFromMe && (
              <div className="flex-shrink-0">
                <StatusIndicator
                  status="delivered"
                  isRead={chat.lastMessageRead}
                />
              </div>
            )}
            <p
              className={`text-[14px] truncate ${
                chat.unreadCount > 0
                  ? "text-gray-900 font-medium"
                  : "text-gray-600"
              }`}
            >
              {chat.lastMessage || "No messages yet"}
            </p>
          </div>

          {/* Unread badge */}
          {chat.unreadCount > 0 && (
            <span className="ml-2 bg-[#25D366] text-white text-[12px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 min-w-[20px] text-center">
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default WhatsAppChatListItem;
