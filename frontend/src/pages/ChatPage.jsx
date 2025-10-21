import Navbar from "../components/Navbar";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage({ user }) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
      <Navbar user={user} />
      <main className="flex-grow overflow-hidden p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto h-full">
          <ChatWindow user={user} />
        </div>
      </main>
    </div>
  );
}
