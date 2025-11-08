import { Search, X } from "lucide-react";
import { useState } from "react";

function SearchInChat({ messages, onResultClick, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const searchResults = messages.filter(msg => 
    msg.text && msg.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNext = () => {
    if (currentIndex < searchResults.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      onResultClick(searchResults[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      onResultClick(searchResults[prevIndex]);
    }
  };

  return (
    <div className="bg-slate-800/95 border-b border-slate-700 p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentIndex(0);
            }}
            placeholder="Search in conversation..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            autoFocus
          />
        </div>

        {searchTerm && searchResults.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {currentIndex + 1} / {searchResults.length}
            </span>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
            >
              ↑
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === searchResults.length - 1}
              className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
            >
              ↓
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {searchTerm && searchResults.length === 0 && (
        <p className="text-xs text-slate-400 mt-2">No messages found</p>
      )}
    </div>
  );
}

export default SearchInChat;
