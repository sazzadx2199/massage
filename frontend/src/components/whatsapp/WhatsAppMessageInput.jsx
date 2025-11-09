import { useState, useRef } from "react";
import { Smile, Paperclip, Mic, Send, X } from "lucide-react";
import toast from "react-hot-toast";

function WhatsAppMessageInput({ onSendMessage, replyingTo, onCancelReply }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() && !image) return;

    onSendMessage({ text: text.trim(), image });
    setText("");
    setImage(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  return (
    <div className="bg-[#F0F2F5] px-4 py-2">
      {/* Reply preview */}
      {replyingTo && (
        <div className="bg-white rounded-lg p-3 mb-2 border-l-4 border-[#25D366]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-[#25D366]">
              Replying to {replyingTo.senderName}
            </span>
            <button
              onClick={onCancelReply}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {replyingTo.text || "📷 Photo"}
          </p>
        </div>
      )}

      {/* Image preview */}
      {image && (
        <div className="bg-white rounded-lg p-3 mb-2 relative">
          <img
            src={image}
            alt="Preview"
            className="max-h-32 rounded-lg"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Emoji button */}
        <button
          className="text-gray-600 hover:text-gray-800 transition-colors pb-2"
          title="Emoji"
        >
          <Smile className="w-6 h-6" />
        </button>

        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-600 hover:text-gray-800 transition-colors pb-2"
          title="Attach"
        >
          <Paperclip className="w-6 h-6" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Text input */}
        <div className="flex-1 bg-white rounded-lg">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="w-full px-4 py-2 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none resize-none max-h-32"
            rows="1"
            style={{
              minHeight: "40px",
              maxHeight: "120px",
            }}
            onInput={(e) => {
              e.target.style.height = "40px";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>

        {/* Send/Mic button */}
        {text.trim() || image ? (
          <button
            onClick={handleSend}
            className="bg-[#25D366] text-white rounded-full p-2 hover:bg-[#20BA5A] transition-colors"
            title="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            className="text-gray-600 hover:text-gray-800 transition-colors pb-2"
            title="Voice message"
          >
            <Mic className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default WhatsAppMessageInput;
