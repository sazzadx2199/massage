import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8 bg-[#F0F2F5]">
      <div className="size-32 md:size-40 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-6 md:mb-8">
        <MessageCircleIcon className="size-16 md:size-20 text-[#25D366]" />
      </div>
      <h3 className="text-2xl md:text-3xl font-light text-gray-800 mb-3 md:mb-4">WhatsApp Web</h3>
      <p className="text-sm md:text-base text-gray-600 max-w-md px-4 mb-6">
        Send and receive messages without keeping your phone online.
      </p>
      <div className="bg-white rounded-lg p-6 max-w-md shadow-sm border border-gray-200">
        <p className="text-sm text-gray-700 mb-4">
          Select a chat to start messaging
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span>🔒</span>
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
