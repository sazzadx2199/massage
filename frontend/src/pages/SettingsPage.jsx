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
    { icon: UserIcon, label: "My Account", onClick: () => {} },
    { icon: BellIcon, label: "Notifications and Sounds", onClick: toggleSound },
    { icon: LockIcon, label: "Privacy and Security", onClick: () => {} },
    { icon: MessageSquareIcon, label: "Chat Settings", onClick: () => {} },
    { icon: FolderIcon, label: "Folders", onClick: () => {} },
    { icon: SlidersIcon, label: "Advanced", onClick: () => {} },
    { icon: Volume2Icon, label: "Speakers and Camera", onClick: () => {} },
    { icon: BatteryIcon, label: "Battery and Animations", onClick: () => {} },
    { icon: LanguagesIcon, label: "Language", value: "English", onClick: () => {} },
  ];

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-slate-200">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-slate-800/30 border-b border-slate-700/50 p-6">
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
              <span className="text-white text-xs">Change</span>
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
            <h2 className="text-lg font-semibold text-slate-200">
              {authUser.fullName}
            </h2>
            <p className="text-sm text-slate-400">{authUser.email}</p>
            <p className="text-xs text-slate-500 mt-1">@{authUser.email.split('@')[0]}</p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {settingsItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-700/30"
          >
            <item.icon className="w-5 h-5 text-slate-400" />
            <span className="flex-1 text-left text-slate-200 text-sm">
              {item.label}
            </span>
            {item.value && (
              <span className="text-sm text-cyan-400">{item.value}</span>
            )}
            {item.label === "Notifications and Sounds" && (
              <span className="text-sm text-slate-400">
                {isSoundEnabled ? "On" : "Off"}
              </span>
            )}
          </button>
        ))}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-700/30 text-red-400"
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="flex-1 text-left text-sm">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
