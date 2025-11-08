import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import TypingIndicator from "./TypingIndicator";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
    typingUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <div className="flex-1 px-4 md:px-6 overflow-y-auto py-4 md:py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {messages.map((msg, index) => {
              const isOwnMessage = msg.senderId === authUser._id;
              const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
              const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderId !== msg.senderId;
              
              return (
                <div
                  key={msg._id}
                  className={`flex items-end gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"} ${!isLastInGroup ? "mb-1" : "mb-4"}`}
                >
                  {/* Avatar - only show for last message in group */}
                  {!isOwnMessage && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {isLastInGroup && (
                        <img 
                          src={selectedUser.profilePic || "/avatar.png"} 
                          alt={selectedUser.fullName}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`relative max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 shadow-sm ${
                      isOwnMessage
                        ? "bg-cyan-600 text-white rounded-2xl rounded-br-md"
                        : "bg-slate-800 text-slate-200 rounded-2xl rounded-bl-md"
                    }`}
                  >
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Shared" 
                        className="rounded-lg max-h-64 object-cover w-full mb-1" 
                      />
                    )}
                    {msg.text && (
                      <p className="text-sm md:text-base break-words whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}
                    
                    {/* Time and status */}
                    <div className={`flex items-center gap-1 mt-1 text-xs ${isOwnMessage ? "justify-end" : ""}`}>
                      <span className="opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isOwnMessage && (
                        <span className="opacity-70">
                          {msg.isRead ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
        
        {/* Typing indicator */}
        {typingUsers.has(selectedUser?._id) && <TypingIndicator />}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
