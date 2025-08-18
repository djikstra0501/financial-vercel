import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import FormPage from "./form/page";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-blue-200 to-purple-300 default">
      <SignedOut>
        <div>
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center p-6 rounded-lg shadow-lg bg-white/80 login">
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

          <div className="absolute left-0 bottom-0 w-full component">
            <svg
              fill="none"
              viewBox="0 0 1440 320"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-32"
            >
              <path
                fill="#6B46C1"
                fillOpacity={1}
                d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,90.7C672,64,768,64,864,90.7C960,117,1056,171,1152,176C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="p-10">
          <UserButton />
          <h1 className="text-2xl mt-4">Welcome!</h1>
            <div className="flex justify-center items-center min-h-screen">
              <FormPage />
            </div>
        </div>
      </SignedIn>
    </main>
  );
}
