import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

export default function InputBox({ onSend, disabled = false, placeholder = "Type a message..." }) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter, allow Shift+Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isMessageEmpty = !message.trim();

  return (
    <div className="flex flex-col gap-2">

      <div 
        className={`flex items-center gap-2 bg-white rounded-full px-4 py-2 transition-all duration-200 ${
          isFocused 
            ? 'ring-2 ring-indigo-500 shadow-md' 
            : 'ring-1 ring-gray-300 shadow-sm'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >

        <button
          type="button"
          disabled={disabled}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
          aria-label="Add emoji"
        >
          <Smile size={20} />
        </button>


        <input
          ref={inputRef}
          type="text"
          placeholder={disabled ? "Please wait..." : placeholder}
          className="flex-grow outline-none bg-transparent text-gray-800 px-2 py-1 placeholder:text-gray-400 disabled:cursor-not-allowed"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          maxLength={500}
        />

 
        {message.length > 400 && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {message.length}/500
          </span>
        )}


        <button
          type="button"
          disabled={disabled}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>


        <button
          onClick={handleSend}
          disabled={isMessageEmpty || disabled}
          className={`p-2 rounded-full transition-all duration-200 ${
            isMessageEmpty || disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600 hover:scale-105 active:scale-95 text-white shadow-md'
          }`}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>

      {/* Helper text */}
      <div className="flex justify-between items-center px-2 text-xs text-gray-400">
        <span>Press Enter to send, Shift + Enter for new line</span>
      </div>
    </div>
  );
}