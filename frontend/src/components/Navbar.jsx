import { Settings, User, Brain } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 h-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Brain className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-800">Emotion Chatbot</h1>
              <span className="text-xs text-gray-500">AI-Powered Emotional Support</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>

            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-full cursor-pointer hover:shadow-lg transition-all group">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <User size={16} className="text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-white hidden sm:inline">Ashmin</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}