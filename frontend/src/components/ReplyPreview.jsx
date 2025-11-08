import { X } from "lucide-react";

function ReplyPreview({ message, onCancel }) {
  return (
    <div className="bg-slate-800/50 border-l-4 border-cyan-500 p-3 mx-4 mb-2 rounded flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-cyan-400 text-xs font-medium mb-1">
          Replying to {message.senderName || "User"}
        </p>
        <p className="text-slate-300 text-sm truncate">
          {message.text || "Photo"}
        </p>
      </div>
      <button
        onClick={onCancel}
        className="text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ReplyPreview;
