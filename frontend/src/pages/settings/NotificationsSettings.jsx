import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useChatStore } from "../../store/useChatStore";

function NotificationsSettings() {
  const navigate = useNavigate();
  const { 
    notificationSound, 
    messagePreview, 
    desktopNotifications,
    toggleNotificationSound,
    toggleMessagePreview,
    toggleDesktopNotifications
  } = useSettingsStore();
  
  const { isSoundEnabled, toggleSound } = useChatStore();

  const settings = [
    {
      label: "Message Sounds",
      description: "Play sound when receiving messages",
      value: isSoundEnabled,
      onChange: toggleSound,
    },
    {
      label: "Notification Sounds",
      description: "Play sound for notifications",
      value: notificationSound,
      onChange: toggleNotificationSound,
    },
    {
      label: "Message Preview",
      description: "Show message preview in notifications",
      value: messagePreview,
      onChange: toggleMessagePreview,
    },
    {
      label: "Desktop Notifications",
      description: "Show desktop notifications",
      value: desktopNotifications,
      onChange: toggleDesktopNotifications,
    },
  ];

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/settings")}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-slate-200">Notifications and Sounds</h1>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {settings.map((setting, index) => (
          <div
            key={index}
            className="p-4 border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-slate-200 text-sm font-medium">{setting.label}</h3>
                <p className="text-slate-400 text-xs mt-1">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.value}
                  onChange={setting.onChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsSettings;
