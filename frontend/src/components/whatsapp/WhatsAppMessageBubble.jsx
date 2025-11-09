import { useState } from "react";
import StatusIndicator from "./StatusIndicator";
import { ChevronDown } from "lucide-react";

function WhatsAppMessageBubble({ 
  message, 
  isOwnMessage, 
  showAvatar, 
  senderName,
  onContextMenu,
  authUser 
}) {
  const [showMenu, setShowMenu] = useState(false);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex items-end gap-2 mb-1 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
      onContextMenu={onContextMenu}
    >
      {/* Avatar space */}
      {!isOwnMessage && (
        <div className="w-8 h-8 flex-shrink-0">
          {showAvatar && (
            <img
              src={message.senderAvatar || "/avatar.png"}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`relative max-w-[65%] px-3 py-2 rounded-lg shadow-sm ${
          isOwnMessage
            ? "bg-[#D9FDD3] rounded-br-none"
            : "bg-white rounded-bl-none"
        }`}
      >
        {/* Reply preview */}
        {message.replyTo && (
          <div
            className={`mb-2 p-2 rounded border-l-4 text-sm ${
              isOwnMessage
                ? "bg-[#C4E7C0] border-[#25D366]"
                : "bg-gray-100 border-gray-400"
            }`}
          >
            <p className="text-xs font-semibold text-[#25D366] mb-1">
              {message.replyTo.senderId === authUser._id ? "You" : senderName}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {message.replyTo.text || "📷 Photo"}
            </p>
          </div>
        )}

        {/* Image */}
        {message.image && (
          <img
            src={message.image}
            alt="Shared"
            className="rounded-lg max-h-64 object-cover w-full mb-1"
          />
        )}

        {/* Text */}
        {message.text && (
          <p className="text-[14.2px] text-gray-800 break-words whitespace-pre-wrap pr-16">
            {message.text}
          </p>
        )}

        {/* Call message */}
        {message.isCallMessage && (
          <div className="text-sm text-gray-600">
            {message.callData.callType === "video" ? "📹" : "📞"}{" "}
            {message.callData.status === "completed"
              ? `Call (${Math.floor(message.callData.duration / 60)}:${(message.callData.duration % 60).toString().padStart(2, "0")})`
              : message.callData.status === "missed"
              ? "Missed call"
              : message.callData.status === "rejected"
              ? "Declined call"
              : "Cancelled call"}
          </div>
        )}

        {/* Time and status */}
        <div className="absolute bottom-1 right-2 flex items-center gap-1">
          {message.isEdited && (
            <span className="text-[11px] text-gray-500 italic">edited</span>
          )}
          <span className="text-[11px] text-gray-500">
            {formatTime(message.createdAt)}
          </span>
          {isOwnMessage && (
            <StatusIndicator
              status={message.status || "delivered"}
              isRead={message.isRead}
            />
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="absolute -bottom-2 right-2 flex gap-1 bg-white rounded-full px-2 py-0.5 shadow-md border border-gray-200">
            {message.reactions.map((reaction, idx) => (
              <span key={idx} className="text-sm">
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}

        {/* Tail */}
        <div
          className={`absolute bottom-0 ${
            isOwnMessage ? "-right-2" : "-left-2"
          }`}
        >
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0C0 0 12 0 12 20C12 20 0 15 0 0Z"
              fill={isOwnMessage ? "#D9FDD3" : "#FFFFFF"}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppMessageBubble;
