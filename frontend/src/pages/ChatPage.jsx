import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import WhatsAppSidebarHeader from "../components/whatsapp/WhatsAppSidebarHeader";
import WhatsAppChatListItem from "../components/whatsapp/WhatsAppChatListItem";
import ChatContainer from "../components/ChatContainer";
import ContactList from "../components/ContactList";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import SearchBar from "../components/SearchBar";

function ChatPage() {
  const { activeTab, setActiveTab, selectedUser, setSelectedUser, chats, getMyChatPartners } = useChatStore();
  const { authUser, logout, onlineUsers } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter chats based on search
  const filteredChats = chats.filter(chat => 
    chat.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full h-screen bg-[#ECE5DD]">
      <div className="h-full max-w-[1600px] mx-auto flex shadow-2xl">
        {/* LEFT SIDEBAR - Hidden on mobile when chat is selected */}
        <div className={`w-full md:w-[400px] bg-white flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <WhatsAppSidebarHeader 
            user={authUser}
            onLogout={logout}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Search */}
          <div className="px-3 py-2 bg-white border-b border-gray-200">
            <SearchBar 
              onSearch={setSearchTerm} 
              placeholder={activeTab === "chats" ? "Search or start new chat" : "Search contacts"}
            />
          </div>

          {/* Chat/Contact List */}
          <div className="flex-1 overflow-y-auto bg-white">
            {activeTab === "chats" ? (
              filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <WhatsAppChatListItem
                    key={chat._id}
                    chat={chat}
                    isSelected={selectedUser?._id === chat._id}
                    isOnline={onlineUsers.includes(chat._id)}
                    onClick={() => setSelectedUser(chat)}
                    authUser={authUser}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No chats found</p>
                </div>
              )
            ) : (
              <ContactList searchTerm={searchTerm} />
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Chat Area */}
        <div className={`flex-1 flex flex-col ${selectedUser ? 'flex' : 'hidden md:flex'}`}
          style={{
            backgroundImage: "url('/whatsapp-bg.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "400px 400px",
          }}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </div>
    </div>
  );
}
export default ChatPage;
