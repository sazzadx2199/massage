import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useSettingsStore } from "../../store/useSettingsStore";

function PrivacySettings() {
  const navigate = useNavigate();
  const { 
    lastSeen, 
    profilePhoto, 
    readReceipts,
    setLastSeen,
    setProfilePhoto,
    toggleReadReceipts
  } = useSettingsStore();

  const privacyOptions = ["everyone", "contacts", "nobody"];

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
        <h1 className="text-xl font-semibold text-slate-200">Privacy and Security</h1>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Last Seen */}
        <div className="p-4 border-b border-slate-700/30">
          <h3 className="text-slate-200 text-sm font-medium mb-3">Last Seen & Online</h3>
          <p className="text-slate-400 text-xs mb-3">Who can see when you were last online</p>
          <div className="space-y-2">
            {privacyOptions.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lastSeen"
                  checked={lastSeen === option}
                  onChange={() => setLastSeen(option)}
                  className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500"
                />
                <span className="text-slate-300 text-sm capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Profile Photo */}
        <div className="p-4 border-b border-slate-700/30">
          <h3 className="text-slate-200 text-sm font-medium mb-3">Profile Photo</h3>
          <p className="text-slate-400 text-xs mb-3">Who can see your profile photo</p>
          <div className="space-y-2">
            {privacyOptions.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="profilePhoto"
                  checked={profilePhoto === option}
                  onChange={() => setProfilePhoto(option)}
                  className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500"
                />
                <span className="text-slate-300 text-sm capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Read Receipts */}
        <div className="p-4 border-b border-slate-700/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-slate-200 text-sm font-medium">Read Receipts</h3>
              <p className="text-slate-400 text-xs mt-1">
                If turned off, you won't see read receipts from others
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={readReceipts}
                onChange={toggleReadReceipts}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacySettings;
