import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="space-y-0">
      {allContacts.map((contact) => {
        const isSelected = selectedUser?._id === contact._id;
        const isOnline = onlineUsers.includes(contact._id);
        
        return (
          <div
            key={contact._id}
            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-slate-700/30 ${
              isSelected 
                ? "bg-slate-700/50" 
                : "hover:bg-slate-800/50"
            }`}
            onClick={() => setSelectedUser(contact)}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img 
                src={contact.profilePic || "/avatar.png"} 
                alt={contact.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-800"></div>
              )}
            </div>

            {/* Contact info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-200 font-medium truncate text-sm">
                {contact.fullName}
              </h4>
              <p className="text-slate-400 text-xs truncate">
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default ContactList;
