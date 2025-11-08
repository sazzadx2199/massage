import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useSettingsStore } from "../../store/useSettingsStore";

function ChatSettings() {
  const navigate = useNavigate();
  const { 
    enterToSend, 
    fontSize,
    toggleEnterToSend,
    setFontSize
  } = useSettingsStore();

  const fontSizes = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
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
        <h1 className="text-xl font-semibold text-slate-200">Chat Settings</h1>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Enter to Send */}
        <div className="p-4 border-b border-slate-700/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-slate-200 text-sm font-medium">Enter to Send</h3>
              <p className="text-slate-400 text-xs mt-1">
                Press Enter to send message (Shift+Enter for new line)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enterToSend}
                onChange={toggleEnterToSend}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>

        {/* Font Size */}
        <div className="p-4 border-b border-slate-700/30">
          <h3 className="text-slate-200 text-sm font-medium mb-3">Message Font Size</h3>
          <div className="space-y-2">
            {fontSizes.map((size) => (
              <label key={size.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="fontSize"
                  checked={fontSize === size.value}
                  onChange={() => setFontSize(size.value)}
                  className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500"
                />
                <span className="text-slate-300 text-sm">{size.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 border-b border-slate-700/30">
          <h3 className="text-slate-200 text-sm font-medium mb-3">Preview</h3>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p 
              className={`text-slate-200 ${
                fontSize === "small" ? "text-sm" : 
                fontSize === "large" ? "text-lg" : 
                "text-base"
              }`}
            >
              This is how your messages will look
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSettings;
