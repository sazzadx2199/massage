import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import TypingIndicator from "./TypingIndicator";
import MessageContextMenu from "./MessageContextMenu";
import EditMessageModal from "./EditMessageModal";
import DeleteMessageModal from "./DeleteMessageModal";
import SearchInChat from "./SearchInChat";
import { Pin } from "lucide-react";
import toast from "react-hot-toast";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUsers,
    deleteMessage,
    editMessage,
    addReaction,
    markMessagesAsRead,
    togglePinMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    
    // Mark messages as read when opening chat
    markMessagesAsRead(selectedUser._id);

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages, markMessagesAsRead]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Message action handlers
  const handleContextMenu = (e, message) => {
    e.preventDefault();
    setContextMenu({
      message,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  const handleReply = () => {
    setReplyingTo(contextMenu.message);
  };

  const handleEdit = () => {
    setEditingMessage(contextMenu.message);
  };

  const handleDelete = () => {
    setDeletingMessage(contextMenu.message);
  };

  const handleCopy = () => {
    if (contextMenu.message.text) {
      navigator.clipboard.writeText(contextMenu.message.text);
      toast.success("Message copied!");
    }
  };

  const handleReact = async (emoji) => {
    await addReaction(contextMenu.message._id, emoji);
  };

  const handleSaveEdit = async (newText) => {
    await editMessage(editingMessage._id, newText);
    setEditingMessage(null);
  };

  const handleDeleteForMe = async () => {
    await deleteMessage(deletingMessage._id, false);
    setDeletingMessage(null);
  };

  const handleDeleteForEveryone = async () => {
    await deleteMessage(deletingMessage._id, true);
    setDeletingMessage(null);
  };

  const handlePin = async () => {
    await togglePinMessage(contextMenu.message._id);
  };

  const handleSearchResult = (message) => {
    // Scroll to message
    const messageElement = document.getElementById(`msg-${message._id}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("highlight-message");
      setTimeout(() => messageElement.classList.remove("highlight-message"), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader onSearchClick={() => setShowSearch(!showSearch)} />
      
      {/* Search Bar */}
      {showSearch && (
        <SearchInChat 
          messages={messages}
          onResultClick={handleSearchResult}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Pinned Messages */}
      {messages.some(m => m.isPinned) && (
        <div className="bg-slate-800/70 border-b border-slate-700 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Pin className="w-4 h-4 text-cyan-500" />
            <span className="font-medium">Pinned:</span>
            <div className="flex-1 truncate">
              {messages.find(m => m.isPinned)?.text || "Image"}
            </div>
          </div>
        </div>
      )}
      
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
                    id={`msg-${msg._id}`}
                    onContextMenu={(e) => handleContextMenu(e, msg)}
                    className={`relative max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                      isOwnMessage
                        ? "bg-cyan-600 text-white rounded-2xl rounded-br-md"
                        : "bg-slate-800 text-slate-200 rounded-2xl rounded-bl-md"
                    } ${msg.isPinned ? "ring-2 ring-cyan-500/50" : ""}`}
                  >
                    {/* Pin indicator */}
                    {msg.isPinned && (
                      <div className="absolute -top-2 -right-2">
                        <Pin className="w-4 h-4 text-cyan-500 fill-cyan-500" />
                      </div>
                    )}
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
                    
                    {/* Time, edited status, and read status */}
                    <div className={`flex items-center gap-1 mt-1 text-xs ${isOwnMessage ? "justify-end" : ""}`}>
                      {msg.isEdited && (
                        <span className="opacity-70 italic">edited</span>
                      )}
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

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {msg.reactions.map((reaction, idx) => (
                          <span 
                            key={idx}
                            className="text-sm bg-slate-700/50 px-2 py-0.5 rounded-full"
                          >
                            {reaction.emoji}
                          </span>
                        ))}
                      </div>
                    )}
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

      <MessageInput replyingTo={replyingTo} onCancelReply={() => setReplyingTo(null)} />

      {/* Context Menu */}
      {contextMenu && (
        <MessageContextMenu
          message={contextMenu.message}
          isOwnMessage={contextMenu.message.senderId === authUser._id}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
          onReply={handleReply}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onReact={handleReact}
          onPin={handlePin}
        />
      )}

      {/* Edit Modal */}
      {editingMessage && (
        <EditMessageModal
          message={editingMessage}
          onSave={handleSaveEdit}
          onCancel={() => setEditingMessage(null)}
        />
      )}

      {/* Delete Modal */}
      {deletingMessage && (
        <DeleteMessageModal
          onDeleteForMe={handleDeleteForMe}
          onDeleteForEveryone={handleDeleteForEveryone}
          onCancel={() => setDeletingMessage(null)}
          canDeleteForEveryone={deletingMessage.senderId === authUser._id}
        />
      )}
    </div>
  );
}

export default ChatContainer;
