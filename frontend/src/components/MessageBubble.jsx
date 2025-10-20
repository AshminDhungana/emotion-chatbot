import { Bot, User } from "lucide-react";

export default function MessageBubble({ text, sender, timestamp }) {
  const isUser = sender === "user";
  
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } my-3 px-2 animate-fadeIn`}
    >
      <div className={`flex items-end gap-2 max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>

        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-indigo-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        <div className="flex flex-col gap-1">
          <div
            className={`px-4 py-2 rounded-2xl text-sm break-words shadow-sm ${
              isUser
                ? "bg-indigo-500 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
            }`}
          >

            <div className="whitespace-pre-wrap">{text}</div>
          </div>
          

          {timestamp && (
            <span
              className={`text-xs text-gray-400 px-2 ${
                isUser ? "text-right" : "text-left"
              }`}
            >
              {timestamp}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}