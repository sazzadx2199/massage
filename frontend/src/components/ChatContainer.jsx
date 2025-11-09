import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";
import { useNavigate } from "react-router";
import WhatsAppChatHeader from "./whatsapp/WhatsAppChatHeader";
import WhatsAppMessageInput from "./whatsapp/WhatsAppMessageInput";
import WhatsAppMessageBubble from "./whatsapp/WhatsAppMessageBubble";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import TypingIndicator from "./TypingIndicator";
import MessageContextMenu from "./MessageContextMenu";
import EditMessageModal from "./EditMessageModal";
import DeleteMessageModal from "./DeleteMessageModal";
import SearchInChat from "./SearchInChat";
import ForwardMessageModal from "./ForwardMessageModal";
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
  const { authUser, onlineUsers, socket } = useAuthStore();
  const navigate = useNavigate();
  const messageEndRef = useRef(null);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [forwardingMessage, setForwardingMessage] = useState(null);

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
    setContextMenu(null);
  };

  const handleEdit = () => {
    setEditingMessage(contextMenu.message);
    setContextMenu(null);
  };

  const handleDelete = () => {
    setDeletingMessage(contextMenu.message);
    setContextMenu(null);
  };

  const handleCopy = () => {
    if (contextMenu.message.text) {
      navigator.clipboard.writeText(contextMenu.message.text);
      toast.success("Message copied!");
    }
    setContextMenu(null);
  };

  const handleReact = async (emoji) => {
    await addReaction(contextMenu.message._id, emoji);
    setContextMenu(null);
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
    setContextMenu(null);
  };

  const handleForward = () => {
    setForwardingMessage(contextMenu.message);
    setContextMenu(null);
  };

  const handleForwardToUsers = async (userIds) => {
    try {
      const { sendMessage } = useChatStore.getState();
      const messageData = {
        text: forwardingMessage.text,
        image: forwardingMessage.image,
      };

      // Send to each selected user
      for (const userId of userIds) {
        // Temporarily set selected user for sending
        const originalSelectedUser = useChatStore.getState().selectedUser;
        const targetUser = [...useChatStore.getState().chats, ...useChatStore.getState().allContacts]
          .find(u => u._id === userId);
        
        if (targetUser) {
          useChatStore.getState().setSelectedUser(targetUser);
          await sendMessage(messageData);
        }
        
        // Restore original selected user
        useChatStore.getState().setSelectedUser(originalSelectedUser);
      }

      toast.success(`Message forwarded to ${userIds.length} ${userIds.length === 1 ? 'person' : 'people'}`);
    } catch (error) {
      toast.error("Failed to forward message");
    }
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

  const { startCall } = useCallStore();

  const handleVideoCall = () => {
    const roomId = `${authUser._id}-${selectedUser._id}-${Date.now()}`;
    
    console.log("🎥 Starting video call with:", selectedUser.fullName);
    
    socket.emit("callUser", {
      receiverId: selectedUser._id,
      callType: "video",
      roomId,
      caller: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
    });
    
    socket.emit("join-call-room", { roomId });
    startCall(selectedUser, "video", roomId);
  };

  const handleVoiceCall = () => {
    const roomId = `${authUser._id}-${selectedUser._id}-${Date.now()}`;
    
    console.log("📞 Starting audio call with:", selectedUser.fullName);
    
    socket.emit("callUser", {
      receiverId: selectedUser._id,
      callType: "audio",
      roomId,
      caller: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
    });
    
    socket.emit("join-call-room", { roomId });
    startCall(selectedUser, "audio", roomId);
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE5DD]">
      <WhatsAppChatHeader 
        user={selectedUser}
        isOnline={onlineUsers.includes(selectedUser._id)}
        onBack={() => useChatStore.getState().setSelectedUser(null)}
        onVideoCall={handleVideoCall}
        onVoiceCall={handleVoiceCall}
        onSearch={() => setShowSearch(!showSearch)}
      />
      
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
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Pin className="w-4 h-4 text-yellow-600" />
            <span className="font-medium">Pinned:</span>
            <div className="flex-1 truncate">
              {messages.find(m => m.isPinned)?.text || "Image"}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 px-4 md:px-12 overflow-y-auto py-4"
        style={{
          backgroundImage: "url('/whatsapp-bg.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "400px 400px",
        }}
      >
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-4xl mx-auto space-y-1">
            {messages.map((msg, index) => {
              const isOwnMessage = msg.senderId === authUser._id;
              const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
              
              return (
                <WhatsAppMessageBubble
                  key={msg._id}
                  message={{
                    ...msg,
                    senderAvatar: selectedUser.profilePic,
                  }}
                  isOwnMessage={isOwnMessage}
                  showAvatar={showAvatar}
                  senderName={selectedUser.fullName}
                  onContextMenu={(e) => handleContextMenu(e, msg)}
                  authUser={authUser}
                />
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
        {typingUsers.has(selectedUser?._id) && (
          <div className="max-w-4xl mx-auto">
            <TypingIndicator />
          </div>
        )}
      </div>

      <WhatsAppMessageInput 
        onSendMessage={async (data) => {
          const { sendMessage } = useChatStore.getState();
          await sendMessage({ ...data, replyTo: replyingTo?._id });
          setReplyingTo(null);
        }}
        replyingTo={replyingTo ? {
          ...replyingTo,
          senderName: replyingTo.senderId === authUser._id ? "You" : selectedUser.fullName
        } : null}
        onCancelReply={() => setReplyingTo(null)}
      />

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
          onForward={handleForward}
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

      {/* Forward Modal */}
      {forwardingMessage && (
        <ForwardMessageModal
          message={forwardingMessage}
          onClose={() => setForwardingMessage(null)}
          onForward={handleForwardToUsers}
        />
      )}
    </div>
  );
}

export default ChatContainer;
