import { 
  Reply, 
  Copy, 
  Edit, 
  Trash2, 
  Forward,
  Pin 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

function MessageContextMenu({ 
  message, 
  isOwnMessage, 
  position, 
  onClose, 
  onReply, 
  onEdit, 
  onDelete, 
  onCopy,
  onReact,
  onPin 
}) {
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState(position);

  useEffect(() => {
    // Adjust menu position if it goes off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const newPosition = { ...position };

      if (rect.right > window.innerWidth) {
        newPosition.x = window.innerWidth - rect.width - 10;
      }
      if (rect.bottom > window.innerHeight) {
        newPosition.y = window.innerHeight - rect.height - 10;
      }

      setMenuPosition(newPosition);
    }

    // Close on click outside
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [position, onClose]);

  const reactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  const menuItems = [
    { icon: Reply, label: "Reply", onClick: onReply, show: true },
    { icon: Copy, label: "Copy", onClick: onCopy, show: message.text },
    { icon: Edit, label: "Edit", onClick: onEdit, show: isOwnMessage && message.text },
    { icon: Forward, label: "Forward", onClick: onForward, show: true },
    { icon: Pin, label: message.isPinned ? "Unpin" : "Pin", onClick: onPin, show: true },
    { icon: Trash2, label: "Delete", onClick: onDelete, show: true, danger: true },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden"
      style={{ 
        left: `${menuPosition.x}px`, 
        top: `${menuPosition.y}px`,
        minWidth: "200px"
      }}
    >
      {/* Reactions */}
      <div className="flex gap-1 p-2 border-b border-slate-700">
        {reactions.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onReact(emoji);
              onClose();
            }}
            className="text-2xl hover:scale-125 transition-transform p-1 rounded hover:bg-slate-700"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {menuItems.filter(item => item.show).map((item, index) => (
          <button
            key={index}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            disabled={item.disabled}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
              item.disabled 
                ? "opacity-50 cursor-not-allowed" 
                : item.danger
                ? "text-red-400 hover:bg-red-500/10"
                : "text-slate-200 hover:bg-slate-700"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MessageContextMenu;
