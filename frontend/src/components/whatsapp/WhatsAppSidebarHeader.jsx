import { useState } from "react";
import { MessageCircle, MoreVertical, Users, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

function WhatsAppSidebarHeader({ user, onLogout, activeTab, onTabChange }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0F2F5] px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Profile */}
        <div className="flex items-center gap-3">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.fullName}
            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90"
            onClick={() => navigate("/settings/account")}
          />
          <h2 className="text-gray-900 font-medium text-lg hidden sm:block">
            WhatsApp
          </h2>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          {/* Chats tab */}
          <button
            onClick={() => onTabChange("chats")}
            className={`transition-colors ${
              activeTab === "chats"
                ? "text-[#25D366]"
                : "text-gray-600 hover:text-gray-800"
            }`}
            title="Chats"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Contacts tab */}
          <button
            onClick={() => onTabChange("contacts")}
            className={`transition-colors ${
              activeTab === "contacts"
                ? "text-[#25D366]"
                : "text-gray-600 hover:text-gray-800"
            }`}
            title="Contacts"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              title="Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppSidebarHeader;
