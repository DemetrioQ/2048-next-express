"use client"
import LoginModal from "../components/LoginModal";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#faf8ef] p-4">
      <LoginModal open={true} onClose={() => {}} />
    </main>
  );
}
