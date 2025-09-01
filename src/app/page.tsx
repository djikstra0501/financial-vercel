import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import FormPage from "./form/page";
import ChatPage from "./chat/page";
import FeatureCarousel from "@/components/featureCarousel";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-blue-700 text-white flex flex-col">
      <header className="flex justify-between items-center p-4 md:p-6 border-b border-white/20">
        <div className="flex items-center gap-2 md:gap-3">
          <Image src="/wave.svg" alt="Daya Finance Logo" width={32} height={32} className="md:w-10 md:h-10" />
          <h1 className="text-xl md:text-2xl font-bold">Daya Finance</h1>
        </div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 md:px-6 md:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm md:text-base">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <SignedOut>
        <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 p-4 md:p-8">
          <FeatureCarousel />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col md:flex-row flex-1 justify-center items-start gap-4 md:gap-6 p-4 md:p-6">
            {/* Expense Form */}
            <div className="w-full md:w-[400px] h-[400px] md:h-[600px] bg-white/10 rounded-lg shadow-lg overflow-y-auto p-3 md:p-4">
              <h2 className="text-base md:text-lg font-semibold mb-2">Expense Form</h2>
              <FormPage />
            </div>

            {/* AI Chat */}
            <div className="w-full md:w-[600px] h-[400px] md:h-[600px] bg-white/10 rounded-lg shadow-lg overflow-y-auto p-3 md:p-4 mt-4 md:mt-0">
              <h2 className="text-base md:text-lg font-semibold mb-2">AI Chat</h2>
              <ChatPage />
            </div>
          </div>
        </div>
      </SignedIn>

      <footer className="p-3 md:p-4 text-center text-xs md:text-sm border-t border-white/20">
        <p>
          Built by <span className="font-semibold">Dananjaya</span> —{" "}
          <a
            href="https://github.com/djikstra0501"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-300"
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
