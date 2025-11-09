import { useState, useRef } from "react";
import { 
  ArrowLeftIcon, 
  UserIcon, 
  BellIcon, 
  LockIcon, 
  MessageSquareIcon,
  FolderIcon,
  SlidersIcon,
  Volume2Icon,
  BatteryIcon,
  LanguagesIcon,
  LogOutIcon
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router";

function SettingsPage() {
  const navigate = useNavigate();
  const { authUser, logout, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const settingsItems = [
    { icon: UserIcon, label: "My Account", onClick: () => navigate("/settings/account") },
    { icon: BellIcon, label: "Notifications and Sounds", onClick: () => navigate("/settings/notifications") },
    { icon: LockIcon, label: "Privacy and Security", onClick: () => navigate("/settings/privacy") },
    { icon: MessageSquareIcon, label: "Chat Settings", onClick: () => navigate("/settings/chat") },
    { icon: FolderIcon, label: "Folders", onClick: () => {}, disabled: true },
    { icon: SlidersIcon, label: "Advanced", onClick: () => {}, disabled: true },
    { icon: Volume2Icon, label: "Speakers and Camera", onClick: () => {}, disabled: true },
    { icon: BatteryIcon, label: "Battery and Animations", onClick: () => {}, disabled: true },
    { icon: LanguagesIcon, label: "Language", value: "English", onClick: () => {}, disabled: true },
  ];

  return (
    <div className="h-screen bg-[#ECE5DD] flex flex-col">
      {/* Header */}
      <div className="bg-[#F0F2F5] border-b border-gray-200 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative group"
          >
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt={authUser.fullName}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {authUser.fullName}
            </h2>
            <p className="text-sm text-gray-600">{authUser.email}</p>
            <p className="text-xs text-gray-500 mt-1">@{authUser.email.split('@')[0]}</p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {settingsItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            disabled={item.disabled}
            className={`w-full flex items-center gap-4 p-4 transition-colors border-b border-gray-200 ${
              item.disabled 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-[#F5F6F6] cursor-pointer"
            }`}
          >
            <item.icon className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left text-gray-900 text-[15px]">
              {item.label}
            </span>
            {item.value && (
              <span className="text-sm text-[#25D366]">{item.value}</span>
            )}
            {item.label === "Notifications and Sounds" && (
              <span className="text-sm text-gray-600">
                {isSoundEnabled ? "On" : "Off"}
              </span>
            )}
            {!item.disabled && !item.value && (
              <span className="text-gray-400">›</span>
            )}
          </button>
        ))}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors border-b border-gray-200 text-red-600"
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="flex-1 text-left text-[15px] font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
