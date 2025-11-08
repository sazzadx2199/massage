import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex border-b border-slate-700/50 bg-slate-800/20">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
          activeTab === "chats" 
            ? "text-cyan-400" 
            : "text-slate-400 hover:text-slate-300"
        }`}
      >
        Chats
        {activeTab === "chats" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
        )}
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
          activeTab === "contacts" 
            ? "text-cyan-400" 
            : "text-slate-400 hover:text-slate-300"
        }`}
      >
        Contacts
        {activeTab === "contacts" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
        )}
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
