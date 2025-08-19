import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import FormPage from "./form/page";
import ChatPage from "./chat/page";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-blue-200 to-purple-300 default">
      <SignedOut>
        <div>
          <div className="flex justify-right min-h-screen">
            <div className="flex justify-center items-center text-center p-6 rounded-lg shadow-lg bg-white/80 login">
              <h1 className="text-4xl font-bold mb-4 text-gray-700">Welcome to Finance Tracker!</h1>
              <p className="mb-6 text-gray-700">
                Track your expenses and inflows easily and securely.
              </p>
              <SignInButton mode="modal">
                <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <ChatPage />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="p-10">
          <UserButton />
          <h1 className="text-2xl mt-4 text-gray-700">Welcome!</h1>
            <div className="flex justify-center items-center min-h-screen">
              <FormPage />
            </div>
        </div>
      </SignedIn>
    </main>
  );
}
