import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { 
      id: 1,
      text: "Hello Ashmin , how are you feeling today?", 
      sender: "bot",
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = (msg) => {
    if (!msg.trim()) return;

    // Add user message
    const userMsg = { 
      id: Date.now(),
      text: msg, 
      sender: "user",
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1,
        text: "I'm analyzing your emotion... 💭", 
        sender: "bot",
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">

      <div className="flex-grow overflow-y-auto p-6">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            text={msg.text} 
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}
        

        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500 text-sm ml-2 mb-4">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <InputBox onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}