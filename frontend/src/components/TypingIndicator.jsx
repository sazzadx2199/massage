function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8"></div> {/* Avatar space */}
      <div className="flex items-center gap-1 bg-white rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
