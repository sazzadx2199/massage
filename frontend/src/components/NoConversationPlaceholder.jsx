import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8">
      <div className="size-16 md:size-24 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6 md:mb-8 animate-pulse">
        <MessageCircleIcon className="size-8 md:size-12 text-cyan-400" />
      </div>
      <h3 className="text-lg md:text-2xl font-semibold text-slate-200 mb-2 md:mb-3">Select a conversation</h3>
      <p className="text-sm md:text-base text-slate-400 max-w-md px-4">
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;
