import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ChatWindow from "../components/ChatWindow";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate initial loading (API connection, auth check, etc.)
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Simulate API call or initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to initialize chat. Please refresh the page.");
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
      <Navbar />
      
      <main className="flex-grow overflow-hidden p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto h-full">
          {/* Loading State */}
          {isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
                <p className="text-gray-600 font-medium">Initializing chat...</p>
              </div>
            </div>
          )}


          {error && !isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                <div className="text-red-500 text-4xl mb-3">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Connection Error
                </h3>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Chat Window */}
          {!isLoading && !error && (
            <div className="h-full animate-fadeIn">
              <ChatWindow />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white bg-opacity-50 backdrop-blur-sm border-t border-gray-200 py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <p>© 2025 Emotion Chatbot. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}