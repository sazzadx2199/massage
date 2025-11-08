import { TrashIcon, XIcon } from "lucide-react";

function DeleteMessageModal({ onDeleteForMe, onDeleteForEveryone, onCancel, canDeleteForEveryone }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl max-w-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200">Delete Message</h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-slate-300 text-sm mb-4">
            Are you sure you want to delete this message?
          </p>

          <div className="space-y-2">
            <button
              onClick={onDeleteForMe}
              className="w-full px-4 py-3 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors text-left"
            >
              <div className="font-medium">Delete for me</div>
              <div className="text-xs text-slate-400 mt-1">
                This message will be deleted for you
              </div>
            </button>

            {canDeleteForEveryone && (
              <button
                onClick={onDeleteForEveryone}
                className="w-full px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-left border border-red-500/20"
              >
                <div className="font-medium">Delete for everyone</div>
                <div className="text-xs text-red-400/70 mt-1">
                  This message will be deleted for all participants
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMessageModal;
