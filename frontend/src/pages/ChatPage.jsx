import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import SearchBar from "../components/SearchBar";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] md:h-screen md:max-h-screen">
      <BorderAnimatedContainer>
        {/* LEFT SIDE - Hidden on mobile when chat is selected */}
        <div className={`w-full md:w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
          <ProfileHeader />
          <ActiveTabSwitch />
          <SearchBar 
            onSearch={setSearchTerm} 
            placeholder={activeTab === "chats" ? "Search chats..." : "Search contacts..."}
          />

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {activeTab === "chats" ? <ChatsList searchTerm={searchTerm} /> : <ContactList searchTerm={searchTerm} />}
          </div>
        </div>

        {/* RIGHT SIDE - Full width on mobile */}
        <div className={`flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
