import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import FormPage from "./form/page";
import ChatPage from "./chat/page";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-blue-700 text-white">
      <SignedOut>
        <div className="min-h-screen flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 flex justify-end p-8">
            <div className="w-full max-w-md flex flex-col justify-center items-center text-center p-6 rounded-lg shadow-lg bg-white/80">
              <h1 className="text-4xl font-bold mb-4 text-gray-700">Welcome to Finance Tracker!</h1>
              <p className="mb-6 text-gray-700">
                Track your expenses and inflows easily and securely.
              </p>
              <SignInButton mode="modal">
                <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col min-h-screen">
          <header className="flex justify-between items-center p-4 border-b border-white/20">
            <h1 className="text-xl font-bold">Finance Tracker Dashboard</h1>
            <UserButton />
          </header>

          <div className="flex flex-1 justify-center items-start gap-6 p-6">
            <div className="w-[400px] h-[600px] bg-white/10 rounded-lg shadow-lg overflow-y-auto p-4">
              <h2 className="text-lg font-semibold mb-2">Expense Form</h2>
              <FormPage />
            </div>

            <div className="w-[600px] h-[600px] bg-white/10 rounded-lg shadow-lg overflow-y-auto p-4">
              <h2 className="text-lg font-semibold mb-2">AI Chat</h2>
              <ChatPage />
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
