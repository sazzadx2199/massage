import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList({ searchTerm = "" }) {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  
  // Filter contacts based on search term
  const filteredContacts = allContacts.filter(contact => 
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (filteredContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-slate-400 text-sm">No contacts found</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {filteredContacts.map((contact) => {
        const isSelected = selectedUser?._id === contact._id;
        const isOnline = onlineUsers.includes(contact._id);
        
        return (
          <div
            key={contact._id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-200 ${
              isSelected 
                ? "bg-[#F0F2F5]" 
                : "hover:bg-[#F5F6F6]"
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
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white"></div>
              )}
            </div>

            {/* Contact info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-gray-900 font-medium truncate text-[16px]">
                {contact.fullName}
              </h4>
              <p className="text-gray-600 text-[14px] truncate">
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
